import type { ModuleSpecs } from "../types";

/**
 * Module 31 — Production Management.
 *
 * Thirty-five workspaces in the master serial order: planning and scheduling,
 * the routing and process masters, the factory resources that execute them,
 * the material chain feeding the floor, the shop-floor transaction flow, and
 * the costing, performance, exception and AI surfaces built on top.
 */

/* ── Shared field fragments ────────────────────────────────────────────── */

const ITEM = "item|Item|enum|@items";
const BUYER = "buyer|Buyer|enum|@buyers";
const OPERATOR = "operator|Operator|person";
const SUPERVISOR = "supervisor|Supervisor|person";
const SECTION = "section|Section|enum|Press Shop;Injection;Die Casting;Plating;Polishing;Assembly;Packing;Tool Room";
const LINE = "line|Production Line|enum|Line 1 - Snap;Line 2 - Button;Line 3 - Zipper;Line 4 - Rivet;Line 5 - Buckle;Line 6 - Assembly";
const MACHINE = "machine|Machine|enum|Press-01;Press-02;Press-03;Injection-01;Injection-02;Die-Cast-01;Plating-Line-A;Plating-Line-B;Assembly-01;Packing-01";
const WORK_CENTER = "workCenter|Work Center|enum|WC-PRESS-01;WC-PRESS-02;WC-INJ-01;WC-DIE-01;WC-PLATE-A;WC-POLISH-01;WC-ASSY-01;WC-PACK-01";
const SHIFT = "shift|Shift|enum|Shift A - 06:00;Shift B - 14:00;Shift C - 22:00;General Day";
const PRO_LINK = "productionOrder|Production Order|enum|PRO-26-1041;PRO-26-1056;PRO-26-1072;PRO-26-1088;PRO-26-1104;PRO-26-1121";
const WO_LINK = "workOrder|Work Order|enum|WO-26-2041;WO-26-2056;WO-26-2072;WO-26-2088;WO-26-2104;WO-26-2121";
const MATERIAL = "material|Material|enum|Brass Strip 0.8mm;Zinc Alloy Ingot;Nickel Anode;Steel Wire 2.0mm;Copper Sheet;Plating Chemical;Polyester Tape;Nylon Monofilament";
const BATCH = "batch|Batch / Lot|enum|HL-4471;HL-4489;HL-4502;HL-4517;HL-4530;HL-4548;HL-4562";
const OPERATION = "operation|Operation|enum|Blanking;Forming;Drilling;Deburring;Plating;Polishing;Assembly;Packing;Inspection";

