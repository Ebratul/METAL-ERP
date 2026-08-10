import type { ModuleSpecs } from "../types";

/** Module 34 — Chemical Management. */

const CHEM = "chemical|Chemical|enum|Nickel Sulphate;Copper Cyanide;Bright Acid Zinc;Chromic Acid;Sodium Hydroxide;Sulphuric Acid;Degreasing Agent;Gold Potassium Cyanide;Passivation Salt;Anti-tarnish Lacquer";
const BATH = "bath|Bath|enum|Nickel Bath 1;Nickel Bath 2;Copper Bath;Zinc Bath;Gold Bath;Degreasing Tank;Rinse Tank 1;Passivation Tank";
const STORE = "store|Storage Area|enum|Chemical Store A;Chemical Store B;Acid Yard;Flammable Cabinet;Line-side Store";
const OWNER = "owner|Custodian|person";
const SUPPLIER = "supplier|Supplier|enum|@suppliers";

export const CHEMICAL_MANAGEMENT: ModuleSpecs = {
  "chemical-register": {
    name: "Chemical Register", kind: "list", summary: "Every chemical held on site",
    entity: "Chemical", ref: "CHM",
    fields: [CHEM, "cas|CAS Number|enum|7786-81-4;544-92-3;7664-93-9;1310-73-2;7738-94-5;13746-66-2", "hazard|Hazard Class|enum|Corrosive;Toxic;Oxidiser;Flammable;Irritant;Environmental", "stock|Stock|float|20;4800;kg;1", "value|Stock Value|money|400;62000", STORE, OWNER, "date|Last Updated|date|-90;0"],
    statuses: ["Approved", "Restricted", "Under Review", "Phasing Out", "Banned"],
    rows: 48,
    insight: "Two approved chemicals are on the buyer's phase-out list for next season — start substitution trials before the audit window.",
  },

  msds: {
    name: "MSDS Library", kind: "list", summary: "Safety data sheets on file",
    entity: "Safety Data Sheet", ref: "SDS",
    fields: [CHEM, SUPPLIER, "revision|Revision|enum|Rev 1;Rev 2;Rev 3;Rev 4", "language|Language|enum|English;Bangla;Chinese;Bilingual", "hazard|Hazard Class|enum|Corrosive;Toxic;Oxidiser;Flammable;Irritant", OWNER, "date|Valid Until|date|-60;700", "pages|Pages|int|2;40"],
    statuses: ["Current", "Expiring", "Expired", "Missing"],
  },

  "bath-chemistry": {
    name: "Bath Chemistry", kind: "analytics", summary: "Concentration held inside limits",
    entity: "Bath Reading", ref: "BCH",
    fields: [BATH, "parameter|Parameter|enum|Metal concentration;pH;Temperature;Brightener;Conductivity;Chloride", "reading|Reading|float|0.4;68;units;2", "target|Target|float|0.5;65;units;2", "deviation|Deviation|pct|82;122", "analyst|Analyst|person", "date|Tested On|date|-30;0"],
    statuses: ["In Control", "Warning Band", "Out of Control", "Corrected"],
    measure: "reading",
  },

  consumption: {
    name: "Chemical Consumption", kind: "analytics", summary: "Usage per 1000 pieces plated",
    entity: "Consumption Record", ref: "CCN",
    fields: [CHEM, BATH, "qty|Consumed|float|2;480;kg;1", "output|Output Plated|int|20000;900000;pcs", "rate|Usage / 1000 pcs|float|0.02;3.4;kg;3", "cost|Cost|money|60;18000", "date|Period|date|-120;0"],
    statuses: ["Within Norm", "Above Norm", "Under Investigation", "Optimised"],
    measure: "qty",
  },

  "restricted-substances": {
    name: "Restricted Substances", kind: "list", summary: "RSL, REACH and ZDHC control",
    entity: "Restricted Item", ref: "RSL",
    fields: [CHEM, "standard|Standard|enum|REACH SVHC;ZDHC MRSL;Buyer RSL;CPSIA;Prop 65;EN 1811", "limit|Permitted Limit|float|0;1000;ppm;1", "measured|Measured|float|0;1400;ppm;1", "risk|Risk|enum|High;Medium;Low", OWNER, "date|Verified On|date|-200;0"],
    statuses: ["Compliant", "Watch", "Non-Compliant", "Substituted"],
    measure: "measured",
  },

  storage: {
    name: "Chemical Storage", kind: "list", summary: "Segregation and quantity limits",
    entity: "Storage Slot", ref: "CST",
    fields: [STORE, CHEM, "capacity|Capacity|float|200;6000;kg;0", "held|Quantity Held|float|10;5800;kg;1", "utilisation|Utilisation|pct|5;99", "segregation|Segregation Group|enum|Acid;Alkali;Oxidiser;Flammable;Neutral", OWNER, "date|Last Inspected|date|-60;0"],
    statuses: ["Compliant", "Near Capacity", "Over Capacity", "Segregation Breach"],
    measure: "held",
  },

  "dosing-log": {
    name: "Dosing Log", kind: "list", summary: "Additions made to each bath",
    entity: "Dosing Entry", ref: "DOS",
    fields: [BATH, CHEM, "qty|Dosed Qty|float|0.2;60;kg;2", "before|Reading Before|float|0.4;58;units;2", "after|Reading After|float|0.5;62;units;2", "operator|Operator|person", "date|Dosed On|date|-30;0"],
    statuses: ["Logged", "Verified", "Correction", "Rejected"],
    measure: "qty",
  },

  "expiry-monitor": {
    name: "Expiry Monitor", kind: "list", summary: "Shelf life running out",
    entity: "Batch", ref: "EXP",
    fields: [CHEM, "batchNo|Batch No|enum|CB-2261;CB-2274;CB-2288;CB-2301;CB-2317;CB-2329", SUPPLIER, "qty|Quantity|float|5;900;kg;1", "value|Value|money|120;24000", "daysLeft|Days to Expiry|int|-40;300;days", "date|Expiry Date|date|-40;300"],
    statuses: ["Valid", "Expiring Soon", "Expired", "Disposed"],
    measure: "value",
  },

  effluent: {
    name: "Effluent Load", kind: "analytics", summary: "What the ETP has to treat",
    entity: "Effluent Reading", ref: "EFL",
    fields: ["stream|Stream|enum|Plating rinse;Acid dip;Alkali wash;Polishing slurry;Floor wash", "parameter|Parameter|enum|pH;COD;BOD;Total Chromium;Nickel;Suspended Solids", "value|Measured Value|float|0.2;480;mg/L;2", "limit|Discharge Limit|float|1;500;mg/L;1", "volume|Volume|float|4;180;m³;1", "analyst|Analyst|person", "date|Sampled On|date|-60;0"],
    statuses: ["Within Limit", "Near Limit", "Exceeded", "Retested"],
    measure: "volume",
  },

  "chemical-purchase": {
    name: "Chemical Purchases", kind: "list", summary: "Inbound chemical orders",
    entity: "Purchase Line", ref: "CPO",
    fields: [CHEM, SUPPLIER, "qty|Order Qty|float|50;4000;kg;0", "rate|Rate|float|0.8;180;USD/kg;2", "value|Order Value|money|400;96000", "leadDays|Lead Time|int|7;90;days", "date|Expected On|date|-30;60"],
    statuses: ["Requested", "Ordered", "In Transit", "Received", "Cancelled"],
  },

  "bath-maintenance": {
    name: "Bath Maintenance", kind: "calendar", summary: "Filtration, dummy and dump plan",
    entity: "Maintenance Task", ref: "BMT",
    fields: [BATH, "task|Task|enum|Carbon treatment;Dummy plating;Filtration;Partial dump;Full dump and refill;Anode cleaning", "downHrs|Downtime|float|1;16;hrs;1", "cost|Cost|money|80;9000", "technician|Technician|person", "date|Planned Date|date|-15;45"],
    statuses: ["Planned", "In Progress", "Completed", "Overdue", "Cancelled"],
  },

  "titration-results": {
    name: "Titration Results", kind: "list", summary: "Lab verification of bath strength",
    entity: "Titration", ref: "TTR",
    fields: [BATH, CHEM, "result|Result|float|0.5;70;g/L;2", "lower|Lower Limit|float|0.4;60;g/L;2", "upper|Upper Limit|float|1;80;g/L;2", "analyst|Analyst|person", "date|Tested On|date|-45;0"],
    statuses: ["Pass", "Borderline", "Fail", "Repeat Test"],
    measure: "result",
  },

  "safety-incidents": {
    name: "Chemical Safety Incidents", kind: "list", summary: "Spills, splashes and exposure",
    entity: "Incident", ref: "CSI",
    fields: [CHEM, STORE, "type|Incident Type|enum|Spill;Splash;Fume exposure;Container damage;Wrong storage;Near miss", "severity|Severity|enum|Major;Moderate;Minor;Near Miss", "lostHrs|Time Lost|float|0;24;hrs;1", "reporter|Reported By|person", "date|Occurred On|date|-180;0"],
    statuses: ["Reported", "Investigating", "Action Taken", "Closed"],
  },

  "ppe-issue": {
    name: "PPE Issue", kind: "list", summary: "Protective equipment given out",
    entity: "PPE Issue", ref: "PPE",
    fields: ["ppe|PPE Item|enum|Chemical goggles;Nitrile gloves;Acid apron;Respirator;Face shield;Safety boots", "worker|Worker|person", "area|Work Area|enum|Plating Line A;Plating Line B;Chemical Store;ETP;Polishing", "qty|Quantity|int|1;40;pcs", "cost|Cost|money|4;900", "date|Issued On|date|-120;0"],
    statuses: ["Issued", "Replacement Due", "Returned", "Damaged"],
  },

  "chemical-approval": {
    name: "New Chemical Approval", kind: "board", summary: "Introduction and clearance workflow",
    entity: "Approval Request", ref: "CAP",
    fields: [CHEM, SUPPLIER, "purpose|Purpose|enum|New finish;Cost reduction;RSL substitution;Quality improvement;Capacity expansion", "trialQty|Trial Qty|float|5;300;kg;1", "requester|Requested By|person", "date|Requested On|date|-90;0"],
    statuses: ["Requested", "Safety Review", "Trial Running", "Approved", "Rejected"],
  },

  "supplier-coa": {
    name: "Supplier CoA", kind: "list", summary: "Certificates of analysis received",
    entity: "Certificate", ref: "COA",
    fields: [CHEM, SUPPLIER, "batchNo|Batch No|enum|CB-2261;CB-2274;CB-2288;CB-2301;CB-2317", "purity|Purity|pct|92;99.9", "verified|Verified In-house|bool|Yes;No", OWNER, "date|Received On|date|-150;0"],
    statuses: ["Received", "Verified", "Discrepancy", "Missing"],
    measure: "purity",
  },

  "waste-disposal": {
    name: "Chemical Waste Disposal", kind: "list", summary: "Licensed disposal records",
    entity: "Disposal", ref: "CWD",
    fields: ["waste|Waste Type|enum|Spent plating solution;Sludge;Contaminated packaging;Expired chemical;Filter media", "qty|Quantity|float|20;2400;kg;1", "handler|Licensed Handler|enum|GreenCycle BD;EnviroSafe Ltd.;Metro Waste Services;EcoChem Handlers", "cost|Disposal Cost|money|60;9800", "manifest|Manifest No|enum|MN-8841;MN-8857;MN-8869;MN-8874;MN-8890", "date|Disposed On|date|-180;0"],
    statuses: ["Scheduled", "Collected", "Certificate Received", "Overdue"],
  },

  "cost-per-litre": {
    name: "Chemical Cost Analysis", kind: "analytics", summary: "Cost of chemistry per unit output",
    entity: "Cost Point", ref: "CCP",
    fields: [BATH, CHEM, "spend|Spend|money|300;42000", "output|Output|int|40000;1200000;pcs", "unitCost|Cost / 1000 pcs|float|0.2;18;USD;2", "trend|vs Last Period|pct|72;128", "date|Period End|date|-180;0"],
    statuses: ["Improving", "Stable", "Rising", "Under Review"],
    measure: "spend",
  },

  "handling-training": {
    name: "Handling Training", kind: "list", summary: "Who is certified to handle what",
    entity: "Training Record", ref: "CTR",
    fields: ["worker|Worker|person", "course|Course|enum|Chemical handling basics;Spill response;Acid dilution;PPE usage;Emergency shower drill", "score|Assessment Score|pct|55;100", "trainer|Trainer|person", "validMonths|Valid For|int|6;36;months", "date|Completed On|date|-400;0"],
    statuses: ["Certified", "Refresher Due", "Expired", "Not Started"],
    measure: "score",
  },

  "chemical-settings": {
    name: "Chemical Controls", kind: "settings", summary: "Thresholds and handling rules",
    entity: "Control Rule", ref: "CSET",
    fields: ["rule|Rule|enum|Block issue of expired batches;Require CoA before receipt;Alert on RSL threshold;Enforce segregation groups;Mandatory PPE check", "threshold|Threshold|pct|60;100", "scope|Scope|enum|All chemicals;Restricted only;Plating baths;Storage areas", OWNER, "date|Effective From|date|-200;0", "chemicalsCovered|Chemicals Covered|int|1;40"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Block issue of chemicals past their expiry date", "Require a valid MSDS before a chemical can be received"],
  },
};
