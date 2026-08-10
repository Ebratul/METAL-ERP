/**
 * Dataset schema model.
 *
 * A *dataset* describes one ERP entity — its fields, its status vocabulary and
 * the KPIs worth showing above it. Every workspace in the app binds to one
 * dataset, and the whole surface (table columns, create/edit form, filter
 * facets, charts and KPI band) is derived from that single description.
 *
 * The model is plain data with no React imports so the registry, the server
 * render and the client render all read the same source of truth.
 */

/** Mirrors `StatusTone` in `@/components/ui/badge`. */
export type Tone =
  | "good"
  | "warning"
  | "serious"
  | "critical"
  | "info"
  | "neutral"
  | "accent";

export type FieldType =
  | "code" // auto-generated reference, e.g. "PO-004312"
  | "text"
  | "select"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "status"
  | "progress"
  | "textarea";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** Generator vocabulary for `text` fields. */
  pool?: readonly string[];
  /** Allowed values for `select` / `status`. */
  options?: readonly string[];
  /** Sampling weights aligned with `options`. */
  weights?: readonly number[];
  /** Numeric range; for `date` these are day offsets from the demo date. */
  min?: number;
  max?: number;
  decimals?: number;
  suffix?: string;
  required?: boolean;
  /** Form column span. */
  span?: 1 | 2;
  /** Show as a table column. Defaults to true. */
  inTable?: boolean;
  /** Editable in the create/edit form. Defaults to true. */
  inForm?: boolean;
  /** Offer as a filter dropdown above the table. */
  facet?: boolean;
  /** The row's headline column — rendered bold and never hidden. */
  primary?: boolean;
  hideOnMobile?: boolean;
  width?: string;
  align?: "left" | "right" | "center";
}

export type MetricKind = "count" | "countWhere" | "sum" | "avg" | "rate" | "distinct";

export type MetricFormat =
  | "number"
  | "currency"
  | "compact"
  | "percent"
  | "days"
  | "plain";

export interface MetricDef {
  label: string;
  kind: MetricKind;
  /** Field the metric reads. Ignored by `count`. */
  field?: string;
  /** Values counted by `countWhere` / the numerator of `rate`. */
  values?: readonly string[];
  format?: MetricFormat;
  caption: string;
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** Falling is good (defects, delays, cost). */
  invert?: boolean;
}

export interface Dataset {
  id: string;
  /** Singular noun for buttons and dialogs: "New Purchase Order". */
  entity: string;
  plural: string;
  /** Reference prefix for generated codes. */
  prefix: string;
  fields: FieldDef[];
  statusKey?: string;
  statusTones: Record<string, Tone>;
  metrics: MetricDef[];
  /** Categorical field used for the "by category" charts. */
  groupKey?: string;
  /** Numeric field aggregated into value charts and totals. */
  valueKey?: string;
  /** Date field driving the calendar and the monthly trend. */
  dateKey?: string;
  /** How many rows to seed. */
  rows: number;
}

/* ── Field builders ────────────────────────────────────────────────────── */

type Extra = Partial<FieldDef>;

export const F = {
  code(label = "Reference", extra: Extra = {}): FieldDef {
    return {
      key: "code",
      label,
      type: "code",
      inForm: false,
      width: "w-36",
      ...extra,
    };
  },

  text(key: string, label: string, pool: readonly string[], extra: Extra = {}): FieldDef {
    return { key, label, type: "text", pool, required: true, ...extra };
  },

  /** The headline column: bold in the table, first field in the form. */
  title(key: string, label: string, pool: readonly string[], extra: Extra = {}): FieldDef {
    return { key, label, type: "text", pool, primary: true, required: true, ...extra };
  },

  select(
    key: string,
    label: string,
    options: readonly string[],
    extra: Extra = {},
  ): FieldDef {
    return { key, label, type: "select", options, facet: true, ...extra };
  },

  number(
    key: string,
    label: string,
    min: number,
    max: number,
    extra: Extra = {},
  ): FieldDef {
    return { key, label, type: "number", min, max, align: "right", ...extra };
  },

  money(
    key: string,
    label: string,
    min: number,
    max: number,
    extra: Extra = {},
  ): FieldDef {
    return { key, label, type: "currency", min, max, align: "right", ...extra };
  },

  percent(
    key: string,
    label: string,
    min = 40,
    max = 100,
    extra: Extra = {},
  ): FieldDef {
    return {
      key,
      label,
      type: "percent",
      min,
      max,
      decimals: 1,
      align: "right",
      ...extra,
    };
  },

  date(
    key: string,
    label: string,
    min = -180,
    max = 30,
    extra: Extra = {},
  ): FieldDef {
    return { key, label, type: "date", min, max, align: "right", ...extra };
  },

  progress(key = "progress", label = "Progress", extra: Extra = {}): FieldDef {
    return { key, label, type: "progress", min: 0, max: 100, width: "w-32", ...extra };
  },

  notes(key = "notes", label = "Notes", extra: Extra = {}): FieldDef {
    return {
      key,
      label,
      type: "textarea",
      inTable: false,
      span: 2,
      ...extra,
    };
  },

  priority(extra: Extra = {}): FieldDef {
    return {
      key: "priority",
      label: "Priority",
      type: "select",
      options: ["High", "Medium", "Low"],
      weights: [24, 52, 24],
      facet: true,
      hideOnMobile: true,
      ...extra,
    };
  },

  owner(pool: readonly string[], label = "Owner", extra: Extra = {}): FieldDef {
    return {
      key: "owner",
      label,
      type: "text",
      pool,
      facet: true,
      hideOnMobile: true,
      ...extra,
    };
  },
};

