import type { ModuleSpecs } from "../types";

/** Module 32 — Production Management. */

const ITEM = "item|Item|enum|@items";
const LINE = "line|Production Line|enum|Press Line 1;Press Line 2;Polishing Line;Plating Line A;Plating Line B;Assembly Line 1;Assembly Line 2";
const ORDER = "order|Work Order|enum|WO-26-1042;WO-26-1051;WO-26-1063;WO-26-1078;WO-26-1090;WO-26-1104;WO-26-1119";
const BUYER = "buyer|Buyer|enum|@buyers";
const SUP = "supervisor|Supervisor|person";
const SHIFT = "shift|Shift|enum|A (06–14);B (14–22);C (22–06)";

export const PRODUCTION: ModuleSpecs = {
  "work-orders": {
    name: "Work Orders", kind: "list", summary: "Every production order in flight",
    entity: "Work Order", ref: "WO",
    fields: [ITEM, BUYER, LINE, "qty|Order Qty|int|10000;480000;pcs", "made|Produced|int|0;470000;pcs", "progress|Progress|pct|0;100", SUP, "due|Due Date|date|-20;70"],
    statuses: ["Planned", "Released", "In Progress", "On Hold", "Completed", "Closed"],
    measure: "qty", rows: 56,
    insight: "Four orders are past their due date with less than 60% completion — expedite before the weekly shipment cut-off.",
  },

  "create-wo": {
    name: "Create Work Order", kind: "form", summary: "Release a new order to the floor",
    entity: "Work Order", ref: "WO",
    fields: [ITEM, BUYER, LINE, "qty|Order Qty|int|10000;300000;pcs", "route|Routing|enum|Standard Stamping;Stamping + Plating;Full Assembly;Subcontract Plating", SUP, "start|Start Date|date|-5;30", "due|Due Date|date|5;80"],
    statuses: ["Draft", "Submitted", "Approved", "Released", "Rejected"],
    measure: "qty",
  },

  "daily-production": {
    name: "Daily Production", kind: "analytics", summary: "Output by day and line",
    entity: "Daily Output", ref: "DPR",
    fields: [LINE, ITEM, "output|Output|int|8000;160000;pcs", "target|Target|int|10000;170000;pcs", "achievement|Achievement|pct|48;118", SHIFT, "date|Production Date|date|-40;0"],
    statuses: ["Above Target", "On Target", "Below Target", "No Production"],
    measure: "output",
  },

  "output-entry": {
    name: "Output Entry", kind: "form", summary: "Record produced quantity",
    entity: "Output Entry", ref: "OPE",
    fields: [ORDER, ITEM, LINE, "good|Good Qty|int|500;60000;pcs", "reject|Reject Qty|int|0;2400;pcs", SHIFT, "operator|Operator|person", "date|Entry Date|date|-8;0"],
    statuses: ["Draft", "Submitted", "Verified", "Posted", "Reversed"],
    measure: "good",
  },

  efficiency: {
    name: "Efficiency Report", kind: "analytics", summary: "Earned hours against actual",
    entity: "Efficiency Record", ref: "EFF",
    fields: [LINE, "earned|Earned Hours|float|20;480;hrs;1", "actual|Actual Hours|float|24;520;hrs;1", "efficiency|Efficiency|pct|46;122", "headcount|Headcount|int|6;64", SHIFT, "date|Week Ending|date|-84;0"],
    statuses: ["Excellent", "On Target", "Below Target", "Critical"],
    measure: "efficiency",
  },

  yield: {
    name: "Yield Analysis", kind: "analytics", summary: "Good output against input",
    entity: "Yield Record", ref: "YLD",
    fields: [ITEM, LINE, "input|Input Qty|int|10000;220000;pcs", "good|Good Qty|int|8000;218000;pcs", "yield|Yield|pct|72;99", "loss|Loss Qty|int|50;9000;pcs", "date|Batch Date|date|-45;0"],
    statuses: ["Within Norm", "Marginal", "Below Norm", "Under Investigation"],
    measure: "input",
  },

  "line-performance": {
    name: "Line Performance", kind: "analytics", summary: "Line-by-line comparison",
    entity: "Line Result", ref: "LPF",
    fields: [LINE, "output|Output|int|40000;900000;pcs", "uptime|Uptime|pct|58;98", "efficiency|Efficiency|pct|52;114", "scrapPct|Scrap|pct|0.4;7", SUP, "date|Period End|date|-180;0"],
    statuses: ["Best Performer", "On Target", "Needs Attention", "Under Improvement"],
    measure: "output",
  },

  subcontract: {
    name: "Subcontract Production", kind: "list", summary: "Operations sent outside",
    entity: "Subcontract Job", ref: "SCJ",
    fields: [ITEM, "vendor|Subcontractor|enum|@suppliers", "operation|Operation|enum|Electroplating;Powder Coating;Laser Engraving;Enamel Filling;Polishing;Heat Treatment", "sentQty|Sent Qty|int|5000;180000;pcs", "recvQty|Received Qty|int|0;178000;pcs", "charge|Job Charge|money|1200;68000", "due|Return Due|date|-15;45"],
    statuses: ["Issued", "At Vendor", "Partially Received", "Received", "Short Closed"],
  },

  "wo-closure": {
    name: "Work Order Closure", kind: "list", summary: "Settle and close finished orders",
    entity: "Closure", ref: "WOC",
    fields: [ORDER, ITEM, "producedQty|Produced|int|9000;420000;pcs", "variance|Qty Variance|pct|88;108", "cost|Actual Cost|money|4000;220000", "accountant|Closed By|person", "date|Closure Date|date|-60;10"],
    statuses: ["Pending Closure", "Under Settlement", "Closed", "Reopened"],
  },

  "production-cost": {
    name: "Production Cost", kind: "analytics", summary: "Actual cost per order",
    entity: "Cost Record", ref: "PCT",
    fields: [ORDER, ITEM, "material|Material Cost|money|3000;120000", "labour|Labour Cost|money|800;42000", "overhead|Overhead|money|500;36000", "unitCost|Unit Cost|float|0.04;2.4;USD;3", "date|Costed On|date|-90;0"],
    statuses: ["Within Standard", "Above Standard", "Under Review", "Approved"],
    measure: "material",
  },

  "operation-progress": {
    name: "Operation Progress", kind: "list", summary: "Stage-wise completion per order",
    entity: "Operation", ref: "OPR",
    fields: [ORDER, "operation|Operation|enum|Blanking;Forming;Deburring;Polishing;Plating;Assembly;Inspection;Packing", LINE, "planned|Planned Qty|int|8000;240000;pcs", "done|Completed Qty|int|0;238000;pcs", "progress|Progress|pct|0;100", "date|Target Date|date|-14;40"],
    statuses: ["Not Started", "In Progress", "Completed", "Blocked"],
    measure: "planned",
  },

  "batch-records": {
    name: "Batch Records", kind: "list", summary: "Manufacturing batch history",
    entity: "Batch", ref: "BAT",
    fields: [ITEM, ORDER, "batchNo|Batch No|enum|B-26-0411;B-26-0428;B-26-0443;B-26-0461;B-26-0478;B-26-0492", "qty|Batch Qty|int|4000;90000;pcs", "heat|Heat Lot|enum|HL-4471;HL-4489;HL-4502;HL-4517;HL-4530", SUP, "date|Batch Date|date|-70;0"],
    statuses: ["Open", "In Process", "Completed", "Quarantined", "Released"],
    measure: "qty",
  },

  "material-issue": {
    name: "Material Issue to Production", kind: "list", summary: "Store issues against orders",
    entity: "Issue Note", ref: "MIS",
    fields: [ORDER, "material|Material|enum|Brass Strip 0.8mm;Brass Strip 1.2mm;Zinc Alloy Ingot;Steel Wire 2.0mm;Plating Salt;Packing Carton", "qty|Issued Qty|float|20;2400;kg;1", "value|Issue Value|money|400;48000", "store|Issuing Store|enum|RM Store;Chemical Store;Packing Store;WIP Store", "issuer|Issued By|person", "date|Issue Date|date|-40;0"],
    statuses: ["Requested", "Issued", "Partially Issued", "Returned", "Cancelled"],
  },

  "production-calendar": {
    name: "Production Calendar", kind: "calendar", summary: "Day-wise line commitments",
    entity: "Scheduled Run", ref: "PCL",
    fields: [LINE, ITEM, ORDER, "qty|Planned Qty|int|8000;180000;pcs", "hours|Run Hours|float|2;22;hrs;1", SHIFT, "date|Run Date|date|-10;35"],
    statuses: ["Scheduled", "Confirmed", "Running", "Completed", "Cancelled"],
    measure: "qty",
  },

  "production-hold": {
    name: "Production Hold", kind: "board", summary: "Orders stopped and why",
    entity: "Hold", ref: "PHD",
    fields: [ORDER, ITEM, LINE, "reason|Hold Reason|enum|Material shortage;Quality issue;Buyer instruction;Tooling failure;Artwork pending;Capacity clash", "qty|Held Qty|int|2000;160000;pcs", "ageDays|Held For|int|1;38;days", SUP],
    statuses: ["Raised", "Under Review", "Action Taken", "Released", "Cancelled"],
    measure: "qty",
  },

  "shift-output": {
    name: "Shift Output", kind: "list", summary: "Output booked per shift",
    entity: "Shift Record", ref: "SFT",
    fields: [SHIFT, LINE, "output|Output|int|3000;90000;pcs", "manpower|Manpower|int|4;48", "perHead|Output / Head|int|400;4200;pcs", SUP, "date|Shift Date|date|-30;0"],
    statuses: ["Above Target", "On Target", "Below Target", "Not Run"],
    measure: "output",
  },

  "capacity-utilization": {
    name: "Capacity Utilisation", kind: "analytics", summary: "Used against available hours",
    entity: "Capacity Record", ref: "CAP",
    fields: [LINE, "available|Available Hours|float|80;720;hrs;1", "used|Used Hours|float|40;700;hrs;1", "utilisation|Utilisation|pct|38;99", "backlogHrs|Backlog|float|0;300;hrs;1", "date|Week Ending|date|-90;14"],
    statuses: ["Overloaded", "Optimal", "Underloaded", "Idle"],
    measure: "used",
  },

  "overtime-log": {
    name: "Overtime Log", kind: "list", summary: "Extra hours booked on production",
    entity: "Overtime Entry", ref: "OVT",
    fields: [LINE, "worker|Worker|person", "hours|OT Hours|float|1;6;hrs;1", "rate|OT Rate|float|0.6;2.4;USD;2", "cost|OT Cost|money|4;220", "reason|Reason|enum|Shipment deadline;Machine breakdown recovery;Absenteeism;Rework;Trial run", "date|OT Date|date|-45;0"],
    statuses: ["Requested", "Approved", "Posted", "Rejected"],
  },

  "output-forecast": {
    name: "Output Forecast", kind: "analytics", summary: "Projected output against commitment",
    entity: "Forecast Point", ref: "OFC",
    fields: [LINE, ITEM, "committed|Committed Qty|int|20000;400000;pcs", "forecast|Forecast Qty|int|15000;420000;pcs", "confidence|Confidence|pct|55;98", "gap|Gap|int|0;60000;pcs", "date|Forecast For|date|0;60"],
    statuses: ["On Track", "At Risk", "Shortfall", "Surplus"],
    measure: "forecast",
  },

  "production-settings": {
    name: "Production Configuration", kind: "settings", summary: "Order release and booking rules",
    entity: "Rule", ref: "PSET",
    fields: [LINE, "rule|Rule|enum|Auto-release on material availability;Block over-production;Mandatory shift confirmation;Auto-close on full receipt;Sequence by changeover", "threshold|Threshold|pct|80;100", "owner|Rule Owner|person", "date|Effective From|date|-120;0", "documentsAffected|Documents Affected|int|10;900"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Auto-release work orders when material is available", "Warn when actual cost exceeds standard by 10%"],
  },
};
