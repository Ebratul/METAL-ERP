import type { ModuleSpecs } from "../types";

/** Module 63 — Branch & Location Management. */

const BRANCH = "branch|Branch|enum|Dhaka Head Office;Gulshan Showroom;Chattogram Liaison;Narayanganj Depot;Gazipur Factory Office;Hong Kong Sourcing;Guangzhou Rep Office;Colombo Sales Desk";
const REGION = "region|Region|enum|Dhaka;Chattogram;Khulna;Sylhet;Rajshahi;East Asia;South Asia;Europe";
const HEAD = "head|Branch Head|person";
const BRANCH_TYPE = "type|Branch Type|enum|Head office;Sales office;Liaison office;Showroom;Depot;Factory office;Overseas rep";

export const BRANCH_LOCATION: ModuleSpecs = {
  "branch-directory": {
    name: "Branch Directory", kind: "list", summary: "Every office, showroom and depot",
    entity: "Branch", ref: "BRN",
    fields: [BRANCH, BRANCH_TYPE, REGION, "headcount|Headcount|int|2;180", "area|Floor Area|int|300;24000;sq ft", "monthlyCost|Monthly Running Cost|money|1200;180000", HEAD, "date|Opened On|date|-4200;-60"],
    statuses: ["Operational", "Being Set Up", "Relocating", "Temporarily Closed", "Closed"],
    measure: "monthlyCost", rows: 38,
    insight: "The Hong Kong sourcing office costs 3.1× the Colombo desk to run but originates 4.8× the confirmed order value — the cost per booked dollar is the lowest in the network.",
  },

  "location-hierarchy": {
    name: "Location Hierarchy", kind: "list", summary: "Country, region, city and zone",
    entity: "Location Node", ref: "LOC",
    fields: ["level|Level|enum|Country;Region;District;City;Zone;Site", "node|Node|enum|Bangladesh;Dhaka Division;Gazipur;Savar;Chattogram;Narayanganj;Hong Kong SAR;Guangdong", "parent|Parent Node|enum|Global;Bangladesh;Dhaka Division;Chattogram Division;Greater China", REGION, "children|Child Nodes|int|0;24", "sites|Sites Mapped|int|0;18", "date|Effective From|date|-1800;0"],
    statuses: ["Active", "Draft", "Merged", "Retired"],
    measure: "sites",
  },

  "branch-profile": {
    name: "Branch Profile", kind: "form", summary: "Address, contacts and function",
    entity: "Branch Profile", ref: "BPF",
    fields: [BRANCH, BRANCH_TYPE, "address|Address|enum|Level 7, Bay's Galleria, Gulshan-1;Plot 42, Sector 3, Uttara;Agrabad C/A, Chattogram;BSCIC Estate, Narayanganj;Kwun Tong, Kowloon;Tianhe District, Guangzhou", "contact|Primary Contact|person", "phone|Contact Line|enum|+880 2 5566 1200;+880 2 9887 4410;+880 31 2513 880;+852 3628 4410;+86 20 3877 9020", "functions|Functions|enum|Sales & marketing;Sourcing;Administration;Warehousing;Customer service;Liaison only", HEAD, "date|Profile Updated|date|-400;0"],
    statuses: ["Verified", "Draft", "Pending Review", "Superseded"],
  },

  "store-mapping": {
    name: "Store & Warehouse Mapping", kind: "list", summary: "Which store sits at which location",
    entity: "Store Mapping", ref: "SMP",
    fields: ["store|Store|enum|RM Store A;RM Store B;Chemical Store;FG Warehouse A;FG Warehouse B;Packing Store;Spare Parts Store;Transit Depot", BRANCH, REGION, "capacity|Capacity|int|200;24000;pallets", "occupancy|Occupancy|pct|18;99", "stockValue|Stock Value|money|18000;4800000", "keeper|Store Keeper|person", "date|Mapped On|date|-900;0"],
    statuses: ["Active", "Near Full", "Under Stock Take", "Being Relocated", "Closed"],
    measure: "stockValue",
  },

  "territory-mapping": {
    name: "Territory Mapping", kind: "analytics", summary: "Sales coverage by area",
    entity: "Territory", ref: "TER",
    fields: ["territory|Territory|enum|Dhaka North;Dhaka South;Gazipur Belt;Narayanganj Belt;Chattogram Zone;EPZ Cluster;Export — East Asia;Export — Europe", BRANCH, "owner|Territory Owner|person", "buyers|Buyers Covered|int|2;48", "revenue|Revenue|money|24000;4800000", "coverage|Coverage|pct|32;100", "date|Reviewed On|date|-300;0"],
    statuses: ["Covered", "Partially Covered", "Uncovered", "Under Review"],
    measure: "revenue",
  },

  "branch-targets": {
    name: "Branch Targets", kind: "form", summary: "Location-wise goals for the year",
    entity: "Branch Target", ref: "BTG",
    fields: [BRANCH, "metric|Target Metric|enum|Order value;New buyers;Collection;Sample conversion;Operating cost;Customer visits", "target|Target|money|20000;4800000", "achieved|Achieved|money|4000;5200000", "attainment|Attainment|pct|18;136", "period|Period|enum|Q1 FY26;Q2 FY26;Q3 FY26;Q4 FY26;FY 2026", HEAD, "date|Set On|date|-330;30"],
    statuses: ["On Track", "At Risk", "Behind", "Achieved", "Draft"],
    measure: "target",
  },

  "branch-performance": {
    name: "Branch Performance", kind: "analytics", summary: "Revenue and cost per branch",
    entity: "Performance Record", ref: "BPR",
    fields: [BRANCH, REGION, "revenue|Revenue|money|18000;4800000", "cost|Operating Cost|money|4000;680000", "contribution|Contribution|pct|4;62", "orders|Orders Booked|int|2;180", "productivity|Revenue / Head|money|2000;180000", "date|Period End|date|-330;0"],
    statuses: ["Above Plan", "On Plan", "Below Plan", "Loss Making"],
    measure: "revenue", rows: 46,
  },

  "branch-expenses": {
    name: "Branch Expenses", kind: "analytics", summary: "Running cost by head",
    entity: "Expense Record", ref: "BEX",
    fields: [BRANCH, "head|Expense Head|enum|Rent;Salaries;Utilities;Travel;Communication;Entertainment;Office supplies;Local transport;Repairs", "budget|Budget|money|500;180000", "actual|Actual|money|300;220000", "variance|Variance|pct|48;148", "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026", "date|Period End|date|-330;0"],
    statuses: ["Within Budget", "Marginal", "Over Budget", "Pending Approval"],
    measure: "actual", rows: 52,
  },

  "geo-map": {
    name: "Geographic Map", kind: "analytics", summary: "Sites plotted across the network",
    entity: "Map Point", ref: "GEO",
    fields: [BRANCH, REGION, "country|Country|enum|Bangladesh;Hong Kong SAR;China;Sri Lanka;India;Vietnam", "latitude|Latitude|float|1;42;°;4", "longitude|Longitude|float|72;122;°;4", "distanceKm|Distance from HQ|int|0;4800;km", "footfall|Monthly Visits|int|0;480", "date|Position Updated|date|-600;0"],
    statuses: ["Plotted", "Approximate", "Needs Verification", "Unmapped"],
    measure: "distanceKm",
  },

  "branch-staffing": {
    name: "Branch Staffing", kind: "list", summary: "Who works where",
    entity: "Staff Allocation", ref: "BSF",
    fields: [BRANCH, "role|Role|enum|Branch head;Merchandiser;Sales executive;Accounts officer;Store keeper;Driver;Office assistant;Customer service", "sanctioned|Sanctioned|int|1;40", "onRoll|On Roll|int|0;38", "vacancy|Vacancy|int|0;12", "cost|Monthly Cost|money|400;120000", HEAD, "date|As On|date|-120;0"],
    statuses: ["Fully Staffed", "Vacancy Open", "Recruitment in Progress", "Over Staffed"],
    measure: "cost",
  },

  "branch-assets": {
    name: "Branch Assets", kind: "list", summary: "Equipment held at each location",
    entity: "Branch Asset", ref: "BAS",
    fields: [BRANCH, "asset|Asset|enum|Laptop;Desktop;Printer;Air conditioner;Office furniture set;Vehicle;Generator;CCTV system;Server rack", "quantity|Quantity|int|1;48", "bookValue|Book Value|money|200;180000", "ageYears|Age|float|0.2;12;yrs;1", "custodian|Custodian|person", "date|Assigned On|date|-1800;0"],
    statuses: ["In Use", "Spare", "Under Repair", "Transferred", "Written Off"],
    measure: "bookValue", rows: 48,
  },

  "lease-agreements": {
    name: "Lease Agreements", kind: "list", summary: "Rent, term and renewal dates",
    entity: "Lease", ref: "LSE",
    fields: [BRANCH, "landlord|Landlord|enum|Bay Developments Ltd.;Rangs Properties;Agrabad Holdings;Uttara Estates;Kowloon Realty;Tianhe Commercial", "monthlyRent|Monthly Rent|money|600;180000", "deposit|Security Deposit|money|2000;980000", "termMonths|Term|int|12;120;months", "escalation|Annual Escalation|pct|0;12", "expiry|Expiry Date|date|-60;1400", "date|Signed On|date|-2400;-30"],
    statuses: ["Active", "Renewal Due", "Under Negotiation", "Expired", "Terminated"],
    measure: "monthlyRent",
  },

  "branch-inventory": {
    name: "Branch Inventory", kind: "analytics", summary: "Stock held outside the factory",
    entity: "Inventory Position", ref: "BIN",
    fields: [BRANCH, "category|Category|enum|Finished goods;Samples;Packing material;Marketing collateral;Spare parts", "quantity|Quantity|int|20;480000;pcs", "value|Stock Value|money|800;1800000", "ageDays|Average Age|int|2;420;days", "coverage|Days of Cover|int|1;180;days", "keeper|Custodian|person", "date|As On|date|-120;0"],
    statuses: ["Healthy", "Slow Moving", "Excess", "Shortage", "Under Reconciliation"],
    measure: "value",
  },

  "petty-cash": {
    name: "Branch Petty Cash", kind: "list", summary: "Local float and its spend",
    entity: "Petty Cash Entry", ref: "PTC",
    fields: [BRANCH, "purpose|Purpose|enum|Local conveyance;Courier;Refreshments;Stationery;Minor repair;Utility top-up;Sample carriage", "amount|Amount|money|5;4800", "float|Float Limit|money|200;12000", "balance|Balance|money|0;12000", "custodian|Custodian|person", "date|Spent On|date|-180;0"],
    statuses: ["Submitted", "Approved", "Reimbursed", "Rejected", "Pending Bill"],
    measure: "amount", rows: 54,
  },

  "branch-approvals": {
    name: "Branch Approvals", kind: "board", summary: "Requests raised from the field",
    entity: "Approval Request", ref: "BAP",
    fields: [BRANCH, "request|Request|enum|Expense reimbursement;New hire;Asset purchase;Discount approval;Advance payment;Travel authorisation;Lease renewal", "amount|Amount|money|100;980000", "raisedBy|Raised By|person", "approver|Approver|person", "ageDays|Pending For|int|0;42;days", "date|Raised On|date|-160;0"],
    statuses: ["Submitted", "With Reviewer", "Approved", "Rejected", "Returned"],
    measure: "amount",
  },

  "regional-rollup": {
    name: "Regional Roll-up", kind: "analytics", summary: "Region-level consolidation",
    entity: "Regional Summary", ref: "RGN",
    fields: [REGION, "branches|Branches|int|1;9", "revenue|Revenue|money|48000;9800000", "cost|Cost|money|12000;2400000", "margin|Margin|pct|2;42", "headcount|Headcount|int|4;320", "growth|YoY Growth|pct|0;48", "date|Period End|date|-330;0"],
    statuses: ["Growing", "Stable", "Declining", "Under Review"],
    measure: "revenue",
  },

  "branch-visits": {
    name: "Branch Visits", kind: "calendar", summary: "Management and audit visits",
    entity: "Visit", ref: "BVS",
    fields: [BRANCH, "purpose|Purpose|enum|Management review;Internal audit;Stock verification;Buyer meeting;Training;Asset verification;Grievance hearing", "visitor|Visitor|person", "durationDays|Duration|int|1;6;days", "cost|Travel Cost|money|40;9800", "observations|Observations|int|0;18", "date|Visit Date|date|-180;120"],
    statuses: ["Planned", "In Progress", "Completed", "Report Pending", "Cancelled"],
    measure: "cost",
  },

  "branch-compliance": {
    name: "Branch Compliance", kind: "list", summary: "Trade licence and local permits",
    entity: "Compliance Item", ref: "BCM",
    fields: [BRANCH, "item|Requirement|enum|Trade licence;VAT registration;Fire safety certificate;Signboard permit;Labour registration;Municipal holding tax;Business registration (overseas)", "authority|Authority|enum|City Corporation;NBR;Fire Service;Local council;Companies House;Labour office", "fee|Annual Fee|money|100;120000", "responsible|Responsible|person", "expiry|Valid Until|date|-45;520", "date|Last Renewed|date|-700;0"],
    statuses: ["Compliant", "Renewal Due", "Under Renewal", "Lapsed", "Not Applicable"],
    measure: "fee",
  },

  "branch-comparison": {
    name: "Branch Comparison", kind: "analytics", summary: "Like-for-like across the network",
    entity: "Comparison Row", ref: "BCP",
    fields: [BRANCH, "metric|Metric|enum|Revenue per head;Cost per head;Orders booked;Collection days;Customer visits;Expense ratio", "value|Value|float|0.4;980;;2", "networkAvg|Network Average|float|0.4;900;;2", "gap|Gap to Average|pct|0;68", "rank|Rank|int|1;8", "date|Period End|date|-330;0"],
    statuses: ["Top Quartile", "Above Average", "Below Average", "Bottom Quartile"],
    measure: "value",
  },

  "branch-settings": {
    name: "Branch Configuration", kind: "settings", summary: "Local operating rules",
    entity: "Branch Setting", ref: "BST",
    fields: [BRANCH, "rule|Rule|enum|Petty cash ceiling;Local approval limit;Working days;Reporting currency;Default warehouse;Expense claim window", "value|Configured Value|enum|USD 500;USD 2,000;6 days;BDT;FG Warehouse A;15 days", "appliesFrom|Applies From|date|-500;60", HEAD, "date|Last Changed|date|-400;0"],
    statuses: ["Active", "Draft", "Scheduled", "Superseded"],
    settings: ["Require head-office approval for any spend above the local ceiling", "Consolidate branch results into the group currency at month-end rate", "Lock branch expense entry three days after the period closes"],
  },
};
