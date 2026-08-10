import type { ModuleSpecs } from "../types";

/** Module 50 — Asset Management. */

const ASSET = "asset|Asset|enum|Power Press 60T;Power Press 110T;Hydraulic Press 150T;Vibratory Polisher;Barrel Plating Line;Rack Plating Line;Air Compressor 75HP;Diesel Generator 500kVA;Delivery Truck;Forklift 2T;IT Server;Office Building";
const CLASS = "class|Asset Class|enum|Plant & machinery;Building;Vehicle;IT equipment;Furniture;Electrical installation;Tools & dies";
const LOCATION = "location|Location|enum|Plant 1 – Press Shop;Plant 1 – Plating;Plant 2 – Assembly;Warehouse;Head Office;Utility Yard";
const CUSTODIAN = "custodian|Custodian|person";
const COSTCENTER = "costCenter|Cost Center|enum|CC-1001 Production;CC-2001 Plating;CC-3001 Packing;CC-4001 Admin;CC-6001 Maintenance";

export const ASSET_MANAGEMENT: ModuleSpecs = {
  "asset-register": {
    name: "Asset Register", kind: "list", summary: "Every capitalised asset on the books",
    entity: "Asset", ref: "AST",
    fields: [ASSET, CLASS, LOCATION, "cost|Acquisition Cost|money|2000;1800000", "accumulated|Accumulated Depreciation|money|0;1400000", "netBook|Net Book Value|money|0;1600000", CUSTODIAN, "date|Capitalised On|date|-2000;0"],
    statuses: ["In Use", "Idle", "Under Maintenance", "Held for Disposal", "Disposed"],
    measure: "cost", rows: 52,
    insight: "Roughly a fifth of plant and machinery is fully depreciated but still running — a revaluation would sharpen the return-on-assets picture.",
  },

  acquisitions: {
    name: "Acquisitions", kind: "list", summary: "New assets capitalised",
    entity: "Acquisition", ref: "ACQ",
    fields: [ASSET, CLASS, "supplier|Supplier|enum|@suppliers", "cost|Cost|money|2000;1600000", "installCost|Installation Cost|money|0;120000", "usefulLife|Useful Life|int|3;30;yrs", COSTCENTER, "date|Acquired On|date|-900;0"],
    statuses: ["Requested", "Ordered", "Received", "Capitalised", "Cancelled"],
    measure: "cost",
  },

  depreciation: {
    name: "Depreciation Schedule", kind: "analytics", summary: "Charge by method and class",
    entity: "Depreciation Line", ref: "DEP",
    fields: [ASSET, CLASS, "method|Method|enum|Straight line;Reducing balance;Units of production", "rate|Rate|pct|2;33", "openingWdv|Opening WDV|money|1000;1600000", "charge|Charge for Period|money|100;180000", "closingWdv|Closing WDV|money|0;1500000", "date|Period End|date|-360;0"],
    statuses: ["Posted", "Provisional", "Adjusted", "Fully Depreciated"],
    measure: "charge",
  },

  transfers: {
    name: "Asset Transfers", kind: "list", summary: "Location and custodian changes",
    entity: "Transfer", ref: "ATR",
    fields: [ASSET, "fromLocation|From|enum|Plant 1 – Press Shop;Plant 1 – Plating;Plant 2 – Assembly;Warehouse;Head Office", "toLocation|To|enum|Plant 1 – Press Shop;Plant 2 – Assembly;Warehouse;Head Office;Utility Yard", "fromCustodian|From Custodian|person", "toCustodian|To Custodian|person", "netBook|Net Book Value|money|0;1200000", "date|Transfer Date|date|-500;10"],
    statuses: ["Requested", "Approved", "In Transit", "Received", "Rejected"],
    measure: "netBook",
  },

  insurance: {
    name: "Insurance Coverage", kind: "list", summary: "Policies, cover and renewals",
    entity: "Policy", ref: "INS",
    fields: [ASSET, "insurer|Insurer|enum|Green Delta;Pragati Insurance;Sadharan Bima;Reliance Insurance", "coverType|Cover|enum|Fire & allied perils;Machinery breakdown;Burglary;Motor;All risk", "sumInsured|Sum Insured|money|10000;2400000", "premium|Premium|money|100;42000", "policyNo|Policy No|enum|POL-4411;POL-4438;POL-4452;POL-4477", "date|Expiry Date|date|-60;420"],
    statuses: ["Active", "Expiring", "Expired", "Under Renewal", "Claimed"],
    measure: "sumInsured",
  },

  disposal: {
    name: "Disposal & Write-off", kind: "list", summary: "Retirement of assets",
    entity: "Disposal", ref: "DSP",
    fields: [ASSET, "method|Disposal Method|enum|Sale;Scrap;Trade-in;Donation;Write-off", "netBook|Net Book Value|money|0;620000", "proceeds|Sale Proceeds|money|0;680000", "gainLoss|Gain / Loss|money|0;120000", "approver|Approved By|person", "date|Disposal Date|date|-600;30"],
    statuses: ["Proposed", "Under Approval", "Approved", "Disposed", "Rejected"],
    measure: "proceeds",
  },

  "asset-verification": {
    name: "Physical Verification", kind: "calendar", summary: "Scheduled asset audits",
    entity: "Verification Task", ref: "AVR",
    fields: [LOCATION, CLASS, "assetsPlanned|Assets to Verify|int|4;220", "assetsFound|Assets Found|int|0;220", "variance|Variance|int|0;24", "verifier|Verified By|person", "date|Verification Date|date|-200;90"],
    statuses: ["Scheduled", "In Progress", "Completed", "Variance Review", "Approved"],
    measure: "assetsPlanned",
  },

  capex: {
    name: "Capex Tracking", kind: "analytics", summary: "Project spend against sanction",
    entity: "Capex Project", ref: "CPX",
    fields: ["project|Project|enum|Plating line upgrade;New press installation;Solar rooftop;ETP expansion;Warehouse racking;Automation cell", "sanctioned|Sanctioned|money|20000;1800000", "committed|Committed|money|0;1700000", "spent|Spent|money|0;1700000", "progress|Physical Progress|pct|0;100", "owner|Project Owner|person", "date|Completion Target|date|-120;420"],
    statuses: ["Proposed", "Approved", "In Progress", "Completed", "On Hold"],
    measure: "sanctioned",
  },

  utilization: {
    name: "Asset Utilisation", kind: "analytics", summary: "Return earned on the asset base",
    entity: "Utilisation Record", ref: "AUT",
    fields: [ASSET, LOCATION, "availableHrs|Available Hours|float|100;720;hrs;0", "runHrs|Run Hours|float|20;700;hrs;0", "utilisation|Utilisation|pct|10;99", "outputValue|Output Value|money|2000;920000", "roa|Return on Asset|pct|1;38", "date|Period End|date|-300;0"],
    statuses: ["High Utilisation", "Normal", "Underutilised", "Idle"],
    measure: "outputValue",
  },

  tagging: {
    name: "Asset Tagging", kind: "list", summary: "Barcode and RFID identification",
    entity: "Asset Tag", ref: "TAG",
    fields: [ASSET, "tagNo|Tag No|enum|TAG-10041;TAG-10058;TAG-10072;TAG-10091;TAG-10114", "tagType|Tag Type|enum|Barcode label;RFID tag;Engraved plate;QR sticker", LOCATION, "lastScannedDays|Last Scanned|int|0;220;days", CUSTODIAN, "date|Tagged On|date|-900;0"],
    statuses: ["Tagged", "Tag Damaged", "Untagged", "Retagged"],
  },

  warranty: {
    name: "Warranty & AMC", kind: "list", summary: "Cover still available on assets",
    entity: "Warranty", ref: "WRN",
    fields: [ASSET, "supplier|Supplier|enum|@suppliers", "coverType|Cover|enum|Manufacturer warranty;Extended warranty;AMC;CAMC;Out of cover", "coverValue|Cover Value|money|500;280000", "claimsMade|Claims Made|int|0;9", "date|Cover Until|date|-120;600", CUSTODIAN],
    statuses: ["Under Warranty", "Expiring", "Expired", "Claimed", "Not Covered"],
    measure: "coverValue",
  },

  leases: {
    name: "Leased Assets", kind: "list", summary: "Assets held under lease",
    entity: "Lease", ref: "LSE",
    fields: [ASSET, "lessor|Lessor|enum|IDLC Finance;Lanka Bangla;United Leasing;IPDC Finance", "leaseType|Lease Type|enum|Finance lease;Operating lease;Hire purchase", "monthlyRent|Monthly Rental|money|200;42000", "termMonths|Term|int|12;84;months", "liability|Lease Liability|money|1000;920000", "date|Lease End|date|-90;900"],
    statuses: ["Active", "Expiring", "Expired", "Renewed", "Terminated"],
    measure: "liability",
  },

  "asset-costing": {
    name: "Asset Cost of Ownership", kind: "analytics", summary: "Running cost across the life",
    entity: "Cost Record", ref: "TCO",
    fields: [ASSET, "acquisition|Acquisition|money|2000;1600000", "maintenance|Maintenance to Date|money|100;420000", "energy|Energy to Date|money|100;380000", "totalCost|Total Cost|money|2000;2200000", "costPerHour|Cost per Run Hour|float|0.4;92;USD;2", "date|Period End|date|-360;0"],
    statuses: ["Economical", "Acceptable", "Expensive", "Replacement Candidate"],
    measure: "totalCost",
  },

  "spare-assets": {
    name: "Standby & Spare Assets", kind: "list", summary: "Backup equipment held ready",
    entity: "Standby Asset", ref: "SPA",
    fields: [ASSET, LOCATION, "readiness|Readiness|pct|20;100", "lastTestedDays|Last Tested|int|0;220;days", "netBook|Net Book Value|money|500;620000", CUSTODIAN, "date|Next Test Due|date|-40;180"],
    statuses: ["Ready", "Needs Testing", "Under Repair", "Not Ready"],
    measure: "netBook",
  },

  impairment: {
    name: "Impairment Review", kind: "list", summary: "Assets carrying more than they earn",
    entity: "Impairment Case", ref: "IMP",
    fields: [ASSET, "indicator|Indicator|enum|Obsolescence;Physical damage;Idle for long period;Market value drop;Technology change", "carryingValue|Carrying Value|money|1000;920000", "recoverable|Recoverable Amount|money|0;900000", "impairment|Impairment Loss|money|0;420000", "approver|Approved By|person", "date|Assessed On|date|-400;0"],
    statuses: ["Identified", "Under Assessment", "Impaired", "No Impairment", "Reversed"],
    measure: "impairment",
  },

  custodian: {
    name: "Custodian Register", kind: "list", summary: "Who is accountable for what",
    entity: "Custody Record", ref: "CUS",
    fields: [CUSTODIAN, "department|Department|enum|Production;Maintenance;Quality;Stores;Admin;IT", "assetsHeld|Assets Held|int|1;42", "totalValue|Value Held|money|2000;1600000", "lastVerifiedDays|Last Verified|int|0;300;days", LOCATION, "date|Assigned On|date|-800;0"],
    statuses: ["Current", "Verification Due", "Handover Pending", "Cleared"],
    measure: "totalValue",
  },

  "asset-request": {
    name: "Asset Request", kind: "form", summary: "Ask for a new or replacement asset",
    entity: "Asset Request", ref: "ARQ",
    fields: [CLASS, "description|Requested Asset|enum|Power press;Polishing machine;Compressor;Forklift;Laptop;Testing instrument;Vehicle", "justification|Justification|enum|Capacity expansion;Replacement;Breakdown;New product;Compliance;Cost saving", "estimatedCost|Estimated Cost|money|500;920000", COSTCENTER, "requester|Requested By|person", "date|Required By|date|-30;300"],
    statuses: ["Draft", "Submitted", "Under Approval", "Approved", "Rejected"],
    measure: "estimatedCost",
  },

  revaluation: {
    name: "Revaluation", kind: "list", summary: "Fair-value adjustments to the register",
    entity: "Revaluation", ref: "RVL",
    fields: [ASSET, CLASS, "bookValue|Book Value|money|1000;1400000", "revaluedAmount|Revalued Amount|money|1000;1800000", "surplus|Revaluation Surplus|money|0;620000", "valuer|Valuer|enum|Independent valuer;Internal committee;Insurance surveyor", "date|Valuation Date|date|-800;0"],
    statuses: ["Proposed", "Under Review", "Approved", "Posted", "Rejected"],
    measure: "revaluedAmount",
  },

  lifecycle: {
    name: "Asset Lifecycle", kind: "analytics", summary: "Age profile and replacement runway",
    entity: "Lifecycle Record", ref: "LCY",
    fields: [ASSET, CLASS, "ageYears|Age|float|0.2;28;yrs;1", "usefulLife|Useful Life|int|3;30;yrs", "lifeUsed|Life Used|pct|2;100", "replacementCost|Replacement Cost|money|2000;1800000", "date|Replacement Due|date|-200;900"],
    statuses: ["Early Life", "Mid Life", "Late Life", "Beyond Life"],
    measure: "replacementCost",
  },

  "asset-settings": {
    name: "Asset Controls", kind: "settings", summary: "Capitalisation and verification rules",
    entity: "Control Rule", ref: "ASET",
    fields: ["rule|Rule|enum|Capitalisation threshold;Mandatory tagging before use;Annual physical verification;Approval for disposal;Auto-depreciation posting", "threshold|Threshold|money|100;20000", "owner|Rule Owner|person", "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Capitalise any purchase above the threshold automatically", "Block asset issue until a tag number is recorded"],
  },
};
