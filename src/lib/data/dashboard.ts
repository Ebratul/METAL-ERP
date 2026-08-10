import { MONTHS, seeded, randomInt, trendSeries } from "./rng";

/**
 * Demo datasets for the CEO Command Center.
 *
 * Everything is derived from a seeded generator, so the server render and the
 * client hydration produce byte-identical numbers.
 */

const rng = seeded("smart-metal-erp:dashboard:v1");

/* ── Headline KPIs ──────────────────────────────────────────────────────── */

export interface HeadlineKpi {
  id: string;
  label: string;
  value: string;
  delta: number;
  invertDelta?: boolean;
  caption: string;
  icon: string;
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  trend: number[];
}

export const HEADLINE_KPIS: HeadlineKpi[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$24.57M",
    delta: 12.5,
    caption: "vs last year",
    icon: "Wallet",
    tone: 1,
    trend: trendSeries(seeded("kpi:revenue"), 12, { start: 1.4, drift: 0.05, digits: 2 }),
  },
  {
    id: "profit",
    label: "Total Profit",
    value: "$6.42M",
    delta: 18.7,
    caption: "26.1% margin",
    icon: "TrendingUp",
    tone: 3,
    trend: trendSeries(seeded("kpi:profit"), 12, { start: 0.36, drift: 0.06, digits: 2 }),
  },
  {
    id: "orders",
    label: "Sales Orders",
    value: "25,846",
    delta: 9.2,
    caption: "1,284 open",
    icon: "ClipboardList",
    tone: 7,
    trend: trendSeries(seeded("kpi:orders"), 12, { start: 1800, drift: 0.03 }),
  },
  {
    id: "output",
    label: "Production Output",
    value: "182.4M pcs",
    delta: 7.8,
    caption: "this fiscal year",
    icon: "Factory",
    tone: 2,
    trend: trendSeries(seeded("kpi:output"), 12, { start: 12_400_000, drift: 0.03 }),
  },
  {
    id: "buyers",
    label: "Active Buyers",
    value: "568",
    delta: 4.6,
    caption: "42 new this quarter",
    icon: "Users",
    tone: 5,
    trend: trendSeries(seeded("kpi:buyers"), 12, { start: 420, drift: 0.025 }),
  },
  {
    id: "otif",
    label: "On-Time In-Full",
    value: "94.2%",
    delta: 2.1,
    caption: "target 95%",
    icon: "PackageCheck",
    tone: 6,
    trend: trendSeries(seeded("kpi:otif"), 12, {
      start: 88,
      drift: 0.006,
      volatility: 0.02,
      digits: 1,
    }),
  },
];

/* ── Business performance (revenue / profit / expense) ──────────────────── */

/** A type alias, not an interface: only aliases get the implicit index
 *  signature that the chart components' `Record<string, string | number>`
 *  row type requires. */
export type PerformanceRow = {
  month: string;
  revenue: number;
  profit: number;
  expenses: number;
};

export const BUSINESS_PERFORMANCE: PerformanceRow[] = (() => {
  const revenueSeries = trendSeries(seeded("perf:revenue"), 12, {
    start: 14_800_000,
    drift: 0.042,
    volatility: 0.05,
  });
  return MONTHS.map((month, index) => {
    const revenue = revenueSeries[index];
    const expenses = Math.round(revenue * (0.74 - index * 0.004));
    return {
      month,
      revenue,
      profit: revenue - expenses,
      expenses,
    };
  });
})();

/* ── Revenue composition ────────────────────────────────────────────────── */

export const REVENUE_MIX = [
  { label: "Export Sales", value: 18_920_000 },
  { label: "Local Sales", value: 2_450_000 },
  { label: "Subcontract Service", value: 1_850_000 },
  { label: "Tooling & Die Recovery", value: 890_000 },
  { label: "Scrap & Recovery", value: 460_000 },
];

/* ── Cash flow ──────────────────────────────────────────────────────────── */

