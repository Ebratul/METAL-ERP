import { MONTHS, DEMO_TODAY, randomFloat, seeded } from "@/lib/data/rng";
import { compactCurrency, compactNumber, number, percent } from "@/lib/utils/format";
import type { StatusTone } from "@/components/ui/badge";
import { TONE_COLOR, isAttentionStatus, statusTone } from "./dsl";
import type { FieldSpec, RecordRow, ResolvedSpec } from "./types";

/**
 * Every chart on a spec workspace is derived from the rows currently in state,
 * so creating, editing or deleting a record moves the analytics with it.
 */

/* ── Monthly trend ─────────────────────────────────────────────────────── */

export interface MonthPoint {
  month: string;
  total: number;
  completed: number;
  open: number;
  count: number;
  /** Chart components take plain row records — this keeps the shape assignable. */
  [key: string]: string | number;
}

/** The twelve month labels ending at the demo "today", oldest first. */
export function trailingMonths(): Array<{ label: string; key: string }> {
  const out: Array<{ label: string; key: string }> = [];
  for (let back = 11; back >= 0; back -= 1) {
    const date = new Date(DEMO_TODAY);
    date.setUTCMonth(date.getUTCMonth() - back);
    out.push({
      label: `${MONTHS[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(2)}`,
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
    });
  }
  return out;
}

function measureOf(row: RecordRow, measure?: FieldSpec): number {
  if (!measure) return 1;
  const value = Number(row[measure.key]);
  return Number.isFinite(value) ? value : 0;
}

function isDone(row: RecordRow, spec: ResolvedSpec): boolean {
  const status = String(row[spec.statusField.key] ?? "");
  return statusTone(status, spec.statuses.indexOf(status)) === "good";
}

/**
 * Buckets the live rows by month. Months the dataset does not reach are filled
 * with a seeded baseline around the dataset's own average, so the twelve-month
 * frame always reads as a business trend rather than a half-empty axis.
 */
export function monthlySeries(
  spec: ResolvedSpec,
  rows: RecordRow[],
  seedKey: string,
): MonthPoint[] {
  const months = trailingMonths();
  const buckets = new Map<string, { total: number; completed: number; count: number }>();

  for (const row of rows) {
    const iso = String(row[spec.dateField?.key ?? "docDate"] ?? "");
    const key = iso.slice(0, 7);
    const bucket = buckets.get(key) ?? { total: 0, completed: 0, count: 0 };
    const value = measureOf(row, spec.measure);
    bucket.total += value;
    bucket.count += 1;
    if (isDone(row, spec)) bucket.completed += value;
    buckets.set(key, bucket);
  }

  const observed = [...buckets.values()];
  const avgTotal =
    observed.length > 0
      ? observed.reduce((sum, bucket) => sum + bucket.total, 0) / observed.length
      : 0;
  const avgCount =
    observed.length > 0
      ? observed.reduce((sum, bucket) => sum + bucket.count, 0) / observed.length
      : 0;

  const rng = seeded(`months:${seedKey}`);

  return months.map(({ label, key }) => {
    const bucket = buckets.get(key);
    if (bucket) {
      return {
        month: label,
        total: Math.round(bucket.total),
        completed: Math.round(bucket.completed),
        open: Math.round(bucket.total - bucket.completed),
        count: bucket.count,
      };
    }
    // Synthetic month: same order of magnitude as the observed data.
    const factor = randomFloat(rng, 0.62, 1.24, 3);
    const total = Math.round(avgTotal * factor);
    const completed = Math.round(total * randomFloat(rng, 0.48, 0.86, 3));
    return {
      month: label,
      total,
      completed,
      open: total - completed,
      count: Math.max(1, Math.round(avgCount * factor)),
    };
  });
}

/* ── Categorical breakdowns ────────────────────────────────────────────── */

export interface CategoryPoint {
  category: string;
  value: number;
  count: number;
  [key: string]: string | number;
}

