import type { ModuleSpecs } from "../types";

/** Module 49 — Tax & VAT Management. */

const PERIOD = "period|Tax Period|enum|Jan 26;Feb 26;Mar 26;Apr 26;May 26;Jun 26;Jul 26";
const SUPPLIER = "supplier|Supplier|enum|@suppliers";
const OFFICER = "officer|Tax Officer|person";
const CIRCLE = "circle|VAT Circle|enum|Circle-04 Dhaka North;Circle-11 Gazipur;Circle-07 Chattogram;LTU Dhaka";

export const TAX_VAT: ModuleSpecs = {
  "vat-register": {
    name: "VAT Register", kind: "list", summary: "Input and output VAT by document",
    entity: "VAT Entry", ref: "VAT",
    fields: [PERIOD, "direction|Direction|enum|Input VAT;Output VAT", "party|Party|enum|@suppliers", "baseValue|Taxable Value|money|500;620000", "rate|VAT Rate|pct|0;15", "vatAmount|VAT Amount|money|0;92000", "docNo|Document No|enum|MK-6.3-4411;MK-6.3-4428;PB-26-0311;CI-26-0411", "date|Document Date|date|-300;0"],
    statuses: ["Recorded", "Verified", "Claimed", "Rejected", "Adjusted"],
    measure: "vatAmount", rows: 50,
    insight: "Input credit worth roughly 8% of the quarter is sitting unclaimed on documents missing a valid Mushak reference.",
  },

  "vat-returns": {
    name: "VAT Returns", kind: "list", summary: "Periodic filings and their status",
    entity: "VAT Return", ref: "VRT",
    fields: [PERIOD, CIRCLE, "outputVat|Output VAT|money|1000;280000", "inputVat|Input Credit|money|500;260000", "netPayable|Net Payable|money|0;180000", "form|Return Form|enum|Mushak 9.1;Mushak 9.2;Mushak 4.3;Annexure", OFFICER, "date|Filing Due|date|-200;40"],
    statuses: ["Draft", "Under Review", "Filed", "Late Filed", "Amended"],
    measure: "netPayable",
  },

  "input-credit": {
    name: "Input Tax Credit", kind: "analytics", summary: "Credit claimed against eligible spend",
    entity: "Credit Record", ref: "ITC",
    fields: [PERIOD, "category|Spend Category|enum|Raw material;Packing material;Utilities;Services;Capital goods;Freight", "eligibleValue|Eligible Value|money|1000;480000", "claimed|Claimed|money|0;460000", "unclaimed|Unclaimed|money|0;90000", "claimRate|Claim Rate|pct|20;100", "date|Period End|date|-300;0"],
    statuses: ["Fully Claimed", "Partially Claimed", "Unclaimed", "Disallowed"],
    measure: "eligibleValue",
  },

  withholding: {
    name: "Withholding Tax", kind: "list", summary: "TDS and VDS deducted at source",
    entity: "Deduction", ref: "WHT",
    fields: [SUPPLIER, "deductionType|Type|enum|VDS on services;TDS on supply;TDS on rent;TDS on professional fee;TDS on salary", "baseAmount|Base Amount|money|200;380000", "rate|Rate|pct|1;15", "deducted|Deducted|money|10;42000", "deposited|Deposited|money|0;42000", "date|Deduction Date|date|-300;0"],
    statuses: ["Deducted", "Deposited", "Certificate Issued", "Overdue", "Adjusted"],
    measure: "deducted",
  },

  "income-tax": {
    name: "Corporate Income Tax", kind: "list", summary: "Assessment year workings",
    entity: "Tax Computation", ref: "CIT",
    fields: ["assessmentYear|Assessment Year|enum|AY 2024-25;AY 2025-26;AY 2026-27", "line|Computation Line|enum|Accounting profit;Add: disallowed expense;Less: exempt income;Taxable income;Tax at rate;Advance tax paid;Balance payable", "amount|Amount|money|1000;2600000", "rate|Tax Rate|pct|10;32", OFFICER, "date|Computed On|date|-400;0"],
    statuses: ["Draft", "Under Review", "Filed", "Assessed", "Under Appeal"],
    measure: "amount",
  },

  "customs-duty": {
    name: "Customs Duty", kind: "analytics", summary: "Import duty and taxes paid",
    entity: "Duty Record", ref: "CDT",
    fields: ["consignment|Consignment|enum|IMP-26-0411;IMP-26-0428;IMP-26-0443;IMP-26-0461", "hsCode|HS Code|enum|7409.21;7907.00;2833.24;3810.10;8207.30", "assessableValue|Assessable Value|money|2000;620000", "customsDuty|Customs Duty|money|100;92000", "vatAtImport|VAT at Import|money|100;96000", "totalDuty|Total Duty|money|200;220000", "date|Assessment Date|date|-300;0"],
    statuses: ["Assessed", "Paid", "Under Query", "Refund Claimed", "Bonded"],
    measure: "totalDuty",
  },

  "filing-calendar": {
    name: "Filing Calendar", kind: "calendar", summary: "Statutory due dates ahead",
    entity: "Filing Obligation", ref: "FCL",
    fields: ["obligation|Obligation|enum|Mushak 9.1 monthly return;VDS deposit;TDS deposit;Advance income tax;Annual return;Withholding return;Customs bond return", CIRCLE, "amount|Amount Due|money|0;280000", "penaltyRisk|Penalty Risk|money|0;42000", OFFICER, "date|Due Date|date|-40;120"],
    statuses: ["Upcoming", "Due Soon", "Filed", "Overdue", "Waived"],
    measure: "amount",
  },

  "tax-assessment": {
    name: "Assessments & Appeals", kind: "list", summary: "Open matters with the authority",
    entity: "Tax Matter", ref: "ASM",
    fields: ["matterType|Matter|enum|VAT audit;Income tax assessment;Customs valuation;Penalty notice;Refund claim;Appeal", "authority|Authority|enum|NBR;Customs;VAT Commissionerate;Appellate Tribunal;High Court", "demandAmount|Demand|money|1000;920000", "provided|Provision Held|money|0;900000", "riskLevel|Risk|enum|High;Medium;Low", OFFICER, "date|Next Hearing|date|-90;300"],
    statuses: ["Open", "Under Response", "Hearing Scheduled", "Settled", "Appealed"],
    measure: "demandAmount",
  },

  "tax-reconciliation": {
    name: "Tax Reconciliation", kind: "analytics", summary: "Books against returns filed",
    entity: "Reconciliation Line", ref: "TRC",
    fields: [PERIOD, "item|Item|enum|Output VAT;Input VAT;Turnover;TDS deducted;TDS deposited;Duty paid", "perBooks|Per Books|money|1000;620000", "perReturn|Per Return|money|1000;620000", "difference|Difference|money|0;42000", "explained|Explained|bool|Yes;No", "date|Reconciled On|date|-300;0"],
    statuses: ["Matched", "Minor Difference", "Material Difference", "Adjusted"],
    measure: "perBooks",
  },

  "mushak-forms": {
    name: "Mushak Forms", kind: "list", summary: "Statutory VAT documents issued",
    entity: "Mushak Form", ref: "MSK",
    fields: ["formType|Form|enum|Mushak 6.3 invoice;Mushak 6.1 purchase;Mushak 6.2 sales;Mushak 6.6 VDS;Mushak 4.3 price declaration", "docNo|Document No|enum|MK-6.3-4411;MK-6.3-4428;MK-6.1-2201;MK-6.6-3312", "party|Party|enum|@buyers", "value|Value|money|200;480000", "vatAmount|VAT|money|0;72000", "date|Issued On|date|-300;0"],
    statuses: ["Issued", "Filed", "Cancelled", "Amended"],
    measure: "vatAmount",
  },

  "vds-certificates": {
    name: "VDS Certificates", kind: "list", summary: "Deduction certificates issued and received",
    entity: "VDS Certificate", ref: "VDS",
    fields: [SUPPLIER, "certNo|Certificate No|enum|VDS-7741;VDS-7768;VDS-7784;VDS-7799", "direction|Direction|enum|Issued;Received", "baseAmount|Base Amount|money|200;380000", "vdsAmount|VDS Amount|money|10;42000", "rate|Rate|pct|1;15", "date|Issued On|date|-300;0"],
    statuses: ["Issued", "Received", "Pending", "Disputed"],
    measure: "vdsAmount",
  },

  "tax-payments": {
    name: "Tax Payments", kind: "list", summary: "Challans and treasury deposits",
    entity: "Tax Payment", ref: "TPM",
    fields: ["taxType|Tax Type|enum|VAT;Income tax;Customs duty;Supplementary duty;Advance tax;Penalty", "challanNo|Challan No|enum|CH-88214;CH-88237;CH-88259;CH-88274", "amount|Amount|money|200;480000", "bank|Bank|enum|Sonali Bank;Janata Bank;Standard Chartered;City Bank", PERIOD, "date|Payment Date|date|-300;10"],
    statuses: ["Scheduled", "Paid", "Acknowledged", "Failed", "Refunded"],
    measure: "amount",
  },

  "advance-tax": {
    name: "Advance Tax", kind: "list", summary: "Instalments paid ahead of assessment",
    entity: "Advance Instalment", ref: "ADT",
    fields: ["assessmentYear|Assessment Year|enum|AY 2024-25;AY 2025-26;AY 2026-27", "instalment|Instalment|enum|1st quarter;2nd quarter;3rd quarter;4th quarter", "estimatedIncome|Estimated Income|money|20000;2800000", "amount|Instalment Amount|money|1000;420000", "paid|Paid|money|0;420000", "date|Due Date|date|-300;120"],
    statuses: ["Due", "Paid", "Short Paid", "Overdue", "Adjusted"],
    measure: "amount",
  },

  "transfer-pricing": {
    name: "Transfer Pricing", kind: "list", summary: "Related-party transaction records",
    entity: "TP Transaction", ref: "TPR",
    fields: ["entity|Related Entity|enum|Smart Metal HK;Smart Metal Trading;Smart Metal Logistics;Group Holding", "transaction|Transaction|enum|Goods sale;Goods purchase;Service fee;Royalty;Interest;Cost recharge", "amount|Amount|money|4000;1200000", "method|TP Method|enum|CUP;Cost plus;Resale price;TNMM;Profit split", "armsLengthRange|Arm's Length|pct|60;140", OFFICER, "date|Financial Year End|date|-400;0"],
    statuses: ["Documented", "Under Review", "Benchmarked", "At Risk"],
    measure: "amount",
  },

  "tax-audit": {
    name: "Tax Audit", kind: "board", summary: "Audit engagements and queries",
    entity: "Audit Query", ref: "TAU",
    fields: ["auditType|Audit|enum|VAT audit;Income tax audit;Customs post-clearance;Transfer pricing review", "query|Query|enum|Input credit eligibility;Turnover reconciliation;Expense disallowance;Valuation basis;Missing documents", "exposure|Exposure|money|1000;620000", OFFICER, "responseDays|Response Due|int|1;45;days", "date|Query Date|date|-200;0"],
    statuses: ["Received", "Under Preparation", "Responded", "Accepted", "Escalated"],
    measure: "exposure",
  },

  exemptions: {
    name: "Exemptions & Rebates", kind: "list", summary: "Reliefs the company qualifies for",
    entity: "Exemption", ref: "EXM",
    fields: ["scheme|Scheme|enum|Export VAT exemption;Bond facility;Reduced rate supply;Duty drawback;Tax holiday;Zero-rated supply", "reference|Reference|enum|SRO-241;SRO-289;SRO-314;Bond-4471;NBR-1122", "value|Benefit Value|money|1000;620000", "conditions|Key Condition|enum|Export proof required;Bond register upkeep;Utilisation within period;Annual renewal", "validUntil|Valid Until|date|-60;500", OFFICER],
    statuses: ["Active", "Expiring", "Expired", "Under Renewal", "Withdrawn"],
    measure: "value",
  },

  "tax-provision": {
    name: "Tax Provision", kind: "analytics", summary: "Current and deferred tax carried",
    entity: "Provision Line", ref: "TPV",
    fields: ["type|Provision Type|enum|Current tax;Deferred tax asset;Deferred tax liability;Contingent tax;Interest provision", "openingBalance|Opening|money|1000;920000", "charge|Charge for Period|money|0;480000", "utilised|Utilised|money|0;420000", "closingBalance|Closing|money|1000;1100000", "date|Period End|date|-360;0"],
    statuses: ["Adequate", "Under Provided", "Over Provided", "Under Review"],
    measure: "closingBalance",
  },

  "return-entry": {
    name: "Return Entry", kind: "form", summary: "Prepare a periodic tax return",
    entity: "Return Draft", ref: "RTE",
    fields: [PERIOD, "returnType|Return Type|enum|Mushak 9.1;Withholding return;Advance tax;Annual income tax;Customs bond return", "outputTax|Output Tax|money|500;280000", "inputTax|Input Tax|money|200;260000", "netPayable|Net Payable|money|0;180000", OFFICER, "date|Filing Date|date|-30;40"],
    statuses: ["Draft", "Submitted", "Reviewed", "Filed", "Rejected"],
    measure: "netPayable",
  },

  "tax-notices": {
    name: "Tax Notices", kind: "list", summary: "Correspondence from the authority",
    entity: "Notice", ref: "NTC",
    fields: ["noticeType|Notice|enum|Show cause;Demand notice;Information request;Penalty notice;Refund order;Hearing notice", "authority|Authority|enum|NBR;Customs;VAT Commissionerate;Appellate Tribunal", "amount|Amount Involved|money|0;920000", "responseDays|Response Due|int|1;45;days", OFFICER, "date|Notice Date|date|-240;0"],
    statuses: ["Received", "Under Response", "Responded", "Closed", "Escalated"],
    measure: "amount",
  },

  "tax-settings": {
    name: "Tax Controls", kind: "settings", summary: "Rates, alerts and posting rules",
    entity: "Control Rule", ref: "TSET",
    fields: ["rule|Rule|enum|Alert before filing due date;Block invoice without VAT code;Auto-post input credit;Require Mushak reference;Validate HS code against item", "leadDays|Alert Lead|int|1;30;days", OFFICER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Alert the tax team seven days before any statutory due date", "Reject purchase entries without a valid Mushak reference"],
  },
};