export const PRODUCTION_MANAGEMENT: ModuleSpecs = {
  /* ── 01 ────────────────────────────────────────────────────────────── */
  "production-dashboard": {
    name: "Production Dashboard", kind: "overview", summary: "Output, efficiency and OEE at a glance",
    entity: "Production Summary", ref: "PDS",
    fields: [SECTION, LINE, SHIFT, "planQty|Planned Qty|int|500;480000;pcs", "actualQty|Actual Output|int|0;480000;pcs", "goodQty|Good Qty|int|0;480000;pcs", "rejectQty|Reject Qty|int|0;24000;pcs", "efficiency|Efficiency|pct|38;100", "oee|OEE|pct|30;96", "date|Production Date|date|-330;0"],
    statuses: ["On Target", "Running", "Behind Plan", "Completed", "Stopped"],
    measure: "actualQty", rows: 60,
    insight: "Press Shop runs at 91% efficiency but only 74% OEE — the gap is changeover time, not machine speed. Six of every ten lost hours are die changes.",
  },

  /* ── 02 ────────────────────────────────────────────────────────────── */
  "ai-production-control": {
    name: "AI Production Control Center", kind: "overview", summary: "Bottlenecks, delays and optimisation signals",
    entity: "Control Signal", ref: "APC",
    fields: ["signalType|Signal|enum|Bottleneck detection;Delay prediction;Capacity alert;Material shortage;Machine utilisation drop;Operator performance;Quality risk;Cost optimisation", SECTION, LINE, MACHINE, "aiConfidence|AI Confidence|pct|45;99", "impactQty|Qty at Risk|int|0;280000;pcs", "impactValue|Value at Risk|money|0;680000", "recommendation|AI Recommendation|text|Shift the order to Press-03;Add an overtime shift this week;Release reserved material early;Re-route through Plating-B;Split the lot across two lines;Hold and re-calibrate the die", "owner|Owner|person", "date|Detected On|date|-300;0"],
    statuses: ["Action Taken", "Acknowledged", "Monitoring", "New", "Dismissed"],
    measure: "impactValue", rows: 58,
    insight: "Plating is flagged as the bottleneck on four days in five. Everything upstream can absorb more load; the barrel capacity is what caps daily output.",
  },

  /* ── 03 ────────────────────────────────────────────────────────────── */
  "production-order": {
    name: "Production Order Management", kind: "list", summary: "Orders released to the factory",
    entity: "Production Order", ref: "PRO",
    fields: ["orderNo|Production Order|code|PRO", BUYER, ITEM, "piRef|Against PI|enum|PI-26-1041;PI-26-1056;PI-26-1072;PI-26-1088;PI-26-1104", "orderQty|Order Quantity|int|500;480000;pcs", "producedQty|Produced|int|0;480000;pcs", "balanceQty|Balance|int|0;480000;pcs", SECTION, "priority|Priority|enum|Urgent;High;Normal;Low", "dueDate|Due Date|date|-40;120", "date|Released On|date|-300;0"],
    statuses: ["Released", "In Production", "Completed", "On Hold", "Closed", "Cancelled"],
    measure: "orderQty", rows: 62,
  },

  /* ── 04 ────────────────────────────────────────────────────────────── */
  "work-order": {
    name: "Work Order Management", kind: "list", summary: "Operation-level jobs on the floor",
    entity: "Work Order", ref: "WO",
    fields: ["woNo|Work Order|code|WO", PRO_LINK, ITEM, WORK_CENTER, OPERATION, "woQty|WO Quantity|int|500;480000;pcs", "completedQty|Completed|int|0;480000;pcs", OPERATOR, SHIFT, "dueDate|Due Date|date|-30;90", "date|Issued On|date|-300;0"],
    statuses: ["Issued", "In Progress", "Completed", "On Hold", "Cancelled"],
    measure: "woQty", rows: 64,
  },

  /* ── 05 ────────────────────────────────────────────────────────────── */
  "production-planning": {
    name: "Production Planning (PPC)", kind: "list", summary: "What we intend to make and when",
    entity: "Production Plan", ref: "PPC",
    fields: ["planNo|Plan|code|PPC", BUYER, ITEM, "planPeriod|Plan Period|enum|Week 12;Week 13;Week 14;Week 15;Month Mar 2026;Month Apr 2026", "plannedQty|Planned Qty|int|500;980000;pcs", "capacityQty|Available Capacity|int|500;980000;pcs", "loadPct|Capacity Load|pct|20;140", "materialReady|Material Status|bool|Material ready;Material short", "planner|Planner|person", "startDate|Plan Start|date|-60;120", "date|Planned On|date|-300;0"],
    statuses: ["Approved", "Frozen", "Under Review", "Draft", "Revised"],
    measure: "plannedQty", rows: 58,
    insight: "Weeks 13 and 14 are planned at 118% of available capacity. Either the plan moves or the overtime is booked now — waiting makes it a delivery problem instead of a planning one.",
  },

  /* ── 06 ────────────────────────────────────────────────────────────── */
  "production-scheduling": {
    name: "Production Scheduling", kind: "calendar", summary: "Machine-level slot allocation",
    entity: "Schedule Slot", ref: "SCH",
    fields: [WORK_CENTER, MACHINE, PRO_LINK, ITEM, "scheduledQty|Scheduled Qty|int|500;280000;pcs", "setupMin|Setup Time|float|5;240;min;0", "runHours|Run Time|float|0.5;72;hrs;1", SHIFT, "startDate|Start|date|-40;90", "endDate|Finish|date|-30;120", "date|Scheduled On|date|-300;0"],
    statuses: ["Scheduled", "Running", "Completed", "Rescheduled", "Delayed"],
    measure: "scheduledQty", rows: 62,
  },

  /* ── 07 ────────────────────────────────────────────────────────────── */
  "capacity-planning": {
    name: "Capacity Planning", kind: "analytics", summary: "Load against available hours",
    entity: "Capacity Record", ref: "CAP",
    fields: [SECTION, LINE, MACHINE, SHIFT, "availableHours|Available Hours|float|8;720;hrs;1", "loadedHours|Loaded Hours|float|0;720;hrs;1", "utilisation|Utilisation|pct|18;125", "bottleneck|Bottleneck|bool|Bottleneck;Within capacity", "overtimeHours|Overtime Needed|float|0;180;hrs;1", "date|Period End|date|-330;0"],
    statuses: ["Within Capacity", "Near Limit", "Over Capacity", "Under Review", "Idle"],
    measure: "loadedHours", rows: 58,
  },

  /* ── 08 ────────────────────────────────────────────────────────────── */
  "routing-master": {
    name: "Product Routing Master (Dynamic)", kind: "list", summary: "Operation sequence per product",
    entity: "Routing", ref: "RTG",
    fields: ["routingNo|Routing|code|RTG", ITEM, "productFamily|Product Family|enum|Snap fasteners;Jeans buttons;Zipper components;Rivets;Eyelets;Buckles;Metal labels", "sequence|Operation Sequence|int|1;12", OPERATION, WORK_CENTER, "cycleSec|Cycle Time|float|0.2;120;sec;2", "setupMin|Setup Time|float|2;240;min;0", "runQty|Qty Routed|int|500;480000;pcs", "dynamic|Routing Type|bool|Dynamic;Fixed", "date|Effective From|date|-600;30"],
    statuses: ["Active", "Draft", "Under Review", "Superseded"],
    measure: "runQty", rows: 60,
    insight: "Dynamic routings let a lot re-route to whichever plating line is free. On the barrel lines that recovers about nine hours a week that fixed routings would have queued.",
  },

  /* ── 09 ────────────────────────────────────────────────────────────── */
  "process-flow-designer": {
    name: "Process Flow Designer", kind: "form", summary: "Build the flow a product follows",
    entity: "Process Flow", ref: "PFD",
    fields: ["flowName|Flow|enum|Snap button standard flow;Jeans button flow;Zipper slider flow;Rivet flow;Plated buckle flow;Custom buyer flow", ITEM, "steps|Steps|int|3;16;steps", "startStep|Start Step|enum|Material receive;Blanking;Injection;Die casting", "endStep|End Step|enum|Packing;Finished goods;Transfer to next process", "parallelPaths|Parallel Paths|int|1;4", "reworkLoop|Rework Loop|bool|Rework loop enabled;Linear flow", "designer|Designed By|person", "date|Updated On|date|-500;0"],
    statuses: ["Published", "Draft", "Under Review", "Archived"],
    measure: "steps", rows: 46,
    settings: ["Allow a rework loop to return a lot to any earlier step in the flow", "Require an approved flow before a production order can be released"],
  },

  /* ── 10 ────────────────────────────────────────────────────────────── */
  "process-management": {
    name: "Production Process Management", kind: "list", summary: "Standard versus actual process time",
    entity: "Process", ref: "PRC",
    fields: ["processName|Process|enum|Blanking;Forming;Drilling;Deburring;Injection molding;Die casting;Plating;Polishing;Assembly;Packing", SECTION, WORK_CENTER, "processedQty|Processed Qty|int|500;480000;pcs", "standardTime|Standard Time|float|0.2;120;sec;2", "actualTime|Actual Time|float|0.2;180;sec;2", "efficiency|Process Efficiency|pct|38;120", "yieldPct|Process Yield|pct|60;100", SUPERVISOR, "date|Measured On|date|-330;0"],
    statuses: ["Stable", "Running", "Under Improvement", "Out of Control", "Stopped"],
    measure: "processedQty", rows: 60,
  },

  /* ── 11 ────────────────────────────────────────────────────────────── */
  "work-center": {
    name: "Work Center Management", kind: "list", summary: "Capacity, cost rate and utilisation",
    entity: "Work Center", ref: "WKC",
    fields: ["centerCode|Work Center|code|WKC", "centerName|Name|enum|Press Shop A;Press Shop B;Injection Bay;Die Casting Bay;Plating Line A;Plating Line B;Polishing;Assembly Hall;Packing Hall", SECTION, "machines|Machines|int|1;24", "operators|Operators|int|1;48;people", "capacityQty|Daily Capacity|int|1000;480000;pcs", "utilisation|Utilisation|pct|18;110", "costRate|Cost Rate|float|2;180;USD/hr;2", SUPERVISOR, "date|Commissioned|date|-1800;0"],
    statuses: ["Active", "Running", "Under Maintenance", "Idle", "Decommissioned"],
    measure: "capacityQty", rows: 48,
  },

  /* ── 12 ────────────────────────────────────────────────────────────── */
  "production-line": {
    name: "Production Line Management", kind: "list", summary: "Line output, balance and downtime",
    entity: "Production Line", ref: "LIN",
    fields: [LINE, SECTION, "lineType|Line Type|enum|Automatic;Semi-automatic;Manual;Hybrid", "stations|Stations|int|2;24", "outputRate|Output Rate|int|100;24000;pcs/hr", "outputQty|Output Qty|int|500;480000;pcs", "efficiency|Line Efficiency|pct|38;100", "downtimeHours|Downtime|float|0;120;hrs;1", SUPERVISOR, "date|Measured On|date|-330;0"],
    statuses: ["Running", "Changeover", "Idle", "Breakdown", "Stopped"],
    measure: "outputQty", rows: 52,
  },

  /* ── 13 ────────────────────────────────────────────────────────────── */
  "section-management": {
    name: "Section Management", kind: "list", summary: "Section target against achievement",
    entity: "Section", ref: "SEC",
    fields: [SECTION, "sectionHead|Section Head|person", "lines|Lines|int|1;12", "manpower|Manpower|int|4;180;people", "targetQty|Target Qty|int|1000;980000;pcs", "achievedQty|Achieved Qty|int|0;980000;pcs", "achievement|Achievement|pct|20;130", "areaSqft|Floor Area|int|500;48000;sqft", "date|Period End|date|-330;0"],
    statuses: ["On Target", "Running", "Below Target", "Under Review", "Shut"],
    measure: "achievedQty", rows: 48,
  },

  /* ── 14 ────────────────────────────────────────────────────────────── */
  "machine-management": {
    name: "Machine Management", kind: "list", summary: "Utilisation, OEE and breakdowns",
    entity: "Machine", ref: "MCH",
    fields: [MACHINE, SECTION, "machineType|Machine Type|enum|Power press;Injection moulding;Die casting;Plating barrel;Polishing drum;Assembly jig;Packing machine", "ratedOutput|Rated Output|int|100;24000;pcs/hr", "runHours|Run Hours|float|0;720;hrs;1", "utilisation|Machine Utilisation|pct|12;98", "oee|OEE|pct|25;95", "breakdowns|Breakdowns|int|0;18", "lastService|Last Service|date|-200;0", "date|Recorded On|date|-330;0"],
    statuses: ["Running", "Setup", "Idle", "Under Maintenance", "Breakdown"],
    measure: "runHours", rows: 54,
    insight: "Press-02 carries the highest utilisation and the most breakdowns. It is the machine the schedule leans on, which is exactly why its service interval keeps slipping.",
  },

  /* ── 15 ────────────────────────────────────────────────────────────── */
  "operator-management": {
    name: "Operator Management", kind: "list", summary: "Skill, output and reject rate",
    entity: "Operator", ref: "OPR",
    fields: [OPERATOR, SECTION, LINE, SHIFT, "skillGrade|Skill Grade|enum|A - Expert;B - Skilled;C - Semi-skilled;D - Trainee", "outputQty|Output Qty|int|100;180000;pcs", "efficiency|Operator Efficiency|pct|38;125", "rejectRate|Reject Rate|pct|0;12", "attendance|Attendance|pct|60;100", "date|Period End|date|-330;0"],
    statuses: ["Above Standard", "On Standard", "Below Standard", "Under Training", "Absent"],
    measure: "outputQty", rows: 58,
  },

  /* ── 16 ────────────────────────────────────────────────────────────── */
  "shift-management": {
    name: "Shift Management", kind: "calendar", summary: "Manpower and output per shift",
    entity: "Shift Record", ref: "SFT",
    fields: [SHIFT, SECTION, LINE, "manpower|Manpower|int|4;180;people", "plannedQty|Planned Qty|int|500;280000;pcs", "actualQty|Actual Qty|int|0;280000;pcs", "overtimeHours|Overtime|float|0;120;hrs;1", "shiftIncharge|Shift In-charge|person", "shiftDate|Shift Date|date|-60;30", "date|Logged On|date|-300;0"],
    statuses: ["Completed", "Running", "Planned", "Short Manned", "Cancelled"],
    measure: "actualQty", rows: 62,
  },

  /* ── 17 ────────────────────────────────────────────────────────────── */
  "material-availability": {
    name: "Material Availability Check", kind: "list", summary: "Can we start this order",
    entity: "Availability Check", ref: "MAC",
    fields: [PRO_LINK, MATERIAL, "requiredQty|Required|float|10;48000;kg;1", "availableQty|Available|float|0;48000;kg;1", "shortageQty|Shortage|float|0;24000;kg;1", "coveragePct|Coverage|pct|0;100", "expectedDate|Expected On|date|-20;90", "checkedBy|Checked By|person", "date|Checked On|date|-300;0"],
    statuses: ["Available", "Partially Available", "On Order", "Shortage", "Blocked"],
    measure: "requiredQty", rows: 58,
    insight: "Nickel anode is short on eleven open orders. Every one of them is a plated line item, so the shortage caps finished output rather than just delaying a single order.",
  },

  /* ── 18 ────────────────────────────────────────────────────────────── */
  "material-reservation": {
    name: "Material Reservation", kind: "list", summary: "Stock committed to an order",
    entity: "Reservation", ref: "RSV",
    fields: [PRO_LINK, MATERIAL, BATCH, "reservedQty|Reserved|float|10;48000;kg;1", "issuedQty|Issued|float|0;48000;kg;1", "balanceQty|Balance|float|0;48000;kg;1", "warehouse|Warehouse|enum|RM Store 1;RM Store 2;Bonded Store;Chemical Store;Floor Store", "reservedBy|Reserved By|person", "validTill|Valid Till|date|-20;90", "date|Reserved On|date|-300;0"],
    statuses: ["Reserved", "Partially Issued", "Fully Issued", "Released", "Expired"],
    measure: "reservedQty", rows: 56,
  },

  /* ── 19 ────────────────────────────────────────────────────────────── */
  "material-requisition": {
    name: "Material Requisition", kind: "list", summary: "Floor asks the store for material",
    entity: "Requisition", ref: "REQ",
    fields: ["reqNo|Requisition|code|REQ", PRO_LINK, MATERIAL, SECTION, "requestedQty|Requested|float|10;48000;kg;1", "approvedQty|Approved|float|0;48000;kg;1", "requestedBy|Requested By|person", "approver|Approved By|person", "requiredDate|Required By|date|-20;60", "date|Raised On|date|-300;0"],
    statuses: ["Approved", "Issued", "Pending Approval", "Partially Approved", "Rejected"],
    measure: "requestedQty", rows: 60,
  },

  /* ── 20 ────────────────────────────────────────────────────────────── */
  "raw-material-issue": {
    name: "Raw Material Issue", kind: "list", summary: "Material handed to the floor",
    entity: "Material Issue", ref: "MIS",
    fields: ["issueNo|Issue Note|code|MIS", PRO_LINK, MATERIAL, BATCH, "issuedQty|Issued Qty|float|10;48000;kg;1", "issueValue|Issue Value|money|100;480000", "warehouse|From Store|enum|RM Store 1;RM Store 2;Bonded Store;Chemical Store", SECTION, "issuedBy|Issued By|person", "date|Issued On|date|-300;0"],
    statuses: ["Issued", "Partially Issued", "Pending", "Returned", "Cancelled"],
    measure: "issueValue", rows: 62,
  },

  /* ── 21 ────────────────────────────────────────────────────────────── */
  "raw-material-return": {
    name: "Raw Material Return", kind: "list", summary: "Unused material back to store",
    entity: "Material Return", ref: "MRT",
    fields: ["returnNo|Return Note|code|MRT", PRO_LINK, MATERIAL, BATCH, "returnedQty|Returned Qty|float|1;24000;kg;1", "returnValue|Return Value|money|20;280000", "reason|Return Reason|enum|Excess issued;Wrong material;Quality rejected;Order cancelled;Process change;Surplus after run", SECTION, "returnedBy|Returned By|person", "date|Returned On|date|-300;0"],
    statuses: ["Accepted", "Pending Inspection", "Partially Accepted", "Rejected", "Scrapped"],
    measure: "returnValue", rows: 52,
  },

  /* ── 22 ────────────────────────────────────────────────────────────── */
  "material-consumption": {
    name: "Material Consumption Management", kind: "analytics", summary: "Standard against actual usage",
    entity: "Consumption Record", ref: "CON",
    fields: [PRO_LINK, ITEM, MATERIAL, "standardQty|Standard Consumption|float|10;48000;kg;1", "actualQty|Actual Consumption|float|10;52000;kg;1", "variance|Consumption Variance|pct|0;38", "wastageQty|Wastage|float|0;4800;kg;1", "consumptionValue|Consumption Value|money|100;680000", "costPerPc|Cost per Piece|float|0.005;2.4;USD;4", "date|Period End|date|-330;0"],
    statuses: ["Within Standard", "Slight Excess", "Over Consumption", "Under Review", "Adjusted"],
    measure: "consumptionValue", rows: 60,
    insight: "Brass strip runs 4.2% over standard on small-diameter snaps. The scrap web between blanks is the cause — a tighter nesting layout is worth about USD 6k a month.",
  },

  /* ── 23 ────────────────────────────────────────────────────────────── */
  "batch-lot-management": {
    name: "Batch & Lot Management", kind: "list", summary: "Heat lots and their yield",
    entity: "Batch", ref: "BAT",
    fields: [BATCH, ITEM, MATERIAL, "batchQty|Batch Qty|int|500;480000;pcs", "goodQty|Good Qty|int|0;480000;pcs", "rejectQty|Reject Qty|int|0;48000;pcs", "heatNo|Heat / Melt No|enum|MELT-2241;MELT-2258;MELT-2274;MELT-2290;MELT-2312", "traceable|Traceability|bool|Fully traceable;Partial", "expiryDate|Shelf Life Till|date|-30;540", "date|Batch Date|date|-330;0"],
    statuses: ["Released", "In Process", "Consumed", "Quarantined", "Rejected"],
    measure: "batchQty", rows: 60,
  },

  /* ── 24 ────────────────────────────────────────────────────────────── */
  "production-transaction": {
    name: "Production Transaction Management", kind: "board", summary: "The shop-floor transaction flow",
    entity: "Transaction", ref: "TRX",
    fields: [PRO_LINK, WO_LINK, ITEM, SECTION, MACHINE, "receivedQty|Material / WIP Received|int|0;480000;pcs", "producedQty|Produced Qty|int|0;480000;pcs", "goodQty|Good Quantity|int|0;480000;pcs", "rejectQty|Reject Quantity|int|0;48000;pcs", "reworkQty|Rework Quantity|int|0;48000;pcs", OPERATOR, SHIFT, "date|Transaction Date|date|-300;0"],
    statuses: ["Previous Process", "Material Receive", "WIP Receive", "Production Start", "Machine Running", "Production Complete", "Good Quantity", "Reject Quantity", "Rework Quantity", "QC Inspection", "Transfer To Next Process"],
    measure: "producedQty", rows: 72,
    insight: "The board columns are the transaction flow itself — a lot moves left to right from the previous process through to transfer, and good, reject and rework quantity are booked at the point the lot leaves the machine.",
  },

  /* ── 25 ────────────────────────────────────────────────────────────── */
  "semi-finished-goods": {
    name: "Semi Finished Goods Management", kind: "list", summary: "Part-made stock between operations",
    entity: "SFG Lot", ref: "SFG",
    fields: [ITEM, PRO_LINK, BATCH, "stage|Stage|enum|After blanking;After forming;After plating;After polishing;Before assembly;Before packing", "sfgQty|SFG Quantity|int|500;480000;pcs", "location|Location|enum|SFG Store;Floor Buffer;Plating WIP;Assembly Buffer;Quarantine", "holdDays|Held For|int|0;90;days", "value|SFG Value|money|100;680000", "date|Received On|date|-300;0"],
    statuses: ["Available", "In Process", "Reserved", "Transferred", "Quarantined"],
    measure: "value", rows: 58,
  },

  /* ── 26 ────────────────────────────────────────────────────────────── */
  "production-costing": {
    name: "Production Costing", kind: "analytics", summary: "Material, labour and overhead per order",
    entity: "Cost Record", ref: "PCS",
    fields: [PRO_LINK, ITEM, "producedQty|Produced Qty|int|500;480000;pcs", "materialCost|Material Cost|money|100;680000", "labourCost|Labour Cost|money|20;280000", "overheadCost|Overhead|money|20;180000", "totalCost|Total Cost|money|200;980000", "standardCost|Standard Cost|money|200;980000", "costPerPc|Cost per Piece|float|0.005;2.4;USD;4", "variance|Cost Variance|pct|0;38", "date|Period End|date|-330;0"],
    statuses: ["Within Standard", "Favourable", "Adverse", "Under Review", "Closed"],
    measure: "totalCost", rows: 60,
  },

  /* ── 27 ────────────────────────────────────────────────────────────── */
  "production-performance": {
    name: "Production Performance Management", kind: "analytics", summary: "OEE broken into its three parts",
    entity: "Performance Record", ref: "PPM",
    fields: [SECTION, LINE, SHIFT, "plannedQty|Planned|int|500;480000;pcs", "actualQty|Actual|int|0;480000;pcs", "efficiency|Efficiency|pct|38;125", "oee|OEE|pct|25;96", "availability|Availability|pct|40;100", "performance|Performance Rate|pct|40;110", "quality|Quality Rate|pct|60;100", "date|Period End|date|-330;0"],
    statuses: ["Above Target", "On Target", "Below Target", "Under Review"],
    measure: "actualQty", rows: 58,
  },

  /* ── 28 ────────────────────────────────────────────────────────────── */
  "production-kpi-reports": {
    name: "Production KPI & Reports", kind: "analytics", summary: "Targets, trends and scheduled reports",
    entity: "KPI Record", ref: "PKR",
    fields: ["kpiName|KPI|enum|Output per shift;OEE;First pass yield;Schedule adherence;Downtime ratio;Rework rate;Cost per piece;Capacity utilisation", SECTION, LINE, "period|Period|enum|Week 12;Week 13;Week 14;Month Mar 2026;Month Apr 2026;Month May 2026", "outputQty|Output Volume|int|1000;980000;pcs", "target|Target|float|10;100;index;1", "actual|Actual|float|0;130;index;1", "achievement|Achievement|pct|20;140", "trend|Trend|enum|Improving;Stable;Declining;Volatile", "reportFormat|Report Output|enum|Dashboard chart;PDF;Excel;Scheduled email", "date|Period End|date|-330;0"],
    statuses: ["Achieved", "On Track", "At Risk", "Missed"],
    measure: "outputQty", rows: 56,
  },

  /* ── 29 ────────────────────────────────────────────────────────────── */
  "production-alerts": {
    name: "Production Alerts & Notifications", kind: "list", summary: "Real-time floor alerting",
    entity: "Alert", ref: "ALR",
    fields: ["alertType|Alert|enum|Machine breakdown;Material shortage;Schedule slippage;Quality deviation;Capacity overload;Downtime threshold;Rework spike;Order due", SECTION, MACHINE, "severity|Severity|enum|Critical;High;Medium;Low;Information", "channel|Channel|enum|Dashboard alert;Email;SMS;Push notification;Andon board", "recipient|Recipient|person", "responseMin|Response Time|float|0.5;480;min;1", "impactQty|Qty Impacted|int|0;280000;pcs", "date|Raised On|date|-300;0"],
    statuses: ["Resolved", "Acknowledged", "Open", "Escalated", "Ignored"],
    measure: "impactQty", rows: 64,
    settings: ["Push a machine breakdown alert to the andon board within one minute", "Escalate any critical alert unacknowledged for fifteen minutes"],
  },

  /* ── 30 ────────────────────────────────────────────────────────────── */
  "workflow-approval": {
    name: "Workflow & Approval Management", kind: "board", summary: "Release, overtime and variance sign-off",
    entity: "Approval", ref: "PAP",
    fields: ["requestType|Request|enum|Production order release;Work order issue;Material requisition;Overtime approval;Rework authorisation;Scrap approval;Plan revision;Cost variance", PRO_LINK, "value|Value|money|100;980000", "stage|Stage|enum|Supervisor;Section Head;Production Manager;Plant Head;Finance", "submittedBy|Submitted By|person", "approver|Approver|person", "pendingDays|Pending For|int|0;30;days", "date|Submitted On|date|-300;0"],
    statuses: ["Draft", "Submitted", "Under Review", "Approved", "Returned", "On Hold", "Rejected"],
    measure: "value", rows: 60,
  },

  /* ── 31 ────────────────────────────────────────────────────────────── */
  "production-documents": {
    name: "Production Document Management", kind: "list", summary: "Job cards, routing sheets and logs",
    entity: "Document", ref: "PDC",
    fields: [PRO_LINK, "docType|Document|enum|Production order sheet;Work order;Routing sheet;Bill of materials;Job card;Inspection report;Machine log;Shift report;Material issue note", "format|Format|enum|PDF;Excel;Word;Image;Scanned copy", "sizeMb|Size|float|0.05;48;MB;2", "version|Version|int|1;8", "uploadedBy|Uploaded By|person", "archived|Archived|bool|Archived;Live", "date|Uploaded On|date|-330;0"],
    statuses: ["Verified", "Uploaded", "Superseded", "Archived", "Rejected"],
    measure: "sizeMb", rows: 58,
  },

  /* ── 32 ────────────────────────────────────────────────────────────── */
  "production-activity-log": {
    name: "Production Activity Log", kind: "list", summary: "Every booking made on the floor",
    entity: "Activity Entry", ref: "PAL",
    fields: ["user|User|person", "action|Action|enum|Order released;Work order issued;Material issued;Production started;Quantity booked;Reject recorded;Rework raised;QC passed;Order closed;Setting changed", PRO_LINK, MACHINE, SECTION, SHIFT, "quantity|Quantity|int|0;480000;pcs", "device|Device|enum|Shop floor terminal;Handheld scanner;Desktop;Mobile app;Andon panel", "date|Timestamp|date|-300;0"],
    statuses: ["Success", "Flagged", "Reversed", "Failed"],
    measure: "quantity", rows: 72,
  },

  /* ── 33 ────────────────────────────────────────────────────────────── */
  "production-exception": {
    name: "Production Exception Management", kind: "list", summary: "What stopped the floor and why",
    entity: "Exception", ref: "EXC",
    fields: ["exceptionType|Exception|enum|Machine breakdown;Material shortage;Power failure;Manpower shortage;Tool failure;Quality hold;Plan change;Die change delay", SECTION, MACHINE, "lostHours|Lost Hours|float|0.1;120;hrs;1", "lostQty|Qty Lost|int|0;280000;pcs", "lostValue|Value Lost|money|0;480000", "rootCause|Root Cause|enum|Tool wear;Operator error;Supplier delay;Maintenance overdue;Design issue;Utility failure;Not established", "owner|Owner|person", "date|Occurred On|date|-330;0"],
    statuses: ["Resolved", "Under Investigation", "Open", "Escalated", "Recurring"],
    measure: "lostValue", rows: 62,
    insight: "Die change delay is the single largest exception by lost hours. It is also the most predictable one — every occurrence follows a tool that passed its stroke count.",
  },

  /* ── 34 ────────────────────────────────────────────────────────────── */
  "variance-analysis": {
    name: "Production Variance Analysis", kind: "analytics", summary: "Standard against actual, head by head",
    entity: "Variance Record", ref: "VAR",
    fields: [PRO_LINK, ITEM, "varianceType|Variance|enum|Quantity variance;Material usage variance;Labour efficiency variance;Machine time variance;Cost variance;Yield variance;Schedule variance", "standardValue|Standard|float|1;480000;units;1", "actualValue|Actual|float|1;520000;units;1", "variancePct|Variance|pct|0;48", "varianceValue|Variance Value|money|0;480000", "direction|Direction|bool|Favourable;Adverse", "analyst|Analysed By|person", "date|Period End|date|-330;0"],
    statuses: ["Favourable", "Within Limit", "Adverse", "Under Review", "Adjusted"],
    measure: "varianceValue", rows: 58,
  },

  /* ── 35 ────────────────────────────────────────────────────────────── */
  "ai-production-analytics": {
    name: "AI Production Analytics", kind: "analytics", summary: "Prediction, optimisation and forecasting",
    entity: "AI Analysis", ref: "APA",
    fields: ["analysisType|Analysis|enum|AI production planning;AI production optimisation;AI capacity planning;AI material planning;AI cost optimisation;AI delay prediction;AI bottleneck detection;AI machine utilisation;AI operator performance;AI quality prediction;AI rework analysis", SECTION, LINE, MACHINE, "confidence|Confidence|pct|45;99", "predictedQty|Predicted Output|int|500;980000;pcs", "impactValue|Value Impact|money|100;980000", "recommendation|AI Recommendation|text|Move the order to Press-03 next shift;Add a night shift for two weeks;Increase the plating batch size;Replace the die before 40k strokes;Re-train two operators on forming;Buffer 8% extra brass strip", "owner|Owner|person", "date|Generated On|date|-330;0"],
    statuses: ["Adopted", "Validated", "Monitoring", "New", "Rejected"],
    measure: "impactValue", rows: 58,
    insight: "Delay prediction called eight of the last nine late orders at least four days out. Acting on the first warning rather than the second is worth roughly a week of recovered lead time.",
  },
};
