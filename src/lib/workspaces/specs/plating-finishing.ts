import type { ModuleSpecs } from "../types";

/** Module 35 — Plating & Surface Finishing Management. */

const ITEM = "item|Item|enum|@items";
const LINE = "line|Plating Line|enum|Barrel Line A;Barrel Line B;Rack Line 1;Rack Line 2;Gold Line;Antique Line";
const FINISH = "finish|Finish|enum|Nickel Free;Antique Brass;Shiny Gold;Matte Black;Gunmetal;Rose Gold;Brushed Silver;Antique Copper";
const OPERATOR = "operator|Line Operator|person";
const ORDER = "order|Work Order|enum|WO-26-1042;WO-26-1051;WO-26-1063;WO-26-1078;WO-26-1090;WO-26-1104";

export const PLATING_FINISHING: ModuleSpecs = {
  "plating-lines": {
    name: "Plating Lines", kind: "overview", summary: "Line-by-line live status",
    entity: "Line Status", ref: "PLS",
    fields: [LINE, FINISH, "loadQty|Current Load|int|4000;120000;pcs", "throughput|Throughput / hr|int|1200;18000;pcs", "utilisation|Utilisation|pct|42;98", OPERATOR, "shift|Shift|enum|A (06–14);B (14–22);C (22–06)", "date|As On|date|-8;0"],
    statuses: ["Running", "Loading", "Idle", "Bath Maintenance", "Breakdown"],
    measure: "loadQty", rows: 44,
    insight: "Rack Line 2 is running 18% below its rated throughput — thickness rework is consuming the recovered capacity.",
  },

  "bath-parameters": {
    name: "Bath Parameters", kind: "analytics", summary: "pH, temperature and current density",
    entity: "Parameter Reading", ref: "BPR",
    fields: [LINE, "parameter|Parameter|enum|pH;Temperature;Current density;Metal concentration;Brightener;Agitation", "reading|Reading|float|0.5;68;units;2", "min|Lower Limit|float|0.4;40;units;2", "max|Upper Limit|float|1;72;units;2", "analyst|Checked By|person", "date|Checked On|date|-25;0"],
    statuses: ["In Control", "Warning Band", "Out of Control", "Corrected"],
    measure: "reading",
  },

  "thickness-control": {
    name: "Thickness Control", kind: "analytics", summary: "Micron deposit against specification",
    entity: "Thickness Reading", ref: "THK",
    fields: [ITEM, FINISH, LINE, "measured|Measured|float|0.2;18;µm;2", "specMin|Spec Min|float|0.2;12;µm;2", "specMax|Spec Max|float|1;22;µm;2", "cpk|Cpk|float|0.4;2.4;;2", "date|Measured On|date|-40;0"],
    statuses: ["Within Spec", "Marginal", "Below Spec", "Above Spec"],
    measure: "measured",
  },

  "finish-master": {
    name: "Finish Master", kind: "list", summary: "Every approved finish recipe",
    entity: "Finish", ref: "FIN",
    fields: [FINISH, "base|Base Metal|enum|Brass;Zinc Alloy;Steel;Copper;Aluminium", "layers|Layer Stack|enum|Cu-Ni-Cr;Ni only;Cu-Ni-Au;Ni-Black;Cu-Antique;Ni-Rose", "targetUm|Target Thickness|float|0.5;16;µm;2", "cyclesMin|Cycle Time|int|18;180;min", "cost|Cost / 1000 pcs|money|4;180", "owner|Process Owner|person", "date|Approved On|date|-500;0"],
    statuses: ["Active", "Trial", "Restricted", "Withdrawn"],
  },

  "plating-orders": {
    name: "Plating Job Orders", kind: "list", summary: "Batches queued for the lines",
    entity: "Plating Job", ref: "PJO",
    fields: [ORDER, ITEM, FINISH, LINE, "qty|Job Qty|int|3000;140000;pcs", "loadedQty|Loaded|int|0;140000;pcs", "progress|Progress|pct|0;100", "due|Required By|date|-10;30"],
    statuses: ["Queued", "Loaded", "Plating", "Unloaded", "Completed", "On Hold"],
    measure: "qty",
  },

  rectification: {
    name: "Re-plating & Rectification", kind: "list", summary: "Rework loops through the bath",
    entity: "Rework Lot", ref: "RPL",
    fields: [ITEM, FINISH, LINE, "qty|Rework Qty|int|500;40000;pcs", "reason|Reason|enum|Thin deposit;Stain;Blister;Colour mismatch;Burnt edge;Poor adhesion", "attempt|Attempt|enum|1st rework;2nd rework;Final attempt", "cost|Rework Cost|money|40;9000", "date|Raised On|date|-45;0"],
    statuses: ["Raised", "Stripping", "Re-plating", "Passed", "Scrapped"],
    measure: "qty",
  },

  "salt-spray": {
    name: "Salt Spray Results", kind: "analytics", summary: "Corrosion resistance hours achieved",
    entity: "Salt Spray Test", ref: "SST",
    fields: [ITEM, FINISH, "hours|Hours Survived|int|8;480;hrs", "required|Required Hours|int|24;240;hrs", "rating|Rating|enum|Grade 10;Grade 9;Grade 8;Grade 7;Below Grade 7", "analyst|Analyst|person", "date|Tested On|date|-150;0"],
    statuses: ["Pass", "Marginal Pass", "Fail", "Retest"],
    measure: "hours",
  },

  "color-matching": {
    name: "Colour Matching", kind: "analytics", summary: "Delta-E against the master swatch",
    entity: "Colour Reading", ref: "CMR",
    fields: [ITEM, FINISH, "deltaE|Delta-E|float|0.1;4.8;;2", "tolerance|Tolerance|float|0.5;2.5;;2", "lightSource|Light Source|enum|D65;TL84;CWF;UV;Horizon", "inspector|Inspector|person", "date|Assessed On|date|-90;0"],
    statuses: ["Match", "Acceptable", "Off-shade", "Rejected"],
    measure: "deltaE",
  },

  "anode-consumption": {
    name: "Anode Consumption", kind: "analytics", summary: "Metal drawn from the anodes",
    entity: "Anode Record", ref: "ANC",
    fields: [LINE, "anode|Anode Type|enum|Nickel round;Nickel S-round;Copper bar;Zinc plate;Gold anode;Titanium basket", "consumed|Consumed|float|1;180;kg;2", "output|Output Plated|int|20000;900000;pcs", "rate|Rate / 1000 pcs|float|0.01;1.8;kg;3", "cost|Cost|money|100;38000", "date|Period|date|-120;0"],
    statuses: ["Within Norm", "High Usage", "Under Review", "Optimised"],
    measure: "consumed",
  },

  "line-efficiency": {
    name: "Line Efficiency", kind: "analytics", summary: "Throughput per line and shift",
    entity: "Efficiency Record", ref: "LEF",
    fields: [LINE, "loads|Loads Run|int|4;42", "output|Output|int|20000;800000;pcs", "rejectPct|Reject|pct|0.4;9", "efficiency|Efficiency|pct|48;99", "downHrs|Downtime|float|0;12;hrs;1", "date|Shift Date|date|-45;0"],
    statuses: ["Above Target", "On Target", "Below Target", "Line Stopped"],
    measure: "output",
  },

  "rack-loading": {
    name: "Rack & Barrel Loading", kind: "list", summary: "How each load is packed",
    entity: "Load", ref: "RLD",
    fields: [LINE, ITEM, "carrier|Carrier|enum|Rack R-01;Rack R-02;Rack R-03;Barrel B-01;Barrel B-02;Barrel B-03", "pieces|Pieces Loaded|int|800;24000;pcs", "capacity|Carrier Capacity|int|1000;26000;pcs", "fill|Fill Rate|pct|35;99", OPERATOR, "date|Loaded On|date|-25;0"],
    statuses: ["Loaded", "In Bath", "Unloaded", "Aborted"],
    measure: "pieces",
  },

  "plating-schedule": {
    name: "Plating Schedule", kind: "calendar", summary: "Line-wise plan for the week",
    entity: "Scheduled Load", ref: "PSC",
    fields: [LINE, ITEM, FINISH, "qty|Planned Qty|int|4000;120000;pcs", "runHrs|Run Hours|float|1;18;hrs;1", "sequence|Sequence|enum|Slot 1;Slot 2;Slot 3;Slot 4;Slot 5", "date|Scheduled Date|date|-8;28"],
    statuses: ["Scheduled", "Confirmed", "Running", "Completed", "Rescheduled"],
    measure: "qty",
  },

  "bath-dosing": {
    name: "Bath Dosing", kind: "list", summary: "Chemical additions to each line",
    entity: "Dosing Entry", ref: "BDS",
    fields: [LINE, "chemical|Chemical|enum|Nickel Sulphate;Brightener A;Brightener B;Boric Acid;Wetting Agent;pH Adjuster", "qty|Dosed|float|0.2;40;kg;2", "before|Before|float|0.5;60;units;2", "after|After|float|0.5;64;units;2", OPERATOR, "date|Dosed On|date|-30;0"],
    statuses: ["Logged", "Verified", "Correction", "Rejected"],
    measure: "qty",
  },

  "barrel-cycles": {
    name: "Barrel Cycle Log", kind: "list", summary: "Cycle time and rotation per barrel",
    entity: "Barrel Cycle", ref: "BCY",
    fields: ["barrel|Barrel|enum|Barrel B-01;Barrel B-02;Barrel B-03;Barrel B-04;Barrel B-05", LINE, "cycleMin|Cycle Time|int|20;150;min", "rpm|Rotation|float|4;18;rpm;1", "qty|Pieces|int|2000;30000;pcs", "current|Current|float|20;900;A;0", "date|Run Date|date|-30;0"],
    statuses: ["Normal", "Extended", "Aborted", "Under Study"],
    measure: "qty",
  },

  "plating-defects": {
    name: "Plating Defects", kind: "list", summary: "Defect capture from the line",
    entity: "Defect Record", ref: "PDF",
    fields: [ITEM, FINISH, LINE, "defect|Defect|enum|Pitting;Blister;Stain;Burnt deposit;Thin coating;Peeling;Dull patch;Water mark", "qty|Affected Qty|int|100;30000;pcs", "defectRate|Defect Rate|pct|0.2;12", "inspector|Inspector|person", "date|Found On|date|-50;0"],
    statuses: ["Open", "Under Analysis", "Corrective Action", "Closed"],
    measure: "qty",
  },

  "rework-queue": {
    name: "Rework Queue", kind: "board", summary: "Lots waiting for a second pass",
    entity: "Queue Lot", ref: "RWQ",
    fields: [ITEM, FINISH, LINE, "qty|Qty|int|500;40000;pcs", "priority|Priority|enum|Urgent;High;Normal", "ageDays|Waiting|int|0;22;days", OPERATOR],
    statuses: ["Awaiting Strip", "Stripping", "Re-plating", "Inspection", "Released"],
    measure: "qty",
  },

  "plating-cost": {
    name: "Plating Cost", kind: "analytics", summary: "Cost build-up per 1000 pieces",
    entity: "Cost Line", ref: "PCS",
    fields: [FINISH, LINE, "chemicals|Chemical Cost|money|40;9000", "energy|Energy Cost|money|20;6000", "labour|Labour Cost|money|20;5200", "unitCost|Cost / 1000 pcs|float|1.2;38;USD;2", "date|Period End|date|-180;0"],
    statuses: ["Within Standard", "Above Standard", "Under Review", "Approved"],
    measure: "chemicals",
  },

  "drag-out": {
    name: "Drag-out & Rinse Loss", kind: "analytics", summary: "Metal lost to rinse water",
    entity: "Drag-out Reading", ref: "DRG",
    fields: [LINE, "metal|Metal|enum|Nickel;Copper;Zinc;Gold;Chromium", "lossKg|Metal Lost|float|0.05;12;kg;3", "rinseVol|Rinse Volume|float|2;90;m³;1", "recovery|Recovery|pct|20;92", "cost|Value Lost|money|20;7200", "date|Measured On|date|-120;0"],
    statuses: ["Controlled", "Elevated", "High Loss", "Recovery Installed"],
    measure: "lossKg",
  },

  "sample-approval": {
    name: "Finish Sample Approval", kind: "list", summary: "Buyer sign-off on finish standards",
    entity: "Finish Sample", ref: "FSA",
    fields: [ITEM, FINISH, "buyer|Buyer|enum|@buyers", "round|Submission Round|enum|1st;2nd;3rd;Final", "submitted|Pieces Submitted|int|3;40;pcs", "merchandiser|Merchandiser|person", "date|Submitted On|date|-120;10"],
    statuses: ["Submitted", "Under Review", "Approved", "Rejected", "Approved with Comment"],
    measure: "submitted",
  },

  "plating-settings": {
    name: "Plating Controls", kind: "settings", summary: "Process limits and interlocks",
    entity: "Control Rule", ref: "PSET",
    fields: [LINE, "rule|Rule|enum|Block load on out-of-control bath;Mandatory thickness check;Auto-hold on Delta-E breach;Limit rework attempts;Require operator sign-off", "threshold|Threshold|pct|60;100", "owner|Rule Owner|person", "date|Effective From|date|-200;0", "linesCovered|Lines Covered|int|1;6"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Hold the load when a bath parameter is out of control", "Cap re-plating at two attempts before scrapping"],
  },
};
