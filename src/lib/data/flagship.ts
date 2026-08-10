import {
  MONTHS,
  daysFromToday,
  pick,
  pickWeighted,
  randomFloat,
  randomInt,
  seeded,
} from "./rng";

/**
 * Purpose-built datasets for the flagship workspaces. These are shaped like the
 * real documents each module handles rather than the generic record shape used
 * by the generated workspaces.
 */

/* ══ SALES ORDER BOOK ═══════════════════════════════════════════════════ */

export type OrderStatus =
  | "Confirmed"
  | "In Production"
  | "Plating"
  | "Packing"
  | "Ready to Ship"
  | "Shipped"
  | "On Hold";

export interface SalesOrder {
  id: string;
  orderNo: string;
  buyer: string;
  country: string;
  style: string;
  product: string;
  quantity: number;
  value: number;
  unitPrice: number;
  status: OrderStatus;
  progress: number;
  orderDate: string;
  shipDate: string;
  daysToShip: number;
  atRisk: boolean;
  merchandiser: string;
}

const ORDER_BUYERS = [
  ["H&M Global Sourcing", "Sweden"],
  ["Inditex / Zara", "Spain"],
  ["Levi Strauss & Co.", "USA"],
  ["Primark Sourcing", "Ireland"],
  ["Uniqlo / Fast Retailing", "Japan"],
  ["Decathlon Sourcing", "France"],
  ["C&A Buying", "Germany"],
  ["Bestseller A/S", "Denmark"],
  ["Next Sourcing Ltd.", "UK"],
  ["Marks & Spencer", "UK"],
];

const ORDER_PRODUCTS = [
  "Antique Brass Snap Button 15mm",
  "Nickel-Free Jeans Button 17mm",
  "Gunmetal Slider #5",
  "Matte Black Rivet 9mm",
  "Gold Eyelet 4mm",
  "Zinc Alloy Buckle 25mm",
  "Engraved Metal Label 30x8mm",
  "Brushed Silver Burr 8mm",
  "Enamel Shank Button 20L",
  "Laser-Etched Tack Button",
];

const MERCHANDISERS = [
  "Sadia Rahman",
  "Tanvir Ahmed",
  "Nusrat Jahan",
  "Farhan Chowdhury",
  "Rashed Khan",
];

const ORDER_STATUSES: OrderStatus[] = [
  "Confirmed",
  "In Production",
  "Plating",
  "Packing",
  "Ready to Ship",
  "Shipped",
  "On Hold",
];

const ORDER_STATUS_WEIGHTS = [16, 22, 14, 12, 10, 22, 4];

const STATUS_PROGRESS: Record<OrderStatus, [number, number]> = {
  Confirmed: [2, 12],
  "In Production": [18, 48],
  Plating: [48, 66],
  Packing: [66, 84],
  "Ready to Ship": [88, 97],
  Shipped: [100, 100],
  "On Hold": [10, 55],
};

export const SALES_ORDERS: SalesOrder[] = (() => {
  const rng = seeded("flagship:sales-orders:v1");

  return Array.from({ length: 86 }, (_, index) => {
    const [buyer, country] = pick(rng, ORDER_BUYERS);
    const status = pickWeighted(rng, ORDER_STATUSES, ORDER_STATUS_WEIGHTS);
    const [minP, maxP] = STATUS_PROGRESS[status];
    const quantity = randomInt(rng, 24_000, 1_450_000);
    const unitPrice = randomFloat(rng, 0.032, 0.48, 3);
    const daysToShip = randomInt(rng, -12, 74);

    return {
      id: `so-${index}`,
      orderNo: `SO-${25_100 + index}`,
      buyer,
      country,
      style: `ST-${randomInt(rng, 1000, 9999)}`,
      product: pick(rng, ORDER_PRODUCTS),
      quantity,
      value: Math.round(quantity * unitPrice),
      unitPrice,
      status,
      progress: randomInt(rng, minP, maxP),
      orderDate: daysFromToday(-randomInt(rng, 12, 160)),
      shipDate: daysFromToday(daysToShip),
      daysToShip,
      atRisk: status !== "Shipped" && (daysToShip < 8 || status === "On Hold"),
      merchandiser: pick(rng, MERCHANDISERS),
    };
  });
})();

export const ORDER_BOOK_TREND = MONTHS.map((month, index) => {
  const rng = seeded(`orderbook:${month}`);
  const booked = Math.round(1_680_000 + index * 62_000 + (rng() - 0.5) * 320_000);
  return {
    month,
    booked,
    shipped: Math.round(booked * (0.82 + rng() * 0.14)),
    backlog: Math.round(booked * (0.28 + rng() * 0.12)),
  };
});

