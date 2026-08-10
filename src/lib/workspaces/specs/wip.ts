import type { ModuleSpecs } from "../types";

/** Module 33 — Work In Progress (WIP) Management. */

const ITEM = "item|Item|enum|@items";
const STAGE = "stage|Stage|enum|Blanking;Forming;Deburring;Polishing;Plating;Assembly;Inspection;Packing";
const ORDER = "order|Work Order|enum|WO-26-1042;WO-26-1051;WO-26-1063;WO-26-1078;WO-26-1090;WO-26-1104;WO-26-1119";
const OWNER = "owner|Responsible|person";
const STORE = "store|WIP Store|enum|WIP-Press;WIP-Polish;WIP-Plating;WIP-Assembly;WIP-Packing";

export const WIP: ModuleSpecs = {
  "wip-position": {
    name: "WIP Position", kind: "analytics", summary: "Quantity sitting at every stage",
    entity: "WIP Position", ref: "WIP",
    fields: [ITEM, STAGE, ORDER, "qty|WIP Qty|int|2000;180000;pcs", "value|WIP Value|money|1800;96000", "ageDays|Age|int|0;42;days", OWNER, "date|As On|date|-10;0"],
    statuses: ["Moving", "Waiting", "Blocked", "Cleared"],
    rows: 54,
    insight: "Plating holds 38% of all floor WIP by value — the queue in front of Line A is the constraint to attack first.",
  },

  "stage-transfer": {
    name: "Stage Transfer", kind: "list", summary: "Movement between operations",
    entity: "Transfer", ref: "STR",
    fields: [ORDER, ITEM, "fromStage|From Stage|enum|Blanking;Forming;Deburring;Polishing;Plating;Assembly", "toStage|To Stage|enum|Forming;Deburring;Polishing;Plating;Assembly;Inspection;Packing", "qty|Transfer Qty|int|1000;90000;pcs", OWNER, "date|Transfer Date|date|-30;0"],
    statuses: ["Draft", "In Transit", "Received", "Short Received", "Cancelled"],
    measure: "qty",
  },

  "wip-aging": {
    name: "WIP Aging", kind: "analytics", summary: "How long stock waits in a stage",
    entity: "Aging Bucket", ref: "WAG",
    fields: [STAGE, ITEM, "bucket|Age Bucket|enum|0–3 days;4–7 days;8–14 days;15–30 days;30+ days", "qty|Qty|int|500;70000;pcs", "value|Value|money|900;72000", "ageDays|Average Age|int|1;46;days", "date|Snapshot|date|-14;0"],
    statuses: ["Fresh", "Watch", "Aged", "Stagnant"],
  },

  "wip-valuation": {
    name: "WIP Valuation", kind: "analytics", summary: "Money standing on the floor",
    entity: "Valuation Line", ref: "WVL",
    fields: [STAGE, ITEM, "qty|Qty|int|1000;120000;pcs", "material|Material Value|money|800;68000", "conversion|Conversion Value|money|200;34000", "total|Total Value|money|1200;98000", "date|Valued On|date|-60;0"],
    statuses: ["Provisional", "Reviewed", "Posted", "Adjusted"],
    measure: "total",
  },

  "bottleneck-wip": {
    name: "Bottleneck WIP", kind: "analytics", summary: "Where the queue builds up",
    entity: "Queue Point", ref: "BNK",
    fields: [STAGE, "workCenter|Work Center|enum|Press-01;Press-02;Polish-01;Plating-A;Plating-B;Assembly-1", "queueQty|Queue Qty|int|2000;140000;pcs", "queueHrs|Queue Hours|float|2;120;hrs;1", "capacity|Capacity Used|pct|48;100", OWNER, "date|Measured On|date|-21;0"],
    statuses: ["Constraint", "Tight", "Comfortable", "Idle"],
    measure: "queueQty",
  },

  reconciliation: {
    name: "WIP Reconciliation", kind: "list", summary: "Issued against accounted quantity",
    entity: "Reconciliation", ref: "REC",
    fields: [ORDER, ITEM, "issued|Issued Qty|int|10000;260000;pcs", "accounted|Accounted Qty|int|9000;259000;pcs", "gap|Unaccounted|int|0;7000;pcs", "gapPct|Gap|pct|0;6", "accountant|Reconciled By|person", "date|Reconciled On|date|-70;0"],
    statuses: ["Open", "Under Review", "Explained", "Written Off", "Closed"],
    measure: "issued",
  },

  "hold-release": {
    name: "Hold & Release", kind: "board", summary: "Quarantined work in progress",
    entity: "Hold", ref: "HLD",
    fields: [ITEM, STAGE, ORDER, "qty|Held Qty|int|500;60000;pcs", "reason|Reason|enum|Quality deviation;Buyer instruction;Missing component;Tooling issue;Awaiting test result", OWNER, "date|Held On|date|-25;0"],
    statuses: ["On Hold", "Under Review", "Rework Advised", "Released", "Scrapped"],
    measure: "qty",
  },

  "flow-efficiency": {
    name: "Flow Efficiency", kind: "analytics", summary: "Touch time against wait time",
    entity: "Flow Record", ref: "FLW",
    fields: [ORDER, ITEM, "touchHrs|Touch Time|float|2;60;hrs;1", "waitHrs|Wait Time|float|4;260;hrs;1", "flowPct|Flow Efficiency|pct|4;62", "leadDays|Lead Time|int|3;38;days", "date|Completed On|date|-90;0"],
    statuses: ["Excellent", "Acceptable", "Poor", "Under Study"],
    measure: "leadDays",
  },

  "wip-register": {
    name: "WIP Register", kind: "list", summary: "Every open WIP lot on record",
    entity: "WIP Lot", ref: "WLT",
    fields: [ITEM, ORDER, STAGE, STORE, "qty|Lot Qty|int|1000;80000;pcs", "value|Lot Value|money|900;62000", OWNER, "date|Opened On|date|-60;0"],
    statuses: ["Open", "Partially Consumed", "Closed", "Written Off"],
  },

  "stage-map": {
    name: "Stage Flow Map", kind: "analytics", summary: "Quantity moving between stages",
    entity: "Flow Link", ref: "SMP",
    fields: [STAGE, "nextStage|Next Stage|enum|Forming;Deburring;Polishing;Plating;Assembly;Inspection;Packing;Dispatch", "qty|Qty Moved|int|4000;190000;pcs", "lossPct|Stage Loss|pct|0.2;6", "cycleHrs|Cycle Hours|float|1;36;hrs;1", "date|Period|date|-45;0"],
    statuses: ["Smooth", "Slowing", "Congested", "Halted"],
    measure: "qty",
  },

  "wip-count": {
    name: "WIP Physical Count", kind: "calendar", summary: "Scheduled floor counting",
    entity: "Count Task", ref: "WCT",
    fields: [STORE, STAGE, "planned|Book Qty|int|2000;90000;pcs", "counted|Counted Qty|int|1800;91000;pcs", "variance|Variance|pct|92;108", "counter|Counted By|person", "date|Count Date|date|-20;25"],
    statuses: ["Scheduled", "In Progress", "Counted", "Variance Review", "Approved"],
    measure: "planned",
  },

  "wip-scrap": {
    name: "WIP Scrap", kind: "list", summary: "Material lost between operations",
    entity: "Scrap Entry", ref: "WSC",
    fields: [ITEM, STAGE, ORDER, "qty|Scrap Qty|int|20;6000;pcs", "weight|Scrap Weight|float|0.5;180;kg;1", "value|Scrap Value|money|20;4200", "reason|Reason|enum|Set-up loss;Burr rejection;Plating failure;Handling damage;Dimensional error", "date|Booked On|date|-40;0"],
    statuses: ["Booked", "Verified", "Posted", "Disputed"],
  },

  "transfer-note": {
    name: "Transfer Note Entry", kind: "form", summary: "Raise a stage-to-stage transfer",
    entity: "Transfer Note", ref: "TNT",
    fields: [ORDER, ITEM, "fromStore|From Store|enum|WIP-Press;WIP-Polish;WIP-Plating;WIP-Assembly", "toStore|To Store|enum|WIP-Polish;WIP-Plating;WIP-Assembly;WIP-Packing;FG Store", "qty|Qty|int|500;70000;pcs", OWNER, "date|Transfer Date|date|-5;5"],
    statuses: ["Draft", "Submitted", "Approved", "Posted", "Rejected"],
    measure: "qty",
  },

  "queue-monitor": {
    name: "Queue Monitor", kind: "list", summary: "What is waiting at each machine",
    entity: "Queue Item", ref: "QUE",
    fields: [ORDER, ITEM, "workCenter|Work Center|enum|Press-01;Press-02;Polish-01;Plating-A;Plating-B;Assembly-1;Inspection", "qty|Waiting Qty|int|1000;110000;pcs", "waitHrs|Waiting|float|1;96;hrs;1", "priority|Priority|enum|Urgent;High;Normal;Low", "date|Queued On|date|-15;0"],
    statuses: ["Waiting", "Next Up", "Processing", "Cleared"],
    measure: "qty",
  },

  "wip-by-order": {
    name: "WIP by Order", kind: "list", summary: "Order-wise floor position",
    entity: "Order WIP", ref: "OWP",
    fields: [ORDER, "buyer|Buyer|enum|@buyers", ITEM, "orderQty|Order Qty|int|20000;420000;pcs", "wipQty|In WIP|int|1000;180000;pcs", "completion|Completion|pct|5;98", "due|Ship Date|date|-10;60"],
    statuses: ["On Schedule", "Watch", "Behind", "Ready for FG"],
    measure: "wipQty",
  },

  "wip-alerts": {
    name: "WIP Alerts", kind: "list", summary: "Ageing, blocked and unbalanced lots",
    entity: "Alert", ref: "WAL",
    fields: [ORDER, STAGE, "alert|Alert|enum|WIP older than 14 days;Stage limit exceeded;Unbalanced flow;Negative WIP;Hold beyond SLA", "qty|Impacted Qty|int|500;80000;pcs", "severity|Severity|enum|Critical;High;Medium;Low", OWNER, "date|Raised On|date|-18;0"],
    statuses: ["New", "Acknowledged", "In Progress", "Resolved", "Suppressed"],
    measure: "qty",
  },

  "wip-turnover": {
    name: "WIP Turnover", kind: "analytics", summary: "How fast the floor recycles value",
    entity: "Turnover Point", ref: "WTO",
    fields: [STAGE, "avgWip|Average WIP|money|4000;120000", "throughput|Throughput Value|money|8000;480000", "turns|Turns per Month|float|0.6;9;x;1", "daysOnHand|Days on Hand|float|2;40;days;1", "date|Period End|date|-180;0"],
    statuses: ["Fast", "Normal", "Slow", "Stalled"],
    measure: "throughput",
  },

  "wip-limits": {
    name: "Stage WIP Limits", kind: "settings", summary: "Kanban ceilings per stage",
    entity: "WIP Limit", ref: "WLM",
    fields: [STAGE, "workCenter|Work Center|enum|Press-01;Press-02;Polish-01;Plating-A;Plating-B;Assembly-1", "limitQty|Limit Qty|int|10000;120000;pcs", "currentQty|Current Qty|int|2000;140000;pcs", "utilisation|Limit Used|pct|20;140", OWNER, "date|Reviewed On|date|-120;0"],
    statuses: ["Within Limit", "At Limit", "Over Limit", "Not Set"],
    settings: ["Block transfers into a stage at its WIP ceiling", "Alert when a stage exceeds 90% of its limit"],
  },

  "wip-write-off": {
    name: "WIP Write-off", kind: "list", summary: "Unrecoverable work in progress",
    entity: "Write-off", ref: "WWO",
    fields: [ITEM, ORDER, STAGE, "qty|Qty|int|100;20000;pcs", "value|Written Off|money|100;18000", "reason|Reason|enum|Irreparable defect;Buyer cancellation;Obsolete design;Physical loss;Contamination", "approver|Approved By|person", "date|Write-off Date|date|-120;0"],
    statuses: ["Proposed", "Under Approval", "Approved", "Posted", "Rejected"],
    measure: "value",
  },

  "wip-forecast": {
    name: "WIP Forecast", kind: "analytics", summary: "Projected floor load ahead",
    entity: "Forecast Point", ref: "WFC",
    fields: [STAGE, "expectedIn|Expected In|int|5000;200000;pcs", "expectedOut|Expected Out|int|4000;210000;pcs", "closingWip|Closing WIP|int|2000;180000;pcs", "coverage|Coverage|float|0.4;7;days;1", "date|Week Of|date|0;56"],
    statuses: ["Balanced", "Building", "Draining", "Overload Risk"],
    measure: "closingWip",
  },
};
