import type { ModuleSpecs } from "../types";

/** Module 73 — Multi-Currency & Forex Management. */

const CURRENCY = "currency|Currency|enum|USD;EUR;GBP;JPY;CNY;BDT;HKD;SGD;AED;INR";
const PAIR = "pair|Currency Pair|enum|USD/BDT;EUR/BDT;GBP/BDT;JPY/BDT;CNY/BDT;EUR/USD;GBP/USD;USD/HKD";
const BANK = "bank|Bank|enum|Standard Chartered;HSBC;Eastern Bank;City Bank;Dutch-Bangla;Islami Bank;Prime Bank;Brac Bank";
const OFFICER = "officer|Treasury Officer|person";
const PERIOD = "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026;Q1 2026;Q2 2026";

export const MULTI_CURRENCY_FOREX: ModuleSpecs = {
  "currency-master": {
    name: "Currency Master", kind: "list", summary: "Currencies we trade in",
    entity: "Currency", ref: "CUR",
    fields: [CURRENCY, "name|Currency Name|enum|US Dollar;Euro;Pound Sterling;Japanese Yen;Chinese Yuan;Bangladeshi Taka;Hong Kong Dollar;Singapore Dollar;UAE Dirham;Indian Rupee", "symbol|Symbol|enum|$;€;£;¥;元;৳;HK$;S$;د.إ;₹", "decimals|Decimal Places|int|0;3", "isBase|Base Currency|bool|Yes;No", "transactions|Transactions (12m)|int|0;4800", OFFICER, "date|Enabled On|date|-2400;0"],
    statuses: ["Active", "Restricted", "Inactive", "Under Setup"],
    measure: "transactions",
  },

  "exchange-rates": {
    name: "Exchange Rates", kind: "list", summary: "Daily and contract rates",
    entity: "Rate", ref: "RTE",
    fields: [PAIR, "rateType|Rate Type|enum|Spot;Buying;Selling;Average;Contract;Budget;Customs", "rate|Rate|float|0.6;168;;4", "source|Source|enum|Bangladesh Bank;Bank quote;Reuters;Buyer contract;Internal budget", BANK, "spread|Spread|pct|0;3", "date|Rate Date|date|-120;3"],
    statuses: ["Published", "Provisional", "Superseded", "Pending Approval"],
    measure: "rate", rows: 56,
    insight: "The USD/BDT selling rate has moved 4.2% in eleven weeks. Unhedged export receivables of USD 3.8m carry roughly USD 160k of translation risk at current levels.",
  },

  "rate-history": {
    name: "Rate History", kind: "analytics", summary: "How rates have moved",
    entity: "Rate Point", ref: "RHS",
    fields: [PAIR, "openRate|Opening|float|0.6;168;;4", "closeRate|Closing|float|0.6;168;;4", "highRate|High|float|0.6;172;;4", "lowRate|Low|float|0.5;166;;4", "movement|Movement|pct|0;8", "volatility|Volatility|pct|0;12", PERIOD, "date|Period End|date|-360;0"],
    statuses: ["Stable", "Appreciating", "Depreciating", "Volatile"],
    measure: "closeRate", rows: 52,
  },

  "rate-policy": {
    name: "Rate Policy", kind: "settings", summary: "Which rate applies where",
    entity: "Rate Rule", ref: "RPL",
    fields: ["transactionType|Transaction Type|enum|Export invoice;Import purchase;LC settlement;Payroll;Asset purchase;Period-end revaluation;Consolidation", "rateType|Rate Applied|enum|Spot on document date;Monthly average;Period-end closing;Contract rate;Budget rate", CURRENCY, "tolerance|Variance Tolerance|pct|0;5", "autoFetch|Auto Fetch|bool|Yes;No", OFFICER, "date|Effective From|date|-600;30"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Fetch the central bank rate automatically each working morning", "Block posting when the applied rate deviates more than 2% from the daily rate"],
  },

  "rate-upload": {
    name: "Rate Upload", kind: "form", summary: "Load rates for a date",
    entity: "Rate Upload", ref: "RUP",
    fields: [PAIR, "rateType|Rate Type|enum|Spot;Buying;Selling;Average;Contract", "rate|Rate|float|0.6;168;;4", "source|Source|enum|Bangladesh Bank;Bank quote;Reuters;Manual entry;File import", "recordsLoaded|Rates Loaded|int|1;120", OFFICER, "date|Applies To|date|-30;5"],
    statuses: ["Draft", "Validated", "Posted", "Rejected", "Superseded"],
    measure: "recordsLoaded",
  },

  revaluation: {
    name: "Period-End Revaluation", kind: "form", summary: "Restate open foreign balances",
    entity: "Revaluation Run", ref: "RVL",
    fields: [PERIOD, CURRENCY, "account|Account|enum|Trade receivables;Trade payables;Foreign bank balance;LC liability;Advance from buyer;Advance to supplier", "openingBalance|Opening Balance|money|8000;9800000", "closingRate|Closing Rate|float|0.6;168;;4", "adjustment|Revaluation Adjustment|money|0;480000", OFFICER, "date|Run Date|date|-330;0"],
    statuses: ["Draft", "Calculated", "Reviewed", "Posted", "Reversed"],
    measure: "adjustment", rows: 46,
  },

  "realized-gain-loss": {
    name: "Realised Gain / Loss", kind: "analytics", summary: "FX impact on settled items",
    entity: "Realised Entry", ref: "RGL",
    fields: [CURRENCY, "documentType|Document|enum|Export invoice;Import payment;LC settlement;Supplier payment;Buyer receipt;Bank transfer", "amountFc|Amount (FC)|money|2000;2400000", "bookedRate|Booked Rate|float|0.6;168;;4", "settledRate|Settled Rate|float|0.6;168;;4", "gainLoss|Gain / Loss|money|0;180000", PERIOD, "date|Settled On|date|-330;0"],
    statuses: ["Gain", "Loss", "Neutral", "Under Review"],
    measure: "gainLoss", rows: 52,
  },

  "unrealized-gain-loss": {
    name: "Unrealised Gain / Loss", kind: "analytics", summary: "FX impact on open positions",
    entity: "Unrealised Entry", ref: "UGL",
    fields: [CURRENCY, "account|Account|enum|Trade receivables;Trade payables;Foreign bank balance;LC liability;Advance from buyer;Advance to supplier", "openBalance|Open Balance|money|4000;4800000", "bookedRate|Booked Rate|float|0.6;168;;4", "currentRate|Current Rate|float|0.6;168;;4", "gainLoss|Unrealised Impact|money|0;280000", PERIOD, "date|As On|date|-330;0"],
    statuses: ["Unrealised Gain", "Unrealised Loss", "Neutral", "Under Review"],
    measure: "gainLoss", rows: 48,
  },

  "forex-exposure": {
    name: "Forex Exposure", kind: "analytics", summary: "Net position by currency",
    entity: "Exposure", ref: "EXP",
    fields: [CURRENCY, "receivables|Receivables|money|0;9800000", "payables|Payables|money|0;4800000", "netPosition|Net Position|money|0;9800000", "hedged|Hedged|money|0;4800000", "hedgeRatio|Hedge Ratio|pct|0;100", "riskValue|Value at Risk|money|0;680000", "date|As On|date|-300;0"],
    statuses: ["Well Hedged", "Partially Hedged", "Unhedged", "Over Hedged"],
    measure: "netPosition",
  },

  hedging: {
    name: "Hedging & Forwards", kind: "list", summary: "Forward contract register",
    entity: "Forward Contract", ref: "FWD",
    fields: [PAIR, BANK, "notional|Notional Amount|money|20000;4800000", "forwardRate|Forward Rate|float|0.6;168;;4", "spotAtBooking|Spot at Booking|float|0.6;168;;4", "premium|Premium|pct|0;8", "maturity|Maturity Date|date|-60;400", OFFICER, "date|Booked On|date|-500;0"],
    statuses: ["Open", "Partially Utilised", "Matured", "Settled", "Cancelled"],
    measure: "notional",
  },

  "hedge-effectiveness": {
    name: "Hedge Effectiveness", kind: "analytics", summary: "Did the hedge do its job",
    entity: "Effectiveness Record", ref: "HEF",
    fields: [PAIR, "notional|Notional|money|20000;4800000", "hedgedRate|Hedged Rate|float|0.6;168;;4", "marketRate|Market Rate at Maturity|float|0.6;168;;4", "benefit|Benefit / Cost|money|0;280000", "effectiveness|Effectiveness|pct|38;120", PERIOD, "date|Assessed On|date|-330;0"],
    statuses: ["Highly Effective", "Effective", "Partially Effective", "Ineffective"],
    measure: "benefit",
  },

  "multi-currency-ledger": {
    name: "Multi-Currency Ledger", kind: "list", summary: "Dual-currency postings",
    entity: "Ledger Entry", ref: "MCL",
    fields: ["account|Account|enum|Trade receivables;Trade payables;Bank — USD;Bank — EUR;Bank — BDT;LC margin;FX gain;FX loss", CURRENCY, "amountFc|Amount (FC)|money|100;4800000", "rate|Rate Applied|float|0.6;168;;4", "amountBase|Amount (Base)|money|1000;480000000", "documentType|Document|enum|Sales invoice;Purchase invoice;Receipt;Payment;Journal;LC settlement", "date|Posting Date|date|-330;0"],
    statuses: ["Posted", "Draft", "Reversed", "Under Review"],
    measure: "amountFc", rows: 56,
  },

  "conversion-calculator": {
    name: "Currency Conversion", kind: "form", summary: "Convert an amount at a chosen rate",
    entity: "Conversion", ref: "CNV",
    fields: ["fromCurrency|From|enum|USD;EUR;GBP;JPY;CNY;BDT;HKD", "toCurrency|To|enum|USD;EUR;GBP;JPY;CNY;BDT;HKD", "amount|Amount|money|10;4800000", "rateType|Rate Type|enum|Spot;Buying;Selling;Average;Contract", "rate|Rate Used|float|0.006;168;;4", "converted|Converted Amount|money|10;480000000", "requester|Requested By|person", "date|Converted On|date|-90;0"],
    statuses: ["Draft", "Confirmed", "Applied", "Discarded"],
    measure: "amount",
  },

  "bank-rates": {
    name: "Bank Quoted Rates", kind: "list", summary: "What each bank offers today",
    entity: "Bank Quote", ref: "BQT",
    fields: [BANK, PAIR, "buyRate|Buying|float|0.6;168;;4", "sellRate|Selling|float|0.6;168;;4", "spread|Spread|pct|0;4", "validHrs|Quote Valid|int|1;48;hrs", "minAmount|Minimum Amount|money|1000;480000", OFFICER, "date|Quoted On|date|-60;1"],
    statuses: ["Best Rate", "Competitive", "Above Market", "Expired"],
    measure: "spread", rows: 48,
  },

  remittance: {
    name: "Remittance Register", kind: "list", summary: "Money in and money out",
    entity: "Remittance", ref: "RMT",
    fields: ["direction|Direction|enum|Inward;Outward", CURRENCY, BANK, "amountFc|Amount (FC)|money|1000;4800000", "rate|Rate Applied|float|0.6;168;;4", "charges|Bank Charges|money|10;9800", "purpose|Purpose|enum|Export proceeds;Import payment;Commission;Freight;Royalty;Sample charge;Advance", "date|Value Date|date|-330;15"],
    statuses: ["Initiated", "In Process", "Credited", "Returned", "Held for Documents"],
    measure: "amountFc", rows: 52,
  },

  "exposure-limits": {
    name: "Exposure Limits", kind: "settings", summary: "How much open risk we allow",
    entity: "Exposure Limit", ref: "ELM",
    fields: [CURRENCY, "limitType|Limit Type|enum|Net open position;Single counterparty;Forward book;Daily dealing;Overnight position", "limit|Limit|money|20000;9800000", "utilised|Utilised|money|0;9800000", "utilisation|Utilisation|pct|0;128", "approver|Approved By|person", "date|Effective From|date|-600;30"],
    statuses: ["Within Limit", "Near Limit", "Breached", "Under Review"],
    measure: "limit",
    settings: ["Alert treasury when any currency position reaches 80% of its limit", "Require board approval to raise a net open position limit"],
  },

  "translation-adjustment": {
    name: "Translation Adjustment", kind: "analytics", summary: "Consolidating foreign entities",
    entity: "Translation Entry", ref: "TRA",
    fields: ["entity|Entity|enum|Smart Metal Accessories Ltd.;Smart Metal EPZ Ltd.;Smart Metal HK Ltd.;Smart Finishing Services Ltd.", CURRENCY, "assets|Assets|money|48000;9800000", "liabilities|Liabilities|money|8000;4800000", "closingRate|Closing Rate|float|0.6;168;;4", "adjustment|Translation Reserve|money|0;680000", PERIOD, "date|Period End|date|-330;0"],
    statuses: ["Posted", "Calculated", "Under Review", "Reversed"],
    measure: "adjustment",
  },

  "rate-variance": {
    name: "Rate Variance", kind: "analytics", summary: "Applied against benchmark",
    entity: "Variance Record", ref: "RVR",
    fields: [PAIR, "documentType|Document|enum|Export invoice;Import purchase;LC settlement;Remittance;Journal", "appliedRate|Applied Rate|float|0.6;168;;4", "benchmarkRate|Benchmark Rate|float|0.6;168;;4", "variance|Variance|pct|0;6", "valueImpact|Value Impact|money|0;280000", "postedBy|Posted By|person", "date|Posted On|date|-300;0"],
    statuses: ["Within Tolerance", "Marginal", "Outside Tolerance", "Under Investigation"],
    measure: "valueImpact", rows: 50,
  },

  "fx-transactions": {
    name: "FX Transactions", kind: "list", summary: "Every deal done with a bank",
    entity: "FX Deal", ref: "FXT",
    fields: [PAIR, BANK, "dealType|Deal Type|enum|Spot purchase;Spot sale;Forward booking;Forward utilisation;Swap;Cancellation", "amountFc|Amount|money|2000;4800000", "dealRate|Deal Rate|float|0.6;168;;4", "charges|Charges|money|5;9800", OFFICER, "date|Deal Date|date|-330;5"],
    statuses: ["Executed", "Pending Settlement", "Settled", "Cancelled", "Failed"],
    measure: "amountFc", rows: 50,
  },

  "forex-settings": {
    name: "Forex Configuration", kind: "settings", summary: "Rounding, sources and controls",
    entity: "Forex Rule", ref: "FST",
    fields: ["rule|Rule|enum|Primary rate source;Rounding precision;Revaluation frequency;Gain-loss account;Rate approval required;Historical rate retention", "value|Configured Value|enum|Bangladesh Bank;4 decimals;Monthly;FX Gain / Loss;Above 1% deviation;7 years", OFFICER, "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Revalue every open foreign balance at each month end", "Post realised and unrealised differences to separate accounts", "Require dual approval for any manual rate override"],
  },
};