export const BACKLOG_AGING = [
  { bucket: "Not yet due", value: 8_420_000, orders: 214 },
  { bucket: "1–15 days", value: 3_180_000, orders: 96 },
  { bucket: "16–30 days", value: 1_640_000, orders: 48 },
  { bucket: "31–60 days", value: 720_000, orders: 22 },
  { bucket: "60+ days overdue", value: 280_000, orders: 9 },
];

export const ORDER_STATUS_MIX = ORDER_STATUSES.map((status) => ({
  label: status,
  value: SALES_ORDERS.filter((order) => order.status === status).length,
}));

/* ══ MES SHOP FLOOR ════════════════════════════════════════════════════ */

export type MachineState = "Running" | "Idle" | "Setup" | "Breakdown" | "Maintenance";

export interface Machine {
  id: string;
  name: string;
  cell: string;
  state: MachineState;
  oee: number;
  output: number;
  target: number;
  operator: string;
  job: string;
  cycleTime: number;
  standardCycle: number;
  temperature: number;
  uptimeHours: number;
}

const CELLS = ["Stamping", "Polishing", "Plating", "Assembly", "Packing"];
const OPERATORS = [
  "Md. Alamin",
  "Rubel Hossain",
  "Shahin Alam",
  "Jasim Uddin",
  "Kamrul Islam",
  "Nazmul Haque",
  "Sabbir Rahman",
  "Delwar Hossen",
];

export const MACHINES: Machine[] = (() => {
  const rng = seeded("flagship:machines:v1");
  const states: MachineState[] = ["Running", "Idle", "Setup", "Breakdown", "Maintenance"];
  const weights = [66, 12, 10, 6, 6];

  return Array.from({ length: 24 }, (_, index) => {
    const cell = CELLS[index % CELLS.length];
    const state = pickWeighted(rng, states, weights);
    const target = randomInt(rng, 18_000, 52_000);
    const standardCycle = randomFloat(rng, 0.8, 3.4, 2);

    return {
      id: `mc-${index}`,
      name: `${cell.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, "0")}`,
      cell,
      state,
      oee: state === "Running" ? randomFloat(rng, 68, 97, 1) : randomFloat(rng, 0, 42, 1),
      output: state === "Running" ? randomInt(rng, target * 0.6, target * 1.05) : randomInt(rng, 0, target * 0.4),
      target,
      operator: pick(rng, OPERATORS),
      job: `WO-${randomInt(rng, 41_000, 41_999)}`,
      cycleTime: Number((standardCycle * randomFloat(rng, 0.92, 1.18, 2)).toFixed(2)),
      standardCycle,
      temperature: randomFloat(rng, 38, 82, 1),
      uptimeHours: randomFloat(rng, 2, 22, 1),
    };
  });
})();

export const HOURLY_OUTPUT = Array.from({ length: 12 }, (_, index) => {
  const rng = seeded(`hourly:${index}`);
  const hour = 8 + index;
  const plan = 42_000;
  return {
    hour: `${String(hour).padStart(2, "0")}:00`,
    plan,
    actual: Math.round(plan * randomFloat(rng, 0.72, 1.12, 3)),
    rejected: randomInt(rng, 180, 1_240),
  };
});

export const DOWNTIME_REASONS = [
  { label: "Die Change / Setup", value: 412 },
  { label: "Material Shortage", value: 286 },
  { label: "Mechanical Breakdown", value: 224 },
  { label: "Bath Chemistry Adjust", value: 168 },
  { label: "Power Interruption", value: 124 },
  { label: "Quality Hold", value: 96 },
  { label: "Operator Absence", value: 62 },
];

export const SHIFT_COMPARISON = [
  { shift: "Shift A (06–14)", output: 482_000, efficiency: 91.4, rejection: 1.8 },
  { shift: "Shift B (14–22)", output: 461_000, efficiency: 88.2, rejection: 2.4 },
  { shift: "Shift C (22–06)", output: 398_000, efficiency: 82.6, rejection: 3.1 },
];

export const ANDON_EVENTS = [
  { id: "an1", line: "PLA-11", message: "Nickel bath temperature above limit", tone: "critical" as const, age: "3 min" },
  { id: "an2", line: "STA-02", message: "Die change overdue by 40 minutes", tone: "warning" as const, age: "12 min" },
  { id: "an3", line: "ASS-18", message: "Component feed jam cleared", tone: "good" as const, age: "24 min" },
  { id: "an4", line: "POL-07", message: "Operator called for tooling support", tone: "info" as const, age: "31 min" },
  { id: "an5", line: "PLA-13", message: "Rectifier current fluctuation", tone: "warning" as const, age: "48 min" },
];

