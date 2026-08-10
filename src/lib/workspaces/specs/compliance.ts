import type { ModuleSpecs } from "../types";

/** Module 54 — Compliance Management. */

const STANDARD = "standard|Standard|enum|ISO 9001;ISO 14001;ISO 45001;BSCI;Sedex SMETA;OEKO-TEX;WRAP;SA8000;ZDHC;Buyer code of conduct";
const AREA = "area|Area|enum|Labour practice;Health & safety;Environment;Business ethics;Chemical management;Wages & hours;Management system";
const BUYER = "buyer|Buyer|enum|@buyers";
const OWNER = "owner|Compliance Officer|person";
const SEVERITY = "severity|Severity|enum|Zero tolerance;Critical;Major;Minor;Observation";

export const COMPLIANCE: ModuleSpecs = {
  "compliance-dashboard": {
    name: "Compliance Dashboard", kind: "overview", summary: "Status across every standard",
    entity: "Compliance Metric", ref: "CMP",
    fields: [STANDARD, AREA, "score|Compliance Score|pct|48;100", "openFindings|Open Findings|int|0;18", "criticalOpen|Critical Open|int|0;6", "nextAuditDays|Next Audit In|int|-30;220;days", OWNER, "date|Last Assessed|date|-200;0"],
    statuses: ["Compliant", "Minor Gaps", "Major Gaps", "Non-Compliant"],
    measure: "score", rows: 44,
    insight: "Two zero-tolerance findings from the last SMETA audit remain open past their agreed closure date — escalate before the buyer follow-up.",
  },

  certifications: {
    name: "Certifications", kind: "list", summary: "Certificates held and their validity",
    entity: "Certification", ref: "CRT",
    fields: [STANDARD, "certBody|Certification Body|enum|SGS;Intertek;Bureau Veritas;TÜV;Control Union;Amfori", "certNo|Certificate No|enum|CERT-8841;CERT-8869;CERT-8887;CERT-8902;CERT-8917", "scope|Scope|enum|Whole factory;Plating unit;Assembly unit;Warehouse;Product range", "cost|Annual Cost|money|500;42000", OWNER, "date|Valid Until|date|-60;700"],
    statuses: ["Valid", "Expiring", "Expired", "Under Renewal", "Suspended"],
    measure: "cost",
  },

  "buyer-audits": {
    name: "Buyer Audits", kind: "calendar", summary: "Scheduled buyer and third-party visits",
    entity: "Audit", ref: "AUD",
    fields: [BUYER, STANDARD, "auditType|Audit Type|enum|Announced;Semi-announced;Unannounced;Follow-up;Desktop review", "auditor|Lead Auditor|person", "findings|Findings Raised|int|0;22", "score|Audit Score|pct|40;100", "date|Audit Date|date|-300;120"],
    statuses: ["Scheduled", "In Progress", "Report Awaited", "Closed", "Postponed"],
    measure: "score",
  },

  "audit-findings": {
    name: "Audit Findings", kind: "list", summary: "Non-compliances raised against us",
    entity: "Finding", ref: "FND",
    fields: [BUYER, STANDARD, AREA, "finding|Finding|enum|Excessive working hours;Missing PPE;Blocked fire exit;Incomplete records;Chemical labelling;Wage calculation error;Untrained operator", SEVERITY, "closureDays|Days to Close|int|-40;120;days", OWNER, "date|Due Date|date|-90;90"],
    statuses: ["Open", "Action Planned", "Under Verification", "Closed", "Overdue"],
    measure: "closureDays",
  },

  cap: {
    name: "Corrective Action Plans", kind: "board", summary: "CAP closure tracking",
    entity: "CAP Item", ref: "CAP",
    fields: [BUYER, AREA, "action|Corrective Action|enum|Policy update;Training programme;Infrastructure fix;Record system change;Process change;Third-party verification", SEVERITY, "cost|Implementation Cost|money|50;62000", OWNER, "date|Target Date|date|-60;120"],
    statuses: ["Raised", "Plan Submitted", "In Progress", "Evidence Submitted", "Verified", "Closed"],
    measure: "cost",
  },

  "social-compliance": {
    name: "Social Compliance", kind: "analytics", summary: "Labour standards performance",
    entity: "Social Metric", ref: "SOC",
    fields: ["metric|Metric|enum|Average weekly hours;Overtime share;Minimum wage compliance;Grievances resolved;Worker committee meetings;Training coverage;Turnover rate", "value|Value|pct|20;100", "target|Target|pct|60;100", "workers|Workers Covered|int|40;1800", "trend|Trend|enum|Improving;Stable;Deteriorating", "date|Period End|date|-300;0"],
    statuses: ["Compliant", "Watch", "Non-Compliant", "Under Review"],
    measure: "value",
  },

  environmental: {
    name: "Environmental Compliance", kind: "analytics", summary: "ETP, emissions and permits",
    entity: "Environmental Metric", ref: "ENV",
    fields: ["parameter|Parameter|enum|ETP outlet pH;COD;BOD;Total chromium;Stack emission;Noise level;Groundwater use", "value|Measured|float|0.2;480;;2", "limit|Regulatory Limit|float|1;500;;1", "compliance|Compliance|pct|40;100", "frequency|Test Frequency|enum|Daily;Weekly;Monthly;Quarterly", "date|Tested On|date|-200;0"],
    statuses: ["Within Limit", "Near Limit", "Exceeded", "Retested"],
    measure: "value",
  },

  "chemical-compliance": {
    name: "Chemical Compliance", kind: "list", summary: "REACH, RSL and ZDHC conformity",
    entity: "Chemical Compliance Record", ref: "CHC",
    fields: ["chemical|Chemical|enum|Nickel Sulphate;Chromic Acid;Copper Cyanide;Bright Acid Zinc;Passivation Salt;Anti-tarnish Lacquer", "framework|Framework|enum|REACH SVHC;ZDHC MRSL;Buyer RSL;CPSIA;Prop 65", "conformity|Conformity|pct|40;100", "evidence|Evidence|enum|Supplier declaration;Test report;MSDS;Third-party certificate;None", "riskLevel|Risk|enum|High;Medium;Low", "date|Verified On|date|-300;0"],
    statuses: ["Compliant", "Evidence Pending", "Non-Compliant", "Substituted"],
    measure: "conformity",
  },

  licenses: {
    name: "Licenses & Permits", kind: "list", summary: "Statutory approvals and validity",
    entity: "License", ref: "LIC",
    fields: ["license|License|enum|Factory licence;Fire licence;Trade licence;Environmental clearance;Boiler certificate;Bond licence;Generator permit;ETP consent", "authority|Authority|enum|DIFE;Fire Service;City Corporation;DOE;Boiler Inspectorate;Customs Bond", "licenseNo|License No|enum|LIC-2261;LIC-2287;LIC-2304;LIC-2338;LIC-2371", "renewalCost|Renewal Cost|money|50;18000", OWNER, "date|Valid Until|date|-60;600"],
    statuses: ["Valid", "Expiring", "Expired", "Under Renewal", "Suspended"],
    measure: "renewalCost",
  },

  "training-records": {
    name: "Compliance Training", kind: "list", summary: "Awareness and refresher coverage",
    entity: "Training Record", ref: "TRN",
    fields: ["course|Course|enum|Code of conduct;Fire safety;Chemical handling;Grievance mechanism;Harassment prevention;PPE usage;First aid", "department|Department|enum|Production;Plating;Assembly;Packing;Stores;Admin;Security", "attendees|Attendees|int|4;240", "coverage|Coverage|pct|20;100", "trainer|Trainer|person", "date|Conducted On|date|-300;30"],
    statuses: ["Completed", "Scheduled", "Refresher Due", "Overdue"],
    measure: "attendees",
  },

  grievance: {
    name: "Worker Grievance", kind: "list", summary: "Concerns raised and resolved",
    entity: "Grievance", ref: "GRV",
    fields: ["category|Category|enum|Wages;Working hours;Facilities;Supervisor behaviour;Safety;Leave;Other", "channel|Channel|enum|Suggestion box;Committee meeting;Helpline;Direct to HR;Anonymous", "resolutionDays|Days to Resolve|int|0;60;days", "department|Department|enum|Production;Plating;Assembly;Packing;Stores;Admin", OWNER, "date|Raised On|date|-240;0"],
    statuses: ["Received", "Under Review", "Action Taken", "Resolved", "Escalated"],
    measure: "resolutionDays",
  },

  "safety-incidents": {
    name: "Safety Incidents", kind: "list", summary: "Injuries, near misses and lost time",
    entity: "Incident", ref: "SAF",
    fields: [AREA, "incidentType|Incident|enum|Cut / laceration;Chemical splash;Slip and fall;Machine entanglement;Burn;Near miss;Electrical shock", SEVERITY, "lostDays|Lost Days|int|0;60;days", "worker|Affected Worker|person", "date|Occurred On|date|-360;0"],
    statuses: ["Reported", "Under Investigation", "Action Taken", "Closed", "Recurring"],
    measure: "lostDays",
  },

  "fire-safety": {
    name: "Fire Safety Drills", kind: "calendar", summary: "Evacuation drills and equipment checks",
    entity: "Drill", ref: "FIR",
    fields: ["activity|Activity|enum|Evacuation drill;Extinguisher inspection;Hydrant test;Alarm test;Fire fighter training;Emergency lighting check", "building|Building|enum|Plant 1;Plant 2;Warehouse;Chemical Store;Admin Block", "participants|Participants|int|10;900", "evacuationMin|Evacuation Time|float|1;14;min;1", OWNER, "date|Scheduled Date|date|-200;90"],
    statuses: ["Scheduled", "Completed", "Overdue", "Findings Open"],
    measure: "participants",
  },

  "working-hours": {
    name: "Working Hours Compliance", kind: "analytics", summary: "Hours and overtime against limits",
    entity: "Hours Record", ref: "WHR",
    fields: ["department|Department|enum|Production;Plating;Assembly;Packing;Stores;Maintenance", "avgWeeklyHrs|Average Weekly Hours|float|38;72;hrs;1", "limit|Legal Limit|float|48;60;hrs;0", "otShare|Overtime Share|pct|0;42", "workersOverLimit|Workers Over Limit|int|0;90", "restDayCompliance|Rest Day Compliance|pct|60;100", "date|Week Ending|date|-300;0"],
    statuses: ["Compliant", "Watch", "Breach", "Under Review"],
    measure: "avgWeeklyHrs",
  },

  "wage-compliance": {
    name: "Wage Compliance", kind: "analytics", summary: "Payment against statutory minimums",
    entity: "Wage Record", ref: "WGC",
    fields: ["grade|Grade|enum|Helper;Operator;Senior Operator;Technician;Supervisor", "minimumWage|Statutory Minimum|money|80;320", "paidWage|Average Paid|money|80;520", "compliance|Compliance|pct|90;140", "workers|Workers|int|10;600", "otRateCompliance|OT Rate Compliance|pct|80;100", "date|Period End|date|-300;0"],
    statuses: ["Compliant", "At Minimum", "Below Minimum", "Under Review"],
    measure: "paidWage",
  },

  "supplier-compliance": {
    name: "Supplier Compliance", kind: "list", summary: "Value-chain conformance",
    entity: "Supplier Assessment", ref: "SPC",
    fields: ["supplier|Supplier|enum|@suppliers", STANDARD, "score|Assessment Score|pct|35;100", "findings|Open Findings|int|0;14", "lastAuditDays|Last Audited|int|10;700;days", "riskLevel|Risk|enum|High;Medium;Low", "date|Next Audit Due|date|-90;400"],
    statuses: ["Approved", "Conditional", "Under Development", "Suspended", "Not Assessed"],
    measure: "score",
  },

  "policy-register": {
    name: "Policy Register", kind: "list", summary: "Published policies and their reviews",
    entity: "Policy", ref: "POL",
    fields: ["policy|Policy|enum|Code of conduct;Child labour policy;Anti-harassment policy;Environmental policy;Health & safety policy;Anti-bribery policy;Grievance policy", "version|Version|enum|v1.0;v1.1;v2.0;v2.1;v3.0", "approvedBy|Approved By|person", "reviewMonths|Review Cycle|int|12;36;months", "acknowledged|Worker Acknowledgement|pct|30;100", "date|Next Review|date|-90;500"],
    statuses: ["Published", "Under Review", "Draft", "Superseded"],
    measure: "acknowledged",
  },

  "code-of-conduct": {
    name: "Code of Conduct Tracking", kind: "list", summary: "Buyer codes signed and monitored",
    entity: "Code Commitment", ref: "COC",
    fields: [BUYER, "codeVersion|Code Version|enum|2023 edition;2024 edition;2025 edition;2026 edition", "signedBy|Signed By|person", "requirements|Requirements|int|20;180", "metRequirements|Requirements Met|int|10;180", "conformity|Conformity|pct|40;100", "date|Signed On|date|-700;0"],
    statuses: ["Signed", "Under Assessment", "Gaps Identified", "Fully Conformant"],
    measure: "conformity",
  },

  "compliance-report": {
    name: "Compliance Report", kind: "form", summary: "Prepare a report for a buyer or body",
    entity: "Compliance Report", ref: "CRP",
    fields: [BUYER, STANDARD, "reportType|Report Type|enum|Self-assessment;CAP progress;Annual declaration;Incident report;Sustainability update", "period|Period|enum|Q1 FY26;Q2 FY26;Q3 FY26;Q4 FY26;FY26", "score|Reported Score|pct|40;100", OWNER, "date|Submission Date|date|-90;40"],
    statuses: ["Draft", "Under Review", "Submitted", "Accepted", "Returned"],
    measure: "score",
  },

  "compliance-settings": {
    name: "Compliance Controls", kind: "settings", summary: "Alerts, escalation and evidence rules",
    entity: "Control Rule", ref: "CSET",
    fields: ["rule|Rule|enum|Alert before licence expiry;Escalate zero-tolerance findings;Mandatory evidence upload;Block overtime beyond limit;Auto-schedule refresher training", "leadDays|Alert Lead|int|7;120;days", OWNER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Alert 60 days before any statutory licence expires", "Escalate zero-tolerance findings to the managing director immediately"],
  },
};
