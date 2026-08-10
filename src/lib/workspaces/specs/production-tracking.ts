import type { ModuleSpecs } from "../types";

/**
 * Module 33 — Product Production Tracking & Traceability Management.
 *
 * Thirty-five workspaces in the master serial order: what is live right now by
 * PI, PO, order and resource, the barcode and batch trail behind every piece,
 * and the delivery chain from ready-for-delivery through gate pass, loading
 * and dispatch to confirmed customer delivery.
 */

/* ── Shared field fragments ────────────────────────────────────────────── */

const BUYER = "buyer|Buyer|enum|@buyers";
const ITEM = "item|Item|enum|@items";
const PI_LINK = "piNo|PI Number|enum|PI-26-1041;PI-26-1056;PI-26-1072;PI-26-1088;PI-26-1104;PI-26-1121";
const PRO_LINK = "productionOrder|Production Order|enum|PRO-26-1041;PRO-26-1056;PRO-26-1072;PRO-26-1088;PRO-26-1104;PRO-26-1121";
const DO_LINK = "deliveryOrder|Delivery Order|enum|DO-26-3041;DO-26-3056;DO-26-3072;DO-26-3088;DO-26-3104";
const SECTION = "section|Section|enum|Press Shop;Injection;Die Casting;Plating;Polishing;Assembly;Packing;Tool Room";
const LINE = "line|Production Line|enum|Line 1 - Snap;Line 2 - Button;Line 3 - Zipper;Line 4 - Rivet;Line 5 - Buckle;Line 6 - Assembly";
const MACHINE = "machine|Machine|enum|Press-01;Press-02;Press-03;Injection-01;Injection-02;Die-Cast-01;Plating-Line-A;Plating-Line-B;Assembly-01;Packing-01";
const OPERATOR = "operator|Operator|person";
const SHIFT = "shift|Shift|enum|Shift A - 06:00;Shift B - 14:00;Shift C - 22:00;General Day";
const BATCH = "batch|Batch / Lot|enum|HL-4471;HL-4489;HL-4502;HL-4517;HL-4530;HL-4548;HL-4562";
const FACTORY = "factory|Factory|enum|Gazipur Plant;Narayanganj Unit;Chattogram Unit;Dhaka EPZ Unit";
const VEHICLE = "vehicleNo|Vehicle|enum|DHK-METRO-GA-1147;DHK-METRO-KHA-2280;CTG-METRO-TA-4471;DHK-METRO-GA-5590;CTG-METRO-CHA-6612";
const PROGRESS = "progressPct|Progress|pct|0;100";

/** The live production workflow, start to delivery confirmation. */
const WORKFLOW_STAGE = "workflowStage|Workflow Stage|enum|Buyer PI;Sales Order;Production Order;Work Order;Material Issue;Manufacturing;Barcode Scan;IPQC;Rework;Final QC;Packing;Finished Goods;Ready For Delivery;Delivery Order;Gate Pass;Vehicle Loading;Dispatch;Customer Delivery;Delivery Confirmation";

