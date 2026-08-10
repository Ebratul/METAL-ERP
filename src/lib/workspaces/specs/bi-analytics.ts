import type { ModuleSpecs } from "../types";

/** Module 58 — Business Intelligence (BI) & Analytics. */

const DOMAIN = "domain|Domain|enum|Sales;Production;Quality;Inventory;Finance;Procurement;HR;Logistics";
const OWNER = "owner|Report Owner|person";
const AUDIENCE = "audience|Audience|enum|Board;Management;Department heads;Supervisors;Buyers;Auditors";
const FREQUENCY = "frequency|Frequency|enum|Real time;Daily;Weekly;Monthly;Quarterly;On demand";
const SOURCE = "source|Data Source|enum|Sales orders;Work orders;Stock ledger;General ledger;QC results;Attendance;Shipments;IoT telemetry";

export const BI_ANALYTICS: ModuleSpecs = {
  "report-library": {
    name: "Report Library", kind: "list", summary: "Every saved report on the platform",
    entity: "Report", ref: "RPT",
    fields: ["reportName|Report|enum|Daily production summary;Order book status;Buyer-wise sales;Inventory ageing;Defect Pareto;Cash position;Overtime analysis;Export realisation", DOMAIN, AUDIENCE, FREQUENCY, "runs|Runs (30d)|int|1;900", OWNER, "date|Last Run|date|-90;0"],
    statuses: ["Published", "Draft", "Under Review", "Deprecated"],
    measure: "runs", rows: 52,
    insight: "Twelve published reports have not been opened in 90 days — retiring them would cut the nightly refresh window by a third.",
  },

  "report-builder": {
    name: "Report Builder", kind: "form", summary: "Compose a report without code",
    entity: "Report Draft", ref: "RBD",
    fields: ["reportName|Report Name|enum|New sales report;Custom production view;Buyer scorecard;Cost breakdown;Quality trend", SOURCE, "measures|Measures|enum|Quantity;Value;Count;Average;Percentage", "dimensions|Group By|enum|Buyer;Item;Line;Month;Supplier;Department", "chartType|Visual|enum|Table;Bar;Line;Donut;Stacked bar;KPI tiles", OWNER, "date|Created On|date|-200;0", "fieldsSelected|Fields Selected|int|2;24"],
    statuses: ["Draft", "Preview", "Saved", "Published", "Discarded"],
  },

  "sales-analytics": {
    name: "Sales Analytics", kind: "analytics", summary: "Revenue deep-dive",
    entity: "Sales Metric", ref: "SLA",
    fields: ["buyer|Buyer|enum|@buyers", "product|Product|enum|@items", "revenue|Revenue|money|4000;980000", "quantity|Quantity|int|20000;1400000;pcs", "avgPrice|Average Price|float|0.02;1.6;USD;3", "growth|YoY Growth|pct|40;180", "date|Period End|date|-360;0"],
    statuses: ["Growing", "Stable", "Declining", "New"],
    measure: "revenue",
  },

  "production-analytics": {
    name: "Production Analytics", kind: "analytics", summary: "Output, efficiency and yield",
    entity: "Production Metric", ref: "PRA",
    fields: ["line|Line|enum|Press Line 1;Press Line 2;Polishing Line;Plating Line A;Assembly Line 1", "output|Output|int|20000;1200000;pcs", "efficiency|Efficiency|pct|48;118", "yieldPct|Yield|pct|72;99.5", "downtimeHrs|Downtime|float|0;180;hrs;1", "costPer1000|Cost / 1000 pcs|float|1;42;USD;2", "date|Period End|date|-360;0"],
    statuses: ["Above Target", "On Target", "Below Target", "Critical"],
    measure: "output",
  },

  "cost-analytics": {
    name: "Cost Analytics", kind: "analytics", summary: "Where the money actually goes",
    entity: "Cost Metric", ref: "CSA",
    fields: ["category|Cost Category|enum|Raw material;Labour;Energy;Chemicals;Packing;Freight;Overhead;Maintenance", "amount|Amount|money|2000;1600000", "shareOfCost|Share|pct|1;46", "perUnit|Per 1000 pcs|float|0.4;92;USD;2", "vsBudget|vs Budget|pct|60;146", "date|Period End|date|-360;0"],
    statuses: ["Within Budget", "Above Budget", "Improving", "Under Review"],
    measure: "amount",
  },

  "buyer-analytics": {
    name: "Buyer Analytics", kind: "analytics", summary: "Concentration, growth and margin",
    entity: "Buyer Metric", ref: "BYA",
    fields: ["buyer|Buyer|enum|@buyers", "revenue|Revenue|money|8000;1400000", "orders|Orders|int|1;90", "marginPct|Margin|pct|2;42", "shareOfRevenue|Share of Revenue|pct|1;38", "otif|OTIF|pct|48;100", "date|Period End|date|-360;0"],
    statuses: ["Key Account", "Growing", "At Risk", "Dormant"],
    measure: "revenue",
  },

  "cohort-analysis": {
    name: "Cohort Analysis", kind: "analytics", summary: "Retention by acquisition cohort",
    entity: "Cohort", ref: "COH",
    fields: ["cohort|Cohort|enum|FY22 buyers;FY23 buyers;FY24 buyers;FY25 buyers;FY26 buyers", "buyers|Buyers|int|1;40", "retained|Still Ordering|int|0;40", "retention|Retention|pct|10;100", "revenue|Cohort Revenue|money|8000;1800000", "avgOrderValue|Average Order Value|money|1000;180000", "date|Period End|date|-360;0"],
    statuses: ["Strong", "Stable", "Eroding", "Lost"],
    measure: "revenue",
  },

  "scheduled-reports": {
    name: "Scheduled Reports", kind: "calendar", summary: "Automated distribution runs",
    entity: "Schedule", ref: "SCH",
    fields: ["reportName|Report|enum|Daily production summary;Weekly order book;Monthly P&L;Inventory ageing;Export status;Quality dashboard", FREQUENCY, AUDIENCE, "recipients|Recipients|int|1;40", "format|Format|enum|PDF;Excel;CSV;Email body;Dashboard link", "date|Next Run|date|-10;40"],
    statuses: ["Active", "Paused", "Failed", "Completed"],
    measure: "recipients",
  },

  "data-export": {
    name: "Data Export", kind: "form", summary: "Extract a dataset to file",
    entity: "Export Job", ref: "EXP",
    fields: [SOURCE, DOMAIN, "fromDate|From|date|-360;-30", "toDate|To|date|-30;0", "rows|Estimated Rows|int|100;480000", "format|Format|enum|CSV;Excel;JSON;Parquet", "requester|Requested By|person"],
    statuses: ["Draft", "Queued", "Running", "Ready", "Failed"],
    measure: "rows",
  },

  "ad-hoc-query": {
    name: "Ad-hoc Query", kind: "form", summary: "Explore the raw datasets",
    entity: "Query", ref: "QRY",
    fields: [SOURCE, "question|Question|enum|Top buyers this quarter;Slowest moving items;Highest defect lines;Overtime by department;Overdue receivables;Energy per unit", "filters|Filter|enum|Last 30 days;Last quarter;This year;Specific buyer;Specific line", "rows|Rows Returned|int|0;9800", "runtimeSec|Runtime|float|0.1;90;sec;2", "analyst|Run By|person", "date|Run On|date|-90;0"],
    statuses: ["Draft", "Running", "Completed", "Saved as Report", "Failed"],
    measure: "rows",
  },

  dashboards: {
    name: "Dashboards", kind: "list", summary: "Curated screens per audience",
    entity: "Dashboard", ref: "DSH",
    fields: ["dashboardName|Dashboard|enum|CEO command centre;Production floor;Quality pulse;Finance overview;Buyer 360;Supply chain", AUDIENCE, "widgets|Widgets|int|3;24", "viewers|Viewers (30d)|int|1;180", "refreshRate|Refresh|enum|Live;5 minutes;Hourly;Daily", OWNER, "date|Last Updated|date|-200;0"],
    statuses: ["Published", "Draft", "Under Revision", "Retired"],
    measure: "viewers",
  },

  "kpi-catalog": {
    name: "KPI Catalog", kind: "list", summary: "Definitions everyone agrees on",
    entity: "KPI", ref: "KPI",
    fields: ["kpi|KPI|enum|OTIF;First pass yield;OEE;Inventory turns;Gross margin;Defect PPM;Energy intensity;Order to ship days", DOMAIN, "formula|Formula|enum|Ratio;Percentage;Average;Count;Sum;Index", "target|Target|float|0.5;98;;1", "actual|Current Actual|float|0.2;120;;1", OWNER, "date|Reviewed On|date|-300;0"],
    statuses: ["Approved", "Under Review", "Draft", "Retired"],
    measure: "actual",
  },

  "data-sources": {
    name: "Data Sources", kind: "list", summary: "What feeds the warehouse",
    entity: "Data Source", ref: "SRC",
    fields: [SOURCE, "sourceType|Type|enum|ERP module;IoT stream;Manual upload;External API;Spreadsheet", "records|Records|int|1000;4800000", "refreshRate|Refresh|enum|Live;Every 15 minutes;Hourly;Nightly;Weekly", "lastRefreshHrs|Last Refresh|int|0;96;hrs", OWNER, "date|Connected On|date|-700;0"],
    statuses: ["Healthy", "Delayed", "Failing", "Disconnected"],
    measure: "records",
  },

  "data-quality": {
    name: "Data Quality", kind: "analytics", summary: "Trust in the numbers",
    entity: "Quality Metric", ref: "DQL",
    fields: [SOURCE, "dimension|Dimension|enum|Completeness;Accuracy;Timeliness;Consistency;Uniqueness", "score|Score|pct|40;100", "issues|Issues Found|int|0;480", "recordsChecked|Records Checked|int|1000;980000", OWNER, "date|Assessed On|date|-200;0"],
    statuses: ["Trusted", "Acceptable", "Poor", "Not Assessed"],
    measure: "recordsChecked",
  },

  "inventory-analytics": {
    name: "Inventory Analytics", kind: "analytics", summary: "Stock health across stores",
    entity: "Inventory Metric", ref: "INA",
    fields: ["store|Store|enum|RM Store;WIP Store;FG Store;Packing Store;Chemical Store;Spare Store", "value|Stock Value|money|4000;1800000", "turns|Turns per Year|float|0.4;18;x;1", "deadStock|Dead Stock|money|0;280000", "coverDays|Cover|float|2;180;days;1", "date|Period End|date|-360;0"],
    statuses: ["Healthy", "Watch", "Excess", "Shortage Risk"],
    measure: "value",
  },

  "quality-analytics": {
    name: "Quality Analytics", kind: "analytics", summary: "Defects, yield and cost of quality",
    entity: "Quality Metric", ref: "QLA",
    fields: ["stage|Stage|enum|Incoming;In-process;Final;Buyer end", "checked|Checked|int|20000;1400000;pcs", "defects|Defects|int|10;42000;pcs", "ppm|Defect PPM|int|100;42000;ppm", "copq|Cost of Poor Quality|money|200;180000", "firstPass|First Pass Yield|pct|72;99.5", "date|Period End|date|-360;0"],
    statuses: ["On Target", "Watch", "Below Target", "Critical"],
    measure: "checked",
  },

  subscriptions: {
    name: "Report Subscriptions", kind: "list", summary: "Who receives what, automatically",
    entity: "Subscription", ref: "SUB",
    fields: ["reportName|Report|enum|Daily production summary;Weekly order book;Monthly P&L;Inventory ageing;Quality dashboard", "subscriber|Subscriber|person", FREQUENCY, "channel|Channel|enum|Email;Mobile push;Portal;Shared drive", "opens|Opens (30d)|int|0;40", "date|Subscribed On|date|-400;0"],
    statuses: ["Active", "Paused", "Bouncing", "Unsubscribed"],
    measure: "opens",
  },

  "usage-tracking": {
    name: "Platform Usage", kind: "analytics", summary: "Who uses BI and how much",
    entity: "Usage Record", ref: "USG",
    fields: ["department|Department|enum|Production;Quality;Commercial;Finance;Stores;Management", "activeUsers|Active Users|int|1;90", "sessions|Sessions|int|4;1800", "reportsRun|Reports Run|int|4;2400", "avgMinutes|Average Session|float|1;42;min;1", "date|Period End|date|-300;0"],
    statuses: ["Highly Engaged", "Engaged", "Low Usage", "Inactive"],
    measure: "reportsRun",
  },

  alerts: {
    name: "Analytics Alerts", kind: "list", summary: "Thresholds watched automatically",
    entity: "Alert", ref: "ALT",
    fields: ["metric|Metric|enum|OTIF below target;Defect PPM spike;Inventory above ceiling;Margin below floor;Overdue receivables;Energy above baseline", DOMAIN, "threshold|Threshold|float|0.5;98;;1", "currentValue|Current Value|float|0.2;140;;1", "severity|Severity|enum|Critical;High;Medium;Low", OWNER, "date|Triggered On|date|-90;0"],
    statuses: ["New", "Acknowledged", "Under Action", "Resolved", "Suppressed"],
    measure: "currentValue",
  },

  "bi-settings": {
    name: "BI Controls", kind: "settings", summary: "Refresh, retention and access",
    entity: "Control Rule", ref: "BSET",
    fields: ["rule|Rule|enum|Nightly refresh window;Row-level security;Retire unused reports;Cache duration;Restrict raw data export", "retentionDays|Retention|int|30;1100;days", OWNER, "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Apply row-level security by department on every dataset", "Flag reports unopened for 90 days for retirement"],
  },
};
