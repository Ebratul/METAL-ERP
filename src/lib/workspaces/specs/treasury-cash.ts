import type { ModuleSpecs } from "../types";

/** Module 47 — Treasury & Cash Management. */

const BANKACC = "bankAccount|Bank Account|enum|SCB USD 0011;HSBC USD 4482;City Bank BDT 9911;BRAC BDT 3320;EBL EUR 7744;DBBL BDT 6655";
const CURRENCY = "currency|Currency|enum|USD;EUR;BDT;GBP";
const OWNER = "owner|Treasury Officer|person";
const PARTY = "party|Counterparty|enum|@buyers";
const VENDOR = "vendor|Supplier|enum|@suppliers";

export const TREASURY_CASH: ModuleSpecs = {
  "cash-position": {
    name: "Cash Position", kind: "overview", summary: "Liquidity available today",
    entity: "Cash Position", ref: "CSH",
    fields: [BANKACC, CURRENCY, "balance|Balance|money|2000;2800000", "available|Available|money|0;2600000", "blocked|Blocked / Lien|money|0;480000", "overdraftLimit|OD Limit|money|0;900000", OWNER, "date|As On|date|-10;0"],
    statuses: ["Healthy", "Adequate", "Tight", "Overdrawn"],
    measure: "balance", rows: 42,
    insight: "68% of group liquidity sits in one USD account — a sweep rule into the BDT operating account would cut short-term borrowing.",
  },

  "bank-accounts": {
    name: "Bank Accounts", kind: "list", summary: "Every account and its mandate",
    entity: "Bank Account", ref: "BAC",
    fields: [BANKACC, "bank|Bank|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank;Dutch-Bangla Bank", "accountType|Type|enum|Current;ND;FC Account;ERQ;Escrow;Payroll", CURRENCY, "balance|Balance|money|500;2400000", "signatories|Signatories|int|1;5", OWNER, "date|Opened On|date|-1400;0"],
    statuses: ["Active", "Dormant", "Under Review", "Closed"],
    measure: "balance",
  },

  "cash-flow-forecast": {
    name: "Cash Flow Forecast", kind: "analytics", summary: "Thirteen-week rolling view",
    entity: "Forecast Week", ref: "CFF",
    fields: ["week|Week|enum|W+1;W+2;W+3;W+4;W+5;W+6;W+7;W+8;W+9;W+10;W+11;W+12;W+13", "inflow|Expected Inflow|money|4000;1400000", "outflow|Expected Outflow|money|4000;1300000", "netFlow|Net Flow|money|0;420000", "closingBalance|Closing Balance|money|0;2200000", "confidence|Confidence|pct|45;98", "date|Week Starting|date|0;95"],
    statuses: ["Surplus", "Balanced", "Deficit", "Critical"],
    measure: "inflow",
  },

  receipts: {
    name: "Receipts", kind: "list", summary: "Money coming in",
    entity: "Receipt", ref: "RCT",
    fields: [PARTY, BANKACC, "amount|Amount|money|500;620000", CURRENCY, "method|Method|enum|LC proceeds;TT;Cheque;Cash;Online transfer", "invoiceRef|Against Invoice|enum|CI-26-0411;CI-26-0428;CI-26-0443;CI-26-0461", OWNER, "date|Value Date|date|-200;10"],
    statuses: ["Expected", "Received", "Partially Received", "Cleared", "Bounced"],
    measure: "amount",
  },

  payments: {
    name: "Payments", kind: "list", summary: "Money going out",
    entity: "Payment", ref: "PAY",
    fields: [VENDOR, BANKACC, "amount|Amount|money|200;480000", CURRENCY, "method|Method|enum|TT;Cheque;Pay order;Online transfer;LC settlement", "billRef|Against Bill|enum|PB-26-0311;PB-26-0328;PB-26-0344;PB-26-0361", OWNER, "date|Payment Date|date|-200;30"],
    statuses: ["Scheduled", "Approved", "Released", "Cleared", "Rejected"],
    measure: "amount",
  },

  "bank-reconciliation": {
    name: "Bank Reconciliation", kind: "list", summary: "Statement against the books",
    entity: "Reconciliation Item", ref: "BRC",
    fields: [BANKACC, "itemType|Item|enum|Unpresented cheque;Deposit in transit;Bank charge;Interest credit;Direct debit;Unidentified credit", "amount|Amount|money|10;280000", "bookBalance|Book Balance|money|500;2200000", "bankBalance|Bank Balance|money|500;2300000", "ageDays|Outstanding|int|0;120;days", "date|Statement Date|date|-180;0"],
    statuses: ["Open", "Matched", "Under Query", "Adjusted", "Written Off"],
    measure: "amount",
  },

  "fx-exposure": {
    name: "FX Exposure", kind: "analytics", summary: "Currency risk on the book",
    entity: "Exposure Line", ref: "FXE",
    fields: [CURRENCY, "receivable|Receivable|money|4000;1600000", "payable|Payable|money|2000;900000", "netExposure|Net Exposure|money|0;1200000", "hedged|Hedged|money|0;900000", "hedgeRatio|Hedge Ratio|pct|0;100", "rate|Rate Used|float|0.8;125;;3", "date|As On|date|-120;0"],
    statuses: ["Hedged", "Partially Hedged", "Unhedged", "Over Hedged"],
    measure: "netExposure",
  },

  investments: {
    name: "Investments & FDR", kind: "list", summary: "Surplus funds put to work",
    entity: "Investment", ref: "INV",
    fields: ["instrument|Instrument|enum|Fixed deposit;Treasury bill;Mutual fund;Call deposit;Bond", "bank|Institution|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank", "principal|Principal|money|10000;1800000", "rate|Interest Rate|pct|1.5;12", "tenorDays|Tenor|int|30;730;days", "maturityValue|Maturity Value|money|10000;2000000", "date|Maturity Date|date|-60;500"],
    statuses: ["Active", "Maturing Soon", "Matured", "Renewed", "Encashed"],
    measure: "principal",
  },

  "loan-register": {
    name: "Loan Register", kind: "list", summary: "Borrowings and repayment schedule",
    entity: "Loan", ref: "LON",
    fields: ["facility|Facility|enum|Term loan;Working capital;Overdraft;Packing credit;LTR;EDF loan", "bank|Bank|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank", "sanctioned|Sanctioned|money|20000;2400000", "outstanding|Outstanding|money|0;2200000", "rate|Interest Rate|pct|4;16", "emi|Instalment|money|500;120000", "date|Next Due|date|-30;180"],
    statuses: ["Active", "Repaying", "Overdue", "Closed", "Restructured"],
    measure: "outstanding",
  },

  "payment-run": {
    name: "Payment Run", kind: "form", summary: "Batch supplier payments",
    entity: "Payment Run", ref: "PRN",
    fields: [BANKACC, "batchNo|Batch No|enum|PR-26-0114;PR-26-0128;PR-26-0143;PR-26-0159", "bills|Bills Included|int|1;60", "amount|Batch Amount|money|1000;820000", CURRENCY, OWNER, "date|Run Date|date|-60;20"],
    statuses: ["Draft", "Submitted", "Approved", "Released", "Rejected"],
    measure: "amount",
  },

  "cash-calendar": {
    name: "Cash Calendar", kind: "calendar", summary: "Dated inflows and outflows",
    entity: "Cash Event", ref: "CCL",
    fields: ["eventType|Event|enum|LC maturity;Salary payment;Supplier payment;Loan instalment;Tax payment;Buyer receipt;FDR maturity", "amount|Amount|money|500;920000", "direction|Direction|enum|Inflow;Outflow", BANKACC, CURRENCY, "date|Event Date|date|-30;90"],
    statuses: ["Scheduled", "Confirmed", "Executed", "Deferred", "Cancelled"],
    measure: "amount",
  },

  "bank-charges": {
    name: "Bank Charges", kind: "analytics", summary: "What banking actually costs",
    entity: "Charge Record", ref: "BCH",
    fields: ["bank|Bank|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank", "chargeType|Charge Type|enum|LC opening;LC negotiation;TT charge;Discrepancy fee;Account maintenance;Guarantee commission", "amount|Amount|money|10;18000", "transactions|Transactions|int|1;90", "avgCharge|Average Charge|float|2;900;USD;2", "date|Period End|date|-300;0"],
    statuses: ["As Agreed", "Above Tariff", "Under Dispute", "Refunded"],
    measure: "amount",
  },

  "liquidity-ratios": {
    name: "Liquidity Ratios", kind: "analytics", summary: "Coverage and working capital health",
    entity: "Ratio Reading", ref: "LQR",
    fields: ["ratio|Ratio|enum|Current ratio;Quick ratio;Cash ratio;Working capital days;Debt service coverage;Interest coverage", "value|Value|float|0.4;6.2;x;2", "target|Target|float|0.8;3;x;2", "variance|vs Target|pct|40;180", "trend|Trend|enum|Improving;Stable;Deteriorating", "date|Period End|date|-360;0"],
    statuses: ["Healthy", "Acceptable", "Weak", "Breach"],
    measure: "value",
  },

  "payment-approval": {
    name: "Payment Approval", kind: "board", summary: "Authorisation chain for outflows",
    entity: "Approval Request", ref: "PAP",
    fields: [VENDOR, "amount|Amount|money|200;620000", CURRENCY, "requester|Requested By|person", "approver|Approver|person", "ageHrs|Pending For|int|1;180;hrs", "date|Requested On|date|-60;0"],
    statuses: ["Submitted", "Finance Review", "CFO Review", "Approved", "Rejected"],
    measure: "amount",
  },

  "petty-cash": {
    name: "Petty Cash", kind: "list", summary: "Small-value site spending",
    entity: "Petty Cash Entry", ref: "PTC",
    fields: ["custodian|Custodian|person", "purpose|Purpose|enum|Local conveyance;Refreshment;Stationery;Minor repair;Courier;Miscellaneous", "amount|Amount|money|2;900", "imprest|Imprest Limit|money|200;4000", "balance|Balance|money|0;4000", "date|Spend Date|date|-120;0"],
    statuses: ["Spent", "Submitted", "Approved", "Replenished", "Rejected"],
    measure: "amount",
  },

  "forex-deals": {
    name: "Forex Deals", kind: "list", summary: "Spot and forward contracts",
    entity: "FX Deal", ref: "FXD",
    fields: ["dealType|Deal Type|enum|Spot;Forward;Swap;Option", "pair|Currency Pair|enum|USD/BDT;EUR/USD;GBP/USD;EUR/BDT", "amount|Deal Amount|money|10000;1600000", "rate|Contract Rate|float|0.8;128;;4", "bank|Bank|enum|Standard Chartered;HSBC;City Bank;Eastern Bank", "gainLoss|Gain / Loss|money|0;68000", "date|Settlement Date|date|-120;180"],
    statuses: ["Booked", "Open", "Settled", "Cancelled", "Rolled Over"],
    measure: "amount",
  },

  "interest-tracking": {
    name: "Interest Tracking", kind: "analytics", summary: "Interest earned and paid",
    entity: "Interest Record", ref: "INT",
    fields: ["source|Source|enum|Term loan;Overdraft;Packing credit;Fixed deposit;Call deposit;LTR", "direction|Direction|enum|Paid;Earned", "principal|Principal|money|10000;2200000", "rate|Rate|pct|1.5;16", "amount|Interest Amount|money|100;92000", "period|Period|enum|Monthly;Quarterly;Half-yearly;Annual", "date|Period End|date|-360;0"],
    statuses: ["Accrued", "Paid", "Received", "Under Dispute"],
    measure: "amount",
  },

  "counterparty-limits": {
    name: "Counterparty Limits", kind: "list", summary: "Exposure ceilings per bank",
    entity: "Limit", ref: "CPL",
    fields: ["bank|Bank|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank;Dutch-Bangla Bank", "limitType|Limit Type|enum|Funded;Non-funded;LC;Guarantee;Forward line", "sanctioned|Sanctioned Limit|money|20000;2800000", "utilised|Utilised|money|0;2700000", "utilisation|Utilisation|pct|0;100", "expiry|Limit Expiry|date|-30;500"],
    statuses: ["Available", "Near Limit", "Fully Utilised", "Expiring", "Expired"],
    measure: "sanctioned",
  },

  "sweep-rules": {
    name: "Cash Sweep Rules", kind: "settings", summary: "Automatic balance movement",
    entity: "Sweep Rule", ref: "SWP",
    fields: ["fromAccount|From Account|enum|SCB USD 0011;HSBC USD 4482;City Bank BDT 9911;EBL EUR 7744", "toAccount|To Account|enum|City Bank BDT 9911;BRAC BDT 3320;DBBL BDT 6655;Investment account", "trigger|Trigger|enum|Above threshold;End of day;Weekly;On deficit", "threshold|Threshold|money|1000;620000", OWNER, "date|Effective From|date|-300;0"],
    statuses: ["Active", "Paused", "Draft", "Retired"],
    settings: ["Sweep balances above the threshold at end of day", "Alert treasury when a sweep fails"],
  },

  "treasury-settings": {
    name: "Treasury Controls", kind: "settings", summary: "Mandates, limits and alerts",
    entity: "Control Rule", ref: "TSET",
    fields: ["rule|Rule|enum|Dual authorisation above limit;Block payment on insufficient balance;Alert on limit utilisation;Mandatory beneficiary verification;Restrict weekend releases", "limit|Limit|money|1000;280000", OWNER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Require two authorised signatories above the payment limit", "Verify beneficiary bank details before the first payment"],
  },
};