/* ══ INVENTORY ═════════════════════════════════════════════════════════ */

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  store: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  unitCost: number;
  value: number;
  abcClass: "A" | "B" | "C";
  ageDays: number;
  status: "Healthy" | "Low" | "Critical" | "Excess";
}

const STOCK_CATEGORIES = [
  "Brass Sheet",
  "Zinc Alloy Ingot",
  "Steel Wire",
  "Plating Chemical",
  "Packing Carton",
  "Poly Bag",
  "Spring & Component",
];

const STORES = ["RM Store", "WIP Store", "FG Store", "Chemical Store", "Packing Store"];

export const STOCK_ITEMS: StockItem[] = (() => {
  const rng = seeded("flagship:stock:v1");

  return Array.from({ length: 72 }, (_, index) => {
    const onHand = randomInt(rng, 200, 92_000);
    const reserved = Math.round(onHand * randomFloat(rng, 0.05, 0.42, 2));
    const reorderLevel = Math.round(onHand * randomFloat(rng, 0.15, 1.2, 2));
    const unitCost = randomFloat(rng, 0.4, 148, 2);
    const available = onHand - reserved;

    const status: StockItem["status"] =
      available <= reorderLevel * 0.4
        ? "Critical"
        : available <= reorderLevel
          ? "Low"
          : available > reorderLevel * 4
            ? "Excess"
            : "Healthy";

    return {
      id: `st-${index}`,
      code: `ITM-${10_000 + index * 13}`,
      name: `${pick(rng, STOCK_CATEGORIES)} ${randomInt(rng, 2, 48)}mm`,
      category: pick(rng, STOCK_CATEGORIES),
      store: pick(rng, STORES),
      onHand,
      reserved,
      available,
      reorderLevel,
      unitCost,
      value: Math.round(onHand * unitCost),
      abcClass: pickWeighted(rng, ["A", "B", "C"] as const, [20, 30, 50]),
      ageDays: randomInt(rng, 3, 240),
      status,
    };
  });
})();

export const STOCK_BY_STORE = STORES.map((store) => {
  const items = STOCK_ITEMS.filter((item) => item.store === store);
  return {
    store,
    raw: items.filter((i) => i.abcClass === "A").reduce((s, i) => s + i.value, 0),
    wip: items.filter((i) => i.abcClass === "B").reduce((s, i) => s + i.value, 0),
    finished: items.filter((i) => i.abcClass === "C").reduce((s, i) => s + i.value, 0),
  };
});

export const TURNOVER_TREND = MONTHS.map((month, index) => {
  const rng = seeded(`turnover:${month}`);
  return {
    month,
    turns: Number((4.2 + index * 0.08 + (rng() - 0.5) * 0.5).toFixed(2)),
    daysOfSupply: Number((86 - index * 1.4 + (rng() - 0.5) * 8).toFixed(1)),
  };
});

export const ABC_SCATTER = (["A", "B", "C"] as const).map((abcClass) => ({
  label: `Class ${abcClass}`,
  points: STOCK_ITEMS.filter((item) => item.abcClass === abcClass)
    .slice(0, 24)
    .map((item) => ({
      x: item.value,
      y: item.ageDays,
      z: Math.max(20, Math.round(item.onHand / 800)),
    })),
}));

/* ══ QUALITY ═══════════════════════════════════════════════════════════ */

export const FPY_CONTROL = MONTHS.flatMap((month) =>
  [1, 2, 3, 4].map((week) => {
    const rng = seeded(`fpy:${month}:${week}`);
    return {
      period: `${month} W${week}`,
      fpy: Number((95.2 + (rng() - 0.5) * 3.2).toFixed(2)),
    };
  }),
).slice(-24);

export const NCR_BY_SOURCE = [
  { label: "In-Process Inspection", value: 184 },
  { label: "Final Inspection", value: 142 },
  { label: "Incoming Material", value: 118 },
  { label: "Customer Complaint", value: 46 },
  { label: "Internal Audit", value: 34 },
];

export const SUPPLIER_PPM = [
  { label: "Zhejiang Metal Works", value: 420 },
  { label: "Dhaka Brass Industries", value: 680 },
  { label: "Guangzhou Alloy Co.", value: 1_240 },
  { label: "Nippon Plating Chemicals", value: 210 },
  { label: "Korea Zipper Components", value: 890 },
  { label: "Shanghai Die & Tool", value: 1_680 },
  { label: "Taiwan Precision Springs", value: 340 },
];

