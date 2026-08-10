/**
 * The collection engine.
 *
 * Turns a dataset description into seeded rows, then derives everything a
 * workspace shows from those rows: KPI values, chart series and CSV exports.
 * Because every derivation reads the *live* row array, adding, editing or
 * deleting a record in the UI moves the KPIs and the charts with it.
 */

import {
  compactCurrency,
  compactNumber,
  currency,
  number as formatNumber,
  percent,
} from "@/lib/utils/format";
import type { Dataset, FieldDef, MetricDef } from "./dataset-types";
import {
  DEMO_TODAY,
  MONTHS,
  daysFromToday,
  pick,
  pickWeighted,
  randomFloat,
  randomInt,
  seeded,
  trendSeries,
} from "./rng";

export type CellValue = string | number;
export type Row = Record<string, CellValue> & { id: string };

/* ── Row generation ────────────────────────────────────────────────────── */

const NOTE_TEMPLATES = [
  "Confirmed with the counterpart on the last review call.",
  "Pending a document from the responsible department.",
  "Raised during the weekly operations meeting.",
  "Follow-up scheduled with the owner this week.",
  "Verified against the supporting document set.",
  "Buyer has been informed of the current position.",
  "Awaiting the approver's sign-off before release.",
  "Recorded from the shop-floor log book entry.",
];

function generateValue(
  field: FieldDef,
  rng: () => number,
  index: number,
  prefix: string,
): CellValue {
  switch (field.type) {
    case "code":
      return `${prefix}-${String(1001 + index).padStart(4, "0")}`;

    case "text":
      return field.pool && field.pool.length > 0 ? pick(rng, field.pool) : "—";

    case "select":
    case "status": {
      const options = field.options ?? [];
      if (options.length === 0) return "—";
      return field.weights && field.weights.length === options.length
        ? pickWeighted(rng, options, field.weights)
        : pick(rng, options);
    }

    case "number":
    case "currency": {
      const min = field.min ?? 0;
      const max = field.max ?? 1_000;
      return field.decimals && field.decimals > 0
        ? randomFloat(rng, min, max, field.decimals)
        : randomInt(rng, Math.round(min), Math.round(max));
    }

    case "percent":
      return randomFloat(rng, field.min ?? 0, field.max ?? 100, field.decimals ?? 1);

    case "progress":
      return randomInt(rng, 0, 100);

    case "date":
      return daysFromToday(randomInt(rng, field.min ?? -180, field.max ?? 30));

    case "textarea":
      return pick(rng, NOTE_TEMPLATES);

    default:
      return "—";
  }
}

/**
 * Product families keyed by what appears in the item name. Fields are sampled
 * independently, so without this a "Snap Button" could be filed under Sliders.
 */
const CATEGORY_BY_KEYWORD: Array<[RegExp, string]> = [
  [/button/i, "Buttons"],
  [/zipper|slider|puller/i, "Zippers"],
  [/rivet|burr/i, "Rivets"],
  [/snap|prong/i, "Snap Fasteners"],
  [/label|tag/i, "Metal Labels"],
  [/buckle|d-ring|clasp|toggle|hook/i, "Buckles"],
  [/eyelet|grommet/i, "Eyelets"],
  [/carton|poly|packing/i, "Packing Material"],
];

/**
 * Nudges generated rows towards internal consistency — a settled record should
 * not sit at 20% progress, a rejected one should not be at 100%, and an item's
 * category should match what the item actually is.
 */
function harmonise(row: Row, dataset: Dataset, rng: () => number): Row {
  const categoryField = dataset.fields.find(
    (field) => field.key === "category" && field.options?.includes("Buttons"),
  );
  const titleField = dataset.fields.find((field) => field.primary);

  if (categoryField && titleField) {
    const title = String(row[titleField.key] ?? "");
    const match = CATEGORY_BY_KEYWORD.find(([pattern]) => pattern.test(title));
    if (match && categoryField.options?.includes(match[1])) {
      row[categoryField.key] = match[1];
    }
  }

  const progressField = dataset.fields.find((field) => field.type === "progress");
  if (!progressField || !dataset.statusKey) return row;

  const status = String(row[dataset.statusKey]);
  const tone = dataset.statusTones[status];

  if (tone === "good") row[progressField.key] = randomInt(rng, 96, 100);
  else if (tone === "critical") row[progressField.key] = randomInt(rng, 5, 45);
  else if (tone === "neutral") row[progressField.key] = randomInt(rng, 0, 22);
  else row[progressField.key] = randomInt(rng, 28, 92);

  return row;
}

export function generateRows(dataset: Dataset, seedKey: string, count?: number): Row[] {
  const total = count ?? dataset.rows;
  const rng = seeded(`rows:${dataset.id}:${seedKey}`);

  return Array.from({ length: total }, (_, index) => {
    const row = { id: `${dataset.prefix}-${index + 1}` } as Row;
    for (const field of dataset.fields) {
      row[field.key] = generateValue(field, rng, index, dataset.prefix);
    }
    return harmonise(row, dataset, rng);
  });
}

