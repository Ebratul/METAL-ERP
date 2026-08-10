import type { ModuleSpecs } from "../types";

/** Module 68 — Contract Management. */

const COUNTERPARTY = "counterparty|Counterparty|enum|H&M Global Sourcing;Inditex / Zara;Levi Strauss & Co.;Zhejiang Metal Works;Dhaka Brass Industries;Nippon Plating Chemicals;Chattogram Packaging Ltd.;Speedline Logistics;Rancon Service Centre";
const CONTRACT_TYPE = "contractType|Contract Type|enum|Supply agreement;Purchase agreement;Service agreement;Lease;Non-disclosure;Agency;Subcontract;Maintenance";
const OWNER = "owner|Contract Owner|person";
const DEPT = "department|Department|enum|Commercial;Procurement;Legal;Finance;Operations;HR;IT;Logistics";
const LEGAL = "legal|Legal Reviewer|person";

export const CONTRACT_MANAGEMENT: ModuleSpecs = {
  "contract-register": {
    name: "Contract Register", kind: "list", summary: "Every contract we hold",
    entity: "Contract", ref: "CTR",
    fields: [COUNTERPARTY, CONTRACT_TYPE, DEPT, "value|Contract Value|money|4000;9800000", "termMonths|Term|int|3;120;months", "autoRenew|Auto Renew|bool|Yes;No", OWNER, "expiry|Expires On|date|-90;1400", "date|Signed On|date|-1800;0"],
    statuses: ["Active", "Expiring", "Under Renewal", "Expired", "Terminated"],
    measure: "value", rows: 48,
    insight: "Eleven contracts worth USD 2.4m expire inside 90 days and six of them auto-renew — the notice window on three has already opened.",
  },

  "buyer-contracts": {
    name: "Buyer Contracts", kind: "list", summary: "Sales-side agreements",
    entity: "Buyer Contract", ref: "BCT",
    fields: ["buyer|Buyer|enum|@buyers", "scope|Scope|enum|Annual supply;Seasonal programme;Nominated supplier;Framework pricing;Exclusive supply;Trial order", "value|Committed Value|money|48000;9800000", "minVolume|Minimum Volume|int|100000;24000000;pcs", "priceBasis|Price Basis|enum|Fixed;Indexed to metal;Cost plus;Annual review", "penalty|Late Delivery Penalty|pct|0;8", OWNER, "expiry|Valid Until|date|-60;900", "date|Effective From|date|-1200;0"],
    statuses: ["Active", "Under Negotiation", "Expiring", "Expired", "Terminated"],
    measure: "value",
  },

  "supplier-contracts": {
    name: "Supplier Contracts", kind: "list", summary: "Purchase-side agreements",
    entity: "Supplier Contract", ref: "SCT",
    fields: ["supplier|Supplier|enum|@suppliers", "scope|Scope|enum|Raw material supply;Chemical supply;Packaging supply;Tooling;Subcontract plating;Consumables;Spare parts", "value|Committed Value|money|8000;4800000", "leadDays|Lead Time|int|7;120;days", "paymentTerm|Payment Term|enum|Advance;30 days;45 days;60 days;90 days;LC at sight", "priceLock|Price Locked|bool|Yes;No", OWNER, "expiry|Valid Until|date|-60;900", "date|Effective From|date|-1200;0"],
    statuses: ["Active", "Under Negotiation", "Expiring", "Expired", "Suspended"],
    measure: "value",
  },

  "service-contracts": {
    name: "Service Contracts", kind: "list", summary: "AMC, facility and professional services",
    entity: "Service Contract", ref: "SVC",
    fields: [COUNTERPARTY, "service|Service|enum|Machine AMC;ETP operation;Security services;Housekeeping;IT support;Audit services;Legal retainer;Transport contract;Canteen", "annualValue|Annual Value|money|2000;980000", "slaTarget|SLA Target|pct|85;99.9", "slaActual|SLA Achieved|pct|58;100", "noticeDays|Notice Period|int|15;180;days", OWNER, "expiry|Expires On|date|-60;900"],
    statuses: ["Active", "Renewal Due", "Under Review", "Expired", "Terminated"],
    measure: "annualValue",
  },

  "lease-contracts": {
    name: "Lease Contracts", kind: "list", summary: "Property and equipment leases",
    entity: "Lease", ref: "LSC",
    fields: [COUNTERPARTY, "asset|Leased Asset|enum|Factory shed;Warehouse space;Office floor;Forklift;Generator;Vehicle fleet;Server hardware", "monthlyRent|Monthly Rent|money|300;180000", "deposit|Security Deposit|money|1000;980000", "termMonths|Term|int|12;120;months", "escalation|Annual Escalation|pct|0;12", OWNER, "expiry|Expires On|date|-60;1400"],
    statuses: ["Active", "Renewal Due", "Under Negotiation", "Expired", "Terminated"],
    measure: "monthlyRent",
  },

  drafting: {
    name: "Contract Drafting", kind: "form", summary: "Template-based authoring",
    entity: "Draft", ref: "DFT",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "template|Template|enum|Standard supply agreement;Standard purchase agreement;Mutual NDA;Service level agreement;Lease agreement;Agency agreement", "clauses|Clauses Included|int|8;64", "deviations|Non-Standard Clauses|int|0;18", "value|Estimated Value|money|4000;4800000", "author|Drafted By|person", "date|Drafted On|date|-260;0"],
    statuses: ["Draft", "Internal Review", "With Counterparty", "Finalised", "Abandoned"],
    measure: "value",
  },

  "clause-library": {
    name: "Clause Library", kind: "list", summary: "Approved standard clauses",
    entity: "Clause", ref: "CLS",
    fields: ["clause|Clause|enum|Force majeure;Limitation of liability;Confidentiality;Termination for convenience;Late delivery penalty;Price revision;Governing law;Dispute resolution;Anti-bribery;Data protection;Intellectual property", "risk|Risk Level|enum|Low;Medium;High;Critical", "usage|Used in Contracts|int|0;120", "negotiable|Negotiable|bool|Yes;No", LEGAL, "date|Last Reviewed|date|-900;0"],
    statuses: ["Approved", "Under Review", "Restricted", "Withdrawn"],
    measure: "usage",
  },

  templates: {
    name: "Contract Templates", kind: "list", summary: "Standard papers we start from",
    entity: "Template", ref: "TPL",
    fields: [CONTRACT_TYPE, "template|Template|enum|Standard supply agreement;Standard purchase agreement;Mutual NDA;One-way NDA;Service level agreement;Lease agreement;Agency agreement;Subcontract agreement", "version|Version|enum|v1.0;v1.4;v2.0;v2.2;v3.0", "language|Language|enum|English;Bengali;Bilingual", "usage|Times Used|int|0;180", LEGAL, "date|Approved On|date|-1200;0"],
    statuses: ["Current", "Draft", "Under Legal Review", "Superseded"],
    measure: "usage",
  },

  "approval-workflow": {
    name: "Approval Workflow", kind: "board", summary: "Legal and management sign-off",
    entity: "Approval", ref: "APV",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "stage|Stage|enum|Business review;Legal review;Finance review;Management approval;Signature", "value|Contract Value|money|4000;9800000", "approver|Current Approver|person", "ageDays|Pending For|int|0;60;days", "riskFlags|Risk Flags|int|0;9", "date|Submitted On|date|-200;0"],
    statuses: ["Submitted", "In Review", "Approved", "Returned", "Rejected"],
    measure: "value", rows: 46,
  },

  "e-signature": {
    name: "Signature Tracking", kind: "list", summary: "Who has signed, who has not",
    entity: "Signature Request", ref: "SIG",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "method|Method|enum|Electronic signature;Wet signature;Digital certificate;Counter-signed scan", "signatories|Signatories|int|2;6", "signed|Signed|int|0;6", "reminders|Reminders Sent|int|0;12", "sentTo|Sent To|person", "date|Sent On|date|-200;0"],
    statuses: ["Sent", "Partially Signed", "Fully Signed", "Declined", "Expired"],
    measure: "signatories",
  },

  obligations: {
    name: "Obligation Tracking", kind: "list", summary: "Commitments we must meet",
    entity: "Obligation", ref: "OBL",
    fields: [COUNTERPARTY, "obligation|Obligation|enum|Monthly volume commitment;Quarterly price review;Annual audit access;Insurance maintenance;Quality certificate submission;Delivery lead time;Minimum stock holding;Reporting submission", DEPT, "frequency|Frequency|enum|One-off;Monthly;Quarterly;Half-yearly;Annually;Continuous", "compliance|Compliance|pct|38;100", "penalty|Penalty Exposure|money|0;980000", OWNER, "due|Next Due|date|-45;220"],
    statuses: ["Met", "Due", "Overdue", "At Risk", "Waived"],
    measure: "penalty", rows: 50,
  },

  milestones: {
    name: "Contract Milestones", kind: "calendar", summary: "Dated commitments on both sides",
    entity: "Milestone", ref: "MLS",
    fields: [COUNTERPARTY, "milestone|Milestone|enum|First delivery;Price review;Volume checkpoint;Audit window;Payment tranche;Performance review;Notice period opens;Renewal decision", "value|Linked Value|money|0;2400000", OWNER, "reminderDays|Remind Before|int|7;90;days", "date|Milestone Date|date|-120;400"],
    statuses: ["Upcoming", "Due", "Met", "Missed", "Waived"],
    measure: "value",
  },

  amendments: {
    name: "Amendments", kind: "list", summary: "Every change to a signed contract",
    entity: "Amendment", ref: "AMD",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "change|Change|enum|Price revision;Volume change;Term extension;Scope addition;Payment term change;Delivery schedule change;Party name change", "valueImpact|Value Impact|money|0;2400000", "amendmentNo|Amendment No.|int|1;9", LEGAL, "effective|Effective From|date|-400;120", "date|Raised On|date|-500;0"],
    statuses: ["Draft", "Under Approval", "Executed", "Rejected", "Withdrawn"],
    measure: "valueImpact",
  },

  renewals: {
    name: "Renewal Calendar", kind: "calendar", summary: "Expiry and notice periods",
    entity: "Renewal", ref: "RNW",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "currentValue|Current Value|money|4000;4800000", "proposedValue|Proposed Value|money|4000;5800000", "noticeDays|Notice Period|int|15;180;days", "recommendation|Recommendation|enum|Renew as is;Renew with changes;Renegotiate;Do not renew;Move to tender", OWNER, "date|Decision Due|date|-60;400"],
    statuses: ["Upcoming", "In Discussion", "Renewed", "Lapsed", "Not Renewed"],
    measure: "proposedValue",
  },

  terminations: {
    name: "Terminations", kind: "list", summary: "Contracts we have ended",
    entity: "Termination", ref: "TRM",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "reason|Reason|enum|Performance failure;Commercial terms;Consolidation;Counterparty exit;Compliance breach;No longer required;Mutual agreement", "noticeGiven|Notice Given|int|0;180;days", "exitCost|Exit Cost|money|0;980000", "settlement|Settlement Value|money|0;1800000", OWNER, "date|Effective From|date|-500;120"],
    statuses: ["Notice Served", "In Wind-down", "Settled", "Disputed", "Closed"],
    measure: "exitCost",
  },

  "contract-compliance": {
    name: "Contract Compliance", kind: "analytics", summary: "Are both sides keeping to terms",
    entity: "Compliance Record", ref: "CCM",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "obligationsTotal|Obligations|int|2;48", "obligationsMet|Met|int|0;48", "compliance|Compliance|pct|32;100", "breaches|Breaches|int|0;12", "exposure|Exposure|money|0;2400000", "date|Period End|date|-330;0"],
    statuses: ["Fully Compliant", "Minor Gaps", "Material Breach", "Under Review"],
    measure: "compliance", rows: 46,
  },

  "contract-value": {
    name: "Contract Value Analysis", kind: "analytics", summary: "Where committed value sits",
    entity: "Value Record", ref: "CVL",
    fields: [CONTRACT_TYPE, DEPT, "committed|Committed Value|money|8000;9800000", "consumed|Consumed to Date|money|0;9800000", "remaining|Remaining|money|0;7800000", "burnRate|Consumption|pct|0;100", "monthsLeft|Months Remaining|int|0;96;months", "date|Period End|date|-330;0"],
    statuses: ["On Profile", "Under Consuming", "Over Consuming", "Exhausted"],
    measure: "committed",
  },

  disputes: {
    name: "Contract Disputes", kind: "list", summary: "Where the parties disagree",
    entity: "Dispute", ref: "DSP",
    fields: [COUNTERPARTY, "issue|Issue|enum|Quality rejection;Delayed delivery;Price escalation;Payment delay;Scope disagreement;Termination notice;Penalty claim", "claimValue|Claim Value|money|1000;4800000", "forum|Forum|enum|Bilateral discussion;Mediation;Arbitration;Court;Buyer escalation", LEGAL, "ageDays|Open For|int|1;900;days", "date|Raised On|date|-900;0"],
    statuses: ["Raised", "Under Discussion", "In Mediation", "Settled", "Escalated"],
    measure: "claimValue",
  },

  repository: {
    name: "Contract Repository", kind: "list", summary: "The signed paper itself",
    entity: "Document", ref: "REP",
    fields: [COUNTERPARTY, CONTRACT_TYPE, "docType|Document|enum|Executed contract;Annexure;Amendment;Board resolution;Power of attorney;Insurance certificate;Bank guarantee", "pages|Pages|int|2;180", "sizeMb|File Size|float|0.1;48;MB;1", "access|Access Level|enum|Public internal;Restricted;Confidential;Legal only", OWNER, "date|Uploaded On|date|-1400;0"],
    statuses: ["Filed", "Pending Upload", "Under Verification", "Archived"],
    measure: "sizeMb", rows: 50,
  },

  "contract-settings": {
    name: "Contract Configuration", kind: "settings", summary: "Approval thresholds and alerts",
    entity: "Contract Rule", ref: "CST",
    fields: ["rule|Rule|enum|Legal review threshold;Management approval threshold;Renewal alert lead time;Non-standard clause escalation;Mandatory clause set;Retention period", "value|Configured Value|enum|Above USD 25,000;Above USD 100,000;90 days;Always;Force majeure + liability;7 years", LEGAL, "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Route every non-standard clause to legal before signature", "Alert the contract owner 90 days before expiry", "Block auto-renewal for any contract with an open dispute"],
  },
};