export const CASH_POSITION = [
  { label: "Cash in Hand", value: 2_450_000, icon: "Banknote", tone: 3 as const },
  { label: "Bank Balance", value: 8_920_000, icon: "Landmark", tone: 1 as const },
  { label: "Accounts Receivable", value: 5_320_000, icon: "ReceiptText", tone: 7 as const },
  { label: "Accounts Payable", value: -3_150_000, icon: "Wallet", tone: 2 as const },
];

export const CASH_FLOW_13W = (() => {
  const inflow = trendSeries(seeded("cash:in"), 13, {
    start: 1_850_000,
    drift: 0.012,
    volatility: 0.12,
  });
  const outflow = trendSeries(seeded("cash:out"), 13, {
    start: 1_620_000,
    drift: 0.011,
    volatility: 0.1,
  });
  return inflow.map((value, index) => ({
    week: `W${index + 1}`,
    inflow: value,
    outflow: outflow[index],
    net: value - outflow[index],
  }));
})();

/* ── Country / market split ─────────────────────────────────────────────── */

export interface CountryRow {
  country: string;
  code: string;
  revenue: number;
  orders: number;
  growth: number;
}

export const COUNTRY_SALES: CountryRow[] = [
  { country: "Bangladesh", code: "BD", revenue: 5_450_000, orders: 6_240, growth: 15.2 },
  { country: "China", code: "CN", revenue: 4_120_000, orders: 4_980, growth: 11.3 },
  { country: "Vietnam", code: "VN", revenue: 3_280_000, orders: 3_610, growth: 18.4 },
  { country: "India", code: "IN", revenue: 2_850_000, orders: 3_120, growth: 9.8 },
  { country: "Turkey", code: "TR", revenue: 2_240_000, orders: 2_450, growth: 7.6 },
  { country: "Indonesia", code: "ID", revenue: 1_680_000, orders: 1_890, growth: 12.1 },
  { country: "Cambodia", code: "KH", revenue: 1_420_000, orders: 1_640, growth: 6.3 },
  { country: "Others", code: "OT", revenue: 3_530_000, orders: 4_916, growth: 5.4 },
];

/* ── Product family mix ─────────────────────────────────────────────────── */

export const PRODUCT_FAMILIES = [
  { label: "Metal Buttons", value: 7_820_000 },
  { label: "Zippers & Sliders", value: 5_940_000 },
  { label: "Rivets & Burrs", value: 3_610_000 },
  { label: "Snap Fasteners", value: 2_880_000 },
  { label: "Metal Labels & Tags", value: 2_140_000 },
  { label: "Buckles & Hooks", value: 1_290_000 },
  { label: "Eyelets", value: 890_000 },
];

/* ── Top buyers ────────────────────────────────────────────────────────── */

export interface BuyerRow {
  name: string;
  country: string;
  revenue: number;
  orders: number;
  margin: number;
  growth: number;
  status: "Active" | "At Risk" | "New";
}

export const TOP_BUYERS: BuyerRow[] = [
  { name: "H&M Global Sourcing", country: "Sweden", revenue: 3_420_000, orders: 412, margin: 27.4, growth: 14.2, status: "Active" },
  { name: "Inditex / Zara", country: "Spain", revenue: 2_980_000, orders: 368, margin: 29.1, growth: 18.6, status: "Active" },
  { name: "Levi Strauss & Co.", country: "USA", revenue: 2_640_000, orders: 296, margin: 31.2, growth: 9.4, status: "Active" },
  { name: "Primark Sourcing", country: "Ireland", revenue: 2_180_000, orders: 344, margin: 22.8, growth: -3.2, status: "At Risk" },
  { name: "Uniqlo / Fast Retailing", country: "Japan", revenue: 1_920_000, orders: 254, margin: 28.6, growth: 21.5, status: "Active" },
  { name: "Decathlon Sourcing", country: "France", revenue: 1_640_000, orders: 218, margin: 25.3, growth: 12.8, status: "Active" },
  { name: "C&A Buying", country: "Germany", revenue: 1_380_000, orders: 186, margin: 24.1, growth: 4.6, status: "Active" },
  { name: "Bestseller A/S", country: "Denmark", revenue: 1_120_000, orders: 164, margin: 26.7, growth: 32.4, status: "New" },
];

