import type { ModuleSpecs } from "../types";

/** Module 61 — Sustainability, Risk & Audit Management. */

const SITE = "site|Site|enum|Unit 1 — Gazipur;Unit 2 — Savar;Unit 3 — Chattogram;Corporate HQ";
const OWNER = "owner|Owner|person";
const AUDITOR = "auditor|Auditor|person";
const FUNC = "function|Function|enum|Production;Plating;Quality;Warehouse;Procurement;Finance;HR;Maintenance;Logistics;IT";
const PERIOD = "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026;Q1 2026;Q2 2026;FY 2026";
const RISK = "risk|Risk|enum|Buyer concentration;Raw material price spike;Plating chemical restriction;Power supply failure;Critical machine breakdown;Skilled labour shortage;Currency devaluation;Cyber incident;Compliance audit failure;Fire and safety incident;Port congestion";
const PILLAR = "pillar|Pillar|enum|Environment;Social;Governance";

export const SUSTAINABILITY_RISK_AUDIT: ModuleSpecs = {
  "esg-dashboard": {
    name: "ESG Dashboard", kind: "overview", summary: "Environmental, social and governance pulse",
    entity: "ESG Metric", ref: "ESG",
    fields: [PILLAR, "metric|Metric|enum|Scope 1 emissions;Scope 2 emissions;Water withdrawal;Hazardous waste;Recycled content;Female workforce share;Training hours;Lost-time injuries;Supplier screening", SITE, "target|Target|float|10;1000;;1", "actual|Actual|float|6;1200;;1", "attainment|Attainment|pct|48;124", OWNER, "date|Reported On|date|-330;0"],
    statuses: ["On Track", "At Risk", "Behind Target", "Achieved"],
    measure: "attainment", rows: 46,
    insight: "Scope 2 emissions are 12% below the FY26 trajectory, but water intensity at Unit 2 has drifted above baseline for three consecutive months.",
  },

  "carbon-footprint": {
    name: "Carbon Footprint", kind: "analytics", summary: "Scope 1, 2 and 3 emissions",
    entity: "Emission Record", ref: "CO2",
    fields: ["scope|Scope|enum|Scope 1 — Direct;Scope 2 — Purchased energy;Scope 3 — Value chain", "source|Source|enum|Diesel generator;Grid electricity;Natural gas;Steam boiler;Company vehicles;Purchased materials;Inbound freight;Outbound freight;Employee commute", SITE, "tco2e|Emissions|float|2;1800;tCO2e;1", "intensity|Intensity|float|0.4;28;kg/1000 pcs;2", "reduction|Reduction vs Baseline|pct|0;38", PERIOD, "date|Period End|date|-360;0"],
    statuses: ["Verified", "Reported", "Under Review", "Estimated"],
    measure: "tco2e", rows: 48,
  },

  "water-footprint": {
    name: "Water Footprint", kind: "analytics", summary: "Withdrawal, discharge and reuse",
    entity: "Water Record", ref: "WTR",
    fields: ["stream|Stream|enum|Municipal supply;Deep tube well;Rainwater harvest;Process discharge;ETP treated outflow;Recycled reuse", SITE, "volume|Volume|float|20;9800;m³;1", "intensity|Litres / 1000 pcs|float|8;480;L;1", "recycled|Recycled Share|pct|4;62", "cod|COD|int|20;480;mg/L", "date|Reading Date|date|-330;0"],
    statuses: ["Within Limit", "Near Limit", "Above Limit", "Under Review"],
    measure: "volume",
  },

  "energy-intensity": {
    name: "Energy Intensity", kind: "analytics", summary: "Energy per thousand pieces",
    entity: "Energy Record", ref: "ENI",
    fields: ["source|Energy Source|enum|Grid electricity;Diesel generator;Gas generator;Solar rooftop;Steam boiler", SITE, "kwh|Consumption|float|400;98000;kWh;0", "output|Output|int|20000;980000;pcs", "intensity|kWh / 1000 pcs|float|1.2;24;kWh;2", "renewable|Renewable Share|pct|0;38", "cost|Energy Cost|money|1800;98000", "date|Period End|date|-330;0"],
    statuses: ["Within Baseline", "Improving", "Above Baseline", "Under Review"],
    measure: "kwh",
  },

  "waste-circularity": {
    name: "Waste & Circularity", kind: "analytics", summary: "Where every waste stream ends up",
    entity: "Waste Stream", ref: "WST",
    fields: ["stream|Waste Stream|enum|Metal scrap;Plating sludge;Packaging waste;Chemical containers;E-waste;Canteen organic;Mixed municipal", SITE, "quantity|Quantity|float|0.2;180;MT;2", "route|Disposal Route|enum|Recycled;Reused internally;Sold to recycler;Licensed incineration;Landfill;Hazardous treatment", "recovery|Recovery Rate|pct|10;98", "value|Recovery Value|money|0;42000", "date|Recorded On|date|-330;0"],
    statuses: ["Diverted from Landfill", "Recycled", "Pending Disposal", "Landfilled", "Non-Compliant"],
    measure: "quantity",
  },

  "sustainability-goals": {
    name: "Sustainability Goals", kind: "analytics", summary: "Target against actual progress",
    entity: "Goal", ref: "SGL",
    fields: ["goal|Goal|enum|Cut Scope 1 & 2 by 30% by 2030;50% renewable electricity;Zero waste to landfill;30% water recycling;100% supplier ESG screening;Gender parity in supervision;Eliminate single-use plastic packing", PILLAR, "baseline|Baseline|float|10;1000;;1", "target|Target|float|5;900;;1", "current|Current|float|5;1100;;1", "progress|Progress|pct|5;98", OWNER, "date|Target Date|date|60;1400"],
    statuses: ["On Track", "At Risk", "Behind", "Achieved", "Not Started"],
    measure: "progress",
  },

  "esg-reporting": {
    name: "ESG Disclosure Reports", kind: "list", summary: "Framework-wise submissions",
    entity: "Disclosure Report", ref: "ESR",
    fields: ["framework|Framework|enum|GRI Standards;SASB;CDP Climate;Higg FEM;ZDHC;UN Global Compact;EcoVadis;Buyer scorecard", "scope|Reporting Scope|enum|Group;Unit 1 — Gazipur;Unit 2 — Savar;Unit 3 — Chattogram", PERIOD, "indicators|Indicators Covered|int|12;240", "completeness|Completeness|pct|35;100", "score|Assessment Score|int|28;98", OWNER, "date|Submission Date|date|-300;90"],
    statuses: ["Draft", "In Review", "Submitted", "Assured", "Published"],
    measure: "score",
  },

  "supplier-esg": {
    name: "Supplier ESG", kind: "analytics", summary: "Value-chain footprint and screening",
    entity: "Supplier Assessment", ref: "SES",
    fields: ["supplier|Supplier|enum|@suppliers", "category|Category|enum|Metal raw material;Plating chemicals;Packaging;Tooling;Logistics;Subcontract finishing", "score|ESG Score|int|24;96", "environment|Environment|pct|30;98", "labour|Labour & Human Rights|pct|35;99", "riskLevel|Risk Level|enum|Low;Medium;High;Critical", "date|Assessed On|date|-420;0"],
    statuses: ["Approved", "Conditional", "Improvement Required", "Pending Assessment", "Suspended"],
    measure: "score",
  },

  "risk-register": {
    name: "Risk Register", kind: "list", summary: "Every identified enterprise risk",
    entity: "Risk", ref: "RSK",
    fields: [RISK, "category|Category|enum|Strategic;Operational;Financial;Compliance;Environmental;Technology;Reputational", FUNC, "likelihood|Likelihood|int|1;5", "impact|Impact|int|1;5", "score|Risk Score|int|1;25", "exposure|Financial Exposure|money|20000;4800000", OWNER, "date|Identified On|date|-540;0"],
    statuses: ["Open", "Being Treated", "Monitored", "Escalated", "Closed"],
    measure: "score", rows: 44,
    insight: "Buyer concentration remains the single highest residual risk — the top three buyers still account for 61% of confirmed order value.",
  },

  "risk-heatmap": {
    name: "Risk Heatmap", kind: "analytics", summary: "Likelihood against impact",
    entity: "Risk Position", ref: "RHM",
    fields: [RISK, "likelihood|Likelihood|int|1;5", "impact|Impact|int|1;5", "inherent|Inherent Score|int|4;25", "residual|Residual Score|int|1;20", "control|Control Effectiveness|pct|20;98", FUNC, "date|Assessed On|date|-300;0"],
    statuses: ["Low Zone", "Medium Zone", "High Zone", "Critical Zone"],
    measure: "residual",
  },

  "risk-assessment": {
    name: "Risk Assessment", kind: "form", summary: "Score a risk and record the rationale",
    entity: "Assessment", ref: "RAS",
    fields: [RISK, "method|Method|enum|Workshop;Interview;Self-assessment;Data-driven;External review", "likelihood|Likelihood|int|1;5", "impact|Impact|int|1;5", "residual|Residual Score|int|1;25", "appetite|Within Appetite|bool|Yes;No", "assessor|Assessed By|person", "date|Assessment Date|date|-200;30"],
    statuses: ["Draft", "Submitted", "Reviewed", "Approved", "Rejected"],
    measure: "residual",
  },

  mitigation: {
    name: "Mitigation Plans", kind: "board", summary: "Treatment actions in flight",
    entity: "Mitigation Action", ref: "MIT",
    fields: [RISK, "action|Action|enum|Dual-source the supply;Install backup generator;Take forward cover;Cross-train operators;Add condition monitoring;Tighten access controls;Top up insurance;Diversify the buyer base", FUNC, "cost|Action Cost|money|5000;980000", "reduction|Risk Reduction|pct|8;72", OWNER, "date|Target Date|date|-60;220"],
    statuses: ["Planned", "In Progress", "Completed", "Delayed", "Cancelled"],
    measure: "cost",
  },

  "incident-log": {
    name: "Risk Event Log", kind: "list", summary: "What actually went wrong",
    entity: "Risk Event", ref: "INC",
    fields: ["event|Event|enum|Power outage;Chemical spill;Machine breakdown;Near-miss injury;Data breach attempt;Shipment delay;Buyer escalation;Fire alarm activation;Effluent limit exceeded", "category|Category|enum|Operational;Safety;Environmental;Security;Commercial", SITE, "impactHrs|Impact Hours|float|0.2;72;hrs;1", "loss|Estimated Loss|money|0;480000", "severity|Severity|enum|Critical;Major;Moderate;Minor", OWNER, "date|Occurred On|date|-420;0"],
    statuses: ["Reported", "Under Investigation", "Root Cause Found", "Action Taken", "Closed"],
    measure: "loss",
  },

  "business-continuity": {
    name: "Business Continuity", kind: "list", summary: "Recovery plans and test status",
    entity: "Continuity Plan", ref: "BCP",
    fields: ["scenario|Scenario|enum|Total power failure;Plant fire;Flood;Pandemic absenteeism;Key supplier failure;IT system outage;Port closure", "process|Critical Process|enum|Order intake;Production;Plating;Despatch;Payroll;Procurement;Invoicing", "rto|Recovery Time Objective|int|2;168;hrs", "rpo|Recovery Point Objective|int|1;48;hrs", "readiness|Readiness|pct|28;98", OWNER, "date|Last Tested|date|-540;0"],
    statuses: ["Tested", "Approved", "Draft", "Overdue for Test", "Under Revision"],
    measure: "readiness",
  },

  "internal-audit": {
    name: "Internal Audit Programme", kind: "calendar", summary: "Audit calendar across the year",
    entity: "Audit", ref: "AUD",
    fields: ["audit|Audit|enum|Inventory count audit;Payroll process audit;Procurement audit;Plating process audit;Quality system audit;Fixed asset verification;IT general controls;Statutory compliance audit", FUNC, SITE, AUDITOR, "duration|Duration|int|1;12;days", "findings|Findings Raised|int|0;28", "date|Scheduled For|date|-120;150"],
    statuses: ["Planned", "Fieldwork", "Reporting", "Completed", "Deferred"],
    measure: "findings",
  },

  "audit-planning": {
    name: "Audit Planning", kind: "form", summary: "Risk-based annual plan",
    entity: "Audit Plan", ref: "APL",
    fields: ["cycle|Audit Cycle|enum|FY26 Annual Plan;H1 FY26;H2 FY26;Ad-hoc review;Follow-up audit", FUNC, "rating|Risk Rating|enum|High;Medium;Low", "mandays|Planned Mandays|int|2;60;days", "coverage|Coverage|pct|20;100", AUDITOR, "date|Plan Date|date|-200;60"],
    statuses: ["Draft", "Submitted", "Approved", "In Execution", "Closed"],
    measure: "mandays",
  },

  "audit-findings": {
    name: "Audit Findings", kind: "list", summary: "Observations and their status",
    entity: "Finding", ref: "AFN",
    fields: ["finding|Finding|enum|Stock variance not investigated;Purchase order raised after invoice;Access rights not revoked on exit;Calibration records missing;Chemical MSDS not displayed;Overtime approved retrospectively;Supplier evaluation not documented;Bank reconciliation delayed", FUNC, "rating|Rating|enum|Critical;Major;Moderate;Minor;Observation", "repeat|Repeat Finding|bool|Yes;No", "exposure|Value at Risk|money|0;980000", OWNER, "due|Due Date|date|-90;150", "date|Raised On|date|-360;0"],
    statuses: ["Open", "Response Awaited", "In Remediation", "Verified Closed", "Overdue"],
    measure: "exposure", rows: 46,
  },

  "corrective-actions": {
    name: "Corrective Actions", kind: "board", summary: "Closing out what audit found",
    entity: "Corrective Action", ref: "CAP",
    fields: ["finding|Linked Finding|enum|Stock variance not investigated;Access rights not revoked;Calibration records missing;Overtime approved retrospectively;Supplier evaluation not documented", FUNC, "action|Action|enum|Update the SOP;Retrain the team;Add a system control;Reconcile monthly;Introduce dual approval;Automate the check", OWNER, "progress|Progress|pct|0;100", "due|Due Date|date|-60;180", "date|Assigned On|date|-260;0"],
    statuses: ["Assigned", "In Progress", "Awaiting Verification", "Closed", "Overdue"],
    measure: "progress",
  },

  "audit-trail": {
    name: "System Audit Trail", kind: "list", summary: "Who changed what, and when",
    entity: "Audit Entry", ref: "TRL",
    fields: ["actor|User|person", "area|Module|enum|Sales Order;Purchase;Inventory;Production;Payroll;Finance;Master Data;Identity & Access", "action|Action|enum|Created;Updated;Deleted;Approved;Rejected;Exported;Signed in;Permission changed", "record|Record|enum|SO-26-1042;PO-26-0871;GRN-26-0455;WO-26-1063;INV-26-2211;EMP-1187", "changes|Fields Changed|int|0;18", "channel|Source|enum|Office LAN;VPN;Mobile app;Integration service;Shop-floor terminal", "date|Timestamp|date|-90;0"],
    statuses: ["Normal", "Sensitive Change", "Privileged Action", "Flagged for Review"],
    measure: "changes", rows: 52,
  },

  "governance-controls": {
    name: "Governance Controls", kind: "settings", summary: "Control library and test results",
    entity: "Control", ref: "GVC",
    fields: ["control|Control|enum|Segregation of duties on payments;Dual approval above threshold;Quarterly access review;Annual risk re-assessment;Mandatory ESG data sign-off;Supplier code of conduct acceptance", FUNC, "frequency|Test Frequency|enum|Monthly;Quarterly;Half-yearly;Annually;Continuous", "effectiveness|Effectiveness|pct|40;100", OWNER, "date|Last Tested|date|-400;0"],
    statuses: ["Effective", "Partially Effective", "Not Tested", "Ineffective"],
    measure: "effectiveness",
    settings: ["Escalate any critical audit finding to the board within 48 hours", "Freeze ESG figures once the disclosure period is signed off", "Require a mitigation plan before a risk can be marked as monitored"],
  },
};
