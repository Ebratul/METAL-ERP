import type { ModuleSpecs } from "../types";

/** Module 40 — Finished Goods Warehouse Management. */

const ITEM = "item|Item|enum|@items";
const BUYER = "buyer|Buyer|enum|@buyers";
const ZONE = "zone|Zone|enum|Zone A – Fast Moving;Zone B – Bulk;Zone C – Slow Moving;Zone D – Export Ready;Quarantine";
const BIN = "bin|Bin Location|enum|A-01-02;A-03-04;B-02-01;B-05-03;C-01-01;C-04-02;D-02-05";
const OWNER = "owner|Store Officer|person";
const ORDER = "order|Sales Order|enum|SO-26-2041;SO-26-2058;SO-26-2073;SO-26-2090;SO-26-2114;SO-26-2138";

export const FG_WAREHOUSE: ModuleSpecs = {
  "fg-receipt": {
    name: "FG Receipt", kind: "list", summary: "Production handover into the store",
    entity: "FG Receipt", ref: "FGR",
    fields: [ITEM, ORDER, "qty|Received Qty|int|2000;280000;pcs", "cartons|Cartons|int|4;600", "value|Receipt Value|money|900;140000", ZONE, OWNER, "date|Received On|date|-90;0"],
    statuses: ["Draft", "Received", "Put Away", "Discrepancy", "Rejected"],
    measure: "qty", rows: 50,
    insight: "Zone A is at 92% occupancy while Zone C sits at 34% — rebalancing fast movers would release two full racks.",
  },

  "fg-stock": {
    name: "FG Stock Position", kind: "analytics", summary: "What is ready to ship",
    entity: "Stock Line", ref: "FGS",
    fields: [ITEM, BUYER, ZONE, "qty|Stock Qty|int|1000;420000;pcs", "reserved|Reserved|int|0;400000;pcs", "available|Available|int|0;420000;pcs", "value|Stock Value|money|800;180000", "date|As On|date|-14;0"],
    statuses: ["Available", "Fully Reserved", "Blocked", "Awaiting QC"],
    measure: "qty",
  },

  picking: {
    name: "Pick Lists", kind: "list", summary: "Order picking instructions",
    entity: "Pick List", ref: "PCK",
    fields: [ORDER, BUYER, ITEM, "qty|Pick Qty|int|1000;220000;pcs", "picked|Picked Qty|int|0;220000;pcs", "progress|Progress|pct|0;100", "picker|Picker|person", "date|Pick By|date|-10;20"],
    statuses: ["Released", "Picking", "Picked", "Short Picked", "Cancelled"],
    measure: "qty",
  },

  staging: {
    name: "Staging & Loading", kind: "board", summary: "Dock readiness by shipment",
    entity: "Staging Job", ref: "STG",
    fields: [ORDER, BUYER, "cartons|Cartons|int|10;900", "weight|Gross Weight|float|40;9000;kg;0", "dock|Dock|enum|Dock 1;Dock 2;Dock 3;Export Bay", "vehicle|Vehicle|enum|DH-11-4471;DH-11-6620;CH-14-2288;Container 20ft;Container 40ft", "date|Loading Date|date|-8;20"],
    statuses: ["Planned", "Staged", "Loading", "Loaded", "Dispatched"],
    measure: "cartons",
  },

  "location-map": {
    name: "Location Map", kind: "analytics", summary: "Rack and bin occupancy",
    entity: "Location", ref: "LOC",
    fields: [ZONE, BIN, "capacity|Capacity|int|20;400;cartons", "occupied|Occupied|int|0;400;cartons", "utilisation|Utilisation|pct|0;100", ITEM, "date|Updated On|date|-20;0"],
    statuses: ["Free", "Partially Filled", "Full", "Blocked"],
    measure: "occupied",
  },

  "shipment-readiness": {
    name: "Shipment Readiness", kind: "analytics", summary: "Order coverage against ship date",
    entity: "Readiness Record", ref: "SRD",
    fields: [ORDER, BUYER, "orderQty|Order Qty|int|20000;480000;pcs", "readyQty|Ready in FG|int|0;480000;pcs", "coverage|Coverage|pct|0;100", "shortfall|Shortfall|int|0;180000;pcs", "date|Ship Date|date|-10;60"],
    statuses: ["Fully Ready", "Partially Ready", "At Risk", "Shipped"],
    measure: "orderQty",
  },

  "fg-aging": {
    name: "FG Aging", kind: "analytics", summary: "How long stock has waited",
    entity: "Aging Line", ref: "FAG",
    fields: [ITEM, BUYER, "bucket|Age Bucket|enum|0–15 days;16–30 days;31–60 days;61–90 days;90+ days", "qty|Qty|int|500;180000;pcs", "value|Value|money|400;96000", "ageDays|Average Age|int|2;180;days", "date|Snapshot|date|-14;0"],
    statuses: ["Fresh", "Watch", "Aged", "Dead Stock"],
    measure: "value",
  },

  returns: {
    name: "Sales Returns", kind: "list", summary: "Buyer returns coming inward",
    entity: "Return", ref: "SRT",
    fields: [BUYER, ITEM, "qty|Returned Qty|int|200;60000;pcs", "reason|Reason|enum|Quality issue;Wrong item;Excess shipment;Order cancelled;Damaged in transit", "value|Return Value|money|200;48000", "condition|Condition|enum|Resaleable;Rework needed;Scrap", OWNER, "date|Received On|date|-180;0"],
    statuses: ["Notified", "Received", "Inspected", "Restocked", "Scrapped"],
    measure: "qty",
  },

  "space-utilization": {
    name: "Space Utilisation", kind: "analytics", summary: "Warehouse capacity in use",
    entity: "Utilisation Record", ref: "SPU",
    fields: [ZONE, "totalSqm|Total Area|float|60;1200;m²;0", "usedSqm|Used Area|float|10;1180;m²;0", "utilisation|Utilisation|pct|8;99", "cartons|Cartons Held|int|40;4200", "date|Measured On|date|-90;0"],
    statuses: ["Comfortable", "Tight", "Congested", "Overflow"],
    measure: "usedSqm",
  },

  "put-away": {
    name: "Put-away", kind: "list", summary: "Receipt to bin assignment",
    entity: "Put-away Task", ref: "PTA",
    fields: [ITEM, "receipt|Receipt Ref|enum|FGR-26-0411;FGR-26-0428;FGR-26-0443;FGR-26-0461;FGR-26-0478", ZONE, BIN, "cartons|Cartons|int|2;300", "operator|Operator|person", "date|Task Date|date|-45;0"],
    statuses: ["Pending", "In Progress", "Completed", "Exception"],
    measure: "cartons",
  },

  "cycle-count": {
    name: "FG Cycle Count", kind: "calendar", summary: "Rolling physical verification",
    entity: "Count Task", ref: "FCC",
    fields: [ZONE, ITEM, "bookQty|Book Qty|int|1000;180000;pcs", "countedQty|Counted Qty|int|900;182000;pcs", "variance|Variance|pct|92;108", "counter|Counted By|person", "date|Count Date|date|-40;35"],
    statuses: ["Scheduled", "In Progress", "Counted", "Variance Review", "Approved"],
    measure: "bookQty",
  },

  "fg-transfer": {
    name: "FG Transfers", kind: "list", summary: "Movement between stores and plants",
    entity: "Transfer", ref: "FTR",
    fields: [ITEM, "fromStore|From Store|enum|FG Store 1;FG Store 2;Export Store;Plant 2 FG", "toStore|To Store|enum|FG Store 1;FG Store 2;Export Store;Buyer Warehouse", "qty|Qty|int|500;160000;pcs", "cartons|Cartons|int|2;400", OWNER, "date|Transfer Date|date|-90;10"],
    statuses: ["Raised", "In Transit", "Received", "Short Received", "Cancelled"],
    measure: "qty",
  },

  "carton-labels": {
    name: "Carton Labelling", kind: "list", summary: "Shipping marks applied to cartons",
    entity: "Label Batch", ref: "CLB",
    fields: [ORDER, BUYER, "labelType|Label Type|enum|Buyer shipping mark;Barcode label;Care label;Country of origin;Handling symbol", "cartons|Cartons Labelled|int|4;700", "printer|Printer|enum|Zebra-01;Zebra-02;TSC-01;Inkjet-Line", "operator|Operator|person", "date|Printed On|date|-60;0"],
    statuses: ["Queued", "Printing", "Applied", "Reprint Needed"],
    measure: "cartons",
  },

  "dispatch-note": {
    name: "Dispatch Note Entry", kind: "form", summary: "Raise the outbound document",
    entity: "Dispatch Note", ref: "DPN",
    fields: [ORDER, BUYER, ITEM, "qty|Dispatch Qty|int|1000;280000;pcs", "cartons|Cartons|int|4;600", "vehicle|Vehicle|enum|DH-11-4471;DH-11-6620;CH-14-2288;Container 20ft;Container 40ft", OWNER, "date|Dispatch Date|date|-5;20"],
    statuses: ["Draft", "Submitted", "Approved", "Gate Out", "Cancelled"],
    measure: "qty",
  },

  reservations: {
    name: "Stock Reservations", kind: "list", summary: "Quantity committed to orders",
    entity: "Reservation", ref: "RSV",
    fields: [ORDER, BUYER, ITEM, "qty|Reserved Qty|int|500;220000;pcs", "value|Reserved Value|money|400;120000", "priority|Priority|enum|Urgent;High;Normal", "expiry|Hold Until|date|-10;45"],
    statuses: ["Active", "Partially Released", "Released", "Expired", "Cancelled"],
    measure: "qty",
  },

  adjustments: {
    name: "FG Adjustments", kind: "list", summary: "Write-on and write-off entries",
    entity: "Adjustment", ref: "FAD",
    fields: [ITEM, ZONE, "qty|Adjust Qty|int|10;20000;pcs", "direction|Direction|enum|Write-on;Write-off", "reason|Reason|enum|Count variance;Damage;Sample issue;System correction;Theft", "value|Value Impact|money|20;18000", "approver|Approved By|person", "date|Adjusted On|date|-180;0"],
    statuses: ["Proposed", "Under Approval", "Approved", "Posted", "Rejected"],
    measure: "value",
  },

  productivity: {
    name: "Warehouse Productivity", kind: "analytics", summary: "Lines and cartons handled per hour",
    entity: "Productivity Record", ref: "WPR",
    fields: ["activity|Activity|enum|Receiving;Put-away;Picking;Packing;Loading;Cycle count", "operator|Operator|person", "units|Units Handled|int|20;3200", "hours|Hours|float|1;12;hrs;1", "rate|Units per Hour|float|4;420;;1", "date|Shift Date|date|-60;0"],
    statuses: ["Above Standard", "On Standard", "Below Standard", "Under Training"],
    measure: "units",
  },

  "damage-log": {
    name: "Damage Log", kind: "list", summary: "Stock damaged in the store",
    entity: "Damage Record", ref: "DMG",
    fields: [ITEM, ZONE, "qty|Damaged Qty|int|10;12000;pcs", "cause|Cause|enum|Forklift impact;Water ingress;Poor stacking;Pest damage;Handling drop", "value|Value Lost|money|20;16000", "reporter|Reported By|person", "date|Reported On|date|-180;0"],
    statuses: ["Reported", "Under Assessment", "Written Off", "Recovered", "Closed"],
    measure: "value",
  },

  "fg-valuation": {
    name: "FG Valuation", kind: "analytics", summary: "Value held in finished goods",
    entity: "Valuation Line", ref: "FVL",
    fields: [ITEM, BUYER, "qty|Qty|int|1000;300000;pcs", "unitCost|Unit Cost|float|0.02;1.8;USD;3", "value|Stock Value|money|600;180000", "method|Valuation Method|enum|FIFO;Weighted average;Standard cost", "date|Valued On|date|-120;0"],
    statuses: ["Provisional", "Reviewed", "Posted", "Adjusted"],
    measure: "value",
  },

  "fg-settings": {
    name: "Warehouse Controls", kind: "settings", summary: "Storage and dispatch rules",
    entity: "Control Rule", ref: "FSET",
    fields: [ZONE, "rule|Rule|enum|FIFO picking enforced;Block dispatch without QC pass;Auto-reserve on order confirmation;Alert above zone capacity;Mandatory carton scan", "threshold|Threshold|pct|60;100", OWNER, "date|Effective From|date|-300;0", "zonesCovered|Zones Covered|int|1;8"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Enforce FIFO picking within each item and zone", "Block gate-out for shipments without a passed final inspection"],
  },
};
