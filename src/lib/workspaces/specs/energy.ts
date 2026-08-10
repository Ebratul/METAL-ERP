import type { ModuleSpecs } from "../types";

/** Module 53 — Energy Management. */

const AREA = "area|Area|enum|Press Shop;Polishing;Plating;Assembly;Packing;Utilities;Warehouse;Office";
const UTILITY = "utility|Utility|enum|Electricity (grid);Electricity (generator);Natural gas;Water;Compressed air;Steam;Solar";
const METER = "meter|Meter|enum|MTR-MAIN-01;MTR-PRESS-02;MTR-PLATE-03;MTR-UTIL-04;MTR-GAS-01;MTR-WATER-01;MTR-SOLAR-01";
const OWNER = "owner|Energy Manager|person";
const SHIFT = "shift|Shift|enum|A (06–14);B (14–22);C (22–06)";

export const ENERGY: ModuleSpecs = {
  "energy-overview": {
    name: "Energy Overview", kind: "overview", summary: "Consumption and cost at a glance",
    entity: "Energy Reading", ref: "ENG",
    fields: [UTILITY, AREA, "consumption|Consumption|float|20;9800;units;1", "cost|Cost|money|100;62000", "share|Share of Total|pct|1;42", "vsLastPeriod|vs Last Period|pct|68;138", OWNER, "date|Period End|date|-300;0"],
    statuses: ["Within Budget", "Above Budget", "Under Review", "Optimised"],
    measure: "consumption", rows: 46,
    insight: "Plating draws 38% of site electricity but only 22% of output value — heat recovery on the rinse line is the obvious first project.",
  },

  electricity: {
    name: "Electricity Consumption", kind: "analytics", summary: "kWh drawn by area and shift",
    entity: "Electricity Reading", ref: "ELC",
    fields: [AREA, METER, "kwh|Consumption|float|40;9800;kWh;1", "peakKw|Peak Demand|float|10;900;kW;1", "cost|Cost|money|40;48000", "rate|Tariff|float|0.06;0.28;USD/kWh;3", SHIFT, "date|Reading Date|date|-180;0"],
    statuses: ["Normal", "Above Baseline", "Peak Period", "Under Review"],
    measure: "kwh",
  },

  "gas-water": {
    name: "Gas & Water", kind: "analytics", summary: "Other utilities consumed",
    entity: "Utility Reading", ref: "GWR",
    fields: ["type|Utility|enum|Natural gas;Water;Steam;Compressed air", AREA, "consumption|Consumption|float|10;4800;units;1", "unitLabel|Unit|enum|m³;litres;kg;Nm³", "cost|Cost|money|20;28000", "perPiece|Per 1000 pcs|float|0.02;18;units;3", "date|Reading Date|date|-180;0"],
    statuses: ["Normal", "Above Baseline", "Leak Suspected", "Optimised"],
    measure: "consumption",
  },

  "energy-intensity": {
    name: "Energy Intensity", kind: "analytics", summary: "Energy per thousand pieces made",
    entity: "Intensity Record", ref: "EIN",
    fields: [AREA, "output|Output|int|20000;1400000;pcs", "energy|Energy Used|float|40;9800;kWh;1", "intensity|kWh / 1000 pcs|float|0.4;28;kWh;2", "benchmark|Benchmark|float|0.5;24;kWh;2", "variance|vs Benchmark|pct|64;148", "date|Period End|date|-300;0"],
    statuses: ["Better than Benchmark", "At Benchmark", "Above Benchmark", "Under Review"],
    measure: "energy",
  },

  "peak-demand": {
    name: "Peak Demand", kind: "analytics", summary: "Load profile and demand charges",
    entity: "Demand Reading", ref: "PKD",
    fields: [METER, "peakKw|Peak Demand|float|40;1400;kW;1", "contractKw|Contract Demand|float|100;1600;kW;0", "utilisation|Demand Used|pct|20;110", "penalty|Excess Penalty|money|0;18000", "timeBand|Peak Time Band|enum|Morning 08–12;Afternoon 12–17;Evening 17–23;Night 23–08", "date|Reading Date|date|-180;0"],
    statuses: ["Within Contract", "Near Limit", "Exceeded", "Penalty Applied"],
    measure: "peakKw",
  },

  generator: {
    name: "Generator & Backup", kind: "list", summary: "DG running hours and fuel",
    entity: "Generator Run", ref: "GEN",
    fields: ["generator|Generator|enum|DG 500kVA #1;DG 500kVA #2;DG 250kVA;Standby UPS", "runHrs|Run Hours|float|0.5;180;hrs;1", "fuelLitres|Fuel Consumed|float|10;3200;L;1", "unitsGenerated|Units Generated|float|20;9000;kWh;1", "efficiency|Fuel Efficiency|float|1.4;4.2;kWh/L;2", "cost|Running Cost|money|40;28000", "date|Run Date|date|-180;0"],
    statuses: ["Standby", "Running", "Under Maintenance", "Faulty"],
    measure: "unitsGenerated",
  },

  solar: {
    name: "Solar Generation", kind: "analytics", summary: "Rooftop contribution to the grid draw",
    entity: "Solar Reading", ref: "SOL",
    fields: ["array|Array|enum|Roof Block A;Roof Block B;Roof Block C;Car Park Canopy", "generated|Generated|float|10;2800;kWh;1", "capacityKw|Installed Capacity|float|20;480;kW;0", "yield|Specific Yield|float|1;6.4;kWh/kWp;2", "savings|Cost Avoided|money|20;18000", "irradiance|Irradiance|float|1;7.2;kWh/m²;2", "date|Reading Date|date|-180;0"],
    statuses: ["Above Expectation", "As Expected", "Below Expectation", "Offline"],
    measure: "generated",
  },

  "energy-cost": {
    name: "Energy Cost", kind: "analytics", summary: "Cost per unit produced",
    entity: "Cost Record", ref: "ECS",
    fields: [UTILITY, AREA, "spend|Spend|money|100;92000", "output|Output|int|20000;1400000;pcs", "costPer1000|Cost / 1000 pcs|float|0.4;38;USD;2", "budget|Budget|money|100;96000", "variance|Variance|pct|62;142", "date|Period End|date|-300;0"],
    statuses: ["Within Budget", "Above Budget", "Under Review", "Optimised"],
    measure: "spend",
  },

  conservation: {
    name: "Conservation Projects", kind: "list", summary: "Savings initiatives and payback",
    entity: "Conservation Project", ref: "CNS",
    fields: ["project|Project|enum|LED retrofit;VFD on compressors;Heat recovery;Solar expansion;Insulation upgrade;Power factor correction;Idle shutdown automation", AREA, "investment|Investment|money|1000;620000", "annualSaving|Annual Saving|money|200;280000", "payback|Payback|float|0.4;7;yrs;1", "savingKwh|Energy Saved|float|100;180000;kWh;0", OWNER, "date|Target Completion|date|-120;500"],
    statuses: ["Idea", "Approved", "In Progress", "Completed", "Dropped"],
    measure: "annualSaving",
  },

  "meter-register": {
    name: "Meter Register", kind: "list", summary: "Every meter and what it covers",
    entity: "Meter", ref: "MTR",
    fields: [METER, UTILITY, AREA, "multiplier|CT Multiplier|float|1;200;;1", "lastReading|Last Reading|float|100;980000;units;0", "calibrationDue|Calibration Due|date|-60;500", OWNER],
    statuses: ["Active", "Faulty", "Calibration Due", "Replaced"],
    measure: "lastReading",
  },

  "meter-readings": {
    name: "Meter Reading Entry", kind: "form", summary: "Record a manual meter reading",
    entity: "Reading", ref: "MRD",
    fields: [METER, UTILITY, "previousReading|Previous Reading|float|100;980000;units;0", "currentReading|Current Reading|float|100;990000;units;0", "consumption|Consumption|float|1;9800;units;1", "reader|Read By|person", "date|Reading Date|date|-15;0"],
    statuses: ["Draft", "Submitted", "Verified", "Posted", "Rejected"],
    measure: "consumption",
  },

  "tariff-master": {
    name: "Tariff Master", kind: "list", summary: "Rates that drive the energy bill",
    entity: "Tariff", ref: "TRF",
    fields: [UTILITY, "supplierName|Supplier|enum|DPDC;DESCO;Titas Gas;WASA;Own generation;Solar PPA", "tariffType|Tariff Type|enum|Flat rate;Time of use;Demand based;Slab based", "rate|Rate|float|0.02;0.42;USD;3", "demandCharge|Demand Charge|float|0;12;USD/kW;2", "validFrom|Valid From|date|-500;0", OWNER],
    statuses: ["Active", "Superseded", "Announced", "Under Negotiation"],
    measure: "rate",
  },

  "load-schedule": {
    name: "Load Schedule", kind: "calendar", summary: "Planned load shifting and shutdowns",
    entity: "Load Event", ref: "LSC",
    fields: [AREA, "event|Event|enum|Peak avoidance shutdown;Load shift to night;Planned maintenance outage;Generator changeover;Solar peak use", "loadKw|Load|float|10;900;kW;1", "durationHrs|Duration|float|0.5;12;hrs;1", "savingEstimate|Estimated Saving|money|10;12000", "date|Scheduled Date|date|-30;60"],
    statuses: ["Planned", "Confirmed", "Executed", "Cancelled"],
    measure: "loadKw",
  },

  "power-factor": {
    name: "Power Factor", kind: "analytics", summary: "Reactive power and penalties",
    entity: "PF Reading", ref: "PF",
    fields: [METER, AREA, "powerFactor|Power Factor|float|0.62;1;;3", "target|Target|float|0.9;0.99;;2", "kvarh|Reactive Energy|float|10;4800;kVArh;1", "penalty|Penalty|money|0;9800", "capacitorBank|Capacitor Bank|enum|Bank 1;Bank 2;Bank 3;None", "date|Reading Date|date|-180;0"],
    statuses: ["Good", "Acceptable", "Poor", "Penalty Applied"],
    measure: "powerFactor",
  },

  "energy-audit": {
    name: "Energy Audit", kind: "calendar", summary: "Internal and statutory audits",
    entity: "Energy Audit", ref: "EAD",
    fields: [AREA, "auditType|Audit Type|enum|Statutory energy audit;Internal walkthrough;Compressed air leak survey;Thermography;ISO 50001 review", "auditor|Auditor|person", "findings|Findings|int|0;18", "savingIdentified|Saving Identified|money|200;280000", "date|Audit Date|date|-300;120"],
    statuses: ["Planned", "In Progress", "Report Issued", "Actions Open", "Closed"],
    measure: "savingIdentified",
  },

  "compressed-air": {
    name: "Compressed Air", kind: "analytics", summary: "The most expensive utility per unit",
    entity: "Air Reading", ref: "AIR",
    fields: ["compressor|Compressor|enum|Compressor 75HP #1;Compressor 75HP #2;Compressor 40HP;Screw Compressor", "flow|Flow|float|20;900;Nm³/hr;1", "pressure|Pressure|float|4;9;bar;1", "specificPower|Specific Power|float|0.06;0.18;kW/Nm³;3", "leakPct|Estimated Leakage|pct|2;38", "energyKwh|Energy|float|40;2800;kWh;1", "date|Reading Date|date|-180;0"],
    statuses: ["Efficient", "Acceptable", "Leaking", "Under Repair"],
    measure: "energyKwh",
  },

  boiler: {
    name: "Boiler & Steam", kind: "list", summary: "Thermal generation and efficiency",
    entity: "Boiler Log", ref: "BLR",
    fields: ["boiler|Boiler|enum|Steam Boiler 2T;Steam Boiler 1T;Thermic Fluid Heater", "fuel|Fuel|enum|Natural gas;Diesel;LPG", "fuelUsed|Fuel Used|float|10;2400;units;1", "steamKg|Steam Generated|float|100;24000;kg;0", "efficiency|Efficiency|pct|54;94", "runHrs|Run Hours|float|1;22;hrs;1", "date|Log Date|date|-180;0"],
    statuses: ["Running", "Standby", "Under Maintenance", "Shut Down"],
    measure: "steamKg",
  },

  "energy-alerts": {
    name: "Energy Alerts", kind: "list", summary: "Consumption anomalies flagged",
    entity: "Energy Alert", ref: "EAL",
    fields: ["alert|Alert|enum|Consumption above baseline;Demand near contract limit;Power factor below target;Meter not reporting;Leak suspected;Generator overrun", AREA, "severity|Severity|enum|Critical;High;Medium;Low", "impact|Cost Impact|money|20;28000", OWNER, "date|Raised On|date|-90;0"],
    statuses: ["New", "Acknowledged", "Under Action", "Resolved", "Suppressed"],
    measure: "impact",
  },

  "carbon-from-energy": {
    name: "Energy Carbon Footprint", kind: "analytics", summary: "Emissions from the energy mix",
    entity: "Emission Record", ref: "CO2",
    fields: [UTILITY, AREA, "consumption|Consumption|float|20;9800;units;1", "factor|Emission Factor|float|0.02;2.8;kg/unit;3", "co2Tonnes|CO₂|float|0.2;480;tCO₂e;2", "renewableShare|Renewable Share|pct|0;62", "date|Period End|date|-300;0"],
    statuses: ["Reducing", "Stable", "Rising", "Under Review"],
    measure: "co2Tonnes",
  },

  "energy-settings": {
    name: "Energy Controls", kind: "settings", summary: "Baselines, alerts and targets",
    entity: "Control Rule", ref: "ESET",
    fields: [AREA, "rule|Rule|enum|Alert above baseline;Auto-shed non-critical load;Notify on demand breach;Require reading before period close;Flag meters not reporting", "threshold|Threshold|pct|60;140", OWNER, "date|Effective From|date|-400;0", "metersCovered|Meters Covered|int|1;20"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Alert the energy manager when an area exceeds its baseline by 10%", "Block period close until every meter has a reading"],
  },
};
