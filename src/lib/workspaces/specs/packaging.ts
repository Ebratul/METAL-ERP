import type { ModuleSpecs } from "../types";

/** Module 41 — Packaging Management. */

const ITEM = "item|Item|enum|@items";
const BUYER = "buyer|Buyer|enum|@buyers";
const PACKMAT = "material|Packing Material|enum|5-ply carton;3-ply carton;Poly bag 8x10;Poly bag 12x16;Bubble wrap;Hang tag;Barcode sticker;Adhesive tape;Pallet;Silica gel";
const OWNER = "owner|Packing In-charge|person";
const ORDER = "order|Sales Order|enum|SO-26-2041;SO-26-2058;SO-26-2073;SO-26-2090;SO-26-2114;SO-26-2138";

export const PACKAGING: ModuleSpecs = {
  "packing-specs": {
    name: "Packing Specifications", kind: "list", summary: "Buyer-wise packing rules",
    entity: "Packing Spec", ref: "PSP",
    fields: [BUYER, ITEM, "innerPack|Inner Pack|enum|100 pcs poly;144 pcs poly;500 pcs poly;Gross box;Blister card", "perCarton|Pieces per Carton|int|500;20000;pcs", "cartonType|Carton|enum|5-ply carton;3-ply carton;Master carton;Export carton", "grossKg|Gross Weight|float|2;22;kg;2", OWNER, "date|Effective From|date|-500;0"],
    statuses: ["Active", "Under Revision", "Draft", "Withdrawn"],
    measure: "perCarton", rows: 44,
    insight: "Two buyers still specify 3-ply cartons for sea freight — upgrading them would cut transit damage claims noticeably.",
  },

  "carton-master": {
    name: "Carton Master", kind: "list", summary: "Box sizes, strength and cost",
    entity: "Carton", ref: "CTN",
    fields: ["cartonCode|Carton Code|enum|CT-5P-A;CT-5P-B;CT-3P-A;CT-3P-B;CT-EXP-01;CT-EXP-02", "size|Size (mm)|enum|400x300x250;450x350x300;500x400x350;600x400x400", "ply|Ply|enum|3-ply;5-ply;7-ply", "burstStrength|Burst Strength|int|8;24;kg/cm²", "cost|Unit Cost|float|0.3;2.8;USD;2", "stock|Stock|int|100;24000;pcs", "date|Updated On|date|-200;0"],
    statuses: ["Active", "Low Stock", "Discontinued", "Under Trial"],
    measure: "stock",
  },

  "packing-list": {
    name: "Packing Lists", kind: "list", summary: "Carton-wise contents per shipment",
    entity: "Packing List", ref: "PKL",
    fields: [ORDER, BUYER, ITEM, "cartons|Cartons|int|4;900", "qty|Total Qty|int|2000;400000;pcs", "netKg|Net Weight|float|20;9000;kg;1", "grossKg|Gross Weight|float|25;9800;kg;1", "date|Prepared On|date|-90;10"],
    statuses: ["Draft", "Verified", "Finalised", "Sent to Buyer", "Amended"],
    measure: "qty",
  },

  "packing-plan": {
    name: "Packing Plan", kind: "calendar", summary: "Daily packing schedule",
    entity: "Packing Slot", ref: "PPL",
    fields: [ORDER, ITEM, "line|Packing Line|enum|Pack Line 1;Pack Line 2;Pack Line 3;Export Bay", "qty|Planned Qty|int|2000;220000;pcs", "manpower|Manpower|int|3;28", "hours|Hours|float|1;14;hrs;1", "date|Planned Date|date|-10;30"],
    statuses: ["Scheduled", "Confirmed", "Packing", "Completed", "Rescheduled"],
    measure: "qty",
  },

  "poly-labels": {
    name: "Poly Bags & Labels", kind: "list", summary: "Inner packing consumables",
    entity: "Inner Pack Item", ref: "PLB",
    fields: ["itemType|Item Type|enum|Poly bag 8x10;Poly bag 12x16;Hang tag;Barcode sticker;Care label;Silica gel", BUYER, "stock|Stock|int|500;90000;pcs", "reorder|Reorder Level|int|200;20000;pcs", "unitCost|Unit Cost|float|0.002;0.4;USD;3", "supplier|Supplier|enum|@suppliers", "date|Last Received|date|-120;0"],
    statuses: ["In Stock", "Low Stock", "On Order", "Out of Stock", "Discontinued"],
    measure: "stock",
  },

  "carton-optimization": {
    name: "Carton Optimisation", kind: "analytics", summary: "Fill rate and cube efficiency",
    entity: "Optimisation Case", ref: "COP",
    fields: [ITEM, "cartonCode|Carton|enum|CT-5P-A;CT-5P-B;CT-3P-A;CT-EXP-01;CT-EXP-02", "fillRate|Fill Rate|pct|48;99", "cubeUsed|Cube Used|float|0.02;0.24;m³;3", "savingPerShipment|Saving|money|20;4200", "recommendation|Recommendation|enum|Change carton size;Change inner pack;Increase pieces per carton;No change", "date|Analysed On|date|-200;0"],
    statuses: ["Opportunity", "Under Trial", "Implemented", "Rejected"],
    measure: "savingPerShipment",
  },

  "packing-consumption": {
    name: "Packing Consumption", kind: "analytics", summary: "Material used against standard",
    entity: "Consumption Record", ref: "PCN",
    fields: [PACKMAT, ORDER, "standard|Standard Qty|int|50;20000;pcs", "actual|Actual Used|int|40;22000;pcs", "variance|Variance|pct|85;125", "cost|Cost|money|20;9800", "date|Period|date|-150;0"],
    statuses: ["Within Norm", "Over Consumption", "Under Review", "Adjusted"],
    measure: "cost",
  },

  "shipping-marks": {
    name: "Shipping Marks", kind: "form", summary: "Carton marking artwork",
    entity: "Shipping Mark", ref: "SHM",
    fields: [BUYER, ORDER, "markType|Mark Type|enum|Main mark;Side mark;Handling symbols;Country of origin;Carton number range", "cartons|Cartons Covered|int|10;900", "artwork|Artwork Ref|enum|ART-3311;ART-3348;ART-3372;ART-3395", "approver|Approved By|person", "date|Approved On|date|-120;15"],
    statuses: ["Draft", "Sent for Approval", "Approved", "Rejected", "Printed"],
    measure: "cartons",
  },

  "packing-materials": {
    name: "Packing Material Stock", kind: "list", summary: "What the packing store holds",
    entity: "Material Stock", ref: "PMS",
    fields: [PACKMAT, "stock|Stock|int|100;60000;pcs", "reserved|Reserved|int|0;40000;pcs", "value|Stock Value|money|100;42000", "reorder|Reorder Level|int|100;12000;pcs", "location|Location|enum|Pack Store A;Pack Store B;Line-side rack;Outdoor shed", "date|As On|date|-30;0"],
    statuses: ["In Stock", "Low Stock", "Reorder Raised", "Out of Stock"],
    measure: "stock",
  },

  "packing-orders": {
    name: "Packing Material Orders", kind: "list", summary: "Purchases from packaging vendors",
    entity: "Material Order", ref: "PMO",
    fields: [PACKMAT, "supplier|Supplier|enum|@suppliers", "qty|Order Qty|int|500;80000;pcs", "rate|Rate|float|0.002;2.8;USD;3", "value|Order Value|money|100;58000", "leadDays|Lead Time|int|5;45;days", "date|Expected On|date|-40;60"],
    statuses: ["Requested", "Ordered", "In Transit", "Received", "Cancelled"],
    measure: "value",
  },

  assortment: {
    name: "Assortment & Ratio Packing", kind: "list", summary: "Mixed-size and colour packs",
    entity: "Assortment", ref: "ASR",
    fields: [BUYER, ORDER, "ratio|Ratio|enum|1:2:2:1;2:3:3:2;1:1:1:1;Solid pack;Custom", "sizes|Sizes|enum|16L/18L/20L;20L/24L/28L;15mm/17mm/20mm;Mixed", "cartons|Cartons|int|4;600", "qty|Total Qty|int|2000;200000;pcs", "date|Packed On|date|-90;10"],
    statuses: ["Planned", "Packing", "Completed", "Reworked"],
    measure: "qty",
  },

  "packing-lines": {
    name: "Packing Line Status", kind: "board", summary: "Live state of each packing bay",
    entity: "Line Job", ref: "PLS",
    fields: ["line|Packing Line|enum|Pack Line 1;Pack Line 2;Pack Line 3;Export Bay", ORDER, ITEM, "qty|Job Qty|int|2000;180000;pcs", "packed|Packed|int|0;180000;pcs", "manpower|Manpower|int|3;24", OWNER],
    statuses: ["Queued", "Setup", "Packing", "Quality Check", "Completed"],
    measure: "qty",
  },

  "packing-cost": {
    name: "Packing Cost", kind: "analytics", summary: "Cost of packing per shipment",
    entity: "Cost Record", ref: "PCS",
    fields: [ORDER, BUYER, "materialCost|Material Cost|money|100;38000", "labourCost|Labour Cost|money|40;12000", "cartons|Cartons|int|10;900", "costPerCarton|Cost per Carton|float|0.4;18;USD;2", "date|Period End|date|-180;0"],
    statuses: ["Within Standard", "Above Standard", "Under Review", "Approved"],
    measure: "materialCost",
  },

  "material-reorder": {
    name: "Material Reorder", kind: "list", summary: "Replenishment suggestions",
    entity: "Reorder Suggestion", ref: "PRO",
    fields: [PACKMAT, "onHand|On Hand|int|0;20000;pcs", "reorder|Reorder Level|int|200;16000;pcs", "suggestQty|Suggested Qty|int|500;40000;pcs", "coverDays|Cover|int|0;60;days", "supplier|Preferred Supplier|enum|@suppliers", "date|Suggested On|date|-30;0"],
    statuses: ["Suggested", "Requisition Raised", "Ordered", "Ignored"],
    measure: "suggestQty",
  },

  "pack-quality": {
    name: "Packing Quality Check", kind: "list", summary: "Carton audits before dispatch",
    entity: "Pack Check", ref: "PQC",
    fields: [ORDER, BUYER, "cartonsChecked|Cartons Checked|int|2;120", "defects|Defects Found|int|0;18", "defectType|Defect|enum|Wrong count;Wrong label;Weak sealing;Mixed sizes;Damaged carton;Missing insert", "inspector|Inspector|person", "date|Checked On|date|-90;0"],
    statuses: ["Passed", "Passed with Comment", "Repacking", "Failed"],
    measure: "cartonsChecked",
  },

  "barcode-labels": {
    name: "Barcode & GS1 Labels", kind: "list", summary: "Scannable labels per carton",
    entity: "Label Job", ref: "BCL",
    fields: [ORDER, BUYER, "labelStandard|Standard|enum|GS1-128;EAN-13;Code 39;QR;Buyer specific", "labels|Labels Printed|int|10;3200", "verified|Scan Verified|bool|Yes;No", "printer|Printer|enum|Zebra-01;Zebra-02;TSC-01", "date|Printed On|date|-90;0"],
    statuses: ["Queued", "Printed", "Verified", "Reprint Needed"],
    measure: "labels",
  },

  "pallet-plan": {
    name: "Pallet Planning", kind: "analytics", summary: "Cartons per pallet and container",
    entity: "Pallet Plan", ref: "PLT",
    fields: [ORDER, "palletType|Pallet|enum|Euro 1200x800;Standard 1200x1000;Slip sheet;Loose load", "cartonsPerPallet|Cartons / Pallet|int|12;96", "pallets|Pallets|int|1;44", "containerFill|Container Fill|pct|48;99", "container|Container|enum|20ft;40ft;40ft HC;LCL", "date|Planned On|date|-60;25"],
    statuses: ["Draft", "Optimised", "Confirmed", "Loaded"],
    measure: "pallets",
  },

  sustainable: {
    name: "Sustainable Packaging", kind: "analytics", summary: "Recycled content and waste reduction",
    entity: "Sustainability Metric", ref: "SUS",
    fields: [PACKMAT, "recycledContent|Recycled Content|pct|0;98", "target|Target|pct|30;95", "weightPerCarton|Weight per Carton|float|0.1;2.4;kg;2", "co2|CO₂ per 1000 pcs|float|0.4;28;kg;2", "date|Period End|date|-300;0"],
    statuses: ["Target Met", "On Track", "Behind", "Not Started"],
    measure: "recycledContent",
  },

  "vendor-packaging": {
    name: "Packaging Vendors", kind: "list", summary: "Supplier performance for packing",
    entity: "Vendor", ref: "PVN",
    fields: ["supplier|Supplier|enum|@suppliers", "category|Category|enum|Cartons;Poly bags;Labels;Tapes;Pallets", "onTime|On-Time Delivery|pct|48;100", "quality|Quality Rating|pct|55;99", "annualSpend|Annual Spend|money|4000;280000", "leadDays|Lead Time|int|5;45;days", "date|Reviewed On|date|-200;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Suspended"],
    measure: "annualSpend",
  },

  "packing-settings": {
    name: "Packing Controls", kind: "settings", summary: "Standards enforced at packing",
    entity: "Control Rule", ref: "PKSET",
    fields: ["rule|Rule|enum|Block packing without approved spec;Mandatory carton scan;Weight tolerance check;Auto-consume packing material;Require pack QC pass", "tolerance|Tolerance|pct|1;15", OWNER, "date|Effective From|date|-300;0", "buyersCovered|Buyers Covered|int|1;24"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Block packing when the buyer specification is not approved", "Flag cartons outside the declared gross weight tolerance"],
  },
};
