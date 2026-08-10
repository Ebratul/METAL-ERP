import {
  daysFromToday,
  pick,
  pickWeighted,
  randomFloat,
  randomInt,
  seeded,
} from "@/lib/data/rng";
import type { StatusTone } from "@/components/ui/badge";
import { compactCurrency, currency, number, shortDate } from "@/lib/utils/format";
import type {
  FieldKind,
  FieldSpec,
  FieldSource,
  RecordRow,
  ResolvedSpec,
  WorkspaceSpec,
} from "./types";

/* ── Shared vocabulary ─────────────────────────────────────────────────── */

export const PEOPLE = [
  "Rashed Khan",
  "Maria Gomez",
  "Tanvir Ahmed",
  "Li Wei",
  "Sadia Rahman",
  "James Taylor",
  "Nusrat Jahan",
  "Kenji Tanaka",
  "Farhan Chowdhury",
  "Emma Novak",
  "Arif Hossain",
  "Priya Nair",
];

export const BUYERS = [
  "H&M Global Sourcing",
  "Inditex / Zara",
  "Levi Strauss & Co.",
  "Primark Sourcing",
  "Uniqlo / Fast Retailing",
  "Decathlon Sourcing",
  "C&A Buying",
  "Bestseller A/S",
  "Next Sourcing Ltd.",
  "Marks & Spencer",
];

export const SUPPLIERS = [
  "Zhejiang Metal Works",
  "Dhaka Brass Industries",
  "Guangzhou Alloy Co.",
  "Nippon Plating Chemicals",
  "Korea Zipper Components",
  "Chattogram Packaging Ltd.",
  "Shanghai Die & Tool",
  "Ahmedabad Steel Strips",
  "Taiwan Precision Springs",
  "Vietnam Surface Finishing",
];

export const ITEMS = [
  "Antique Brass Snap 15mm",
  "Nickel-Free Jeans Button 17mm",
  "Gunmetal Slider #5",
  "Matte Black Rivet 9mm",
  "Gold Eyelet 4mm",
  "Zinc Alloy Buckle 25mm",
  "Engraved Metal Label 30x8",
  "Two-Way Zipper Puller",
  "Brushed Silver Burr 8mm",
  "Enamel Shank Button 20L",
];

/** Named pools usable from a spec as `enum|@buyers`. */
const POOLS: Record<string, string[]> = {
  "@people": PEOPLE,
  "@buyers": BUYERS,
  "@suppliers": SUPPLIERS,
  "@items": ITEMS,
};

/* ── Field parsing ─────────────────────────────────────────────────────── */

const KINDS = new Set<FieldKind>([
  "code",
  "text",
  "enum",
  "person",
  "int",
  "money",
  "pct",
  "float",
  "date",
  "bool",
  "status",
]);

function resolveOptions(raw: string): string[] {
  const pooled = POOLS[raw.trim()];
  if (pooled) return pooled;
  return raw
    .split(";")
    .map((option) => option.trim())
    .filter(Boolean);
}

/** `"qty|Planned Qty|int|8000;140000;pcs"` -> FieldSpec. */
export function parseField(source: FieldSource, fallbackPrefix: string): FieldSpec {
  if (typeof source !== "string") return source;

  const [key = "field", label = "Field", rawKind = "text", rawArgs = ""] =
    source.split("|");
  const kind = (KINDS.has(rawKind as FieldKind) ? rawKind : "text") as FieldKind;
  const args = rawArgs.trim();

  switch (kind) {
    case "code":
      return { key, label, kind, prefix: args || fallbackPrefix };

    case "enum":
    case "text": {
      const options = resolveOptions(args);
      return { key, label, kind, options: options.length ? options : ITEMS };
    }

    case "int":
    case "money": {
      const [min = "10", max = "1000", unit] = args.split(";");
      return { key, label, kind, min: Number(min), max: Number(max), unit };
    }

    case "pct": {
      const [min = "40", max = "99"] = args.split(";");
      return { key, label, kind, min: Number(min), max: Number(max), digits: 1 };
    }

    case "float": {
      const [min = "0", max = "10", unit, digits] = args.split(";");
      return {
        key,
        label,
        kind,
        min: Number(min),
        max: Number(max),
        unit,
        digits: digits ? Number(digits) : 2,
      };
    }

    case "date": {
      const [min = "-120", max = "45"] = args.split(";");
      return { key, label, kind, min: Number(min), max: Number(max) };
    }

    case "bool": {
      const [yes = "Yes", no = "No"] = args.split(";");
      return { key, label, kind, options: [yes, no] };
    }

    default:
      return { key, label, kind };
  }
}

