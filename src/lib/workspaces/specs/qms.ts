import type { ModuleSpecs } from "../types";

/** Module 37 — Quality Management System (QMS). */

const ITEM = "item|Item|enum|@items";
const BUYER = "buyer|Buyer|enum|@buyers";
const SUPPLIER = "supplier|Supplier|enum|@suppliers";
const INSPECTOR = "inspector|Inspector|person";
const DEFECT = "defect|Defect|enum|Plating stain;Dimension out of tolerance;Burr;Colour mismatch;Deformation;Loose assembly;Sharp edge;Logo misprint;Rust spot;Contamination";
const STAGE = "stage|Inspection Stage|enum|Incoming;In-process;Pre-final;Final;Loading";

export const QMS: ModuleSpecs = {
  "quality-dashboard": {
    name: "Quality Dashboard", kind: "overview", summary: "Live quality pulse across the plant",
    entity: "Quality Metric", ref: "QDB",
    fields: [STAGE, ITEM, "checked|Checked Qty|int|4000;200000;pcs", "defects|Defects Found|int|10;9000;pcs", "defectRate|Defect Rate|pct|0.2;9", "firstPass|First Pass Yield|pct|82;99.5", INSPECTOR, "date|Reading Date|date|-30;0"],
    statuses: ["On Target", "Watch", "Below Target", "Critical"],
    measure: "checked", rows: 44,
  },

  "inspection-plans": {
    name: "Inspection Plans", kind: "list", summary: "What gets checked, when and how",
    entity: "Inspection Plan", ref: "IPL",
    fields: [ITEM, STAGE, "characteristic|Characteristic|enum|Diameter;Thickness;Plating adhesion;Colour;Pull strength;Surface finish;Logo clarity", "method|Method|enum|Visual;Vernier;Micrometer;Go/No-go gauge;Pull tester;Colour box", "frequency|Frequency|enum|Every piece;Every carton;Hourly;Per lot;Per shift", "sample|Sample Size|int|3;125;pcs", "owner|Plan Owner|person", "date|Effective From|date|-400;0"],
    statuses: ["Active", "Under Revision", "Draft", "Withdrawn"],
  },

  "incoming-qc": {
    name: "Incoming QC", kind: "list", summary: "Supplier material inspection",
    entity: "Incoming Inspection", ref: "IQC",
    fields: [SUPPLIER, "material|Material|enum|Brass Strip 0.8mm;Brass Strip 1.2mm;Zinc Alloy Ingot;Steel Wire 2.0mm;Packing Carton;Poly Bag", "lotQty|Lot Qty|float|100;9000;kg;0", "sample|Sample Size|int|5;125;pcs", "defects|Defects|int|0;22;pcs", "acceptance|Acceptance|pct|72;100", INSPECTOR, "date|Inspected On|date|-70;0"],
    statuses: ["Accepted", "Accepted with Deviation", "Under Test", "Rejected", "Returned"],
    measure: "lotQty",
  },

  "in-process-qc": {
    name: "In-Process QC", kind: "list", summary: "Checks made on the running line",
    entity: "Line Check", ref: "IPQ",
    fields: [ITEM, "line|Line|enum|Press Line 1;Press Line 2;Polishing Line;Plating Line A;Assembly Line 1", "checked|Checked Qty|int|20;2000;pcs", DEFECT, "defects|Defects|int|0;120;pcs", "defectRate|Defect Rate|pct|0;14", INSPECTOR, "date|Checked On|date|-40;0"],
    statuses: ["Pass", "Warning", "Line Stopped", "Corrected"],
    measure: "checked",
  },

  "final-qc": {
    name: "Final QC", kind: "list", summary: "Pre-shipment inspection results",
    entity: "Final Inspection", ref: "FQC",
    fields: [BUYER, ITEM, "orderQty|Order Qty|int|20000;480000;pcs", "sample|Sample Size|int|50;500;pcs", "major|Major Defects|int|0;18;pcs", "minor|Minor Defects|int|0;40;pcs", INSPECTOR, "date|Inspected On|date|-60;12"],
    statuses: ["Passed", "Passed with Comment", "Re-inspection", "Failed", "Pending"],
    measure: "orderQty",
  },

  aql: {
    name: "AQL Sampling", kind: "settings", summary: "Sampling plans by lot size",
    entity: "Sampling Plan", ref: "AQL",
    fields: ["lotRange|Lot Size Range|enum|151–280;281–500;501–1200;1201–3200;3201–10000;10001–35000", "level|Inspection Level|enum|General I;General II;General III;Special S-1;Special S-4", "aqlMajor|AQL Major|float|0.4;4;;1", "aqlMinor|AQL Minor|float|1;10;;1", "sample|Sample Size|int|20;500;pcs", "accept|Accept On|int|0;21;defects", "date|Revised On|date|-500;0"],
    statuses: ["Active", "Draft", "Superseded"],
    settings: ["Apply tightened inspection after two consecutive failures", "Require QA manager approval to waive an AQL failure"],
  },

  ncr: {
    name: "Non-Conformance (NCR)", kind: "list", summary: "Raised non-conformities",
    entity: "NCR", ref: "NCR",
    fields: [ITEM, STAGE, DEFECT, "qty|Affected Qty|int|100;120000;pcs", "cost|Cost Impact|money|200;56000", "severity|Severity|enum|Critical;Major;Minor", "raisedBy|Raised By|person", "date|Raised On|date|-120;0"],
    statuses: ["Open", "Under Investigation", "Action Assigned", "Verified", "Closed"],
    measure: "cost",
  },

  capa: {
    name: "CAPA Management", kind: "board", summary: "Corrective and preventive actions",
    entity: "CAPA", ref: "CAP",
    fields: ["source|Source|enum|Internal NCR;Buyer complaint;Audit finding;Trend analysis;Supplier issue", "area|Area|enum|Stamping;Plating;Assembly;Packing;Store;Purchase", "action|Action|enum|Process change;Tooling repair;Training;Supplier change;Inspection tightening;Design change", "owner|Action Owner|person", "effectiveness|Effectiveness|pct|0;100", "due|Target Date|date|-40;60"],
    statuses: ["Raised", "Root Cause", "Action Planned", "Implemented", "Verified", "Closed"],
    measure: "effectiveness",
  },

  spc: {
    name: "SPC Control Charts", kind: "analytics", summary: "Process capability and control",
    entity: "SPC Reading", ref: "SPC",
    fields: [ITEM, "characteristic|Characteristic|enum|Diameter;Thickness;Height;Hole position;Plating micron;Weight", "mean|Mean|float|0.4;24;mm;3", "sigma|Std Deviation|float|0.001;0.9;mm;3", "cp|Cp|float|0.4;2.6;;2", "cpk|Cpk|float|0.3;2.4;;2", "date|Measured On|date|-90;0"],
    statuses: ["Capable", "Marginal", "Not Capable", "Out of Control"],
    measure: "cpk",
  },

  "defect-pareto": {
    name: "Defect Pareto", kind: "analytics", summary: "The vital few defect drivers",
    entity: "Defect Group", ref: "PAR",
    fields: [DEFECT, "area|Area|enum|Stamping;Polishing;Plating;Assembly;Packing", "count|Occurrences|int|10;4200", "qty|Pieces Affected|int|200;180000;pcs", "share|Share of Total|pct|1;38", "cost|Cost of Defect|money|100;42000", "date|Period End|date|-180;0"],
    statuses: ["Top Driver", "Significant", "Minor", "Eliminated"],
    measure: "qty",
  },

  "internal-audit": {
    name: "Internal Audits", kind: "calendar", summary: "The annual audit programme",
    entity: "Audit", ref: "IAD",
    fields: ["area|Audit Area|enum|Stamping;Plating;Assembly;Store;Purchase;Maintenance;HR;Documentation", "type|Audit Type|enum|Process audit;System audit;Product audit;5S audit;Follow-up audit", "auditor|Lead Auditor|person", "findings|Findings|int|0;14", "score|Audit Score|pct|55;100", "date|Audit Date|date|-180;90"],
    statuses: ["Planned", "In Progress", "Report Issued", "Closed", "Postponed"],
    measure: "score",
  },

  "quality-docs": {
    name: "Quality Documents", kind: "list", summary: "Manuals, SOPs and formats",
    entity: "Quality Document", ref: "QDC",
    fields: ["docType|Document Type|enum|Quality manual;Procedure;Work instruction;Format;Standard;Policy", "title|Title|enum|Incoming inspection procedure;Plating process control;Non-conformance handling;Calibration procedure;Customer complaint handling;Internal audit procedure", "revision|Revision|enum|Rev 0;Rev 1;Rev 2;Rev 3;Rev 4", "owner|Document Owner|person", "reviewMonths|Review Cycle|int|12;36;months", "date|Next Review|date|-60;500"],
    statuses: ["Released", "Under Review", "Draft", "Obsolete"],
  },

  "supplier-quality": {
    name: "Supplier Quality", kind: "analytics", summary: "Defect PPM by supplier",
    entity: "Supplier Quality Record", ref: "SQR",
    fields: [SUPPLIER, "material|Material|enum|Brass Strip;Zinc Alloy;Steel Wire;Plating Chemical;Packing Material", "received|Received Lots|int|2;120", "rejected|Rejected Lots|int|0;18", "ppm|Defect PPM|int|120;48000;ppm", "rating|Quality Rating|pct|48;99", "date|Period End|date|-240;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Under Development", "Blocked"],
    measure: "ppm",
  },

  "inspection-schedule": {
    name: "Inspection Schedule", kind: "calendar", summary: "Who inspects what and when",
    entity: "Inspection Slot", ref: "ISC",
    fields: [BUYER, ITEM, STAGE, INSPECTOR, "qty|Lot Qty|int|10000;400000;pcs", "durationHrs|Duration|float|1;16;hrs;1", "date|Scheduled Date|date|-12;35"],
    statuses: ["Scheduled", "Confirmed", "In Progress", "Completed", "Rescheduled"],
    measure: "qty",
  },

  "customer-complaints": {
    name: "Customer Complaints", kind: "list", summary: "Quality issues raised by buyers",
    entity: "Complaint", ref: "CMP",
    fields: [BUYER, ITEM, DEFECT, "qty|Claimed Qty|int|200;90000;pcs", "claimValue|Claim Value|money|400;78000", "severity|Severity|enum|Critical;Major;Minor", "owner|Handled By|person", "date|Received On|date|-200;0"],
    statuses: ["Received", "Under Investigation", "Response Sent", "Settled", "Rejected"],
    measure: "claimValue",
  },

  "first-article": {
    name: "First Article Inspection", kind: "list", summary: "First-off approval before bulk",
    entity: "FAI Record", ref: "FAI",
    fields: [ITEM, BUYER, "order|Work Order|enum|WO-26-1042;WO-26-1051;WO-26-1063;WO-26-1078;WO-26-1090", "checked|Characteristics Checked|int|4;28", "deviations|Deviations|int|0;6", INSPECTOR, "date|Inspected On|date|-90;10"],
    statuses: ["Pending", "Approved", "Conditional Approval", "Rejected"],
    measure: "checked",
  },

  "quality-cost": {
    name: "Cost of Quality", kind: "analytics", summary: "Prevention, appraisal and failure",
    entity: "Quality Cost", ref: "COQ",
    fields: ["category|Category|enum|Prevention;Appraisal;Internal failure;External failure", "area|Area|enum|Stamping;Plating;Assembly;Packing;Supplier;Customer", "amount|Amount|money|400;96000", "shareOfSales|Share of Sales|pct|0.2;6", "trend|vs Last Period|pct|72;134", "date|Period End|date|-240;0"],
    statuses: ["Improving", "Stable", "Rising", "Under Review"],
    measure: "amount",
  },

  "gauge-rr": {
    name: "Gauge R&R", kind: "analytics", summary: "Measurement system capability",
    entity: "Gauge Study", ref: "GRR",
    fields: ["gauge|Gauge|enum|Digital vernier;Micrometer;Thickness gauge;Pull tester;Colour spectrophotometer;Weighing scale", "characteristic|Characteristic|enum|Diameter;Thickness;Weight;Force;Colour", "rrPct|GR&R|pct|2;38", "ndc|Distinct Categories|int|1;12", "appraisers|Appraisers|int|2;4", "analyst|Study By|person", "date|Study Date|date|-300;0"],
    statuses: ["Acceptable", "Marginal", "Unacceptable", "Repeat Study"],
    measure: "rrPct",
  },

  "quality-alerts": {
    name: "Quality Alerts", kind: "list", summary: "Trend breaches raised automatically",
    entity: "Quality Alert", ref: "QAL",
    fields: ["alert|Alert|enum|Defect rate above threshold;Cpk below 1.33;Repeat defect;Supplier PPM spike;AQL failure;Overdue CAPA", "area|Area|enum|Stamping;Polishing;Plating;Assembly;Packing;Supplier", "severity|Severity|enum|Critical;High;Medium;Low", "impactedQty|Impacted Qty|int|500;140000;pcs", "owner|Owner|person", "date|Raised On|date|-45;0"],
    statuses: ["New", "Acknowledged", "In Progress", "Resolved", "Suppressed"],
    measure: "impactedQty",
  },

  "qms-settings": {
    name: "QMS Configuration", kind: "settings", summary: "Escalation and control rules",
    entity: "Control Rule", ref: "QSET",
    fields: ["rule|Rule|enum|Auto-raise NCR above defect threshold;Escalate overdue CAPA;Block dispatch on failed final QC;Mandatory FAI before bulk;Tighten AQL after failure", "threshold|Threshold|pct|60;100", "owner|Rule Owner|person", "date|Effective From|date|-300;0", "documentsAffected|Documents Affected|int|4;480"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Block dispatch when final QC has failed", "Escalate a CAPA to the plant head when it passes its due date"],
  },
};