/* ── Production status ─────────────────────────────────────────────────── */

export const PRODUCTION_STAGES = [
  { label: "Casting / Stamping", value: 42_800_000 },
  { label: "Polishing", value: 38_400_000 },
  { label: "Plating", value: 34_100_000 },
  { label: "Assembly", value: 29_600_000 },
  { label: "Inspection", value: 27_900_000 },
  { label: "Packing", value: 26_400_000 },
];

export const LINE_OEE = [
  { line: "Stamping A", oee: 87.4, availability: 92.1, performance: 95.2, quality: 99.7 },
  { line: "Stamping B", oee: 82.1, availability: 88.4, performance: 93.6, quality: 99.2 },
  { line: "Plating 1", oee: 91.2, availability: 95.6, performance: 96.1, quality: 99.2 },
  { line: "Plating 2", oee: 94.6, availability: 97.2, performance: 97.8, quality: 99.5 },
  { line: "Plating 3", oee: 68.4, availability: 74.2, performance: 93.1, quality: 99.0 },
  { line: "Assembly 1", oee: 89.7, availability: 93.8, performance: 96.4, quality: 99.2 },
  { line: "Assembly 2", oee: 85.3, availability: 90.1, performance: 94.8, quality: 99.8 },
];

/** Machine-hours by weekday × shift — a continuous magnitude heatmap. */
export const CAPACITY_HEATMAP = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const lines = [
    "Stamping A",
    "Stamping B",
    "Plating 1",
    "Plating 2",
    "Plating 3",
    "Assembly 1",
    "Assembly 2",
  ];
  const heatRng = seeded("capacity:heatmap");
  const cells = lines.flatMap((line) =>
    days.map((day) => ({
      row: line,
      column: day,
      value:
        day === "Sun"
          ? randomInt(heatRng, 20, 55)
          : randomInt(heatRng, 62, 99),
    })),
  );
  return { rows: lines, columns: days, cells };
})();

/* ── Quality ───────────────────────────────────────────────────────────── */

export const DEFECT_PARETO = [
  { label: "Plating Peel-off", value: 428 },
  { label: "Dimension Out of Tol.", value: 316 },
  { label: "Colour Mismatch", value: 274 },
  { label: "Surface Scratch", value: 208 },
  { label: "Burr / Sharp Edge", value: 164 },
  { label: "Weak Attachment", value: 112 },
  { label: "Rust Spot", value: 68 },
];

export const QUALITY_TREND = MONTHS.map((month, index) => {
  const qRng = seeded(`quality:${month}`);
  return {
    month,
    rejectionRate: Number((3.6 - index * 0.09 + (qRng() - 0.5) * 0.4).toFixed(2)),
    reworkRate: Number((2.2 - index * 0.05 + (qRng() - 0.5) * 0.3).toFixed(2)),
    firstPassYield: Number((94.2 + index * 0.14 + (qRng() - 0.5) * 0.6).toFixed(2)),
  };
});

/* ── Order pipeline funnel ─────────────────────────────────────────────── */

export const ORDER_FUNNEL = [
  { label: "Inquiries", value: 1_842 },
  { label: "Quotations", value: 1_284 },
  { label: "Proforma Invoices", value: 892 },
  { label: "Confirmed Orders", value: 648 },
  { label: "In Production", value: 512 },
  { label: "Shipped", value: 468 },
];

/* ── Inventory ─────────────────────────────────────────────────────────── */