/** Group by any enum/person/text field, summing the headline measure. */
export function groupBy(
  rows: RecordRow[],
  field: FieldSpec,
  measure?: FieldSpec,
  limit = 8,
): CategoryPoint[] {
  const map = new Map<string, { value: number; count: number }>();

  for (const row of rows) {
    const key = String(row[field.key] ?? "—");
    const entry = map.get(key) ?? { value: 0, count: 0 };
    entry.value += measureOf(row, measure);
    entry.count += 1;
    map.set(key, entry);
  }

  return [...map.entries()]
    .map(([category, entry]) => ({ category, ...entry }))
    .sort((a, b) => b.value - a.value || b.count - a.count)
    .slice(0, limit);
}

export interface StatusPoint {
  label: string;
  value: number;
  color: string;
  tone: StatusTone;
}

export function statusSplit(spec: ResolvedSpec, rows: RecordRow[]): StatusPoint[] {
  return spec.statuses
    .map((status, index) => {
      const tone = statusTone(status, index);
      return {
        label: status,
        value: rows.filter((row) => row[spec.statusField.key] === status).length,
        color: TONE_COLOR[tone],
        tone,
      };
    })
    .filter((point) => point.value > 0);
}

/* ── KPI band ──────────────────────────────────────────────────────────── */

export interface DerivedKpi {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
  caption: string;
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  trend: number[];
}

function formatMeasure(field: FieldSpec | undefined, total: number): string {
  if (!field) return number(total);
  if (field.kind === "money") return compactCurrency(total);
  if (field.unit) return `${compactNumber(total)} ${field.unit}`;
  return compactNumber(total);
}

/** Four tiles computed from the rows on screen. */
export function deriveKpis(
  spec: ResolvedSpec,
  rows: RecordRow[],
  seedKey: string,
  months: MonthPoint[],
): DerivedKpi[] {
  const rng = seeded(`kpi:${seedKey}`);
  const measureTotal = rows.reduce((sum, row) => sum + measureOf(row, spec.measure), 0);

  const attention = rows.filter((row) => {
    const status = String(row[spec.statusField.key] ?? "");
    return isAttentionStatus(status, spec.statuses.indexOf(status));
  }).length;

  const done = rows.filter((row) => isDone(row, spec)).length;
  const pctField = spec.fields.find((field) => field.kind === "pct");
  const pctAvg =
    pctField && rows.length
      ? rows.reduce((sum, row) => sum + Number(row[pctField.key] ?? 0), 0) / rows.length
      : 0;

  const countTrend = months.map((month) => month.count);
  const totalTrend = months.map((month) => month.total);
  const doneTrend = months.map((month) => month.completed);

  return [
    {
      label: `Total ${plural(spec.entity)}`,
      value: number(rows.length),
      delta: randomFloat(rng, -4, 18, 1),
      caption: "in this workspace",
      tone: 1,
      trend: countTrend,
    },
    {
      label: spec.measure ? `Total ${spec.measure.label}` : "Volume",
      value: formatMeasure(spec.measure, measureTotal),
      delta: randomFloat(rng, -6, 21, 1),
      caption: "across all records",
      tone: 3,
      trend: totalTrend,
    },
    pctField
      ? {
          label: `Average ${pctField.label}`,
          value: percent(pctAvg),
          delta: randomFloat(rng, -3, 9, 1),
          caption: "rolling average",
          tone: 7,
          trend: doneTrend,
        }
      : {
          label: "Closed / Approved",
          value: number(done),
          delta: randomFloat(rng, -2, 14, 1),
          caption: `${rows.length ? Math.round((done / rows.length) * 100) : 0}% of records`,
          tone: 7,
          trend: doneTrend,
        },
    {
      label: "Needs Attention",
      value: number(attention),
      delta: randomFloat(rng, -12, 7, 1),
      invert: true,
      caption: "pending, held or failed",
      tone: 2,
      trend: countTrend.map((value, index) => Math.round(value * (0.2 + index * 0.01))),
    },
  ];
}

/** "Work Order" -> "Work Orders"; "Analysis" -> "Analyses". */
export function plural(word: string): string {
  if (/sis$/i.test(word)) return word.replace(/sis$/i, "ses");
  if (/(s|x|z|ch|sh)$/i.test(word)) return `${word}es`;
  if (/[^aeiou]y$/i.test(word)) return word.replace(/y$/i, "ies");
  return `${word}s`;
}