export const COPQ_BREAKDOWN = [
  { label: "Rework Labour", value: 284_000 },
  { label: "Scrapped Material", value: 218_000 },
  { label: "Re-plating Cost", value: 164_000 },
  { label: "Buyer Claims", value: 96_000 },
  { label: "Sorting & Inspection", value: 72_000 },
  { label: "Air Freight (Recovery)", value: 58_000 },
];

export const AQL_RESULTS = MONTHS.map((month) => {
  const rng = seeded(`aql:${month}`);
  return {
    month,
    passed: randomInt(rng, 168, 248),
    failed: randomInt(rng, 6, 34),
    reinspected: randomInt(rng, 4, 22),
  };
});

export const CAPA_STATUS = [
  { label: "Open", value: 24, tone: "warning" as const },
  { label: "In Progress", value: 38, tone: "info" as const },
  { label: "Verification", value: 16, tone: "info" as const },
  { label: "Closed", value: 142, tone: "good" as const },
  { label: "Overdue", value: 9, tone: "critical" as const },
];

/* ══ FINANCE ═══════════════════════════════════════════════════════════ */

export const PL_SUMMARY = [
  { line: "Revenue", value: 24_570_000, kind: "income" as const },
  { line: "Cost of Goods Sold", value: -14_180_000, kind: "cost" as const },
  { line: "Gross Profit", value: 10_390_000, kind: "subtotal" as const },
  { line: "Operating Expenses", value: -3_140_000, kind: "cost" as const },
  { line: "Administrative Expenses", value: -1_420_000, kind: "cost" as const },
  { line: "Finance Cost", value: -680_000, kind: "cost" as const },
  { line: "Other Income", value: 380_000, kind: "income" as const },
  { line: "Profit Before Tax", value: 5_530_000, kind: "subtotal" as const },
  { line: "Tax Expense", value: -1_240_000, kind: "cost" as const },
  { line: "Net Profit", value: 4_290_000, kind: "total" as const },
];

export const AR_AGING = [
  { bucket: "Current", value: 2_840_000, invoices: 218 },
  { bucket: "1–30 days", value: 1_420_000, invoices: 112 },
  { bucket: "31–60 days", value: 640_000, invoices: 54 },
  { bucket: "61–90 days", value: 280_000, invoices: 26 },
  { bucket: "90+ days", value: 140_000, invoices: 14 },
];

export const AP_AGING = [
  { bucket: "Current", value: 1_680_000, invoices: 164 },
  { bucket: "1–30 days", value: 890_000, invoices: 96 },
  { bucket: "31–60 days", value: 380_000, invoices: 42 },
  { bucket: "61–90 days", value: 140_000, invoices: 18 },
  { bucket: "90+ days", value: 60_000, invoices: 7 },
];

export const EXPENSE_MIX = [
  { label: "Raw Material", value: 9_840_000 },
  { label: "Direct Labour", value: 2_680_000 },
  { label: "Plating & Chemicals", value: 1_920_000 },
  { label: "Energy & Utilities", value: 1_240_000 },
  { label: "Freight & Logistics", value: 880_000 },
  { label: "Administrative", value: 1_420_000 },
  { label: "Finance Cost", value: 680_000 },
];

export const FINANCIAL_RATIOS = [
  { label: "Gross Margin", value: 42.3, target: 40, unit: "%" },
  { label: "Net Margin", value: 17.5, target: 15, unit: "%" },
  { label: "Current Ratio", value: 1.84, target: 1.5, unit: "x" },
  { label: "Quick Ratio", value: 1.12, target: 1.0, unit: "x" },
  { label: "Debt / Equity", value: 0.68, target: 0.8, unit: "x" },
  { label: "Inventory Turns", value: 5.2, target: 6, unit: "x" },
  { label: "DSO", value: 42, target: 45, unit: "d" },
  { label: "DPO", value: 56, target: 50, unit: "d" },
];

export const MONTHLY_FINANCE = MONTHS.map((month, index) => {
  const rng = seeded(`fin:${month}`);
  const revenue = Math.round(1_840_000 + index * 42_000 + (rng() - 0.5) * 180_000);
  const cogs = Math.round(revenue * (0.6 - index * 0.002));
  const opex = Math.round(revenue * 0.19);
  return {
    month,
    revenue,
    cogs,
    opex,
    netProfit: revenue - cogs - opex,
  };
});

export const CASH_CONVERSION = MONTHS.map((month, index) => {
  const rng = seeded(`ccc:${month}`);
  return {
    month,
    dso: Number((46 - index * 0.4 + (rng() - 0.5) * 4).toFixed(1)),
    dio: Number((72 - index * 0.6 + (rng() - 0.5) * 6).toFixed(1)),
    dpo: Number((52 + index * 0.3 + (rng() - 0.5) * 4).toFixed(1)),
  };
});
