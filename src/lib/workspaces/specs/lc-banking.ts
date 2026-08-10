import type { ModuleSpecs } from "../types";

/** Module 48 — LC & Banking Management. */

const BANK = "bank|Bank|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank;Dutch-Bangla Bank";
const BUYER = "buyer|Buyer|enum|@buyers";
const SUPPLIER = "supplier|Supplier|enum|@suppliers";
const LCNO = "lcNo|LC Number|enum|LC-88214;LC-88237;LC-88259;LC-88274;LC-88290;LC-88311;LC-88326";
const OWNER = "owner|Commercial Officer|person";
const CURRENCY = "currency|Currency|enum|USD;EUR;GBP";

export const LC_BANKING: ModuleSpecs = {
  "lc-register": {
    name: "LC Register", kind: "list", summary: "Every letter of credit on the book",
    entity: "Letter of Credit", ref: "LC",
    fields: [LCNO, "lcType|LC Type|enum|Export master;Back-to-back;Import sight;Import usance;Standby;Transferable", BANK, "amount|LC Amount|money|10000;1600000", "utilised|Utilised|money|0;1580000", "utilisation|Utilisation|pct|0;100", CURRENCY, "expiry|Expiry Date|date|-40;220"],
    statuses: ["Advised", "Accepted", "Partially Utilised", "Fully Utilised", "Expired", "Cancelled"],
    measure: "amount", rows: 46,
    insight: "Four export LCs expire within 21 days with shipment still open — request extensions before the shipment cut-off.",
  },

  "export-lc": {
    name: "Export LC", kind: "list", summary: "Master credits received from buyers",
    entity: "Export LC", ref: "ELC",
    fields: [BUYER, LCNO, BANK, "amount|LC Amount|money|20000;1800000", "shipped|Shipped Value|money|0;1780000", "balance|Unshipped Balance|money|0;1400000", "tenorDays|Tenor|int|0;180;days", "expiry|Expiry Date|date|-30;200"],
    statuses: ["Advised", "Accepted", "Under Shipment", "Fully Shipped", "Expired"],
    measure: "amount",
  },

  "back-to-back": {
    name: "Back-to-Back LC", kind: "list", summary: "BTB opened against master credits",
    entity: "BTB LC", ref: "BTB",
    fields: [SUPPLIER, LCNO, "masterLc|Master LC|enum|LC-88214;LC-88237;LC-88259;LC-88274", BANK, "amount|BTB Amount|money|4000;900000", "marginPct|Margin Held|pct|5;40", "coverage|Master Coverage|pct|20;95", "expiry|Expiry Date|date|-30;180"],
    statuses: ["Applied", "Opened", "Shipped", "Settled", "Expired"],
    measure: "amount",
  },

  "lc-amendments": {
    name: "LC Amendments", kind: "list", summary: "Every change to a credit",
    entity: "Amendment", ref: "AMD",
    fields: [LCNO, "amendmentNo|Amendment No|enum|AM-01;AM-02;AM-03;AM-04", "changeType|Change|enum|Value increase;Value decrease;Shipment date extension;Expiry extension;Description change;Port change;Tolerance change", "oldValue|Old Value|money|4000;1200000", "newValue|New Value|money|4000;1400000", "charge|Amendment Charge|money|20;900", "date|Amended On|date|-200;10"],
    statuses: ["Requested", "Advised", "Accepted", "Rejected"],
    measure: "newValue",
  },

  utilization: {
    name: "Limit Utilisation", kind: "analytics", summary: "How much facility is in use",
    entity: "Facility Utilisation", ref: "UTL",
    fields: [BANK, "facility|Facility|enum|LC limit;BTB limit;Guarantee limit;Packing credit;Overdraft;LTR", "sanctioned|Sanctioned|money|50000;3200000", "utilised|Utilised|money|0;3100000", "available|Available|money|0;2400000", "utilisation|Utilisation|pct|0;100", "expiry|Limit Expiry|date|-30;420"],
    statuses: ["Available", "Near Limit", "Fully Utilised", "Expiring", "Expired"],
    measure: "sanctioned",
  },

  "bank-charges": {
    name: "Bank Charges", kind: "analytics", summary: "The real cost of trade finance",
    entity: "Charge Line", ref: "BCG",
    fields: [BANK, "chargeType|Charge|enum|LC opening commission;Advising charge;Negotiation commission;Discrepancy fee;Acceptance commission;SWIFT charge;Amendment charge", LCNO, "amount|Amount|money|10;18000", "baseValue|On Value|money|4000;1400000", "ratePct|Rate|pct|0.05;2.5", "date|Charged On|date|-300;0"],
    statuses: ["As Agreed", "Above Tariff", "Under Dispute", "Refunded"],
    measure: "amount",
  },

  maturity: {
    name: "Maturity Calendar", kind: "calendar", summary: "Acceptances falling due",
    entity: "Maturity", ref: "MAT",
    fields: [LCNO, BANK, "party|Counterparty|enum|@buyers", "amount|Maturity Amount|money|4000;1200000", CURRENCY, "tenorDays|Tenor|int|30;180;days", "date|Maturity Date|date|-30;180"],
    statuses: ["Upcoming", "Due Today", "Overdue", "Settled", "Rolled Over"],
    measure: "amount",
  },

  discrepancies: {
    name: "Discrepancy Log", kind: "list", summary: "Objections against presented documents",
    entity: "Discrepancy", ref: "DSC",
    fields: [LCNO, BANK, "type|Discrepancy|enum|Late presentation;Late shipment;Description mismatch;Missing document;Over-drawn;Inconsistent data;Expired credit", "amount|Amount at Risk|money|4000;1200000", "charge|Discrepancy Fee|money|20;900", OWNER, "date|Raised On|date|-200;0"],
    statuses: ["Raised", "Under Correction", "Waived by Buyer", "Resolved", "Payment Withheld"],
    measure: "amount",
  },

  "bank-guarantee": {
    name: "Bank Guarantees", kind: "list", summary: "BG issued and outstanding",
    entity: "Guarantee", ref: "BG",
    fields: ["bgNo|BG Number|enum|BG-4411;BG-4438;BG-4452;BG-4477;BG-4491", "bgType|Type|enum|Performance;Advance payment;Bid bond;Customs;Utility", BANK, "beneficiary|Beneficiary|enum|@buyers", "amount|BG Amount|money|2000;620000", "commission|Commission|money|20;9000", "expiry|Expiry Date|date|-40;500"],
    statuses: ["Issued", "Active", "Expiring", "Expired", "Invoked", "Released"],
    measure: "amount",
  },

  "lc-opening": {
    name: "LC Opening Request", kind: "form", summary: "Apply to open an import or BTB credit",
    entity: "Opening Request", ref: "LCO",
    fields: [SUPPLIER, BANK, "amount|Requested Amount|money|4000;900000", CURRENCY, "goods|Goods Description|enum|Brass strip;Zinc alloy ingot;Plating chemicals;Packing material;Machinery spares", "tenorDays|Tenor|int|0;180;days", "marginPct|Margin|pct|5;40", "date|Required By|date|-10;60"],
    statuses: ["Draft", "Submitted", "Under Bank Review", "Opened", "Rejected"],
    measure: "amount",
  },

  "lc-documents": {
    name: "LC Document Set", kind: "list", summary: "Documents presented under each credit",
    entity: "Document Set", ref: "LDS",
    fields: [LCNO, "docType|Document|enum|Commercial invoice;Bill of lading;Packing list;Certificate of origin;Insurance certificate;Beneficiary certificate;Inspection certificate", "copies|Copies|int|1;6", "presentedValue|Presented Value|money|4000;1200000", OWNER, "date|Presented On|date|-200;10"],
    statuses: ["Pending", "Prepared", "Presented", "Accepted", "Discrepant"],
    measure: "presentedValue",
  },

  "acceptance-tracking": {
    name: "Acceptance Tracking", kind: "list", summary: "Usance acceptances awaiting payment",
    entity: "Acceptance", ref: "ACC",
    fields: [LCNO, BANK, BUYER, "amount|Accepted Amount|money|4000;1200000", "tenorDays|Tenor|int|30;180;days", "dueDays|Days to Due|int|-30;180;days", "date|Due Date|date|-30;180"],
    statuses: ["Accepted", "Due Soon", "Overdue", "Paid", "Dishonoured"],
    measure: "amount",
  },

  "bill-discounting": {
    name: "Bill Discounting", kind: "list", summary: "Early realisation against acceptances",
    entity: "Discounted Bill", ref: "DIS",
    fields: [LCNO, BANK, "faceValue|Face Value|money|4000;1200000", "discountRate|Discount Rate|pct|3;14", "discountAmount|Discount|money|40;42000", "netProceeds|Net Proceeds|money|4000;1180000", "tenorDays|Days Discounted|int|15;180;days", "date|Discounted On|date|-240;0"],
    statuses: ["Requested", "Discounted", "Matured", "Recourse Claimed", "Settled"],
    measure: "faceValue",
  },

  "packing-credit": {
    name: "Packing Credit", kind: "list", summary: "Pre-shipment finance drawn",
    entity: "Packing Credit", ref: "PC",
    fields: [BANK, LCNO, "sanctioned|Sanctioned|money|10000;1400000", "drawn|Drawn|money|0;1380000", "rate|Interest Rate|pct|3;12", "repayDays|Repayment Period|int|30;180;days", "date|Repayment Due|date|-40;180"],
    statuses: ["Sanctioned", "Drawn", "Partially Repaid", "Repaid", "Overdue"],
    measure: "drawn",
  },

  "bank-relationship": {
    name: "Bank Relationship", kind: "list", summary: "Service quality per banking partner",
    entity: "Relationship Record", ref: "BRL",
    fields: [BANK, "relationshipManager|Relationship Manager|person", "servicesUsed|Services|enum|LC;BTB;Guarantee;Loans;FX;Payroll;All services", "annualVolume|Annual Volume|money|40000;3600000", "chargeRatio|Charge Ratio|pct|0.1;3", "serviceRating|Service Rating|pct|45;99", "date|Reviewed On|date|-300;0"],
    statuses: ["Primary", "Secondary", "Under Review", "Exiting"],
    measure: "annualVolume",
  },

  "swift-messages": {
    name: "SWIFT Messages", kind: "list", summary: "Message trail with the banks",
    entity: "SWIFT Message", ref: "SWF",
    fields: ["messageType|Message Type|enum|MT700 LC issue;MT707 Amendment;MT710 Advice;MT734 Refusal;MT740 Reimbursement;MT799 Free format", LCNO, BANK, "amount|Referenced Amount|money|4000;1400000", "direction|Direction|enum|Received;Sent", "date|Message Date|date|-240;0"],
    statuses: ["Received", "Acknowledged", "Actioned", "Query Raised"],
    measure: "amount",
  },

  "expiry-monitor": {
    name: "LC Expiry Monitor", kind: "list", summary: "Credits running out of time",
    entity: "Expiring LC", ref: "EXM",
    fields: [LCNO, BUYER, BANK, "amount|LC Amount|money|10000;1600000", "unutilised|Unutilised|money|0;1200000", "daysToExpiry|Days to Expiry|int|-30;120;days", "extensionRequested|Extension Requested|bool|Yes;No", "expiry|Expiry Date|date|-30;120"],
    statuses: ["Comfortable", "Expiring Soon", "Critical", "Expired", "Extended"],
    measure: "unutilised",
  },

  "btb-reconciliation": {
    name: "BTB Reconciliation", kind: "analytics", summary: "Master credit against BTB exposure",
    entity: "Reconciliation Line", ref: "BRC",
    fields: ["masterLc|Master LC|enum|LC-88214;LC-88237;LC-88259;LC-88274;LC-88290", "masterValue|Master Value|money|20000;1800000", "btbOpened|BTB Opened|money|0;1400000", "btbRatio|BTB Ratio|pct|10;92", "headroom|Headroom|money|0;900000", "date|As On|date|-180;0"],
    statuses: ["Within Policy", "Near Ceiling", "Over Exposed", "Under Review"],
    measure: "masterValue",
  },

  "lc-analytics": {
    name: "LC Analytics", kind: "analytics", summary: "Cost, cycle time and bank mix",
    entity: "Analytics Point", ref: "LAN",
    fields: [BANK, "metric|Metric|enum|Average LC value;Negotiation cycle days;Discrepancy rate;Charge ratio;Utilisation;Realisation days", "value|Value|float|0.2;180;;2", "target|Target|float|0.5;120;;2", "lcCount|LCs|int|1;60", "amount|Value Handled|money|20000;3200000", "date|Period End|date|-360;0"],
    statuses: ["Better than Target", "On Target", "Below Target", "Under Review"],
    measure: "amount",
  },

  "lc-settings": {
    name: "LC & Banking Controls", kind: "settings", summary: "Alerts, ceilings and approvals",
    entity: "Control Rule", ref: "LSET",
    fields: ["rule|Rule|enum|Alert before LC expiry;Cap BTB against master;Block presentation on discrepancy;Require dual approval for amendments;Auto-match acceptance to receipt", "threshold|Threshold|pct|40;100", "leadDays|Alert Lead|int|3;45;days", OWNER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Alert 21 days before any letter of credit expires", "Cap back-to-back exposure at 75% of the master credit"],
  },
};
