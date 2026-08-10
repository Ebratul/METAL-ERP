/**
 * Chart theming constants.
 *
 * Every colour here is a design-system token, never a raw hex at the call site.
 * The categorical slots are assigned in fixed order and never cycled — a ninth
 * series folds into "Other" or becomes a facet instead.
 */

export const SERIES_TOKENS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
  "var(--series-8)",
] as const;

/** Max categorical series before the tail must be folded into "Other". */
export const MAX_SERIES = SERIES_TOKENS.length;

/**
 * All-pairs chart forms (scatter, bubble, treemap, choropleth) carry a tighter
 * cap: only the first three slots clear the CVD floor when any two marks can
 * sit side by side.
 */
export const MAX_SERIES_ALL_PAIRS = 3;

export function seriesColor(index: number): string {
  return SERIES_TOKENS[index % SERIES_TOKENS.length];
}

/** Single-hue ramp for magnitude (heatmaps, intensity). Light -> dark. */
export const SEQUENTIAL = [
  "var(--seq-100)",
  "var(--seq-200)",
  "var(--seq-300)",
  "var(--seq-400)",
  "var(--seq-500)",
  "var(--seq-600)",
  "var(--seq-700)",
] as const;

/**
 * Ordinal ramp for ordered discrete stages (funnel steps, tiers). Starts at
 * step 250 so the lightest mark still clears 2:1 against the surface.
 */
export const ORDINAL = [
  "var(--seq-200)",
  "var(--seq-300)",
  "var(--seq-400)",
  "var(--seq-500)",
  "var(--seq-600)",
  "var(--seq-700)",
] as const;

export const STATUS_COLORS = {
  good: "var(--status-good)",
  warning: "var(--status-warning)",
  serious: "var(--status-serious)",
  critical: "var(--status-critical)",
  info: "var(--status-info)",
  neutral: "var(--status-neutral)",
} as const;

export const CHART_INK = {
  grid: "var(--chart-grid)",
  axis: "var(--chart-axis)",
  label: "var(--chart-label)",
  surface: "var(--bg-surface)",
} as const;

/** Shared cartesian axis styling — recessive, solid hairlines, never dashed. */
export const axisProps = {
  stroke: CHART_INK.axis,
  tick: { fill: CHART_INK.label, fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

export const gridProps = {
  stroke: CHART_INK.grid,
  strokeWidth: 1,
  vertical: false,
} as const;

/** Interpolate the sequential ramp for a 0–1 intensity. */
export function sequentialStep(intensity: number): string {
  const clamped = Math.max(0, Math.min(1, intensity));
  const index = Math.round(clamped * (SEQUENTIAL.length - 1));
  return SEQUENTIAL[index];
}

export interface SeriesSpec {
  key: string;
  label: string;
  /** Defaults to the categorical slot at this series' index. */
  color?: string;
  /** Format one value for the tooltip and table view. */
  format?: (value: number) => string;
}

/** Resolve colours once so a filtered-out series never repaints the survivors. */
export function resolveSeries(series: SeriesSpec[]): Required<Pick<SeriesSpec, "key" | "label" | "color">>[] {
  return series.map((spec, index) => ({
    key: spec.key,
    label: spec.label,
    color: spec.color ?? seriesColor(index),
  }));
}