/* ── Metric builders ───────────────────────────────────────────────────── */

export const M = {
  count(label: string, caption: string, tone: MetricDef["tone"] = 1): MetricDef {
    return { label, kind: "count", caption, tone, format: "number" };
  },

  where(
    label: string,
    field: string,
    values: readonly string[],
    caption: string,
    tone: MetricDef["tone"] = 2,
    invert = false,
  ): MetricDef {
    return {
      label,
      kind: "countWhere",
      field,
      values,
      caption,
      tone,
      invert,
      format: "number",
    };
  },

  sum(
    label: string,
    field: string,
    caption: string,
    tone: MetricDef["tone"] = 3,
    format: MetricFormat = "currency",
  ): MetricDef {
    return { label, kind: "sum", field, caption, tone, format };
  },

  avg(
    label: string,
    field: string,
    caption: string,
    tone: MetricDef["tone"] = 4,
    format: MetricFormat = "number",
    invert = false,
  ): MetricDef {
    return { label, kind: "avg", field, caption, tone, format, invert };
  },

  rate(
    label: string,
    field: string,
    values: readonly string[],
    caption: string,
    tone: MetricDef["tone"] = 6,
  ): MetricDef {
    return { label, kind: "rate", field, values, caption, tone, format: "percent" };
  },

  distinct(
    label: string,
    field: string,
    caption: string,
    tone: MetricDef["tone"] = 3,
  ): MetricDef {
    return { label, kind: "distinct", field, caption, tone, format: "number" };
  },
};

/* ── Dataset builder ───────────────────────────────────────────────────── */

export interface DatasetSpec {
  id: string;
  entity: string;
  plural?: string;
  prefix: string;
  fields: FieldDef[];
  /** Status vocabulary mapped to its badge tone; the order is the board order. */
  status: Record<string, Tone>;
  statusLabel?: string;
  statusWeights?: readonly number[];
  metrics?: MetricDef[];
  groupKey?: string;
  valueKey?: string;
  dateKey?: string;
  rows?: number;
}

/** Tones that read as "this item is finished / healthy". */
const SETTLED: Tone[] = ["good"];
/** Tones that read as "someone still has to act". */
const ATTENTION: Tone[] = ["warning", "critical", "serious"];

/**
 * Turns a spec into a dataset: appends the status field, infers the group /
 * value / date keys when they were not given, and derives a sensible KPI band
 * when the spec did not supply one.
 */
export function defineDataset(spec: DatasetSpec): Dataset {
  const statusOptions = Object.keys(spec.status);

  const statusField: FieldDef = {
    key: "status",
    label: spec.statusLabel ?? "Status",
    type: "status",
    options: statusOptions,
    weights: spec.statusWeights,
    facet: true,
    required: true,
  };

  const fields = [...spec.fields, statusField];

  const groupKey =
    spec.groupKey ??
    fields.find((field) => field.type === "select" && field.key !== "priority")?.key;

  const valueKey =
    spec.valueKey ??
    fields.find((field) => field.type === "currency")?.key ??
    fields.find((field) => field.type === "number")?.key;

  const dateKey = spec.dateKey ?? fields.find((field) => field.type === "date")?.key;

  const plural = spec.plural ?? `${spec.entity}s`;

  const settled = statusOptions.filter((value) =>
    SETTLED.includes(spec.status[value]),
  );
  const attention = statusOptions.filter((value) =>
    ATTENTION.includes(spec.status[value]),
  );

  const metrics =
    spec.metrics ??
    ([
      M.count(`Total ${plural}`, "in this workspace", 1),
      attention.length > 0
        ? M.where("Needs Action", "status", attention, "open with the team", 2, true)
        : M.count(`Active ${plural}`, "currently tracked", 2),
      valueKey
        ? M.sum(
            fields.find((field) => field.key === valueKey)?.label ?? "Total Value",
            valueKey,
            "across all rows",
            3,
            fields.find((field) => field.key === valueKey)?.type === "currency"
              ? "currency"
              : "compact",
          )
        : // Without a numeric field, spread across the grouping column is the
          // most informative third metric — a second count would just repeat.
          M.distinct(
            `${fields.find((field) => field.key === groupKey)?.label ?? "Categories"} Covered`,
            groupKey ?? "status",
            "distinct values in view",
            3,
          ),
      settled.length > 0
        ? M.rate("Completion Rate", "status", settled, "share settled", 6)
        : M.count("Tracked", "records on file", 6),
    ] satisfies MetricDef[]);

  return {
    id: spec.id,
    entity: spec.entity,
    plural,
    prefix: spec.prefix,
    fields,
    statusKey: "status",
    statusTones: spec.status,
    metrics,
    groupKey,
    valueKey,
    dateKey,
    rows: spec.rows ?? 64,
  };
}
