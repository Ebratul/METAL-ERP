import type { ErpModule } from "@/lib/modules";
import { MONTHS, randomFloat, randomInt, seeded, trendSeries } from "./rng";

/**
 * Module-landing demo data.
 *
 * Individual workspaces build their numbers from their dataset (see
 * `lib/data/collection.ts`). This module only feeds the module *landing* page,
 * which summarises a whole module rather than one record set. Every generator
 * is seeded from the module slug, so the same module always renders identical
 * numbers on the server, on hydration and across reloads.
 */

/* ── KPI band ──────────────────────────────────────────────────────────── */

export interface WorkspaceKpi {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
  caption: string;
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  trend: number[];
}

const KPI_SHAPES: Array<{
  label: string;
  unit: "currency" | "count" | "percent" | "days";
  invert?: boolean;
  caption: string;
}> = [
  { label: "Total Records", unit: "count", caption: "across this module" },
  { label: "Open Items", unit: "count", caption: "awaiting action" },
  { label: "Value at Stake", unit: "currency", caption: "vs last period" },
  { label: "Completion Rate", unit: "percent", caption: "target 95%" },
  { label: "Average Cycle Time", unit: "days", invert: true, caption: "vs 30-day baseline" },
  { label: "Exceptions", unit: "count", invert: true, caption: "needs review" },
];

function formatUnit(unit: string, value: number): string {
  switch (unit) {
    case "currency":
      return value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(2)}M`
        : `$${(value / 1000).toFixed(1)}K`;
    case "percent":
      return `${value.toFixed(1)}%`;
    case "days":
      return `${value.toFixed(1)} d`;
    default:
      return new Intl.NumberFormat("en-US").format(Math.round(value));
  }
}

export function workspaceKpis(seedKey: string, count = 4): WorkspaceKpi[] {
  const rng = seeded(`kpi:${seedKey}`);
  const tones: WorkspaceKpi["tone"][] = [1, 3, 7, 2, 5, 4];

  return KPI_SHAPES.slice(0, count).map((shape, index) => {
    const base =
      shape.unit === "currency"
        ? randomInt(rng, 240_000, 8_400_000)
        : shape.unit === "percent"
          ? randomFloat(rng, 72, 99, 1)
          : shape.unit === "days"
            ? randomFloat(rng, 2.4, 28, 1)
            : randomInt(rng, 48, 9_800);

    return {
      label: shape.label,
      value: formatUnit(shape.unit, base),
      delta: randomFloat(rng, -9, 22, 1),
      invert: shape.invert,
      caption: shape.caption,
      tone: tones[index % tones.length],
      trend: trendSeries(seeded(`kpitrend:${seedKey}:${index}`), 10, {
        start: base * 0.72,
        drift: 0.02,
        volatility: 0.08,
        digits: 2,
      }),
    };
  });
}

/* ── Chart data ────────────────────────────────────────────────────────── */

export type TrendPoint = {
  month: string;
  primary: number;
  secondary: number;
  tertiary: number;
};

export function workspaceTrend(seedKey: string): TrendPoint[] {
  const primary = trendSeries(seeded(`trend:a:${seedKey}`), 12, {
    start: randomInt(seeded(`base:${seedKey}`), 4_200, 68_000),
    drift: 0.032,
    volatility: 0.07,
  });
  const secondary = trendSeries(seeded(`trend:b:${seedKey}`), 12, {
    start: primary[0] * 0.68,
    drift: 0.028,
    volatility: 0.08,
  });
  const tertiary = trendSeries(seeded(`trend:c:${seedKey}`), 12, {
    start: primary[0] * 0.34,
    drift: 0.04,
    volatility: 0.1,
  });

  return MONTHS.map((month, index) => ({
    month,
    primary: primary[index],
    secondary: secondary[index],
    tertiary: tertiary[index],
  }));
}

export type CategoryPoint = { category: string; value: number };

export function workspaceCategories(
  seedKey: string,
  labels: string[],
): CategoryPoint[] {
  const rng = seeded(`cat:${seedKey}`);
  return labels.map((category) => ({
    category,
    value: randomInt(rng, 180, 4_800),
  }));
}

export function workspaceBreakdown(
  seedKey: string,
  labels: string[],
): Array<{ label: string; value: number }> {
  const rng = seeded(`mix:${seedKey}`);
  return labels.map((label) => ({
    label,
    value: randomInt(rng, 240_000, 3_800_000),
  }));
}

/* ── Category label sets per module group ──────────────────────────────── */

const GROUP_CATEGORIES: Record<string, string[]> = {
  intelligence: ["Sales", "Production", "Quality", "Finance", "Logistics", "HR"],
  workforce: ["Production", "Quality", "Store", "Plating", "Admin", "Tool Room"],
  "master-data": ["Items", "Buyers", "Suppliers", "Locations", "Codes", "Documents"],
  sales: ["Buttons", "Zippers", "Rivets", "Snaps", "Labels", "Buckles"],
  product: ["Concept", "Design", "Tooling", "Trial", "Release", "Revision"],
  planning: ["Raw Metal", "Chemicals", "Packing", "Consumables", "Tooling", "Services"],
  inventory: ["RM Store", "WIP Store", "FG Store", "Packing Store", "Chemical Store", "Scrap Yard"],
  manufacturing: ["Stamping", "Polishing", "Plating", "Assembly", "Inspection", "Packing"],
  quality: ["Incoming", "In-Process", "Final", "Lab", "Audit", "Customer"],
  logistics: ["Air", "Sea", "Road", "Courier", "Multimodal", "Local"],
  finance: ["Receivable", "Payable", "Payroll", "Tax", "Treasury", "Capex"],
  assets: ["Presses", "Plating Lines", "Polishers", "Compressors", "Utilities", "Vehicles"],
  governance: ["Access", "Workflow", "Audit", "Risk", "Integration", "Mobile"],
};

export function categoriesForModule(module: ErpModule): string[] {
  return GROUP_CATEGORIES[module.group] ?? GROUP_CATEGORIES.intelligence;
}