/* ── Status tones ──────────────────────────────────────────────────────── */

const TONE_KEYWORDS: Array<[StatusTone, string[]]> = [
  [
    "critical",
    [
      "reject",
      "fail",
      "cancel",
      "scrap",
      "breakdown",
      "expired",
      "error",
      "lost",
      "stopped",
      "damaged",
      "defect",
      "alarm",
      "non-compliant",
      "unsafe",
      "down",
      "critical",
      "aborted",
      "void",
    ],
  ],
  [
    "serious",
    [
      "overdue",
      "escalat",
      "breach",
      "block",
      "quarantin",
      "shortage",
      "deviat",
      "non-conform",
      "disput",
      "at risk",
      "exception",
      "recall",
      "suspend",
      "obsolete",
    ],
  ],
  [
    "warning",
    [
      "pending",
      "await",
      "hold",
      "queue",
      "delay",
      "due",
      "expiring",
      "low",
      "idle",
      "waiting",
      "backlog",
      "unassigned",
      "watch",
      "reorder",
      "partial",
      "revis",
      "draft",
      "setup",
      "standby",
    ],
  ],
  [
    "good",
    [
      "approve",
      "complete",
      "closed",
      "pass",
      "cleared",
      "done",
      "released",
      "delivered",
      "shipped",
      "paid",
      "resolved",
      "healthy",
      "compliant",
      "available",
      "verified",
      "settled",
      "reconcil",
      "calibrat",
      "signed",
      "published",
      "connected",
      "accepted",
      "certified",
      "achieved",
      "ok",
      "good",
      "valid",
      "fit",
      "recovered",
      "won",
    ],
  ],
  [
    "info",
    [
      "progress",
      "running",
      "process",
      "transit",
      "review",
      "submitt",
      "planned",
      "schedul",
      "assign",
      "wip",
      "ongoing",
      "testing",
      "sampling",
      "dispatch",
      "open",
      "new",
      "active",
      "loading",
      "sync",
      "trial",
      "live",
    ],
  ],
];

const FALLBACK_TONES: StatusTone[] = [
  "info",
  "good",
  "warning",
  "serious",
  "critical",
  "neutral",
];

/** Map a status label to a tone by meaning, falling back to slot order. */
export function statusTone(status: string, index = 0): StatusTone {
  const value = status.toLowerCase();
  for (const [tone, keywords] of TONE_KEYWORDS) {
    if (keywords.some((keyword) => value.includes(keyword))) return tone;
  }
  return FALLBACK_TONES[index % FALLBACK_TONES.length];
}

/** Statuses that should pull attention — drives the "needs action" KPI. */
export function isAttentionStatus(status: string, index = 0): boolean {
  const tone = statusTone(status, index);
  return tone === "warning" || tone === "serious" || tone === "critical";
}

export const TONE_COLOR: Record<StatusTone, string> = {
  good: "var(--status-good)",
  warning: "var(--status-warning)",
  serious: "var(--status-serious)",
  critical: "var(--status-critical)",
  info: "var(--status-info)",
  neutral: "var(--status-neutral)",
  accent: "var(--accent)",
};

/* ── Spec resolution ───────────────────────────────────────────────────── */

const DEFAULT_ROWS = 42;

/**
 * Normalise a spec: parse fields, guarantee a reference, a date and a status
 * column, and pre-compute the lookups the engine leans on.
 */
export function resolveSpec(spec: WorkspaceSpec): ResolvedSpec {
  const parsed = spec.fields.map((field) => parseField(field, spec.ref));

  const codeField: FieldSpec =
    parsed.find((field) => field.kind === "code") ??
    { key: "reference", label: "Reference", kind: "code", prefix: spec.ref };

  const body = parsed.filter((field) => field !== codeField && field.kind !== "status");

  const dateField =
    body.find((field) => field.kind === "date") ??
    ({ key: "docDate", label: "Date", kind: "date", min: -150, max: 30 } as FieldSpec);

  const hasDate = body.some((field) => field.kind === "date");
  const orderedBody = hasDate ? body : [...body, dateField];

  const statusField: FieldSpec = {
    key: "status",
    label: "Status",
    kind: "status",
    options: spec.statuses,
  };

  const fields = [codeField, ...orderedBody, statusField];

  const numericFields = fields.filter(
    (field) => field.kind === "money" || field.kind === "int" || field.kind === "float",
  );

  const measure =
    (spec.measure ? fields.find((field) => field.key === spec.measure) : undefined) ??
    fields.find((field) => field.kind === "money") ??
    numericFields[0];

  return {
    entity: spec.entity,
    ref: spec.ref,
    fields,
    statuses: spec.statuses,
    rows: spec.rows ?? DEFAULT_ROWS,
    measure,
    insight: spec.insight,
    settings: spec.settings,
    statusField,
    codeField,
    dateField,
    primaryTextField: fields.find(
      (field) => field.kind === "enum" || field.kind === "text",
    ),
    enumFields: fields.filter(
      (field) => field.kind === "enum" || field.kind === "text" || field.kind === "person",
    ),
    numericFields,
  };
}

