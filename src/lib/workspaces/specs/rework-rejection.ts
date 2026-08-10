import type { ModuleSpecs } from "../types";

/** Module 38 — Rework & Rejection Management. */

const ITEM = "item|Item|enum|@items";
const DEFECT = "defect|Defect|enum|Plating stain;Dimension out;Burr;Colour mismatch;Deformation;Loose assembly;Sharp edge;Logo misprint;Rust spot";
const STAGE = "stage|Detected At|enum|Incoming;Stamping;Polishing;Plating;Assembly;Final QC;Buyer end";
const OWNER = "owner|Responsible|person";
const ORDER = "order|Work Order|enum|WO-26-1042;WO-26-1051;WO-26-1063;WO-26-1078;WO-26-1090;WO-26-1104";

export const REWORK_REJECTION: ModuleSpecs = {
  "rejection-log": {
    name: "Rejection Log", kind: "list", summary: "Everything that failed first pass",
    entity: "Rejection", ref: "REJ",
    fields: [ITEM, ORDER, STAGE, DEFECT, "qty|Rejected Qty|int|100;60000;pcs", "value|Value at Risk|money|100;48000", OWNER, "date|Rejected On|date|-120;0"],
    statuses: ["Logged", "Under Review", "Rework Advised", "Scrapped", "Used As Is"],
    measure: "qty", rows: 52,
    insight: "Plating stains account for a third of all rejections but 62% of them are recoverable through a single re-plating pass.",
  },

  disposition: {
    name: "Disposition Board", kind: "board", summary: "Use as is, rework or scrap",
    entity: "Disposition", ref: "DSP",
    fields: [ITEM, DEFECT, "qty|Qty|int|100;50000;pcs", "recommendation|Recommendation|enum|Use as is;Rework;Downgrade;Scrap;Return to supplier", "value|Value|money|100;42000", OWNER, "date|Raised On|date|-60;0"],
    statuses: ["Pending Review", "Under Assessment", "Decision Taken", "Executed", "Closed"],
    measure: "qty",
  },

  "rework-orders": {
    name: "Rework Orders", kind: "list", summary: "Rework jobs in progress",
    entity: "Rework Order", ref: "RWO",
    fields: [ITEM, ORDER, DEFECT, "qty|Rework Qty|int|200;45000;pcs", "recovered|Recovered Qty|int|0;44000;pcs", "recovery|Recovery Rate|pct|20;99", "cost|Rework Cost|money|60;18000", "due|Target Date|date|-20;30"],
    statuses: ["Raised", "In Progress", "Completed", "Partially Recovered", "Abandoned"],
    measure: "qty",
  },

  "rework-routing": {
    name: "Rework Routing", kind: "list", summary: "Repair paths per defect type",
    entity: "Rework Route", ref: "RRT",
    fields: [DEFECT, "operations|Operation Path|enum|Strip → Re-plate;Re-polish → Plate;Deburr only;Re-assemble;Re-print logo;Repack", "cycleMin|Cycle Time|int|4;120;min", "costPer1000|Cost / 1000 pcs|money|8;420", "successRate|Success Rate|pct|45;99", "owner|Process Owner|person", "date|Defined On|date|-400;0"],
    statuses: ["Active", "Trial", "Under Revision", "Withdrawn"],
    measure: "successRate",
  },

  "defect-codes": {
    name: "Defect Code Master", kind: "list", summary: "The standard defect taxonomy",
    entity: "Defect Code", ref: "DFC",
    fields: ["code|Defect Code|enum|D-101;D-102;D-201;D-205;D-301;D-310;D-402;D-455", DEFECT, "category|Category|enum|Appearance;Dimensional;Functional;Packaging;Material", "severity|Severity|enum|Critical;Major;Minor", "occurrences|Occurrences|int|4;1800", "owner|Owner|person", "date|Added On|date|-700;0"],
    statuses: ["Active", "Merged", "Retired"],
    measure: "occurrences",
  },

  copq: {
    name: "Cost of Poor Quality", kind: "analytics", summary: "Money lost to defects",
    entity: "COPQ Line", ref: "CPQ",
    fields: ["category|Category|enum|Rework labour;Scrapped material;Re-plating chemicals;Air freight;Buyer claim;Re-inspection", STAGE, "amount|Amount|money|200;86000", "qty|Pieces|int|500;140000;pcs", "shareOfSales|Share of Sales|pct|0.1;5", "date|Period End|date|-240;0"],
    statuses: ["Improving", "Stable", "Rising", "Under Review"],
    measure: "amount",
  },

  responsibility: {
    name: "Responsibility Analysis", kind: "analytics", summary: "Where the failure originated",
    entity: "Responsibility Record", ref: "RSP",
    fields: ["source|Responsible Area|enum|Own production;Supplier;Design;Tooling;Handling;Buyer specification", STAGE, DEFECT, "qty|Qty|int|200;90000;pcs", "cost|Cost|money|200;60000", "share|Share|pct|2;42", "date|Period End|date|-200;0"],
    statuses: ["Confirmed", "Disputed", "Under Investigation", "Closed"],
    measure: "cost",
  },

  "recovery-rate": {
    name: "Recovery Rate", kind: "analytics", summary: "Reworked against scrapped",
    entity: "Recovery Record", ref: "RCV",
    fields: [ITEM, DEFECT, "rejected|Rejected|int|200;80000;pcs", "recovered|Recovered|int|100;79000;pcs", "scrapped|Scrapped|int|0;20000;pcs", "recovery|Recovery Rate|pct|20;99", "date|Period End|date|-180;0"],
    statuses: ["Excellent", "Acceptable", "Poor", "Under Improvement"],
    measure: "rejected",
  },

  "rework-cost": {
    name: "Rework Cost Detail", kind: "analytics", summary: "Labour, material and energy per job",
    entity: "Rework Cost", ref: "RWC",
    fields: ["reworkOrder|Rework Order|enum|RWO-26-0412;RWO-26-0428;RWO-26-0441;RWO-26-0455;RWO-26-0470", ITEM, "labour|Labour|money|20;9000", "material|Material|money|10;7000", "energy|Energy|money|4;2400", "unitCost|Cost / 1000 pcs|float|2;180;USD;2", "date|Costed On|date|-150;0"],
    statuses: ["Draft", "Approved", "Posted", "Disputed"],
    measure: "labour",
  },

  "rework-schedule": {
    name: "Rework Schedule", kind: "calendar", summary: "When rework hits the line",
    entity: "Rework Slot", ref: "RSC",
    fields: [ITEM, "line|Line|enum|Rework Cell 1;Rework Cell 2;Plating Line A;Polishing Line;Assembly Line 2", "qty|Qty|int|500;40000;pcs", "hours|Hours Needed|float|1;24;hrs;1", OWNER, "date|Scheduled Date|date|-10;30"],
    statuses: ["Scheduled", "In Progress", "Completed", "Rescheduled", "Cancelled"],
    measure: "qty",
  },

  salvage: {
    name: "Salvage & Downgrade", kind: "list", summary: "Sold as second quality",
    entity: "Salvage Lot", ref: "SLV",
    fields: [ITEM, DEFECT, "qty|Qty|int|200;40000;pcs", "grade|Grade|enum|B-grade;C-grade;Sample stock;Local market", "recovery|Recovery Value|money|40;16000", "originalValue|Original Value|money|200;60000", "date|Downgraded On|date|-180;0"],
    statuses: ["Proposed", "Approved", "Sold", "Held", "Scrapped"],
    measure: "recovery",
  },

  "rejection-entry": {
    name: "Rejection Entry", kind: "form", summary: "Book a rejection from the floor",
    entity: "Rejection Entry", ref: "REN",
    fields: [ITEM, ORDER, STAGE, DEFECT, "qty|Rejected Qty|int|10;20000;pcs", "operator|Reported By|person", "date|Rejection Date|date|-6;0"],
    statuses: ["Draft", "Submitted", "Verified", "Posted", "Rejected"],
    measure: "qty",
  },

  "rejection-trend": {
    name: "Rejection Trend", kind: "analytics", summary: "Rate movement over time",
    entity: "Trend Point", ref: "RTD",
    fields: [STAGE, ITEM, "checked|Checked|int|10000;400000;pcs", "rejected|Rejected|int|50;30000;pcs", "rate|Rejection Rate|pct|0.2;9", "target|Target Rate|pct|0.5;3", "date|Period End|date|-240;0"],
    statuses: ["Below Target", "On Target", "Above Target", "Critical"],
    measure: "rejected",
  },

  "supplier-rejection": {
    name: "Supplier Rejections", kind: "list", summary: "Material returned to vendors",
    entity: "Supplier Rejection", ref: "SRJ",
    fields: ["supplier|Supplier|enum|@suppliers", "material|Material|enum|Brass Strip;Zinc Alloy;Steel Wire;Plating Chemical;Packing Carton", "qty|Rejected Qty|float|20;2400;kg;1", "value|Value|money|200;38000", DEFECT, "claim|Claim Raised|bool|Yes;No", "date|Rejected On|date|-180;0"],
    statuses: ["Raised", "Supplier Notified", "Debit Note Issued", "Replaced", "Settled"],
    measure: "value",
  },

  "buyer-returns": {
    name: "Buyer Returns", kind: "list", summary: "Goods returned after shipment",
    entity: "Return", ref: "BRT",
    fields: ["buyer|Buyer|enum|@buyers", ITEM, DEFECT, "qty|Returned Qty|int|200;60000;pcs", "claimValue|Claim Value|money|400;72000", "shipment|Shipment Ref|enum|SHP-26-0221;SHP-26-0238;SHP-26-0254;SHP-26-0271", "date|Returned On|date|-200;0"],
    statuses: ["Notified", "Received", "Under Assessment", "Credit Issued", "Rejected"],
    measure: "claimValue",
  },

  "rework-capacity": {
    name: "Rework Capacity", kind: "analytics", summary: "Load on the rework cells",
    entity: "Capacity Record", ref: "RCP",
    fields: ["cell|Rework Cell|enum|Rework Cell 1;Rework Cell 2;Plating Rework;Polishing Rework;Assembly Rework", "available|Available Hours|float|20;320;hrs;1", "booked|Booked Hours|float|4;340;hrs;1", "utilisation|Utilisation|pct|15;115", "backlog|Backlog Qty|int|0;80000;pcs", "date|Week Ending|date|-120;14"],
    statuses: ["Overloaded", "Optimal", "Underloaded", "Idle"],
    measure: "booked",
  },

  "rework-approval": {
    name: "Rework Approval", kind: "board", summary: "Sign-off before rework begins",
    entity: "Approval Request", ref: "RAP",
    fields: [ITEM, DEFECT, "qty|Qty|int|200;50000;pcs", "cost|Estimated Cost|money|60;22000", "requester|Requested By|person", "approver|Approver|person", "date|Requested On|date|-60;0"],
    statuses: ["Requested", "Under Review", "Approved", "Rejected", "Executed"],
    measure: "cost",
  },

  "scrap-conversion": {
    name: "Scrap Conversion", kind: "list", summary: "Rejects that became metal scrap",
    entity: "Conversion", ref: "SCV",
    fields: [ITEM, DEFECT, "qty|Pieces|int|200;60000;pcs", "weight|Metal Weight|float|2;900;kg;1", "recoveryValue|Scrap Value|money|20;9000", "yard|Scrap Yard|enum|Brass Yard;Zinc Yard;Steel Yard;Mixed Yard", "date|Converted On|date|-180;0"],
    statuses: ["Proposed", "Approved", "Transferred", "Sold"],
    measure: "weight",
  },

  "rework-yield": {
    name: "Rework Yield", kind: "analytics", summary: "How much rework actually saves",
    entity: "Yield Record", ref: "RYD",
    fields: [DEFECT, "attempts|Attempts|int|1;3", "input|Input Qty|int|200;50000;pcs", "output|Good Output|int|100;49000;pcs", "yield|Yield|pct|30;99", "costPerGood|Cost per Good Piece|float|0.01;0.9;USD;3", "date|Period End|date|-180;0"],
    statuses: ["Worth Reworking", "Marginal", "Not Economical", "Under Review"],
    measure: "input",
  },

  "rework-settings": {
    name: "Rework Controls", kind: "settings", summary: "Limits and approval thresholds",
    entity: "Control Rule", ref: "RSET",
    fields: ["rule|Rule|enum|Cap rework attempts;Require approval above cost;Auto-scrap below yield;Charge back to supplier;Block dispatch of reworked lots", "threshold|Threshold|pct|20;100", "owner|Rule Owner|person", "date|Effective From|date|-300;0", "casesAffected|Cases Affected|int|1;180"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Scrap automatically when expected rework yield falls below 40%", "Require QA approval for any third rework attempt"],
  },
};
