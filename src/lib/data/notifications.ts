export interface Notification {
  id: string;
  title: string;
  detail: string;
  age: string;
  tone: "critical" | "warning" | "good" | "info";
  read: boolean;
}

/** Static demo feed — deterministic so server and client HTML agree. */
export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Low stock alert",
    detail: "236 items below reorder level across 3 stores",
    age: "5 min ago",
    tone: "critical",
    read: false,
  },
  {
    id: "n2",
    title: "Plating line 3 stopped",
    detail: "Nickel bath temperature out of range for 12 minutes",
    age: "11 min ago",
    tone: "critical",
    read: false,
  },
  {
    id: "n3",
    title: "Payment received",
    detail: "$285,000 received from H&M Global Sourcing",
    age: "18 min ago",
    tone: "good",
    read: false,
  },
  {
    id: "n4",
    title: "New order received",
    detail: "Order #SO-25246 — 1.2M pcs metal buttons",
    age: "26 min ago",
    tone: "info",
    read: false,
  },
  {
    id: "n5",
    title: "Approval required",
    detail: "8 purchase requisitions pending your sign-off",
    age: "34 min ago",
    tone: "warning",
    read: false,
  },
  {
    id: "n6",
    title: "QC rejection spike",
    detail: "Snap button line — rejection at 4.8% vs 2.1% baseline",
    age: "48 min ago",
    tone: "warning",
    read: false,
  },
  {
    id: "n7",
    title: "Shipment cleared customs",
    detail: "Import consignment IMP-4471 released at Chattogram",
    age: "1 hr ago",
    tone: "good",
    read: true,
  },
  {
    id: "n8",
    title: "LC expiring soon",
    detail: "Master LC #LC-88213 expires in 6 days",
    age: "2 hr ago",
    tone: "warning",
    read: true,
  },
];

export interface LiveAlert {
  id: string;
  title: string;
  detail: string;
  age: string;
  tone: "critical" | "warning" | "good" | "info";
  href: string;
}

export const LIVE_ALERTS: LiveAlert[] = [
  {
    id: "a1",
    title: "Low Stock Alert",
    detail: "236 items are low in stock",
    age: "5 min ago",
    tone: "critical",
    href: "/m/inventory-store/min-max",
  },
  {
    id: "a2",
    title: "Payment Received",
    detail: "$285,000 received from H&M Global",
    age: "18 min ago",
    tone: "good",
    href: "/m/treasury-cash/receipts",
  },
  {
    id: "a3",
    title: "New Order Received",
    detail: "Order #SO-25246 received",
    age: "26 min ago",
    tone: "info",
    href: "/m/sales-order/order-book",
  },
  {
    id: "a4",
    title: "Approval Required",
    detail: "23 requests are pending",
    age: "34 min ago",
    tone: "warning",
    href: "/m/workflow-approval/my-approvals",
  },
  {
    id: "a5",
    title: "High Value Order",
    detail: "Order #SO-25246 — $845,000",
    age: "41 min ago",
    tone: "info",
    href: "/m/sales-order/order-value",
  },
  {
    id: "a6",
    title: "Die Life Threshold",
    detail: "Die DM-0412 at 94% of rated shots",
    age: "1 hr ago",
    tone: "warning",
    href: "/m/die-mold/shot-count",
  },
];

export interface SystemService {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
}

export const SYSTEM_SERVICES: SystemService[] = [
  { name: "Application Server", status: "operational", uptime: "99.99%" },
  { name: "Database Cluster", status: "operational", uptime: "99.98%" },
  { name: "Backup & Replication", status: "operational", uptime: "100%" },
  { name: "Security Gateway", status: "operational", uptime: "99.97%" },
  { name: "API Services", status: "degraded", uptime: "99.42%" },
  { name: "Payment Gateway", status: "operational", uptime: "99.95%" },
  { name: "IoT Ingest Pipeline", status: "operational", uptime: "99.91%" },
];

export interface AiInsight {
  id: string;
  tone: "good" | "warning" | "info" | "critical";
  title: string;
  detail: string;
  href: string;
}

export const AI_INSIGHTS: AiInsight[] = [
  {
    id: "i1",
    tone: "good",
    title: "Sales are up 12.5% this month",
    detail: "Metal buttons and rivets are driving the gain across EU buyers.",
    href: "/m/bi-analytics/sales-analytics",
  },
  {
    id: "i2",
    tone: "warning",
    title: "236 products are running low in stock",
    detail: "Reorder now to avoid stockouts on 14 confirmed orders.",
    href: "/m/mrp/shortage",
  },
  {
    id: "i3",
    tone: "info",
    title: "Plating line 2 shows the best yield",
    detail: "Consider shifting antique-finish volume from line 4 to line 2.",
    href: "/m/plating-finishing/line-efficiency",
  },
  {
    id: "i4",
    tone: "good",
    title: "Profit margin improved by 2.3%",
    detail: "Zinc alloy price negotiation is holding through this quarter.",
    href: "/m/cost-budget/variance-analysis",
  },
  {
    id: "i5",
    tone: "critical",
    title: "Order SO-25188 is at delivery risk",
    detail: "Plating stage is 4 days behind the T&A critical path.",
    href: "/m/time-action/delay-alerts",
  },
];