/* ── Row generation ────────────────────────────────────────────────────── */

/** Weights that make the first-listed statuses the common ones. */
function statusWeights(count: number): number[] {
  return Array.from({ length: count }, (_, index) => Math.max(3, 30 - index * 6));
}

function fieldValue(
  rng: () => number,
  field: FieldSpec,
  index: number,
  statuses: string[],
): string | number {
  switch (field.kind) {
    case "code":
      return `${field.prefix}-26-${String(1041 + index * 3).padStart(4, "0")}`;
    case "enum":
    case "text":
      return pick(rng, field.options ?? ITEMS);
    case "person":
      return pick(rng, PEOPLE);
    case "int": {
      const raw = randomInt(rng, field.min ?? 10, field.max ?? 1000);
      return raw > 5000 ? Math.round(raw / 10) * 10 : raw;
    }
    case "money":
      return randomInt(rng, field.min ?? 1000, field.max ?? 90_000);
    case "pct":
      return randomFloat(rng, field.min ?? 40, field.max ?? 99, 1);
    case "float":
      return randomFloat(rng, field.min ?? 0, field.max ?? 10, field.digits ?? 2);
    case "date":
      return daysFromToday(randomInt(rng, field.min ?? -120, field.max ?? 45));
    case "bool":
      return pick(rng, field.options ?? ["Yes", "No"]);
    case "status":
      return pickWeighted(rng, statuses, statusWeights(statuses.length));
    default:
      return "";
  }
}

/** Deterministic demo rows — identical on the server and after hydration. */
export function generateRows(spec: ResolvedSpec, seedKey: string): RecordRow[] {
  const rng = seeded(`spec:${seedKey}`);

  return Array.from({ length: spec.rows }, (_, index) => {
    const row: RecordRow = { id: `${spec.ref}-${index + 1}` };
    for (const field of spec.fields) {
      row[field.key] = fieldValue(rng, field, index, spec.statuses);
    }
    return row;
  });
}

/** A blank row shaped by the spec — the starting point for the create form. */
export function emptyRow(spec: ResolvedSpec, sequence: number): RecordRow {
  const row: RecordRow = { id: `${spec.ref}-new-${sequence}` };
  for (const field of spec.fields) {
    switch (field.kind) {
      case "code":
        row[field.key] = `${field.prefix}-26-${String(9000 + sequence).padStart(4, "0")}`;
        break;
      case "date":
        row[field.key] = daysFromToday(0);
        break;
      case "status":
        row[field.key] = spec.statuses[0];
        break;
      case "int":
      case "money":
      case "pct":
      case "float":
        row[field.key] = "";
        break;
      default:
        row[field.key] = "";
    }
  }
  return row;
}

/* ── Value formatting ──────────────────────────────────────────────────── */

/** Display string for a cell, detail row or CSV cell. */
export function formatValue(field: FieldSpec, value: string | number): string {
  if (value === "" || value === undefined || value === null) return "—";

  switch (field.kind) {
    case "money":
      return currency(Number(value));
    case "int":
      return field.unit
        ? `${number(Number(value))} ${field.unit}`
        : number(Number(value));
    case "float":
      return field.unit
        ? `${Number(value).toFixed(field.digits ?? 2)} ${field.unit}`
        : Number(value).toFixed(field.digits ?? 2);
    case "pct":
      return `${Number(value).toFixed(1)}%`;
    case "date":
      return shortDate(String(value));
    default:
      return String(value);
  }
}

/** Short form used inside cards and tight cells. */
export function compactValue(field: FieldSpec, value: string | number): string {
  if (field.kind === "money") return compactCurrency(Number(value));
  return formatValue(field, value);
}

/** True when the field should sit in the right-aligned numeric column group. */
export function isNumericField(field: FieldSpec): boolean {
  return (
    field.kind === "money" ||
    field.kind === "int" ||
    field.kind === "float" ||
    field.kind === "pct"
  );
}
