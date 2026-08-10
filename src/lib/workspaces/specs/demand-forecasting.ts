import type { ModuleSpecs } from "../types";

/** Module 74 — Demand Forecasting & Sales Forecasting. */

const BUYER = "buyer|Buyer|enum|@buyers";
const FAMILY = "family|Product Family|enum|Snap fasteners;Jeans buttons;Zipper sliders;Rivets;Eyelets;Buckles;Metal labels;Shank buttons";
const REGION = "region|Region|enum|Europe;North America;East Asia;South Asia;Middle East;Oceania";
const PLANNER = "planner|Demand Planner|person";
const HORIZON = "horizon|Horizon|enum|Next month;Next quarter;Next 6 months;Next 12 months;Season SS26;Season AW26";
const MONTH = "month|Month|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026;Jun 2026;Jul 2026;Aug 2026;Sep 2026;Oct 2026;Nov 2026;Dec 2026";

export const DEMAND_FORECASTING: ModuleSpecs = {
  "forecast-overview": {
    name: "Forecast Overview", kind: "overview", summary: "The current agreed outlook",
    entity: "Forecast Line", ref: "FCO",
    fields: [FAMILY, BUYER, HORIZON, "quantity|Forecast Quantity|int|50000;9800000;pcs", "value|Forecast Value|money|8000;4800000", "confidence|Confidence|pct|28;98", PLANNER, "date|Forecast Date|date|-200;30"],
    statuses: ["Consensus Agreed", "Draft", "Under Review", "Locked", "Superseded"],
    measure: "quantity", rows: 52,
    insight: "Sales and planning are 14% apart on snap fasteners for Q3. History says the planning number has been closer in five of the last six quarters.",
  },

  "demand-forecast": {
    name: "Demand Forecast", kind: "analytics", summary: "Volume by product family",
    entity: "Demand Point", ref: "DMD",
    fields: [FAMILY, "item|Item|enum|@items", MONTH, "baseline|Statistical Baseline|int|20000;4800000;pcs", "adjusted|Adjusted Forecast|int|20000;5800000;pcs", "adjustment|Manual Adjustment|pct|60;150", "method|Method|enum|Moving average;Exponential smoothing;Holt-Winters;Regression;Manual;Buyer input", PLANNER, "date|Period Start|date|-330;300"],
    statuses: ["Published", "Draft", "Under Review", "Superseded"],
    measure: "adjusted", rows: 56,
  },

  "sales-forecast": {
    name: "Sales Forecast", kind: "analytics", summary: "Value by buyer and region",
    entity: "Sales Forecast", ref: "SFC",
    fields: [BUYER, REGION, MONTH, "quantity|Quantity|int|20000;4800000;pcs", "unitPrice|Average Price|float|0.02;3.8;USD;3", "value|Forecast Value|money|4000;4800000", "confidence|Confidence|pct|20;98", "owner|Sales Owner|person", "date|Period Start|date|-330;300"],
    statuses: ["Committed", "Likely", "Upside", "At Risk", "Excluded"],
    measure: "value", rows: 54,
  },

  "buyer-projections": {
    name: "Buyer Projections", kind: "list", summary: "Numbers the buyers share with us",
    entity: "Buyer Projection", ref: "BPJ",
    fields: [BUYER, FAMILY, "season|Season|enum|SS26;AW26;SS27;Carry-over;Basic programme", "projectedQty|Projected Quantity|int|50000;9800000;pcs", "sharePromised|Share Promised to Us|pct|10;100", "ourShare|Our Expected Share|int|20000;4800000;pcs", "reliability|Historical Reliability|pct|32;100", "receivedFrom|Received From|person", "date|Received On|date|-260;0"],
    statuses: ["Received", "Confirmed", "Provisional", "Withdrawn", "Awaited"],
    measure: "projectedQty",
  },

  seasonality: {
    name: "Seasonality Analysis", kind: "analytics", summary: "Peak and lean patterns",
    entity: "Seasonal Index", ref: "SSN",
    fields: [FAMILY, MONTH, "index|Seasonal Index|float|0.3;2.4;;2", "avgVolume|Average Volume|int|20000;4800000;pcs", "peakMonth|Peak Month|enum|March;April;July;August;September;October", "variability|Variability|pct|4;68", "yearsAnalysed|Years Analysed|int|1;8", "date|Analysed On|date|-300;0"],
    statuses: ["Strong Seasonality", "Moderate", "Weak", "No Pattern"],
    measure: "avgVolume",
  },

  "consensus-forecast": {
    name: "Consensus Forecast", kind: "board", summary: "Where sales, planning and finance agree",
    entity: "Consensus Item", ref: "CNS",
    fields: [FAMILY, BUYER, HORIZON, "salesNumber|Sales View|int|20000;5800000;pcs", "planningNumber|Planning View|int|20000;5800000;pcs", "consensusNumber|Consensus|int|20000;5800000;pcs", "gap|Gap|pct|0;62", "date|Meeting Date|date|-160;40"],
    statuses: ["Proposed", "In Discussion", "Agreed", "Escalated", "Locked"],
    measure: "consensusNumber", rows: 48,
  },

  "scenario-planning": {
    name: "Scenario Planning", kind: "analytics", summary: "Best, base and worst case",
    entity: "Scenario", ref: "SCN",
    fields: ["scenario|Scenario|enum|Base case;Optimistic;Pessimistic;Buyer loss;New buyer win;Metal price spike;Freight disruption", FAMILY, "quantity|Quantity|int|20000;9800000;pcs", "value|Value|money|8000;5800000", "probability|Probability|pct|5;95", "capacityNeeded|Capacity Needed|pct|30;160", "marginImpact|Margin Impact|pct|0;38", PLANNER, "date|Modelled On|date|-260;0"],
    statuses: ["Modelled", "Under Review", "Approved", "Superseded"],
    measure: "value",
  },

  "forecast-vs-actual": {
    name: "Forecast vs Actual", kind: "analytics", summary: "How close we were",
    entity: "Comparison", ref: "FVA",
    fields: [FAMILY, BUYER, MONTH, "forecast|Forecast|int|20000;4800000;pcs", "actual|Actual|int|10000;5800000;pcs", "variance|Variance|pct|38;168", "valueGap|Value Gap|money|0;1800000", PLANNER, "date|Period End|date|-330;0"],
    statuses: ["Accurate", "Over Forecast", "Under Forecast", "Significant Miss"],
    measure: "actual", rows: 54,
  },

  "forecast-accuracy": {
    name: "Forecast Accuracy", kind: "analytics", summary: "MAPE, bias and hit rate",
    entity: "Accuracy Record", ref: "ACC",
    fields: [FAMILY, BUYER, "mape|MAPE|pct|2;68", "bias|Bias|pct|0;42", "hitRate|Within Tolerance|pct|18;98", "periodsMeasured|Periods Measured|int|3;24", "method|Method Used|enum|Moving average;Exponential smoothing;Holt-Winters;Regression;Manual;Consensus", PLANNER, "date|Measured On|date|-330;0"],
    statuses: ["Excellent", "Acceptable", "Poor", "Under Review"],
    measure: "mape", rows: 48,
  },

  "model-settings": {
    name: "Model Settings", kind: "settings", summary: "Method, horizon and parameters",
    entity: "Model Config", ref: "MDL",
    fields: [FAMILY, "method|Method|enum|Moving average;Exponential smoothing;Holt-Winters;Regression;Croston (intermittent);Manual override", "windowMonths|History Window|int|3;36;months", "horizonMonths|Forecast Horizon|int|1;18;months", "alpha|Smoothing Factor|float|0.05;0.95;;2", "seasonalityOn|Seasonality Applied|bool|Yes;No", PLANNER, "date|Effective From|date|-500;30"],
    statuses: ["Active", "Draft", "Under Test", "Superseded"],
    measure: "horizonMonths",
    settings: ["Re-fit every model automatically at the start of each quarter", "Fall back to a moving average when history is shorter than six months"],
  },

  "forecast-entry": {
    name: "Forecast Entry", kind: "form", summary: "Submit a number for a period",
    entity: "Forecast Entry", ref: "FEN",
    fields: [FAMILY, BUYER, MONTH, "quantity|Quantity|int|10000;5800000;pcs", "value|Value|money|2000;4800000", "confidence|Confidence|pct|20;98", "rationale|Rationale|enum|Buyer confirmed programme;Historical run rate;New development;Season shift;Price change;Capacity constraint", "submittedBy|Submitted By|person", "date|Submitted On|date|-200;15"],
    statuses: ["Draft", "Submitted", "Reviewed", "Accepted", "Rejected"],
    measure: "quantity", rows: 50,
  },

  "historical-demand": {
    name: "Historical Demand", kind: "list", summary: "What actually shipped",
    entity: "History Record", ref: "HST",
    fields: [FAMILY, "item|Item|enum|@items", BUYER, MONTH, "quantity|Shipped Quantity|int|5000;4800000;pcs", "value|Shipped Value|money|1000;2400000", "orders|Orders|int|1;48", "date|Period End|date|-720;0"],
    statuses: ["Confirmed", "Provisional", "Adjusted", "Excluded from Model"],
    measure: "quantity", rows: 58,
  },

  "item-forecast": {
    name: "Item-Level Forecast", kind: "list", summary: "SKU-level projection",
    entity: "Item Forecast", ref: "IFC",
    fields: ["item|Item|enum|@items", FAMILY, MONTH, "quantity|Forecast Quantity|int|2000;2400000;pcs", "onHand|Stock on Hand|int|0;980000;pcs", "coverageDays|Days of Cover|int|0;220;days", "reorderQty|Suggested Build|int|0;2400000;pcs", PLANNER, "date|Period Start|date|-120;300"],
    statuses: ["Sufficient Cover", "Build Required", "Excess", "Phase Out", "New Item"],
    measure: "quantity", rows: 56,
  },

  "region-forecast": {
    name: "Regional Forecast", kind: "analytics", summary: "Where the demand sits",
    entity: "Regional Forecast", ref: "RFC",
    fields: [REGION, FAMILY, HORIZON, "quantity|Quantity|int|50000;9800000;pcs", "value|Value|money|8000;5800000", "growth|Growth vs Last Year|pct|0;68", "share|Share of Total|pct|1;48", "owner|Regional Owner|person", "date|Period Start|date|-200;300"],
    statuses: ["Growing", "Stable", "Declining", "Emerging", "Under Review"],
    measure: "value",
  },

  "capacity-implication": {
    name: "Capacity Implication", kind: "analytics", summary: "Can we actually make it",
    entity: "Capacity Check", ref: "CIM",
    fields: [FAMILY, "process|Process|enum|Pressing;Polishing;Barrel plating;Rack plating;Assembly;Packing", MONTH, "demandHrs|Demand Hours|float|20;3200;hrs;0", "capacityHrs|Capacity Hours|float|20;3200;hrs;0", "coverage|Coverage|pct|32;168", "gapHrs|Gap|float|0;1400;hrs;0", "action|Action Needed|enum|None;Overtime;Subcontract;Add shift;Invest;Reshape demand", "date|Period Start|date|-90;300"],
    statuses: ["Sufficient", "Tight", "Shortfall", "Severe Shortfall"],
    measure: "demandHrs", rows: 50,
  },

  "material-requirement": {
    name: "Material Implication", kind: "analytics", summary: "What the forecast needs bought",
    entity: "Material Requirement", ref: "MRQ",
    fields: ["material|Material|enum|Brass Strip 0.8mm;Brass Strip 1.2mm;Zinc Alloy Ingot;Steel Wire 2.0mm;Nickel Anode;Copper Anode;Packing Carton", FAMILY, MONTH, "requiredQty|Required|float|200;24000;kg;0", "onHand|On Hand|float|0;18000;kg;0", "toBuy|To Purchase|float|0;24000;kg;0", "leadDays|Lead Time|int|7;120;days", "value|Purchase Value|money|2000;980000", "date|Required By|date|-30;300"],
    statuses: ["Covered", "Order Now", "Order Soon", "Shortage Risk", "Excess"],
    measure: "toBuy", rows: 52,
  },

  "forecast-versions": {
    name: "Forecast Versions", kind: "list", summary: "Every published cut of the number",
    entity: "Forecast Version", ref: "FVR",
    fields: ["version|Version|enum|FY26 Budget;Q1 Reforecast;Q2 Reforecast;Monthly rolling — Apr;Monthly rolling — May;Season SS26 plan", HORIZON, "totalQty|Total Quantity|int|400000;24000000;pcs", "totalValue|Total Value|money|48000;9800000", "changeVsPrior|Change vs Prior|pct|0;42", "linesCount|Forecast Lines|int|20;980", PLANNER, "date|Published On|date|-330;0"],
    statuses: ["Published", "Draft", "Locked", "Superseded", "Withdrawn"],
    measure: "totalValue",
  },

  "bias-tracking": {
    name: "Bias Tracking", kind: "analytics", summary: "Who consistently over or under calls it",
    entity: "Bias Record", ref: "BIA",
    fields: ["forecaster|Forecaster|person", FAMILY, "periods|Periods Measured|int|3;24", "avgBias|Average Bias|pct|0;48", "overForecast|Over-Forecast Periods|int|0;24", "underForecast|Under-Forecast Periods|int|0;24", "mape|MAPE|pct|2;62", "date|Measured On|date|-330;0"],
    statuses: ["Neutral", "Over Forecasting", "Under Forecasting", "Erratic"],
    measure: "avgBias",
  },

  "new-product-forecast": {
    name: "New Product Forecast", kind: "list", summary: "Numbers with no history behind them",
    entity: "New Product Forecast", ref: "NPF",
    fields: ["item|New Item|enum|Recycled Brass Snap 15mm;Nickel-Free Slider #5;Laser-Etched Metal Label;Magnetic Closure 18mm;Bio-Coated Rivet 9mm", FAMILY, BUYER, "launchQty|Launch Quantity|int|20000;2400000;pcs", "analogItem|Analogue Item|enum|@items", "rampMonths|Ramp-up|int|1;12;months", "confidence|Confidence|pct|10;80", PLANNER, "date|Launch Date|date|-60;300"],
    statuses: ["Concept", "Sampling", "Approved", "Launched", "Dropped"],
    measure: "launchQty",
  },

  "forecast-calendar": {
    name: "Forecast Calendar", kind: "calendar", summary: "The planning cycle rhythm",
    entity: "Cycle Event", ref: "FCL",
    fields: ["event|Event|enum|Forecast input window opens;Sales submission deadline;Statistical run;Consensus meeting;Forecast lock;Capacity review;Buyer projection request", HORIZON, "owner|Owner|person", "durationDays|Duration|int|1;10;days", "participants|Participants|int|2;24", "date|Scheduled For|date|-90;180"],
    statuses: ["Scheduled", "In Progress", "Completed", "Missed", "Rescheduled"],
    measure: "participants",
  },
};
