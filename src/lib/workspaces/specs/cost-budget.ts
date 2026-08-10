import type { ModuleSpecs } from "../types";

/** Module 46 — Cost Control & Budget Management. */

const COSTCENTER = "costCenter|Cost Center|enum|CC-1001 Production;CC-2001 Plating;CC-3001 Packing;CC-4001 Admin;CC-5001 Sales;CC-6001 Maintenance;CC-7001 Quality";
const HEAD = "head|Budget Head|enum|Raw material;Direct labour;Power & fuel;Consumables;Repairs & maintenance;Freight;Travel;Depreciation;Overtime;Professional fees";
const ITEM = "item|Product|enum|@items";
const OWNER = "owner|Budget Owner|person";
const PERIOD = "period|Period|enum|Q1 FY26;Q2 FY26;Q3 FY26;Q4 FY26;FY26 Full Year";

export const COST_BUDGET: ModuleSpecs = {
  budgets: {
    name: "Budget Register", kind: "list", summary: "Departmental budgets on record",
    entity: "Budget", ref: "BGT",
    fields: [COSTCENTER, HEAD, PERIOD, "budget|Budget Amount|money|4000;980000", "committed|Committed|money|0;960000", "available|Available|money|0;900000", OWNER, "date|Approved On|date|-300;0"],
    statuses: ["Draft", "Submitted", "Approved", "Revised", "Frozen"],
    measure: "budget", rows: 48,
    insight: "Power & fuel is tracking 12% above budget across three cost centres — the energy tariff revision has not been re-based yet.",
  },

  "budget-vs-actual": {
    name: "Budget vs Actual", kind: "analytics", summary: "Variance by head and centre",
    entity: "Variance Line", ref: "BVA",
    fields: [COSTCENTER, HEAD, "budget|Budget|money|2000;860000", "actual|Actual|money|1000;920000", "variance|Variance|money|0;180000", "variancePct|Variance|pct|58;148", "date|Period End|date|-300;0"],
    statuses: ["Favourable", "On Plan", "Adverse", "Under Review"],
    measure: "actual",
  },

  "standard-costing": {
    name: "Standard Costing", kind: "list", summary: "The standard cost master",
    entity: "Standard Cost", ref: "STC",
    fields: [ITEM, "material|Material Cost|float|0.004;0.9;USD;4", "labour|Labour Cost|float|0.001;0.3;USD;4", "overhead|Overhead|float|0.001;0.24;USD;4", "total|Standard Cost|float|0.008;1.4;USD;4", "revision|Revision|enum|Rev 1;Rev 2;Rev 3;Rev 4", OWNER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Under Revision", "Superseded", "Draft"],
    measure: "total",
  },

  "variance-analysis": {
    name: "Variance Analysis", kind: "analytics", summary: "Price, usage and mix effects",
    entity: "Variance Record", ref: "VAR",
    fields: [ITEM, "type|Variance Type|enum|Material price;Material usage;Labour rate;Labour efficiency;Overhead absorption;Mix", "amount|Variance Amount|money|100;180000", "favourable|Favourable|bool|Yes;No", "volume|Volume|int|10000;600000;pcs", "impactPerUnit|Impact per 1000 pcs|float|0.4;28;USD;2", "date|Period End|date|-300;0"],
    statuses: ["Favourable", "Adverse", "Explained", "Under Investigation"],
    measure: "amount",
  },

  "product-profitability": {
    name: "Product Profitability", kind: "analytics", summary: "Margin by product family",
    entity: "Product Margin", ref: "PPF",
    fields: [ITEM, "revenue|Revenue|money|8000;980000", "cost|Cost|money|4000;860000", "grossMargin|Gross Margin|money|500;420000", "marginPct|Margin|pct|2;46", "volume|Volume|int|20000;1400000;pcs", "date|Period End|date|-300;0"],
    statuses: ["Star", "Healthy", "Marginal", "Loss Making"],
    measure: "revenue",
  },

  "order-profitability": {
    name: "Order Profitability", kind: "analytics", summary: "Margin realised per order",
    entity: "Order Margin", ref: "OPF",
    fields: ["order|Sales Order|enum|SO-26-2041;SO-26-2058;SO-26-2073;SO-26-2090;SO-26-2114;SO-26-2138", "buyer|Buyer|enum|@buyers", "revenue|Order Value|money|8000;620000", "actualCost|Actual Cost|money|4000;560000", "margin|Margin|money|200;280000", "marginPct|Margin|pct|1;42", "date|Closed On|date|-300;0"],
    statuses: ["Above Target", "On Target", "Below Target", "Loss Making"],
    measure: "revenue",
  },

  "cost-centers": {
    name: "Cost Center Report", kind: "analytics", summary: "Spend by responsibility centre",
    entity: "Cost Center Result", ref: "CCR",
    fields: [COSTCENTER, "budget|Budget|money|8000;880000", "actual|Actual Spend|money|4000;940000", "utilisation|Budget Used|pct|20;140", "headcount|Headcount|int|4;180", "costPerHead|Cost per Head|money|200;9800", "date|Period End|date|-300;0"],
    statuses: ["Within Budget", "At Limit", "Over Budget", "Under Review"],
    measure: "actual",
  },

  "overhead-analysis": {
    name: "Overhead Analysis", kind: "analytics", summary: "Absorbed against actual overhead",
    entity: "Overhead Record", ref: "OHD",
    fields: [COSTCENTER, "driver|Absorption Driver|enum|Machine hours;Labour hours;Units produced;Floor area;Headcount", "absorbed|Absorbed|money|2000;620000", "actual|Actual|money|2000;680000", "underOver|Under / Over|money|0;90000", "rate|Absorption Rate|float|0.4;42;USD;2", "date|Period End|date|-300;0"],
    statuses: ["Over Absorbed", "Balanced", "Under Absorbed", "Under Review"],
    measure: "actual",
  },

  forecast: {
    name: "Cost Forecast", kind: "analytics", summary: "Projected run-rate to year end",
    entity: "Forecast Line", ref: "CFC",
    fields: [COSTCENTER, HEAD, "ytdActual|YTD Actual|money|4000;720000", "forecast|Full Year Forecast|money|8000;1400000", "budget|Full Year Budget|money|8000;1300000", "gap|Gap to Budget|money|0;220000", "confidence|Confidence|pct|50;98", "date|Forecast For|date|0;300"],
    statuses: ["On Budget", "Overrun Expected", "Saving Expected", "Under Review"],
    measure: "forecast",
  },

  "budget-entry": {
    name: "Budget Entry", kind: "form", summary: "Capture a budget line",
    entity: "Budget Line", ref: "BLN",
    fields: [COSTCENTER, HEAD, PERIOD, "amount|Budget Amount|money|1000;800000", "basis|Basis|enum|Prior year actual;Zero based;Volume driven;Contract driven;Management estimate", OWNER, "date|Submitted On|date|-120;10"],
    statuses: ["Draft", "Submitted", "Under Review", "Approved", "Rejected"],
    measure: "amount",
  },

  "capex-budget": {
    name: "Capex Budget", kind: "list", summary: "Capital spend plan and drawdown",
    entity: "Capex Item", ref: "CPX",
    fields: ["project|Project|enum|Plating line upgrade;New press installation;Solar rooftop;ETP expansion;Warehouse racking;ERP rollout", "budget|Budget|money|20000;1600000", "spent|Spent to Date|money|0;1500000", "drawdown|Drawdown|pct|0;100", "payback|Payback|float|0.6;7;yrs;1", OWNER, "date|Completion Target|date|-120;500"],
    statuses: ["Proposed", "Approved", "In Progress", "Completed", "Deferred"],
    measure: "budget",
  },

  "department-budget": {
    name: "Department Budgets", kind: "list", summary: "Budget held by each department",
    entity: "Department Budget", ref: "DBG",
    fields: ["department|Department|enum|Production;Quality;Maintenance;Stores;Commercial;HR;Finance;IT", PERIOD, "budget|Budget|money|8000;920000", "actual|Actual|money|2000;980000", "utilisation|Utilisation|pct|10;135", OWNER, "date|Period End|date|-300;0"],
    statuses: ["Within Budget", "At Limit", "Over Budget", "Frozen"],
    measure: "budget",
  },

  "cost-drivers": {
    name: "Cost Drivers", kind: "list", summary: "What actually moves the cost base",
    entity: "Cost Driver", ref: "CDR",
    fields: ["driver|Driver|enum|Brass price per kg;Electricity tariff;Labour wage rate;Freight rate;Chemical price;Exchange rate", "currentValue|Current Value|float|0.2;480;;2", "baseValue|Base Value|float|0.2;460;;2", "movement|Movement|pct|72;146", "annualImpact|Annual Impact|money|2000;480000", "date|Updated On|date|-200;0"],
    statuses: ["Stable", "Rising", "Falling", "Volatile"],
    measure: "annualImpact",
  },

  "price-cost-tracking": {
    name: "Price vs Cost Tracking", kind: "analytics", summary: "Selling price against unit cost",
    entity: "Tracking Point", ref: "PCT",
    fields: [ITEM, "sellingPrice|Selling Price|float|0.02;1.8;USD;3", "unitCost|Unit Cost|float|0.01;1.4;USD;3", "marginPerUnit|Margin per Unit|float|0.001;0.6;USD;4", "marginPct|Margin|pct|1;44", "volume|Volume|int|20000;1200000;pcs", "date|Period End|date|-300;0"],
    statuses: ["Healthy Margin", "Thin Margin", "Below Cost", "Under Repricing"],
    measure: "volume",
  },

  "savings-initiatives": {
    name: "Savings Initiatives", kind: "board", summary: "Cost reduction projects in flight",
    entity: "Initiative", ref: "SAV",
    fields: ["initiative|Initiative|enum|Nesting optimisation;Chemical recovery;LED retrofit;Freight consolidation;Alternate supplier;Scrap reduction;Overtime control", COSTCENTER, "targetSaving|Target Saving|money|1000;280000", "realised|Realised|money|0;280000", "achievement|Achievement|pct|0;120", OWNER, "date|Target Date|date|-90;300"],
    statuses: ["Idea", "Approved", "In Progress", "Realised", "Dropped"],
    measure: "targetSaving",
  },

  "budget-approval": {
    name: "Budget Approval", kind: "board", summary: "Sign-off chain for budget lines",
    entity: "Approval Request", ref: "BAP",
    fields: [COSTCENTER, HEAD, "amount|Amount|money|2000;900000", "requester|Requested By|person", "approver|Approver|person", "ageDays|Pending For|int|0;30;days", "date|Requested On|date|-90;0"],
    statuses: ["Submitted", "Department Review", "Finance Review", "Approved", "Rejected"],
    measure: "amount",
  },

  "cost-allocation": {
    name: "Cost Allocation Rules", kind: "settings", summary: "How shared costs are spread",
    entity: "Allocation Rule", ref: "ALC",
    fields: ["cost|Shared Cost|enum|Factory rent;Power;Security;Canteen;IT services;Insurance", "basis|Allocation Basis|enum|Floor area;Headcount;Machine hours;Units produced;Revenue share", "fromCenter|From|enum|CC-9001 Shared;CC-9002 Utilities;CC-9003 Admin Pool", "toCenter|To|enum|CC-1001 Production;CC-2001 Plating;CC-3001 Packing;All centres", "sharePct|Share|pct|2;60", "date|Effective From|date|-400;0", "amount|Allocated Amount|money|500;280000"],
    statuses: ["Active", "Draft", "Superseded", "Suspended"],
    settings: ["Re-allocate shared overhead monthly", "Block postings to pooled cost centres after allocation"],
  },

  "scenario-planning": {
    name: "Scenario Planning", kind: "analytics", summary: "What-if on the cost base",
    entity: "Scenario", ref: "SCN",
    fields: ["scenario|Scenario|enum|Brass +10%;Wage +8%;Energy tariff +15%;Volume -20%;FX +5%;Freight -12%", "baseProfit|Base Profit|money|20000;980000", "scenarioProfit|Scenario Profit|money|4000;1100000", "impact|Impact|money|0;280000", "impactPct|Impact|pct|1;38", "likelihood|Likelihood|pct|10;95", "date|Modelled On|date|-200;0"],
    statuses: ["Modelled", "Under Review", "Accepted", "Discarded"],
    measure: "impact",
  },

  "monthly-review": {
    name: "Monthly Cost Review", kind: "calendar", summary: "Review meetings and actions",
    entity: "Review Meeting", ref: "MCR",
    fields: [COSTCENTER, "period|Review Period|enum|Jan 26;Feb 26;Mar 26;Apr 26;May 26;Jun 26;Jul 26", "actions|Actions Raised|int|0;14", "closed|Actions Closed|int|0;14", OWNER, "date|Meeting Date|date|-200;40"],
    statuses: ["Scheduled", "Held", "Actions Open", "Closed", "Postponed"],
    measure: "actions",
  },

  "budget-settings": {
    name: "Budget Controls", kind: "settings", summary: "Limits, freezes and alerts",
    entity: "Control Rule", ref: "BSET",
    fields: ["rule|Rule|enum|Block PO above available budget;Alert at 90% utilisation;Freeze budget after quarter close;Require approval for reallocation;Auto-carry unspent capex", "threshold|Threshold|pct|60;100", OWNER, "date|Effective From|date|-400;0", "budgetsCovered|Budgets Covered|int|1;40"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Block purchase orders that exceed the available budget", "Alert the budget owner at 90% utilisation"],
  },
};