/** The reference for a brand new record, continuing the generated sequence. */
export function nextCode(dataset: Dataset, rows: Row[]): string {
  const highest = rows.reduce((max, row) => {
    const raw = String(row.code ?? "");
    const tail = Number(raw.slice(raw.lastIndexOf("-") + 1));
    return Number.isFinite(tail) && tail > max ? tail : max;
  }, 1000);
  return `${dataset.prefix}-${String(highest + 1).padStart(4, "0")}`;
}

/** A blank record pre-filled with sensible defaults for the create form. */
export function blankRow(dataset: Dataset, rows: Row[]): Row {
  const row = { id: `new-${rows.length + 1}` } as Row;

  // A new record should open in the earliest sensible state, not whichever
  // status happens to be listed first (often the terminal one). Names win over
  // tones: "Obsolete" is neutral-toned but is nobody's starting point.
  const statuses = Object.keys(dataset.statusTones);
  const openingStatus =
    statuses.find((status) =>
      /^(draft|new|open|pending|planned|queued|requested|created|submitted|suggested|prospect|not started|unassigned)$/i.test(
        status,
      ),
    ) ??
    statuses.find((status) => dataset.statusTones[status] === "warning") ??
    statuses.find((status) => dataset.statusTones[status] === "neutral") ??
    statuses[0];

  for (const field of dataset.fields) {
    switch (field.type) {
      case "code":
        row[field.key] = nextCode(dataset, rows);
        break;
      case "status":
        row[field.key] = openingStatus ?? field.options?.[0] ?? "";
        break;
      case "select":
        row[field.key] = field.options?.[0] ?? "";
        break;
      case "date":
        row[field.key] = daysFromToday(0);
        break;
      case "number":
      case "currency":
      case "percent":
      case "progress":
        row[field.key] = 0;
        break;
      default:
        row[field.key] = "";
    }
  }

  return row;
}

/* ── Field formatting ──────────────────────────────────────────────────── */

export function formatCell(field: FieldDef, value: CellValue): string {
  if (value === "" || value === undefined || value === null) return "—";

  switch (field.type) {
    case "currency":
      return typeof value === "number"
        ? value >= 100_000
          ? compactCurrency(value)
          : currency(value, "$")
        : String(value);
    case "number":
      return typeof value === "number"
        ? `${formatNumber(value)}${field.suffix ? ` ${field.suffix}` : ""}`
        : String(value);
    case "percent":
      return typeof value === "number" ? percent(value, field.decimals ?? 1) : String(value);
    case "progress":
      return `${Math.round(Number(value))}%`;
    default:
      return String(value);
  }
}

export function formatMetric(format: MetricDef["format"], value: number): string {
  switch (format) {
    case "currency":
      return compactCurrency(value);
    case "compact":
      return compactNumber(value);
    case "percent":
      return percent(value, 1);
    case "days":
      return `${value.toFixed(1)} d`;
    case "plain":
      return String(value);
    default:
      return formatNumber(Math.round(value));
  }
}

/* ── Metrics ───────────────────────────────────────────────────────────── */

export interface MetricResult {
  label: string;
  value: string;
  caption: string;
  delta: number;
  invert?: boolean;
  tone: MetricDef["tone"];
  trend: number[];
}

function rawMetric(rows: Row[], metric: MetricDef): number {
  switch (metric.kind) {
    case "count":
      return rows.length;

    case "countWhere":
      return rows.filter((row) =>
        (metric.values ?? []).includes(String(row[metric.field ?? "status"])),
      ).length;

    case "sum":
      return rows.reduce((sum, row) => sum + Number(row[metric.field ?? ""] ?? 0), 0);

    case "avg": {
      if (rows.length === 0) return 0;
      const total = rows.reduce(
        (sum, row) => sum + Number(row[metric.field ?? ""] ?? 0),
        0,
      );
      return total / rows.length;
    }

    case "rate": {
      if (rows.length === 0) return 0;
      const hits = rows.filter((row) =>
        (metric.values ?? []).includes(String(row[metric.field ?? "status"])),
      ).length;
      return (hits / rows.length) * 100;
    }

    case "distinct":
      return new Set(rows.map((row) => String(row[metric.field ?? ""]))).size;

    default:
      return 0;
  }
}

export function computeMetrics(
  dataset: Dataset,
  rows: Row[],
  seedKey: string,
): MetricResult[] {
  return dataset.metrics.map((metric, index) => {
    const raw = rawMetric(rows, metric);
    const rng = seeded(`metric:${seedKey}:${metric.label}`);

    return {
      label: metric.label,
      value: formatMetric(metric.format, raw),
      caption: metric.caption,
      delta: randomFloat(rng, -11, 21, 1),
      invert: metric.invert,
      tone: metric.tone,
      // The sparkline shows how the metric arrived at its current value.
      trend: trendSeries(seeded(`spark:${seedKey}:${index}`), 12, {
        start: Math.max(1, raw * 0.74),
        drift: 0.028,
        volatility: 0.09,
        digits: 2,
      }),
    };
  });
}

/* ── Aggregation for charts ────────────────────────────────────────────── */

