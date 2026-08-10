import type { ModuleSpecs } from "../types";

/** Module 45 — Finance & Accounts Management. */

const ACCOUNT = "account|GL Account|enum|1010 Cash at Bank;1200 Trade Receivable;1300 Inventory;2100 Trade Payable;3000 Share Capital;4000 Export Sales;5000 Raw Material Consumed;6100 Salaries & Wages;6300 Power & Fuel;7000 Bank Charges";
const COSTCENTER = "costCenter|Cost Center|enum|CC-1001 Production;CC-2001 Plating;CC-3001 Packing;CC-4001 Admin;CC-5001 Sales;CC-6001 Maintenance";
const BUYER = "buyer|Buyer|enum|@buyers";
const SUPPLIER = "supplier|Supplier|enum|@suppliers";
const ACCOUNTANT = "accountant|Prepared By|person";
const CURRENCY = "currency|Currency|enum|USD;EUR;BDT;GBP";

export const FINANCE_ACCOUNTS: ModuleSpecs = {
  "financial-overview": {
    name: "Financial Overview", kind: "overview", summary: "P&L, cash and position at a glance",
    entity: "Financial Metric", ref: "FIN",
    fields: ["metric|Metric|enum|Revenue;Gross profit;Operating profit;Net profit;Cash balance;Receivables;Payables;Inventory value", "amount|Amount|money|20000;4800000", "budget|Budget|money|18000;5000000", "variance|Variance|pct|62;138", COSTCENTER, "date|Period End|date|-360;0"],
    statuses: ["Above Budget", "On Budget", "Below Budget", "Under Review"],
    measure: "amount", rows: 44,
  },

  "chart-of-accounts": {
    name: "Chart of Accounts", kind: "list", summary: "The general ledger structure",
    entity: "GL Account", ref: "COA",
    fields: [ACCOUNT, "type|Account Type|enum|Asset;Liability;Equity;Income;Expense", "group|Group|enum|Current asset;Fixed asset;Current liability;Long-term liability;Direct cost;Overhead;Revenue", "balance|Current Balance|money|1000;3800000", "postingAllowed|Posting Allowed|bool|Yes;No", "owner|Account Owner|person", "date|Opened On|date|-1200;0"],
    statuses: ["Active", "Blocked", "Under Review", "Closed"],
    measure: "balance",
  },

  "journal-entries": {
    name: "Journal Entries", kind: "list", summary: "Manual and automatic postings",
    entity: "Journal Entry", ref: "JV",
    fields: ["voucherNo|Voucher No|enum|JV-26-0411;JV-26-0428;JV-26-0443;JV-26-0461;JV-26-0478", "narration|Narration|enum|Depreciation charge;Accrual of wages;Forex revaluation;Provision for bad debt;Reclassification;Prepaid amortisation", ACCOUNT, "debit|Debit|money|100;480000", "credit|Credit|money|100;480000", COSTCENTER, ACCOUNTANT, "date|Posting Date|date|-240;0"],
    statuses: ["Draft", "Pending Approval", "Posted", "Reversed", "Rejected"],
    measure: "debit",
  },

  "general-ledger": {
    name: "General Ledger", kind: "list", summary: "Account-wise movement",
    entity: "Ledger Line", ref: "GL",
    fields: [ACCOUNT, "voucherNo|Voucher|enum|JV-26-0411;PV-26-0221;RV-26-0338;SV-26-0455;BP-26-0512", "debit|Debit|money|0;420000", "credit|Credit|money|0;420000", "balance|Running Balance|money|1000;3200000", COSTCENTER, "date|Posting Date|date|-360;0"],
    statuses: ["Posted", "Reversed", "Under Query", "Reconciled"],
    measure: "balance",
  },

  "accounts-receivable": {
    name: "Accounts Receivable", kind: "list", summary: "What buyers owe us",
    entity: "Receivable", ref: "AR",
    fields: [BUYER, "invoiceNo|Invoice No|enum|CI-26-0411;CI-26-0428;CI-26-0443;CI-26-0461;CI-26-0478", "invoiceValue|Invoice Value|money|4000;480000", "received|Received|money|0;480000", "outstanding|Outstanding|money|0;460000", "overdueDays|Overdue|int|-60;180;days", CURRENCY, "date|Due Date|date|-120;90"],
    statuses: ["Current", "Due Soon", "Overdue", "Settled", "Disputed"],
    measure: "outstanding",
  },

  "accounts-payable": {
    name: "Accounts Payable", kind: "list", summary: "What we owe suppliers",
    entity: "Payable", ref: "AP",
    fields: [SUPPLIER, "billNo|Bill No|enum|PB-26-0311;PB-26-0328;PB-26-0344;PB-26-0361;PB-26-0379", "billValue|Bill Value|money|1000;320000", "paid|Paid|money|0;320000", "outstanding|Outstanding|money|0;300000", "overdueDays|Overdue|int|-60;150;days", CURRENCY, "date|Due Date|date|-90;90"],
    statuses: ["Current", "Due Soon", "Overdue", "Paid", "On Hold"],
    measure: "outstanding",
  },

  "ar-aging": {
    name: "AR Aging", kind: "analytics", summary: "Receivables by overdue bucket",
    entity: "Aging Bucket", ref: "ARA",
    fields: [BUYER, "bucket|Bucket|enum|Not due;1–30 days;31–60 days;61–90 days;90+ days", "amount|Amount|money|1000;620000", "invoices|Invoices|int|1;28", "share|Share|pct|1;46", "riskLevel|Risk|enum|Low;Medium;High", "date|As On|date|-90;0"],
    statuses: ["Healthy", "Watch", "At Risk", "Doubtful"],
    measure: "amount",
  },

  "ap-aging": {
    name: "AP Aging", kind: "analytics", summary: "Payment obligations by bucket",
    entity: "Aging Bucket", ref: "APA",
    fields: [SUPPLIER, "bucket|Bucket|enum|Not due;1–30 days;31–60 days;61–90 days;90+ days", "amount|Amount|money|1000;480000", "bills|Bills|int|1;30", "share|Share|pct|1;44", "priority|Payment Priority|enum|Critical;High;Normal;Deferred", "date|As On|date|-90;0"],
    statuses: ["Scheduled", "Due Soon", "Overdue", "On Hold"],
    measure: "amount",
  },

  "profit-loss": {
    name: "Profit & Loss", kind: "analytics", summary: "Income statement by period",
    entity: "P&L Line", ref: "PNL",
    fields: ["line|Line Item|enum|Export sales;Local sales;Raw material;Direct labour;Factory overhead;Selling expenses;Admin expenses;Finance cost;Depreciation", "amount|Amount|money|2000;3600000", "budget|Budget|money|2000;3800000", "variance|Variance|pct|58;142", "shareOfSales|Share of Sales|pct|0.4;68", "date|Period End|date|-360;0"],
    statuses: ["Favourable", "On Plan", "Adverse", "Under Review"],
    measure: "amount",
  },

  "balance-sheet": {
    name: "Balance Sheet", kind: "analytics", summary: "Assets, liabilities and equity",
    entity: "Balance Line", ref: "BS",
    fields: ["line|Line Item|enum|Property plant & equipment;Inventory;Trade receivable;Cash & equivalents;Trade payable;Short-term loan;Long-term loan;Share capital;Retained earnings", "amount|Amount|money|20000;6400000", "priorAmount|Prior Period|money|18000;6200000", "movement|Movement|pct|60;146", "category|Category|enum|Non-current asset;Current asset;Current liability;Non-current liability;Equity", "date|As On|date|-360;0"],
    statuses: ["Reviewed", "Provisional", "Audited", "Restated"],
    measure: "amount",
  },

  "trial-balance": {
    name: "Trial Balance", kind: "list", summary: "Debit and credit agreement check",
    entity: "Trial Balance Line", ref: "TB",
    fields: [ACCOUNT, "openingBalance|Opening|money|0;2200000", "debit|Debit|money|0;1800000", "credit|Credit|money|0;1800000", "closingBalance|Closing|money|0;2600000", ACCOUNTANT, "date|Period End|date|-360;0"],
    statuses: ["Balanced", "Under Review", "Adjusted", "Locked"],
    measure: "closingBalance",
  },

  "period-close": {
    name: "Period Close", kind: "board", summary: "Month-end checklist and sign-off",
    entity: "Close Task", ref: "CLS",
    fields: ["task|Task|enum|Bank reconciliation;Inventory valuation;Depreciation run;Accrual booking;Forex revaluation;Intercompany matching;Sub-ledger tie-out;Management pack", "period|Period|enum|Jan 26;Feb 26;Mar 26;Apr 26;May 26;Jun 26;Jul 26", "owner|Owner|person", "effort|Effort|float|0.5;16;hrs;1", "date|Due Date|date|-40;25"],
    statuses: ["Not Started", "In Progress", "Under Review", "Completed", "Blocked"],
    measure: "effort",
  },

  "fixed-assets-gl": {
    name: "Asset Accounting", kind: "list", summary: "Capitalisation and depreciation postings",
    entity: "Asset Posting", ref: "FAG",
    fields: ["asset|Asset|enum|Power Press 110T;Plating Line A;Air Compressor;Delivery Truck;Office Building;IT Equipment", "postingType|Posting|enum|Capitalisation;Depreciation;Revaluation;Disposal;Impairment", "amount|Amount|money|200;480000", "accumulated|Accumulated Depreciation|money|0;620000", "netBook|Net Book Value|money|0;900000", ACCOUNTANT, "date|Posting Date|date|-360;0"],
    statuses: ["Draft", "Posted", "Reversed", "Under Review"],
    measure: "amount",
  },

  "bank-book": {
    name: "Bank Book", kind: "list", summary: "Bank-wise receipts and payments",
    entity: "Bank Entry", ref: "BNK",
    fields: ["bank|Bank Account|enum|SCB USD 0011;HSBC USD 4482;City Bank BDT 9911;BRAC BDT 3320;EBL EUR 7744", "entryType|Entry Type|enum|Receipt;Payment;Charge;Interest;Transfer", "amount|Amount|money|100;620000", "balance|Balance After|money|1000;2400000", CURRENCY, ACCOUNTANT, "date|Value Date|date|-240;0"],
    statuses: ["Posted", "Unreconciled", "Reconciled", "Reversed"],
    measure: "amount",
  },

  "cash-flow": {
    name: "Cash Flow Statement", kind: "analytics", summary: "Operating, investing and financing",
    entity: "Cash Flow Line", ref: "CFS",
    fields: ["activity|Activity|enum|Operating;Investing;Financing", "line|Line Item|enum|Cash from customers;Payments to suppliers;Wages paid;Capex;Loan drawdown;Loan repayment;Interest paid;Tax paid", "amount|Amount|money|1000;1800000", "priorAmount|Prior Period|money|1000;1700000", "movement|Movement|pct|54;152", "date|Period End|date|-360;0"],
    statuses: ["Inflow", "Outflow", "Neutral", "Under Review"],
    measure: "amount",
  },

  "expense-claims": {
    name: "Expense Claims", kind: "list", summary: "Staff reimbursements",
    entity: "Expense Claim", ref: "EXC",
    fields: ["claimant|Claimant|person", "category|Category|enum|Travel;Buyer entertainment;Fuel;Courier;Stationery;Training;Medical", "amount|Claim Amount|money|10;4800", "approved|Approved Amount|money|0;4800", COSTCENTER, "date|Claim Date|date|-180;0"],
    statuses: ["Submitted", "Under Approval", "Approved", "Paid", "Rejected"],
    measure: "amount",
  },

  "advance-settlement": {
    name: "Advance Settlement", kind: "list", summary: "Advances issued and cleared",
    entity: "Advance", ref: "ADV",
    fields: ["party|Party|person", "purpose|Purpose|enum|Travel advance;Supplier advance;Petty cash;Salary advance;Project advance", "advanceAmount|Advance|money|50;42000", "settled|Settled|money|0;42000", "balance|Balance|money|0;40000", "ageDays|Outstanding|int|0;180;days", "date|Issued On|date|-240;0"],
    statuses: ["Issued", "Partially Settled", "Settled", "Overdue", "Written Off"],
    measure: "balance",
  },

  intercompany: {
    name: "Intercompany Accounts", kind: "list", summary: "Balances between group entities",
    entity: "Intercompany Balance", ref: "ICO",
    fields: ["entity|Counterparty Entity|enum|Smart Metal Unit 2;Smart Metal Trading;Smart Metal Logistics;Smart Metal HK", "transaction|Transaction|enum|Goods transfer;Service charge;Loan;Expense recharge;Royalty", "amount|Amount|money|500;620000", "matched|Matched Amount|money|0;620000", "difference|Difference|money|0;60000", CURRENCY, "date|Transaction Date|date|-240;0"],
    statuses: ["Matched", "Unmatched", "Under Reconciliation", "Eliminated"],
    measure: "amount",
  },

  "voucher-entry": {
    name: "Voucher Entry", kind: "form", summary: "Book a receipt, payment or journal",
    entity: "Voucher", ref: "VCH",
    fields: ["voucherType|Voucher Type|enum|Receipt;Payment;Journal;Contra;Debit note;Credit note", ACCOUNT, "amount|Amount|money|50;480000", COSTCENTER, CURRENCY, "narration|Narration|enum|Supplier payment;Buyer receipt;Salary payment;Utility bill;Bank charge;Adjustment", ACCOUNTANT, "date|Voucher Date|date|-30;5"],
    statuses: ["Draft", "Submitted", "Approved", "Posted", "Rejected"],
    measure: "amount",
  },

  "finance-settings": {
    name: "Finance Controls", kind: "settings", summary: "Posting periods and approval limits",
    entity: "Control Rule", ref: "FSET",
    fields: ["rule|Rule|enum|Lock posting after period close;Dual approval above limit;Block negative cash posting;Mandatory cost center;Auto-reverse accruals", "limit|Approval Limit|money|1000;250000", "owner|Rule Owner|person", "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Lock the ledger once a period is closed", "Require a cost center on every expense posting"],
  },
};
