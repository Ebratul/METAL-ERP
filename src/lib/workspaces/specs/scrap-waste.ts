import type { ModuleSpecs } from "../types";

/** Module 39 — Scrap & Waste Management. */

const METAL = "metal|Material|enum|Brass turnings;Brass sheet offcut;Zinc alloy runner;Steel punch waste;Copper wire;Mixed metal;Plating sludge";
const PROCESS = "process|Process|enum|Blanking;Forming;Turning;Polishing;Plating;Assembly;Packing";
const YARD = "yard|Scrap Yard|enum|Brass Yard;Zinc Yard;Steel Yard;Mixed Yard;Hazardous Store";
const OWNER = "owner|Custodian|person";
const BUYERSCRAP = "trader|Scrap Buyer|enum|Metro Metal Traders;Unified Recyclers;Chattogram Scrap Co.;GreenCycle BD;Dhaka Metal Exchange";

export const SCRAP_WASTE: ModuleSpecs = {
  "scrap-generation": {
    name: "Scrap Generation", kind: "analytics", summary: "Scrap thrown off by each process",
    entity: "Generation Record", ref: "SGN",
    fields: [PROCESS, METAL, "weight|Scrap Weight|float|4;1800;kg;1", "input|Input Weight|float|100;20000;kg;0", "scrapPct|Scrap Rate|pct|0.8;18", "shift|Shift|enum|A (06–14);B (14–22);C (22–06)", "date|Generated On|date|-120;0"],
    statuses: ["Within Norm", "Above Norm", "Under Investigation", "Reduced"],
    measure: "weight", rows: 48,
    insight: "Blanking contributes 54% of brass scrap by weight — nesting optimisation on the two highest-volume dies is the fastest saving.",
  },

  "scrap-collection": {
    name: "Scrap Collection", kind: "list", summary: "Floor to scrap yard movement",
    entity: "Collection Note", ref: "SCL",
    fields: [PROCESS, METAL, "weight|Collected Weight|float|2;900;kg;1", YARD, "collector|Collected By|person", "bin|Bin|enum|BIN-01;BIN-02;BIN-03;BIN-04;BIN-05;BIN-06", "date|Collected On|date|-90;0"],
    statuses: ["Collected", "Weighed", "Transferred", "Discrepancy"],
    measure: "weight",
  },

  "metal-recovery": {
    name: "Metal Recovery", kind: "analytics", summary: "Recovery percentage by alloy",
    entity: "Recovery Record", ref: "MRC",
    fields: [METAL, "generated|Generated|float|20;2400;kg;1", "recovered|Recovered|float|10;2300;kg;1", "recovery|Recovery Rate|pct|42;99", "value|Recovered Value|money|100;42000", "date|Period End|date|-180;0"],
    statuses: ["Excellent", "Acceptable", "Poor", "Under Improvement"],
    measure: "recovered",
  },

  "waste-streams": {
    name: "Waste Streams", kind: "list", summary: "Hazardous and general waste lines",
    entity: "Waste Stream", ref: "WST",
    fields: ["stream|Stream|enum|Metal scrap;Plating sludge;Spent acid;Oily rags;Packaging waste;Domestic waste;E-waste", "class|Classification|enum|Hazardous;Non-hazardous;Recyclable;Regulated", "monthlyKg|Monthly Volume|float|20;9000;kg;0", "handler|Handler|enum|In-house;GreenCycle BD;EnviroSafe Ltd.;Municipal;Licensed recycler", "cost|Handling Cost|money|40;12000", OWNER, "date|Reviewed On|date|-200;0"],
    statuses: ["Managed", "Under Review", "Non-compliant", "Discontinued"],
    measure: "monthlyKg",
  },

  disposal: {
    name: "Disposal Records", kind: "list", summary: "Licensed disposal manifests",
    entity: "Disposal", ref: "DSP",
    fields: ["waste|Waste Type|enum|Plating sludge;Spent acid;Contaminated packaging;Filter media;Expired chemical", "weight|Weight|float|20;3200;kg;1", "handler|Licensed Handler|enum|GreenCycle BD;EnviroSafe Ltd.;Metro Waste Services;EcoChem Handlers", "manifest|Manifest No|enum|MN-8841;MN-8857;MN-8869;MN-8874;MN-8890;MN-8902", "cost|Disposal Cost|money|60;14000", "date|Disposed On|date|-240;0"],
    statuses: ["Scheduled", "Collected", "Certificate Received", "Overdue", "Rejected"],
    measure: "weight",
  },

  "scrap-sales": {
    name: "Scrap Sales", kind: "list", summary: "Resale transactions and realisation",
    entity: "Scrap Sale", ref: "SSL",
    fields: [METAL, BUYERSCRAP, "weight|Weight Sold|float|50;6000;kg;0", "rate|Rate|float|0.3;6.2;USD/kg;2", "value|Sale Value|money|200;62000", "invoice|Invoice No|enum|SI-26-0114;SI-26-0128;SI-26-0143;SI-26-0159;SI-26-0172", "date|Sale Date|date|-240;0"],
    statuses: ["Quoted", "Confirmed", "Delivered", "Invoiced", "Paid"],
    measure: "value",
  },

  "yield-loss": {
    name: "Yield Loss Analysis", kind: "analytics", summary: "Where the material disappears",
    entity: "Loss Point", ref: "YLS",
    fields: [PROCESS, METAL, "inputKg|Input|float|200;18000;kg;0", "outputKg|Good Output|float|150;17500;kg;0", "lossKg|Loss|float|2;1400;kg;1", "lossPct|Loss|pct|0.5;16", "cause|Main Cause|enum|Nesting layout;Setup rejects;Handling damage;Overspray;Trim waste;Evaporation", "date|Period End|date|-200;0"],
    statuses: ["Within Norm", "Above Norm", "Improving", "Critical"],
    measure: "lossKg",
  },

  circularity: {
    name: "Circularity Metrics", kind: "analytics", summary: "Reuse and recycling performance",
    entity: "Circularity Metric", ref: "CIR",
    fields: ["metric|Metric|enum|Recycled input share;Scrap recycled;Waste to landfill;Water reused;Packaging reused;Chemical recovered", "value|Value|pct|4;96", "target|Target|pct|30;95", "gap|Gap to Target|pct|0;60", OWNER, "date|Period End|date|-300;0"],
    statuses: ["Target Met", "On Track", "Behind", "At Risk"],
    measure: "value",
  },

  "scrap-register": {
    name: "Scrap Register", kind: "list", summary: "Every scrap lot on the books",
    entity: "Scrap Lot", ref: "SLT",
    fields: [METAL, YARD, "weight|Weight|float|10;4000;kg;1", "value|Book Value|money|40;28000", "grade|Grade|enum|Clean;Mixed;Contaminated;Oily", "ageDays|Age|int|0;180;days", "date|Received On|date|-240;0"],
    statuses: ["In Stock", "Reserved", "Sold", "Disposed", "Written Off"],
    measure: "weight",
  },

  weighment: {
    name: "Weighment Entry", kind: "form", summary: "Weighbridge and platform records",
    entity: "Weighment", ref: "WGH",
    fields: [METAL, "grossKg|Gross Weight|float|50;12000;kg;1", "tareKg|Tare Weight|float|10;4000;kg;1", "netKg|Net Weight|float|20;9000;kg;1", "vehicle|Vehicle|enum|DH-11-4471;DH-11-6620;CH-14-2288;DH-12-9931;Trolley-Internal", "operator|Weighed By|person", "date|Weighed On|date|-90;0"],
    statuses: ["Draft", "Submitted", "Verified", "Posted", "Rejected"],
    measure: "netKg",
  },

  "scrap-yard": {
    name: "Scrap Yard Position", kind: "list", summary: "What sits in each yard today",
    entity: "Yard Position", ref: "SYD",
    fields: [YARD, METAL, "weight|Weight Held|float|20;9000;kg;0", "capacity|Yard Capacity|float|500;14000;kg;0", "utilisation|Utilisation|pct|4;99", "value|Value Held|money|100;56000", OWNER, "date|As On|date|-30;0"],
    statuses: ["Normal", "Near Capacity", "Overflow", "Clearance Due"],
    measure: "weight",
  },

  "hazardous-waste": {
    name: "Hazardous Waste", kind: "list", summary: "Regulated waste under control",
    entity: "Hazardous Lot", ref: "HZW",
    fields: ["waste|Waste|enum|Plating sludge;Spent acid;Cyanide residue;Chromium waste;Oil contaminated soil", "weight|Weight|float|10;2600;kg;1", "storage|Storage|enum|Hazardous Store A;Hazardous Store B;Sealed Drum Yard;ETP Sludge Bay", "permit|Permit No|enum|DOE-4411;DOE-4488;DOE-4520;DOE-4577", "riskLevel|Risk Level|enum|High;Medium;Low", "date|Disposal Due|date|-30;180"],
    statuses: ["Stored", "Scheduled", "Disposed", "Overdue", "Non-compliant"],
    measure: "weight",
  },

  "recycling-partners": {
    name: "Recycling Partners", kind: "list", summary: "Approved recyclers and licences",
    entity: "Partner", ref: "RCP",
    fields: ["partner|Partner|enum|GreenCycle BD;EnviroSafe Ltd.;Metro Metal Traders;Unified Recyclers;EcoChem Handlers", "streams|Streams Handled|enum|Metal scrap;Plating sludge;Spent acid;Packaging;E-waste", "licenceNo|Licence No|enum|LIC-2261;LIC-2287;LIC-2304;LIC-2338", "rating|Performance Rating|pct|55;99", "volumeKg|Annual Volume|float|2000;90000;kg;0", "date|Licence Expiry|date|-40;500"],
    statuses: ["Approved", "Under Audit", "Licence Expiring", "Suspended", "Blacklisted"],
    measure: "volumeKg",
  },

  "scrap-pricing": {
    name: "Scrap Pricing", kind: "analytics", summary: "Realised rate against market",
    entity: "Price Point", ref: "SPR",
    fields: [METAL, "marketRate|Market Rate|float|0.3;6.5;USD/kg;2", "realisedRate|Realised Rate|float|0.2;6.2;USD/kg;2", "variance|Variance|pct|72;116", "volumeKg|Volume|float|100;9000;kg;0", "value|Value|money|200;54000", "date|Period End|date|-240;0"],
    statuses: ["Above Market", "At Market", "Below Market", "Under Negotiation"],
    measure: "value",
  },

  auction: {
    name: "Scrap Auction", kind: "board", summary: "Competitive bidding rounds",
    entity: "Auction Lot", ref: "AUC",
    fields: [METAL, "weight|Lot Weight|float|200;9000;kg;0", "reserve|Reserve Price|money|200;42000", "topBid|Highest Bid|money|100;58000", "bidders|Bidders|int|1;9", BUYERSCRAP, "date|Auction Date|date|-90;30"],
    statuses: ["Announced", "Bidding Open", "Bids Received", "Awarded", "Cancelled"],
    measure: "topBid",
  },

  "scrap-transfer": {
    name: "Scrap Transfers", kind: "list", summary: "Movement between yards and plants",
    entity: "Transfer", ref: "STF",
    fields: [METAL, "fromYard|From|enum|Brass Yard;Zinc Yard;Steel Yard;Mixed Yard;Plant 2 Yard", "toYard|To|enum|Brass Yard;Zinc Yard;Mixed Yard;Recycler;Plant 1 Yard", "weight|Weight|float|20;4000;kg;1", "vehicle|Vehicle|enum|DH-11-4471;DH-11-6620;CH-14-2288;Trolley-Internal", OWNER, "date|Transfer Date|date|-120;0"],
    statuses: ["Raised", "In Transit", "Received", "Short Received", "Cancelled"],
    measure: "weight",
  },

  "waste-audit": {
    name: "Waste Audit", kind: "calendar", summary: "Internal and regulatory audits",
    entity: "Waste Audit", ref: "WAD",
    fields: ["scope|Audit Scope|enum|Hazardous storage;Segregation practice;Manifest records;Recycler compliance;ETP sludge handling", "auditor|Auditor|person", "findings|Findings|int|0;12", "score|Score|pct|50;100", "body|Audit Body|enum|Internal;DOE;Buyer;Certification body", "date|Audit Date|date|-200;90"],
    statuses: ["Planned", "In Progress", "Report Issued", "Closed", "Postponed"],
    measure: "score",
  },

  "scrap-value": {
    name: "Scrap Value Recovery", kind: "analytics", summary: "Income recovered from waste",
    entity: "Value Record", ref: "SVR",
    fields: [METAL, "weight|Weight|float|100;9000;kg;0", "income|Sales Income|money|200;62000", "handlingCost|Handling Cost|money|20;12000", "netValue|Net Recovery|money|100;56000", "sharePct|Share of Scrap Income|pct|2;44", "date|Period End|date|-240;0"],
    statuses: ["Improving", "Stable", "Declining", "Under Review"],
    measure: "netValue",
  },

  "etp-sludge": {
    name: "ETP Sludge Handling", kind: "list", summary: "Treatment plant residue tracking",
    entity: "Sludge Lot", ref: "ETP",
    fields: ["source|Source|enum|Primary clarifier;Secondary clarifier;Filter press;Neutralisation tank", "weight|Wet Weight|float|20;3000;kg;1", "moisture|Moisture|pct|20;82", "metalContent|Metal Content|pct|1;28", "disposal|Disposal Route|enum|Licensed landfill;Cement co-processing;Metal recovery;Storage", "date|Generated On|date|-180;0"],
    statuses: ["Stored", "Scheduled", "Dispatched", "Disposed", "Overdue"],
    measure: "weight",
  },

  "scrap-settings": {
    name: "Scrap Controls", kind: "settings", summary: "Norms, approvals and alerts",
    entity: "Control Rule", ref: "SSET",
    fields: [PROCESS, "rule|Rule|enum|Alert above scrap norm;Require weighment before transfer;Approval for scrap sale;Block disposal without manifest;Segregate hazardous streams", "normPct|Scrap Norm|pct|1;15", OWNER, "date|Effective From|date|-300;0", "streamsCovered|Streams Covered|int|1;12"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Require a weighbridge slip before any scrap leaves the gate", "Alert the plant head when a process exceeds its scrap norm"],
  },
};