export const INVENTORY_MIX = [
  { label: "Raw Material", value: 5_240_000 },
  { label: "Work in Progress", value: 3_180_000 },
  { label: "Finished Goods", value: 2_940_000 },
  { label: "Packing Material", value: 860_000 },
  { label: "Consumables & Chemicals", value: 560_000 },
];

export const INVENTORY_AGING = [
  { bucket: "0–30 d", value: 6_240_000, items: 8_420 },
  { bucket: "31–60 d", value: 3_180_000, items: 4_260 },
  { bucket: "61–90 d", value: 1_840_000, items: 2_180 },
  { bucket: "91–180 d", value: 980_000, items: 1_140 },
  { bucket: "180+ d", value: 540_000, items: 742 },
];

/* ── Supplier scorecard (radar) ────────────────────────────────────────── */

export const SUPPLIER_RADAR = [
  { dimension: "Quality", top: 94, average: 78 },
  { dimension: "Delivery", top: 91, average: 72 },
  { dimension: "Price", top: 82, average: 76 },
  { dimension: "Responsiveness", top: 88, average: 68 },
  { dimension: "Compliance", top: 96, average: 81 },
  { dimension: "Capacity", top: 86, average: 74 },
];

/* ── Order value vs margin scatter (all-pairs form: 3 groups max) ───────── */

export const ORDER_SCATTER = (() => {
  const groups = ["Metal Buttons", "Zippers & Sliders", "Rivets & Burrs"];
  return groups.map((label, groupIndex) => {
    const sRng = seeded(`scatter:${label}`);
    return {
      label,
      points: Array.from({ length: 26 }, () => ({
        x: randomInt(sRng, 20_000, 480_000),
        y: Number((18 + sRng() * 20 - groupIndex * 1.6).toFixed(1)),
        z: randomInt(sRng, 40, 100),
      })),
    };
  });
})();

/* ── Delivery / shipment ───────────────────────────────────────────────── */

export const SHIPMENT_STATUS = [
  { label: "Delivered", value: 1_284, tone: "good" as const },
  { label: "In Transit", value: 156, tone: "info" as const },
  { label: "At Port", value: 72, tone: "warning" as const },
  { label: "Delayed", value: 24, tone: "critical" as const },
];

/* ── Workforce ─────────────────────────────────────────────────────────── */

export const WORKFORCE = {
  total: 2_453,
  present: 2_255,
  absent: 198,
  attendanceRate: 91.9,
  overtimeHours: 12_480,
};

/* ── Energy ────────────────────────────────────────────────────────────── */

export const ENERGY_TREND = MONTHS.map((month, index) => {
  const eRng = seeded(`energy:${month}`);
  return {
    month,
    electricity: Math.round(842_000 + index * 4_200 + (eRng() - 0.5) * 60_000),
    gas: Math.round(318_000 + index * 1_800 + (eRng() - 0.5) * 28_000),
    solar: Math.round(64_000 + index * 5_400 + (eRng() - 0.5) * 12_000),
  };
});

/* ── Approvals waiting ─────────────────────────────────────────────────── */

export const PENDING_APPROVALS = [
  { label: "Purchase Requisitions", count: 27, href: "/m/procurement/requisitions", tone: 2 as const },
  { label: "Quotation Discounts", count: 9, href: "/m/quotation-costing/approval-matrix", tone: 4 as const },
  { label: "Sample Approvals", count: 15, href: "/m/sample-management/approval-tracking", tone: 5 as const },
  { label: "Payment Releases", count: 19, href: "/m/finance-accounts/accounts-payable", tone: 3 as const },
  { label: "Engineering Changes", count: 6, href: "/m/plm/change-requests", tone: 7 as const },
  { label: "Overtime Sanctions", count: 12, href: "/m/organization-management/shifts", tone: 1 as const },
];

/** Small helper for the country revenue bar list. */
export const TOTAL_COUNTRY_REVENUE = COUNTRY_SALES.reduce(
  (sum, row) => sum + row.revenue,
  0,
);

export { rng as dashboardRng };