export interface CategoryPoint {
  category: string;
  value: number;
  secondary: number;
  /** Chart components accept any keyed record; this keeps them compatible. */
  [key: string]: string | number;
}

/** Count (and value-sum) of rows per distinct value of `key`. */
export function groupBy(
  rows: Row[],
  key: string | undefined,
  valueKey?: string,
  limit = 8,
): CategoryPoint[] {
  if (!key) return [];

  const buckets = new Map<string, { count: number; total: number }>();
  for (const row of rows) {
    const bucket = String(row[key] ?? "Unassigned");
    const current = buckets.get(bucket) ?? { count: 0, total: 0 };
    current.count += 1;
    current.total += valueKey ? Number(row[valueKey] ?? 0) : 0;
    buckets.set(bucket, current);
  }

  return [...buckets.entries()]
    .map(([category, stats]) => ({
      category,
      value: stats.count,
      secondary: Math.round(stats.total),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export interface StatusPoint {
  status: string;
  value: number;
  share: number;
}

export function statusBreakdown(dataset: Dataset, rows: Row[]): StatusPoint[] {
  const key = dataset.statusKey;
  if (!key) return [];

  const order = Object.keys(dataset.statusTones);
  const counts = new Map<string, number>(order.map((status) => [status, 0]));

  for (const row of rows) {
    const status = String(row[key]);
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }

  const total = rows.length || 1;
  return order.map((status) => ({
    status,
    value: counts.get(status) ?? 0,
    share: ((counts.get(status) ?? 0) / total) * 100,
  }));
}

export interface TrendPoint {
  month: string;
  volume: number;
  value: number;
  settled: number;
  [key: string]: string | number;
}

const DAY_MS = 86_400_000;
const BUCKETS = 12;

/** Whole days since the epoch for an ISO date, or null when unparseable. */
function dayOrdinal(iso: string): number | null {
  if (iso.length < 10) return null;
  const parsed = Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isFinite(parsed) ? Math.floor(parsed / DAY_MS) : null;
}

function bucketLabel(dayNumber: number, sizeInDays: number): string {
  const date = new Date(dayNumber * DAY_MS);
  if (sizeInDays >= 28) {
    return `${MONTHS[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(2)}`;
  }
  return `${String(date.getUTCDate()).padStart(2, "0")} ${MONTHS[date.getUTCMonth()]}`;
}

/**
 * A twelve-bucket activity series built from the rows' own dates.
 *
 * The window follows the data instead of the calendar: due dates sit in the
 * future and receipts sit in the past, and a workspace holding six weeks of
 * records gets weekly buckets rather than a year of mostly empty months.
 */
export function monthlyTrend(dataset: Dataset, rows: Row[]): TrendPoint[] {
  const dateKey = dataset.dateKey;
  const valueKey = dataset.valueKey;
  const settledStatuses = Object.entries(dataset.statusTones)
    .filter(([, tone]) => tone === "good")
    .map(([status]) => status);

  const days = dateKey
    ? rows
        .map((row) => dayOrdinal(String(row[dateKey] ?? "")))
        .filter((value): value is number => value !== null)
    : [];

  const today = Math.floor(DEMO_TODAY.getTime() / DAY_MS);
  const min = days.length > 0 ? Math.min(...days) : today - 364;
  const max = days.length > 0 ? Math.max(...days) : today;

  // Whole weeks or whole months, whichever covers the span more naturally.
  const rawSize = Math.ceil((max - min + 1) / BUCKETS);
  const size = rawSize <= 7 ? 7 : rawSize <= 30 ? 30 : Math.ceil(rawSize / 30) * 30;

  const buckets = Array.from({ length: BUCKETS }, (_, index) => ({
    month: bucketLabel(min + index * size, size),
    volume: 0,
    value: 0,
    settled: 0,
  }));

  rows.forEach((row, index) => {
    const day = dateKey ? dayOrdinal(String(row[dateKey] ?? "")) : null;
    const slot =
      day === null
        ? index % BUCKETS
        : Math.min(BUCKETS - 1, Math.max(0, Math.floor((day - min) / size)));

    const bucket = buckets[slot];
    bucket.volume += 1;
    bucket.value += valueKey ? Number(row[valueKey] ?? 0) : 0;
    if (dataset.statusKey && settledStatuses.includes(String(row[dataset.statusKey]))) {
      bucket.settled += 1;
    }
  });

  return buckets.map((bucket) => ({
    ...bucket,
    value: Math.round(bucket.value),
  }));
}

/* ── Export ────────────────────────────────────────────────────────────── */

/**
 * CSV text for the current view. Values are quoted and inner quotes doubled, so
 * a stray comma or quote in demo data cannot break the column alignment — and a
 * leading `=`/`+`/`-`/`@` is prefixed with a quote so spreadsheet apps treat it
 * as text rather than a formula.
 */
export function toCsv(fields: FieldDef[], rows: Row[]): string {
  const escape = (input: CellValue): string => {
    let text = String(input ?? "");
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };

  const header = fields.map((field) => escape(field.label)).join(",");
  const body = rows
    .map((row) => fields.map((field) => escape(row[field.key])).join(","))
    .join("\n");

  return `${header}\n${body}`;
}
