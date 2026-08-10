import type { ModuleSpecs } from "../types";

/** Module 62 — Factory & Plant Management. */

const PLANT = "plant|Plant|enum|Unit 1 — Gazipur;Unit 2 — Savar;Unit 3 — Chattogram;Unit 4 — Adamjee EPZ";
const UNIT = "unit|Production Unit|enum|Press Shop;Polishing;Barrel Plating;Rack Plating;Assembly;Packing;Tool Room;ETP";
const MANAGER = "manager|Plant Manager|person";
const ENGINEER = "engineer|Responsible Engineer|person";

export const FACTORY_PLANT: ModuleSpecs = {
  "plant-directory": {
    name: "Plant Directory", kind: "list", summary: "Every manufacturing site on record",
    entity: "Plant", ref: "PLT",
    fields: [PLANT, "type|Site Type|enum|Owned factory;Leased factory;EPZ unit;Subcontract site;Warehouse only", "area|Covered Area|int|8000;220000;sq ft", "workforce|Workforce|int|60;2400", "capacity|Monthly Capacity|int|400000;18000000;pcs", "commissioned|Commissioned|date|-5400;-200", MANAGER, "date|Record Updated|date|-300;0"],
    statuses: ["Operational", "Partially Operational", "Under Commissioning", "Shut Down"],
    measure: "capacity", rows: 38,
    insight: "Unit 3 — Chattogram is running at 94% of installed capacity while Unit 4 sits at 61%; shifting the zipper-slider families would balance the load without capex.",
  },

  "plant-profile": {
    name: "Plant Profile", kind: "form", summary: "Legal, physical and ownership detail",
    entity: "Plant Profile", ref: "PPF",
    fields: [PLANT, "legalEntity|Legal Entity|enum|Smart Metal Accessories Ltd.;Smart Metal EPZ Ltd.;Smart Finishing Services Ltd.", "ownership|Ownership|enum|Owned freehold;Long lease;Short lease;Shared facility", "landArea|Land Area|float|0.4;12;acre;2", "buildings|Buildings|int|1;14", "shifts|Shifts Operated|int|1;3", MANAGER, "date|Profile Updated|date|-400;0"],
    statuses: ["Verified", "Draft", "Pending Review", "Superseded"],
    measure: "landArea",
  },

  "production-units": {
    name: "Production Units", kind: "list", summary: "Units and lines inside each plant",
    entity: "Production Unit", ref: "PRU",
    fields: [UNIT, PLANT, "lines|Lines|int|1;12", "machines|Machines|int|2;48", "manpower|Manpower|int|6;320", "capacity|Daily Capacity|int|10000;900000;pcs", "utilisation|Utilisation|pct|38;99", ENGINEER, "date|Commissioned On|date|-3600;-60"],
    statuses: ["Running", "Idle", "Under Maintenance", "Being Commissioned", "Decommissioned"],
    measure: "capacity", rows: 46,
  },

  "floor-layout": {
    name: "Floor Layout", kind: "analytics", summary: "How space is allocated",
    entity: "Layout Block", ref: "LYT",
    fields: [PLANT, "block|Block|enum|Ground floor — Press;First floor — Finishing;Second floor — Assembly;Annex — Plating;Yard — Scrap;Basement — Utilities", UNIT, "area|Allocated Area|int|400;38000;sq ft", "density|Machines / 1000 sq ft|float|0.4;9;;2", "occupancy|Space Occupancy|pct|32;99", "revision|Layout Revision|enum|Rev 1;Rev 2;Rev 3;Rev 4", "date|Revised On|date|-900;0"],
    statuses: ["Current", "Proposed", "Under Modification", "Archived"],
    measure: "area",
  },

  utilities: {
    name: "Utility Connections", kind: "list", summary: "Power, gas, water and compressed air",
    entity: "Utility Connection", ref: "UTC",
    fields: [PLANT, "utility|Utility|enum|Grid power (11kV);Standby generator;Natural gas;Deep tube well;Municipal water;Compressed air;Steam;Solar rooftop", "provider|Provider|enum|DPDC;DESCO;Titas Gas;WASA;In-house;PGCB;Third-party O&M", "sanctioned|Sanctioned Load|float|20;3200;kVA;1", "peakDraw|Peak Draw|float|10;3400;kVA;1", "monthlyCost|Monthly Cost|money|4000;480000", ENGINEER, "date|Connected On|date|-3600;-30"],
    statuses: ["Active", "Standby", "Under Upgrade", "Disconnected"],
    measure: "monthlyCost",
  },

  "utility-consumption": {
    name: "Utility Consumption", kind: "analytics", summary: "What each site burns each month",
    entity: "Consumption Record", ref: "UCN",
    fields: [PLANT, "utility|Utility|enum|Electricity;Gas;Water;Diesel;Compressed air;Steam", "quantity|Quantity|float|100;98000;;1", "uom|Unit|enum|kWh;m³;litre;MT;Nm³", "cost|Cost|money|2000;680000", "perPiece|Cost / 1000 pcs|float|0.4;38;;2", "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026", "date|Period End|date|-330;0"],
    statuses: ["Within Budget", "Above Budget", "Under Review", "Estimated"],
    measure: "cost", rows: 48,
  },

  "plant-capacity": {
    name: "Plant Capacity", kind: "analytics", summary: "Installed against utilised",
    entity: "Capacity Record", ref: "PCP",
    fields: [PLANT, UNIT, "installed|Installed Capacity|int|20000;1800000;pcs", "available|Available Capacity|int|15000;1700000;pcs", "used|Utilised|int|8000;1650000;pcs", "utilisation|Utilisation|pct|32;99", "bottleneck|Bottleneck|enum|Press tonnage;Plating barrel time;Polishing drums;Assembly manpower;Packing tables;None", "date|Period End|date|-300;0"],
    statuses: ["Balanced", "Overloaded", "Under-utilised", "Constrained"],
    measure: "used",
  },

  "statutory-licenses": {
    name: "Statutory Licences", kind: "list", summary: "Every permit the site must hold",
    entity: "Licence", ref: "LIC",
    fields: [PLANT, "licence|Licence|enum|Factory Licence;Fire Licence;Environmental Clearance;Trade Licence;Boiler Certificate;Electrical Safety;Hazardous Waste Permit;Bonded Warehouse Licence", "authority|Authority|enum|DIFE;Fire Service & Civil Defence;Department of Environment;City Corporation;Boiler Inspectorate;NBR", "fee|Renewal Fee|money|3000;420000", "validity|Valid For|int|180;1095;days", "custodian|Custodian|person", "date|Expires On|date|-60;520"],
    statuses: ["Valid", "Renewal Due", "Under Renewal", "Expired", "Suspended"],
    measure: "fee",
  },

  "license-renewals": {
    name: "Licence Renewals", kind: "calendar", summary: "What falls due and when",
    entity: "Renewal", ref: "LRN",
    fields: [PLANT, "licence|Licence|enum|Factory Licence;Fire Licence;Environmental Clearance;Trade Licence;Boiler Certificate;Electrical Safety;Hazardous Waste Permit", "leadDays|Notice Period|int|15;120;days", "fee|Renewal Fee|money|3000;420000", "responsible|Responsible|person", "date|Renewal Date|date|-45;300"],
    statuses: ["Scheduled", "Documents Ready", "Submitted", "Renewed", "Overdue"],
    measure: "fee",
  },

  "plant-performance": {
    name: "Plant Performance", kind: "analytics", summary: "Output, quality and cost by site",
    entity: "Performance Record", ref: "PPR",
    fields: [PLANT, "output|Output|int|180000;9800000;pcs", "oee|OEE|pct|48;92", "rejection|Rejection|pct|0.4;7", "onTime|On-Time Delivery|pct|72;100", "costPerK|Cost / 1000 pcs|float|4;62;USD;2", MANAGER, "date|Period End|date|-330;0"],
    statuses: ["Above Plan", "On Plan", "Below Plan", "Under Review"],
    measure: "output", rows: 48,
  },

  "expansion-projects": {
    name: "Expansion Projects", kind: "list", summary: "New lines, sheds and capacity",
    entity: "Expansion Project", ref: "EXP",
    fields: [PLANT, "project|Project|enum|New plating line;Press shop extension;Automated assembly cell;Solar rooftop 500kWp;ETP capacity upgrade;Finished goods warehouse;Tool room modernisation", "capex|Capex|money|48000;9800000", "addedCapacity|Added Capacity|int|50000;2400000;pcs", "progress|Progress|pct|0;100", "sponsor|Project Sponsor|person", "date|Target Completion|date|-90;720"],
    statuses: ["Concept", "Approved", "In Execution", "Commissioned", "On Hold"],
    measure: "capex",
  },

  "civil-works": {
    name: "Civil & Building Works", kind: "list", summary: "Structure, roofing and repairs",
    entity: "Civil Job", ref: "CVL",
    fields: [PLANT, "work|Work|enum|Roof sheet replacement;Floor epoxy coating;Drainage repair;Boundary wall;Toilet block renovation;Ventilation ducting;Painting;Water tank cleaning", "contractor|Contractor|enum|Rahman Construction;Metro Builders;In-house maintenance;Skyline Engineering;Delta Civil Works", "cost|Cost|money|1200;680000", "durationDays|Duration|int|1;120;days", ENGINEER, "date|Start Date|date|-300;90"],
    statuses: ["Planned", "In Progress", "Completed", "Delayed", "Cancelled"],
    measure: "cost",
  },

  "plant-assets": {
    name: "Plant Asset Register", kind: "list", summary: "Machines held at each site",
    entity: "Plant Asset", ref: "PAS",
    fields: [PLANT, UNIT, "asset|Asset|enum|Power Press 60T;Power Press 110T;Hydraulic Press 150T;Vibratory Polisher;Barrel Plating Line;Rack Plating Line;Auto Assembly Cell;Air Compressor 75HP;DG Set 750kVA", "assetValue|Book Value|money|6000;2400000", "ageYears|Age|float|0.4;24;yrs;1", "condition|Condition|enum|New;Good;Fair;Poor;Beyond repair", ENGINEER, "date|Acquired On|date|-5400;-30"],
    statuses: ["In Use", "Standby", "Under Repair", "Idle", "Disposed"],
    measure: "assetValue", rows: 50,
  },

  "plant-manpower": {
    name: "Plant Manpower", kind: "analytics", summary: "Headcount and absence by site",
    entity: "Manpower Record", ref: "PMP",
    fields: [PLANT, UNIT, "sanctioned|Sanctioned|int|8;420", "onRoll|On Roll|int|6;410", "present|Present Today|int|4;400", "absenteeism|Absenteeism|pct|1;18", "overtimeHrs|Overtime Hours|float|0;3200;hrs;0", MANAGER, "date|As On|date|-120;0"],
    statuses: ["Fully Staffed", "Short Staffed", "Over Staffed", "Under Review"],
    measure: "onRoll",
  },

  "plant-cost": {
    name: "Plant Operating Cost", kind: "analytics", summary: "What it costs to run each site",
    entity: "Cost Record", ref: "PCS",
    fields: [PLANT, "head|Cost Head|enum|Direct labour;Utilities;Consumables;Maintenance;Rent & lease;Statutory fees;Security & housekeeping;Transport", "budget|Budget|money|8000;1800000", "actual|Actual|money|6000;2100000", "variance|Variance|pct|62;138", "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026", "date|Period End|date|-330;0"],
    statuses: ["Within Budget", "Marginal", "Over Budget", "Under Review"],
    measure: "actual", rows: 48,
  },

  "environment-controls": {
    name: "Environmental Controls", kind: "list", summary: "ETP, scrubbers and emission points",
    entity: "Control Facility", ref: "ENV",
    fields: [PLANT, "facility|Facility|enum|Effluent Treatment Plant;Fume scrubber;Dust collector;Oil-water separator;Sludge dryer;Noise enclosure;Rainwater harvesting", "capacity|Rated Capacity|float|2;480;m³/day;1", "loadNow|Current Load|float|1;520;m³/day;1", "efficiency|Treatment Efficiency|pct|58;99", ENGINEER, "date|Last Inspected|date|-240;0"],
    statuses: ["Compliant", "Marginal", "Non-Compliant", "Under Maintenance", "Offline"],
    measure: "efficiency",
  },

  "safety-infrastructure": {
    name: "Safety Infrastructure", kind: "list", summary: "Fire, first aid and escape provision",
    entity: "Safety Asset", ref: "SFA",
    fields: [PLANT, "asset|Safety Asset|enum|Fire extinguisher;Hydrant point;Smoke detector;Emergency exit;Fire pump;First aid box;Eye wash station;Assembly point signage", "quantity|Quantity|int|1;280", "coverage|Coverage|pct|45;100", "inspector|Inspected By|person", "nextDue|Next Inspection|date|-30;220", "date|Last Inspection|date|-300;0"],
    statuses: ["Compliant", "Due for Inspection", "Defect Found", "Non-Compliant"],
    measure: "quantity",
  },

  "plant-calendar": {
    name: "Plant Calendar", kind: "calendar", summary: "Shutdowns, holidays and audits",
    entity: "Calendar Event", ref: "PCL",
    fields: [PLANT, "event|Event|enum|Annual maintenance shutdown;Public holiday;Buyer audit;Statutory inspection;Stock take;Line commissioning;Safety drill", "durationDays|Duration|int|1;14;days", "impact|Production Impact|enum|Full stop;Partial stop;No impact", "lostOutput|Output Impact|int|0;980000;pcs", MANAGER, "date|Event Date|date|-90;270"],
    statuses: ["Scheduled", "In Progress", "Completed", "Rescheduled", "Cancelled"],
    measure: "lostOutput",
  },

  "plant-benchmarking": {
    name: "Inter-Plant Benchmarking", kind: "analytics", summary: "Site against site on the same metric",
    entity: "Benchmark", ref: "BMK",
    fields: [PLANT, "metric|Metric|enum|Cost per 1000 pcs;OEE;Rejection rate;Energy intensity;Labour productivity;On-time delivery;Absenteeism", "value|Value|float|0.4;980;;2", "best|Best in Group|float|0.3;900;;2", "gap|Gap to Best|pct|0;62", "rank|Rank|int|1;4", "date|Period End|date|-330;0"],
    statuses: ["Best in Group", "Above Average", "Below Average", "Needs Attention"],
    measure: "value",
  },

  "plant-settings": {
    name: "Plant Configuration", kind: "settings", summary: "Site-level operating rules",
    entity: "Plant Setting", ref: "PST",
    fields: [PLANT, "rule|Rule|enum|Working days per week;Standard shift hours;Overtime ceiling per head;Costing method;Stock valuation basis;Default despatch warehouse", "value|Configured Value|enum|6 days;8 hours;24 hours / month;Standard costing;Weighted average;FG Warehouse A", "appliesFrom|Applies From|date|-500;60", MANAGER, "date|Last Changed|date|-400;0"],
    statuses: ["Active", "Draft", "Scheduled", "Superseded"],
    settings: ["Lock production posting once the plant month is closed", "Require plant manager approval for any capacity change above 10%", "Alert when a statutory licence falls inside its notice period"],
  },
};