export const PRODUCTION_TRACKING: ModuleSpecs = {
  /* ── 01 ────────────────────────────────────────────────────────────── */
  "tracking-dashboard": {
    name: "Production Tracking Dashboard", kind: "overview", summary: "Where every live order stands",
    entity: "Tracking Summary", ref: "PTD",
    fields: [BUYER, PI_LINK, ITEM, WORKFLOW_STAGE, "orderQty|Order Qty|int|500;480000;pcs", "completedQty|Completed|int|0;480000;pcs", "balanceQty|Balance|int|0;480000;pcs", PROGRESS, "dueDate|Due Date|date|-40;120", "date|Updated On|date|-300;0"],
    statuses: ["On Schedule", "In Progress", "At Risk", "Completed", "Delayed"],
    measure: "completedQty", rows: 66,
    insight: "The workflow stage column is the live production workflow itself, from buyer PI through to delivery confirmation. Most delayed value is sitting between final QC and packing, not on the machines.",
  },

  /* ── 02 ────────────────────────────────────────────────────────────── */
  "active-pi-tracking": {
    name: "Active PI Tracking", kind: "list", summary: "Every PI still in play",
    entity: "Active PI", ref: "APT",
    fields: ["piNumber|PI Number|code|PI", BUYER, ITEM, "piQty|PI Qty|int|500;480000;pcs", "producedQty|Produced|int|0;480000;pcs", "shippedQty|Shipped|int|0;480000;pcs", PROGRESS, "value|PI Value|money|4000;2400000", "executive|Marketing Executive|person", "deliveryDate|Delivery Date|date|-40;150", "date|PI Date|date|-330;0"],
    statuses: ["In Production", "Ready", "Shipped", "Closed", "Delayed"],
    measure: "value", rows: 60,
  },

  /* ── 03 ────────────────────────────────────────────────────────────── */
  "active-po-tracking": {
    name: "Active PO Tracking", kind: "list", summary: "Buyer purchase orders in progress",
    entity: "Active PO", ref: "PO",
    fields: ["poNumber|Buyer PO|code|PO", BUYER, PI_LINK, ITEM, "poQty|PO Qty|int|500;480000;pcs", "deliveredQty|Delivered|int|0;480000;pcs", "balanceQty|Balance|int|0;480000;pcs", PROGRESS, "value|PO Value|money|4000;2400000", "shipDate|Ship Date|date|-40;150", "date|PO Date|date|-330;0"],
    statuses: ["Open", "In Production", "Partially Delivered", "Completed", "Delayed"],
    measure: "value", rows: 58,
  },

  /* ── 04 ────────────────────────────────────────────────────────────── */
  "production-order-tracking": {
    name: "Production Order Tracking", kind: "list", summary: "Order-level progress on the floor",
    entity: "Order Tracker", ref: "POT",
    fields: ["orderNo|Production Order|code|PRO", BUYER, ITEM, SECTION, "orderQty|Order Qty|int|500;480000;pcs", "producedQty|Produced|int|0;480000;pcs", PROGRESS, "delayDays|Delay|int|0;60;days", "startDate|Started|date|-150;0", "dueDate|Due Date|date|-40;120"],
    statuses: ["On Schedule", "In Production", "At Risk", "Completed", "Delayed"],
    measure: "producedQty", rows: 62,
  },

  /* ── 05 ────────────────────────────────────────────────────────────── */
  "work-order-tracking": {
    name: "Work Order Tracking", kind: "list", summary: "Operation-level progress",
    entity: "Work Order Tracker", ref: "WOT",
    fields: ["woNo|Work Order|code|WO", PRO_LINK, "operation|Operation|enum|Blanking;Forming;Drilling;Deburring;Plating;Polishing;Assembly;Packing;Inspection", "workCenter|Work Center|enum|WC-PRESS-01;WC-PRESS-02;WC-INJ-01;WC-DIE-01;WC-PLATE-A;WC-ASSY-01;WC-PACK-01", "woQty|WO Qty|int|500;480000;pcs", "completedQty|Completed|int|0;480000;pcs", PROGRESS, OPERATOR, SHIFT, "date|Issued On|date|-300;0"],
    statuses: ["In Progress", "Completed", "Queued", "On Hold", "Delayed"],
    measure: "completedQty", rows: 64,
  },

  /* ── 06 ────────────────────────────────────────────────────────────── */
  "buyer-wise-tracking": {
    name: "Buyer Wise Tracking", kind: "analytics", summary: "Progress rolled up per buyer",
    entity: "Buyer Tracker", ref: "BWT",
    fields: [BUYER, "activePi|Active PIs|int|1;48;PIs", "orderQty|Order Qty|int|1000;980000;pcs", "producedQty|Produced|int|0;980000;pcs", PROGRESS, "onTimePct|On Time|pct|30;100", "delayedOrders|Delayed Orders|int|0;24", "value|Order Value|money|8000;4800000", "date|Period End|date|-330;0"],
    statuses: ["On Track", "At Risk", "Delayed", "Completed"],
    measure: "value", rows: 52,
  },

  /* ── 07 ────────────────────────────────────────────────────────────── */
  "product-wise-tracking": {
    name: "Product Wise Tracking", kind: "analytics", summary: "Progress rolled up per product",
    entity: "Product Tracker", ref: "PWT",
    fields: [ITEM, "productLine|Product Line|enum|Buttons;Snap buttons;Rivets;Eyelets;Jeans buttons;Buckles;Metal zippers;Nylon zippers;Sliders;Badges", "orderQty|Order Qty|int|1000;980000;pcs", "producedQty|Produced|int|0;980000;pcs", PROGRESS, "yieldPct|Yield|pct|58;100", "reworkQty|Rework Qty|int|0;180000;pcs", "value|Value|money|4000;2800000", "date|Period End|date|-330;0"],
    statuses: ["On Track", "At Risk", "Delayed", "Completed"],
    measure: "producedQty", rows: 56,
  },

  /* ── 08 ────────────────────────────────────────────────────────────── */
  "pi-wise-progress": {
    name: "PI Wise Progress", kind: "analytics", summary: "Stage reached against days elapsed",
    entity: "PI Progress", ref: "PIP",
    fields: [PI_LINK, BUYER, WORKFLOW_STAGE, "stagesDone|Stages Complete|int|1;19;stages", "orderQty|Order Qty|int|500;480000;pcs", "completedQty|Completed|int|0;480000;pcs", PROGRESS, "daysElapsed|Days Elapsed|int|0;180;days", "daysRemaining|Days Remaining|int|0;120;days", "date|Updated On|date|-300;0"],
    statuses: ["On Schedule", "In Progress", "At Risk", "Completed", "Delayed"],
    measure: "completedQty", rows: 58,
  },

  /* ── 09 ────────────────────────────────────────────────────────────── */
  "po-wise-progress": {
    name: "PO Wise Progress", kind: "analytics", summary: "Buyer PO fulfilment curve",
    entity: "PO Progress", ref: "POP",
    fields: ["poRef|Buyer PO|enum|PO-26-4041;PO-26-4056;PO-26-4072;PO-26-4088;PO-26-4104", BUYER, "poQty|PO Qty|int|500;480000;pcs", "producedQty|Produced|int|0;480000;pcs", "deliveredQty|Delivered|int|0;480000;pcs", PROGRESS, "fulfilmentPct|Fulfilment|pct|0;100", "daysToShip|Days to Ship|int|0;120;days", "value|PO Value|money|4000;2400000", "date|Updated On|date|-300;0"],
    statuses: ["On Schedule", "In Progress", "At Risk", "Completed", "Delayed"],
    measure: "value", rows: 56,
  },

  /* ── 10 ────────────────────────────────────────────────────────────── */
  "factory-wise-progress": {
    name: "Factory Wise Progress", kind: "analytics", summary: "Plant against plant",
    entity: "Factory Progress", ref: "FWP",
    fields: [FACTORY, "orderQty|Order Qty|int|1000;980000;pcs", "producedQty|Produced|int|0;980000;pcs", PROGRESS, "capacityUtil|Capacity Utilisation|pct|18;110", "manpower|Manpower|int|20;980;people", "openOrders|Open Orders|int|1;120", "value|Value|money|8000;4800000", "date|Period End|date|-330;0"],
    statuses: ["On Track", "At Risk", "Delayed", "Completed"],
    measure: "value", rows: 48,
  },

  /* ── 11 ────────────────────────────────────────────────────────────── */
  "section-wise-tracking": {
    name: "Section Wise Tracking", kind: "analytics", summary: "Throughput and WIP by section",
    entity: "Section Tracker", ref: "SWT",
    fields: [SECTION, FACTORY, "inputQty|Input Qty|int|500;980000;pcs", "outputQty|Output Qty|int|0;980000;pcs", "wipQty|WIP Qty|int|0;480000;pcs", PROGRESS, "throughput|Throughput|int|100;24000;pcs/day", "ageDays|Average WIP Age|float|0.2;40;days;1", "date|Period End|date|-330;0"],
    statuses: ["Flowing", "Congested", "Idle", "Blocked"],
    measure: "outputQty", rows: 52,
  },

  /* ── 12 ────────────────────────────────────────────────────────────── */
  "line-wise-tracking": {
    name: "Line Wise Tracking", kind: "analytics", summary: "Output and downtime per line",
    entity: "Line Tracker", ref: "LWT",
    fields: [LINE, SECTION, SHIFT, "outputQty|Output Qty|int|100;480000;pcs", PROGRESS, "efficiency|Line Efficiency|pct|38;105", "downtimeHours|Downtime|float|0;120;hrs;1", "targetQty|Target Qty|int|500;480000;pcs", "date|Period End|date|-330;0"],
    statuses: ["Running", "Changeover", "Idle", "Breakdown", "Stopped"],
    measure: "outputQty", rows: 54,
  },

  /* ── 13 ────────────────────────────────────────────────────────────── */
  "machine-wise-tracking": {
    name: "Machine Wise Tracking", kind: "analytics", summary: "Live machine state and output",
    entity: "Machine Tracker", ref: "MWT",
    fields: [MACHINE, SECTION, "runHours|Run Hours|float|0;720;hrs;1", "outputQty|Output Qty|int|100;480000;pcs", "utilisation|Utilisation|pct|12;98", "oee|OEE|pct|25;95", "breakdowns|Breakdowns|int|0;18", "lastScan|Last Scan|date|-10;0", "date|Period End|date|-330;0"],
    statuses: ["Running", "Setup", "Idle", "Under Maintenance", "Breakdown"],
    measure: "outputQty", rows: 54,
  },

  /* ── 14 ────────────────────────────────────────────────────────────── */
  "operator-wise-tracking": {
    name: "Operator Wise Tracking", kind: "analytics", summary: "Who produced what, and how well",
    entity: "Operator Tracker", ref: "OWT",
    fields: [OPERATOR, SECTION, LINE, SHIFT, "outputQty|Output Qty|int|100;180000;pcs", "hoursWorked|Hours Worked|float|1;280;hrs;1", "efficiency|Efficiency|pct|38;125", "rejectRate|Reject Rate|pct|0;12", "date|Period End|date|-330;0"],
    statuses: ["Above Standard", "On Standard", "Below Standard", "Under Training"],
    measure: "outputQty", rows: 58,
  },

  /* ── 15 ────────────────────────────────────────────────────────────── */
  "batch-lot-tracking": {
    name: "Batch & Lot Tracking", kind: "list", summary: "Follow a lot through the plant",
    entity: "Lot Tracker", ref: "BLT",
    fields: [BATCH, ITEM, PRO_LINK, "batchQty|Batch Qty|int|500;480000;pcs", WORKFLOW_STAGE, "location|Current Location|enum|Press Shop;Plating WIP;SFG Store;Assembly Buffer;Packing Hall;FG Warehouse;Quarantine", "ageDays|Age|int|0;90;days", "traceable|Traceability|bool|Fully traceable;Partial", "date|Batch Date|date|-330;0"],
    statuses: ["In Process", "Released", "Quarantined", "Consumed", "Rejected"],
    measure: "batchQty", rows: 60,
  },

  /* ── 16 ────────────────────────────────────────────────────────────── */
  "barcode-qr-tracking": {
    name: "Barcode / QR Tracking", kind: "list", summary: "Every scan, every checkpoint",
    entity: "Scan Event", ref: "SCN",
    fields: ["scanCode|Scan Code|code|SCN", ITEM, BATCH, "codeType|Code Type|enum|Barcode 128;QR code;Data Matrix;RFID tag", "scanPoint|Scan Point|enum|Material issue;Machine in;Machine out;IPQC;Rework;Final QC;Packing;FG store;Gate", "scanCount|Scans|int|1;48;scans", "quantity|Quantity|int|50;480000;pcs", "device|Device|enum|Handheld scanner;Fixed scanner;Mobile app;Shop floor terminal", "scannedBy|Scanned By|person", "date|Scanned On|date|-300;0"],
    statuses: ["Scanned", "Verified", "In Transit", "Duplicate Scan", "Not Scanned"],
    measure: "quantity", rows: 70,
    insight: "Nine scan points give a piece a complete history. Where a lot shows fewer than six scans it is almost always because the packing scan was skipped under shift pressure.",
  },

  /* ── 17 ────────────────────────────────────────────────────────────── */
  "wip-tracking": {
    name: "Work In Progress (WIP) Tracking", kind: "list", summary: "What sits between operations",
    entity: "WIP Lot", ref: "WIP",
    fields: [ITEM, PRO_LINK, SECTION, "stage|WIP Stage|enum|After blanking;After forming;After plating;After polishing;Before assembly;Before packing", "wipQty|WIP Qty|int|100;480000;pcs", "wipValue|WIP Value|money|100;980000", "ageDays|Ageing|int|0;90;days", "location|Location|enum|Floor Buffer;Plating WIP;SFG Store;Assembly Buffer;Quarantine", "date|Recorded On|date|-330;0"],
    statuses: ["Moving", "Waiting", "Aged", "Blocked", "Cleared"],
    measure: "wipValue", rows: 62,
    insight: "WIP value peaks at the plating buffer. Anything sitting there beyond nine days is a lot that missed its barrel slot and has been waiting for the next colour changeover.",
  },

  /* ── 18 ────────────────────────────────────────────────────────────── */
  "production-progress": {
    name: "Production Progress (%)", kind: "analytics", summary: "Planned curve against actual",
    entity: "Progress Record", ref: "PRG",
    fields: [PRO_LINK, BUYER, ITEM, "orderQty|Order Qty|int|500;480000;pcs", "completedQty|Completed|int|0;480000;pcs", PROGRESS, "plannedPct|Planned Progress|pct|0;100", "variancePct|Schedule Variance|pct|0;48", "forecastDate|Forecast Completion|date|-20;150", "date|Updated On|date|-300;0"],
    statuses: ["Ahead of Plan", "On Plan", "Behind Plan", "Completed", "Stalled"],
    measure: "completedQty", rows: 60,
  },

  /* ── 19 ────────────────────────────────────────────────────────────── */
  "material-consumption-tracking": {
    name: "Material Consumption Tracking", kind: "analytics", summary: "Issued against actually consumed",
    entity: "Consumption Tracker", ref: "MCT",
    fields: [PRO_LINK, "material|Material|enum|Brass Strip 0.8mm;Zinc Alloy Ingot;Nickel Anode;Steel Wire 2.0mm;Copper Sheet;Plating Chemical;Polyester Tape", "issuedQty|Issued|float|10;48000;kg;1", "consumedQty|Consumed|float|0;48000;kg;1", "balanceQty|Balance on Floor|float|0;24000;kg;1", "consumptionPct|Consumed|pct|0;100", "wastage|Wastage|float|0;4800;kg;1", "value|Consumption Value|money|100;680000", "date|Period End|date|-330;0"],
    statuses: ["Within Standard", "Slight Excess", "Over Consumption", "Under Review", "Reconciled"],
    measure: "value", rows: 58,
  },

  /* ── 20 ────────────────────────────────────────────────────────────── */
  "qc-status-tracking": {
    name: "QC Status Tracking", kind: "list", summary: "Quality state of every lot",
    entity: "QC Status", ref: "QST",
    fields: [PRO_LINK, ITEM, BUYER, "qcStage|QC Stage|enum|IPQC;FQC;Pre-final inspection;Buyer inspection;Third party inspection", "inspectedQty|Inspected|int|50;480000;pcs", "passQty|Passed|int|0;480000;pcs", "failQty|Failed|int|0;48000;pcs", "passRate|Pass Rate|pct|40;100", "inspector|Inspector|person", "date|Inspected On|date|-330;0"],
    statuses: ["Passed", "Passed with Deviation", "Under Inspection", "On Hold", "Failed"],
    measure: "inspectedQty", rows: 62,
  },

  /* ── 21 ────────────────────────────────────────────────────────────── */
  "rework-tracking": {
    name: "Rework Tracking", kind: "list", summary: "Rework raised, done and pending",
    entity: "Rework Tracker", ref: "RWT",
    fields: [ITEM, PRO_LINK, "reworkReason|Reason|enum|Plating defect;Dimension out of tolerance;Colour mismatch;Burr;Loose assembly;Surface scratch;Logo misalignment", "reworkQty|Rework Qty|int|50;280000;pcs", "recoveredQty|Recovered|int|0;280000;pcs", "pendingQty|Pending Rework|int|0;280000;pcs", "yieldPct|Recovery Yield|pct|20;100", "ageDays|Pending For|int|0;60;days", "supervisor|Supervisor|person", "date|Raised On|date|-330;0"],
    statuses: ["Completed", "In Progress", "Pending", "Partially Recovered", "Abandoned"],
    measure: "reworkQty", rows: 58,
  },

  /* ── 22 ────────────────────────────────────────────────────────────── */
  "reject-tracking": {
    name: "Reject Tracking", kind: "list", summary: "Rejects by reason and section",
    entity: "Reject Record", ref: "RJT",
    fields: [ITEM, PRO_LINK, SECTION, "rejectReason|Reject Reason|enum|Beyond rework;Material defect;Die mark;Casting porosity;Plating peel;Dimensional failure;Contamination", "rejectQty|Reject Qty|int|50;280000;pcs", "rejectRate|Reject Rate|pct|0;24", "rejectValue|Reject Value|money|20;480000", MACHINE, "date|Recorded On|date|-330;0"],
    statuses: ["Confirmed", "Under Review", "Sent to Rework", "Scrapped", "Disputed"],
    measure: "rejectValue", rows: 58,
  },

  /* ── 23 ────────────────────────────────────────────────────────────── */
  "packing-tracking": {
    name: "Packing Tracking", kind: "list", summary: "Packed quantity and carton build",
    entity: "Packing Tracker", ref: "PKT",
    fields: [BUYER, PRO_LINK, "packedQty|Packed Qty|int|500;480000;pcs", "cartons|Cartons|int|1;2400;cartons", "packingPct|Packing Progress|pct|0;100", "packType|Pack Type|enum|Polybag;Inner box;Master carton;Blister pack;Hanger card;Bulk drum", "netWeight|Net Weight|float|1;24000;kg;1", "grossWeight|Gross Weight|float|1;26000;kg;1", "date|Packed On|date|-330;0"],
    statuses: ["Completed", "In Progress", "Pending", "Short Packed", "On Hold"],
    measure: "packedQty", rows: 58,
  },

  /* ── 24 ────────────────────────────────────────────────────────────── */
  "finished-goods-tracking": {
    name: "Finished Goods Tracking", kind: "list", summary: "Stock sitting in the FG store",
    entity: "FG Stock", ref: "FGK",
    fields: [BUYER, ITEM, PI_LINK, "fgQty|FG Qty|int|500;480000;pcs", "cartons|Cartons|int|1;2400;cartons", "location|Warehouse Location|enum|FG Rack A;FG Rack B;FG Rack C;Bonded Store;Dispatch Bay;Buyer Hold Area", "value|FG Value|money|100;980000", "ageDays|Ageing|int|0;180;days", "date|Received On|date|-330;0"],
    statuses: ["Available", "Allocated", "Aged Stock", "On Hold", "Dispatched"],
    measure: "value", rows: 62,
  },

  /* ── 25 ────────────────────────────────────────────────────────────── */
  "ready-for-delivery": {
    name: "Ready For Delivery", kind: "list", summary: "Goods and papers both ready",
    entity: "Ready Lot", ref: "RFD",
    fields: [BUYER, PI_LINK, ITEM, "readyQty|Ready Qty|int|500;480000;pcs", "cartons|Cartons|int|1;2400;cartons", "value|Value|money|100;980000", "docsReady|Documents|bool|Documents ready;Documents pending", "waitingDays|Waiting For|int|0;60;days", "readySince|Ready Since|date|-90;0", "deliveryDate|Delivery Due|date|-20;120"],
    statuses: ["Ready", "Awaiting Documents", "Awaiting Vehicle", "Dispatched", "On Hold"],
    measure: "value", rows: 56,
    insight: "Goods go ready an average of six days before the papers do. The waiting-days column is almost entirely a documentation queue, not a production one.",
  },

  /* ── 26 ────────────────────────────────────────────────────────────── */
  "delivery-order": {
    name: "Delivery Order (DO)", kind: "list", summary: "Authority to release the goods",
    entity: "Delivery Order", ref: "DO",
    fields: ["doNumber|Delivery Order|code|DO", BUYER, PI_LINK, "doQty|DO Qty|int|500;480000;pcs", "cartons|Cartons|int|1;2400;cartons", "value|Value|money|100;980000", "deliverTo|Deliver To|text|Buyer warehouse Hamburg;Buying house Dhaka;Chattogram Port;Consolidator Singapore;Buyer agent Barcelona", "issuedBy|Issued By|person", "doDate|DO Date|date|-120;30", "date|Created On|date|-300;0"],
    statuses: ["Issued", "Approved", "Draft", "Executed", "Cancelled"],
    measure: "value", rows: 58,
  },

  /* ── 27 ────────────────────────────────────────────────────────────── */
  "gate-pass": {
    name: "Gate Pass Management", kind: "list", summary: "Nothing leaves without one",
    entity: "Gate Pass", ref: "GP",
    fields: ["gatePassNo|Gate Pass|code|GP", "passType|Pass Type|enum|Finished goods out;Returnable;Non-returnable;Sample out;Scrap out", BUYER, DO_LINK, "cartons|Cartons|int|1;2400;cartons", "value|Value|money|100;980000", VEHICLE, "securityCheck|Security Check|bool|Checked;Pending", "issuedBy|Issued By|person", "date|Issued On|date|-300;0"],
    statuses: ["Cleared", "Issued", "Pending Security", "Held at Gate", "Cancelled"],
    measure: "value", rows: 58,
  },

  /* ── 28 ────────────────────────────────────────────────────────────── */
  "vehicle-loading": {
    name: "Vehicle Loading Tracking", kind: "list", summary: "Bay, seal and load completion",
    entity: "Loading Record", ref: "VLT",
    fields: [VEHICLE, "driver|Driver|person", "loadingBay|Loading Bay|enum|Bay 1;Bay 2;Bay 3;Bay 4", DO_LINK, "cartonsLoaded|Cartons Loaded|int|1;2400;cartons", "loadPct|Load Completion|pct|0;100", "loadingHours|Loading Time|float|0.2;12;hrs;1", "sealNo|Seal Number|enum|SEAL-4471;SEAL-4489;SEAL-4502;SEAL-4517;SEAL-4530", "grossWeight|Gross Weight|float|100;26000;kg;1", "date|Loaded On|date|-300;0"],
    statuses: ["Loaded", "Loading", "Sealed", "Waiting Vehicle", "Aborted"],
    measure: "cartonsLoaded", rows: 56,
  },

  /* ── 29 ────────────────────────────────────────────────────────────── */
  "dispatch-management": {
    name: "Dispatch Management", kind: "list", summary: "Goods on their way out",
    entity: "Dispatch", ref: "DSP",
    fields: [BUYER, DO_LINK, "dispatchMode|Mode|enum|Own vehicle;Third party transport;Buyer pickup;Courier;Container to port", "destination|Destination|enum|Chattogram Port;Dhaka ICD;Buyer warehouse;Buying house;Airport;Consolidator", "cartons|Cartons|int|1;2400;cartons", "value|Value|money|100;980000", VEHICLE, "freightCost|Freight Cost|money|20;68000", "dispatchDate|Dispatched On|date|-120;20", "date|Planned On|date|-300;0"],
    statuses: ["Dispatched", "In Transit", "Scheduled", "Delayed", "Cancelled"],
    measure: "value", rows: 60,
  },

  /* ── 30 ────────────────────────────────────────────────────────────── */
  "customer-delivery": {
    name: "Customer Delivery Tracking", kind: "list", summary: "Delivered, received and confirmed",
    entity: "Delivery Record", ref: "CDT",
    fields: [BUYER, DO_LINK, "deliveredQty|Delivered Qty|int|500;480000;pcs", "cartons|Cartons|int|1;2400;cartons", "value|Value|money|100;980000", "receivedBy|Received By|text|Warehouse supervisor;Buying house QC;Buyer merchandiser;Consolidator clerk;Security desk", "podStatus|Proof of Delivery|bool|POD received;POD pending", "transitDays|Transit Days|int|0;60;days", "deliveryDate|Delivered On|date|-120;10", "date|Recorded On|date|-300;0"],
    statuses: ["Delivery Confirmed", "Delivered", "In Transit", "Partially Delivered", "Disputed"],
    measure: "value", rows: 60,
  },

  /* ── 31 ────────────────────────────────────────────────────────────── */
  "production-timeline": {
    name: "Production Timeline", kind: "calendar", summary: "Every milestone on a date",
    entity: "Timeline Event", ref: "PTL",
    fields: ["eventType|Event|enum|Order release;Material issue;Production start;IPQC;Final QC;Packing;FG transfer;Gate pass;Dispatch;Delivery", PRO_LINK, BUYER, ITEM, "quantity|Quantity|int|50;480000;pcs", "owner|Owner|person", "eventDate|Event Date|date|-90;120", "date|Logged On|date|-300;0"],
    statuses: ["Completed", "Scheduled", "Due Soon", "Overdue", "Cancelled"],
    measure: "quantity", rows: 66,
  },

  /* ── 32 ────────────────────────────────────────────────────────────── */
  "production-history": {
    name: "Production History", kind: "list", summary: "Closed orders and how they ran",
    entity: "History Record", ref: "PHS",
    fields: [PRO_LINK, BUYER, ITEM, "completedQty|Completed Qty|int|500;480000;pcs", "cycleDays|Cycle Time|int|1;180;days", "yieldPct|Yield|pct|58;100", "onTime|Delivery|bool|On time;Late", "value|Order Value|money|4000;2400000", "closedDate|Closed On|date|-330;0", "date|Started On|date|-400;-30"],
    statuses: ["Closed", "Completed", "Closed Late", "Short Closed", "Cancelled"],
    measure: "value", rows: 64,
  },

  /* ── 33 ────────────────────────────────────────────────────────────── */
  "full-traceability": {
    name: "Full Product Traceability", kind: "list", summary: "Heat lot to buyer carton",
    entity: "Trace Record", ref: "TRC",
    fields: ["traceId|Trace ID|code|TRC", ITEM, BATCH, "heatNo|Heat / Melt No|enum|MELT-2241;MELT-2258;MELT-2274;MELT-2290;MELT-2312", "supplier|Material Supplier|enum|@suppliers", WORKFLOW_STAGE, "stagesRecorded|Stages Recorded|int|1;19;stages", BUYER, "shipmentRef|Shipment|enum|SHP-26-0412;SHP-26-0455;SHP-26-0488;SHP-26-0501;SHP-26-0533", "quantity|Quantity|int|50;480000;pcs", "date|Traced On|date|-330;0"],
    statuses: ["Fully Traceable", "Partially Traceable", "Under Verification", "Gap Found", "Not Traceable"],
    measure: "quantity", rows: 62,
    insight: "A complete trace runs from the supplier heat lot to the buyer's carton in nineteen recorded stages. Where a gap is found it is nearly always the rework loop, which re-enters the flow without a fresh scan.",
  },

  /* ── 34 ────────────────────────────────────────────────────────────── */
  "executive-dashboard": {
    name: "Executive Production Dashboard", kind: "overview", summary: "The board-level production view",
    entity: "Executive Summary", ref: "EPD",
    fields: [FACTORY, BUYER, "orderValue|Order Value|money|8000;4800000", "producedValue|Produced Value|money|0;4800000", "deliveredValue|Delivered Value|money|0;4800000", "otifPct|OTIF|pct|38;100", "capacityUtil|Capacity Utilisation|pct|18;110", "openOrders|Open Orders|int|1;120", "delayedOrders|Delayed Orders|int|0;36", "date|Period End|date|-330;0"],
    statuses: ["On Track", "At Risk", "Delayed", "Completed"],
    measure: "orderValue", rows: 56,
    insight: "OTIF sits at 86% against a 95% commitment. Almost the entire shortfall traces to two buyers whose orders consistently reach packing late, not to capacity.",
  },

  /* ── 35 ────────────────────────────────────────────────────────────── */
  "ai-tracking-analytics": {
    name: "AI Production Tracking & Analytics", kind: "analytics", summary: "Delay, completion and OTIF prediction",
    entity: "AI Tracking Insight", ref: "ATA",
    fields: ["analysisType|Analysis|enum|AI delay prediction;AI completion forecast;AI bottleneck detection;AI dispatch planning;AI traceability gap detection;AI OTIF prediction;AI throughput forecast;AI buyer risk", BUYER, PRO_LINK, "confidence|Confidence|pct|45;99", "delayRisk|Delay Risk|pct|0;98", "predictedQty|Predicted Output|int|500;980000;pcs", "impactValue|Value Impact|money|100;980000", "recommendation|AI Recommendation|text|Expedite the plating slot for this lot;Split the shipment and air freight the balance;Re-sequence two orders on Line 3;Add a packing shift on Thursday;Chase the missing scan at final QC;Warn the buyer of a four day slip", "forecastDate|Forecast Completion|date|-20;150", "date|Generated On|date|-330;0"],
    statuses: ["Adopted", "Validated", "Monitoring", "New", "Rejected"],
    measure: "impactValue", rows: 58,
  },
};
