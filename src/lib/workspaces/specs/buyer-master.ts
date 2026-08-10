import type { ModuleSpecs } from "../types";

/** Module 64 — Buyer Master Management. */

const BUYER = "buyer|Buyer|enum|@buyers";
const MERCH = "merchandiser|Merchandiser|person";
const REGION = "region|Region|enum|Europe;North America;East Asia;South Asia;Middle East;Oceania";
const SEGMENT = "segment|Segment|enum|Strategic;Key account;Growth;Transactional;Dormant";

export const BUYER_MASTER: ModuleSpecs = {
  "buyer-directory": {
    name: "Buyer Directory", kind: "list", summary: "Every buyer and buying group",
    entity: "Buyer", ref: "BYR",
    fields: [BUYER, SEGMENT, REGION, "annualValue|Annual Order Value|money|48000;9800000", "orders|Orders (12m)|int|2;180", "shareOfBusiness|Share of Business|pct|0.4;28", MERCH, "date|Onboarded On|date|-3600;-30"],
    statuses: ["Active", "New", "On Hold", "Dormant", "Blacklisted"],
    measure: "annualValue", rows: 44,
    insight: "Four buyers now sit above the 15% concentration threshold. Inditex alone carries 22% of confirmed value — commercially strong, but a single-buyer shock would be material.",
  },

  "buyer-profile": {
    name: "Buyer Profile", kind: "form", summary: "Legal identity and trade details",
    entity: "Buyer Profile", ref: "BPR",
    fields: [BUYER, "legalName|Legal Name|enum|H&M Hennes & Mauritz GBC AB;Industria de Diseño Textil S.A.;Levi Strauss & Co.;Primark Ltd.;Fast Retailing Co. Ltd.;Decathlon SA", "country|Country of Registration|enum|Sweden;Spain;United States;Ireland;Japan;France;Denmark;United Kingdom", "vatId|Tax / VAT ID|enum|SE556042733201;ESA15075062;US942479956;IE9682796N;JP4010001034730", "incoterm|Default Incoterm|enum|FOB;CIF;CFR;EXW;DDP;FCA", "currency|Trading Currency|enum|USD;EUR;GBP;JPY;CNY", MERCH, "date|Profile Updated|date|-500;0"],
    statuses: ["Verified", "Draft", "Pending Documents", "Superseded"],
  },

  "brand-mapping": {
    name: "Brand Mapping", kind: "list", summary: "Brands sitting under each buyer",
    entity: "Brand", ref: "BRD",
    fields: [BUYER, "brand|Brand|enum|H&M;COS;Monki;Weekday;Zara;Bershka;Pull&Bear;Levi's;Dockers;Uniqlo;GU;Quechua;Domyos", "productLines|Product Lines|enum|Denim;Outerwear;Knitwear;Bags;Footwear;Kids;Sportswear", "orders|Orders (12m)|int|1;98", "value|Order Value|money|8000;3800000", "growth|YoY Growth|pct|0;72", MERCH, "date|Mapped On|date|-1400;0"],
    statuses: ["Active", "Seasonal", "New", "Discontinued"],
    measure: "value", rows: 48,
  },

  addresses: {
    name: "Ship-to & Bill-to", kind: "list", summary: "Delivery and invoicing addresses",
    entity: "Address", ref: "ADR",
    fields: [BUYER, "addressType|Address Type|enum|Bill-to;Ship-to;Consignee;Notify party;Agent;Return address", "location|Location|enum|Stockholm, Sweden;Arteixo, Spain;San Francisco, USA;Dublin, Ireland;Tokyo, Japan;Lille, France;Hong Kong SAR;Singapore", "port|Port of Discharge|enum|Hamburg;Rotterdam;Los Angeles;Felixstowe;Yokohama;Le Havre;Jebel Ali;Colombo", "contact|Contact Person|person", "isDefault|Default|bool|Yes;No", "date|Added On|date|-1800;0"],
    statuses: ["Active", "Pending Verification", "Superseded", "Blocked"],
  },

  "buyer-contacts": {
    name: "Buyer Contacts", kind: "list", summary: "Who we deal with on each side",
    entity: "Contact", ref: "CNT",
    fields: [BUYER, "contact|Contact|person", "role|Role|enum|Buying manager;Merchandiser;Technologist;Quality auditor;Compliance officer;Logistics coordinator;Finance contact", "channel|Preferred Channel|enum|Email;Buyer portal;Phone;WhatsApp;In person", "seniority|Seniority|enum|Head;Manager;Senior executive;Executive", "interactions|Interactions (90d)|int|0;120", "date|Last Contacted|date|-200;0"],
    statuses: ["Active", "Primary", "On Leave", "Left the Company"],
    measure: "interactions",
  },

  "buyer-terms": {
    name: "Commercial Terms", kind: "settings", summary: "Payment and delivery terms",
    entity: "Term Set", ref: "TRM",
    fields: [BUYER, "payment|Payment Term|enum|LC at sight;LC 30 days;LC 60 days;LC 90 days;TT advance 30%;TT 45 days;Open account 60 days", "incoterm|Incoterm|enum|FOB;CIF;CFR;EXW;DDP;FCA", "toleranceQty|Quantity Tolerance|pct|0;10", "leadDays|Standard Lead Time|int|21;120;days", "penalty|Late Penalty|pct|0;8", MERCH, "date|Effective From|date|-900;60"],
    statuses: ["Active", "Draft", "Under Negotiation", "Expired"],
    measure: "leadDays",
    settings: ["Block order confirmation when terms differ from the agreed set", "Require finance sign-off before extending an open-account term"],
  },

  "buyer-requirements": {
    name: "Buyer Requirements", kind: "list", summary: "Packing, labelling and compliance rules",
    entity: "Requirement", ref: "REQ",
    fields: [BUYER, "requirement|Requirement|enum|Nickel release test per lot;Carton barcode format GS1-128;Polybag free packing;Recycled content declaration;OEKO-TEX certificate;Metal detection pass;Individual poly with warning;Pallet height limit 1.6m", "category|Category|enum|Packing;Labelling;Testing;Documentation;Sustainability;Logistics", "mandatory|Mandatory|bool|Yes;No", "compliance|Compliance Rate|pct|58;100", "owner|Owner|person", "date|Effective From|date|-900;60"],
    statuses: ["Active", "Draft", "Under Clarification", "Withdrawn"],
    measure: "compliance", rows: 48,
  },

  "nominated-suppliers": {
    name: "Nominated Suppliers", kind: "list", summary: "Buyer-mandated sources",
    entity: "Nomination", ref: "NOM",
    fields: [BUYER, "supplier|Nominated Supplier|enum|@suppliers", "material|Material|enum|Zipper tape;Plating chemicals;Recycled brass;Packing carton;Hangtag board;Thread;Elastic", "priceBasis|Price Basis|enum|Buyer negotiated;Open market;Indexed;Cost plus", "share|Share of Requirement|pct|10;100", "leadDays|Lead Time|int|10;90;days", "owner|Sourcing Owner|person", "date|Nominated On|date|-1200;0"],
    statuses: ["Approved", "Conditional", "Under Review", "Withdrawn"],
    measure: "share",
  },

  "credit-limit": {
    name: "Credit Limits", kind: "settings", summary: "Exposure ceilings per buyer",
    entity: "Credit Limit", ref: "CRD",
    fields: [BUYER, "limit|Credit Limit|money|20000;4800000", "utilised|Utilised|money|0;5200000", "utilisation|Utilisation|pct|0;138", "overdue|Overdue Amount|money|0;980000", "dso|Days Sales Outstanding|int|12;180;days", "reviewer|Reviewed By|person", "date|Reviewed On|date|-400;0"],
    statuses: ["Within Limit", "Near Limit", "Exceeded", "On Hold", "Under Review"],
    measure: "limit",
    settings: ["Block new order confirmation once 95% of the limit is consumed", "Review every credit limit at least once each half-year"],
  },

  "buyer-hierarchy": {
    name: "Buyer Hierarchy", kind: "analytics", summary: "Group to sub-buyer structure",
    entity: "Hierarchy Node", ref: "HIR",
    fields: ["group|Buying Group|enum|H&M Group;Inditex Group;LS&Co.;Associated British Foods;Fast Retailing;Decathlon Group;Bestseller Group", BUYER, "level|Level|enum|Group;Division;Buying office;Brand;Sub-buyer", "children|Child Nodes|int|0;12", "value|Consolidated Value|money|48000;9800000", "share|Group Share|pct|1;100", "date|Structure Updated|date|-700;0"],
    statuses: ["Confirmed", "Provisional", "Under Restructure", "Retired"],
    measure: "value",
  },

  "buyer-documents": {
    name: "Buyer Documents", kind: "list", summary: "Agreements, certificates and manuals",
    entity: "Document", ref: "BDC",
    fields: [BUYER, "document|Document|enum|Supply agreement;Code of conduct;Packing manual;Quality manual;Non-disclosure agreement;Price list;Sustainability commitment;Audit report", "version|Version|enum|v1.0;v1.2;v2.0;v2.3;v3.1", "signedBy|Signed By|person", "expiry|Valid Until|date|-90;1200", "sizeMb|File Size|float|0.1;48;MB;1", "date|Received On|date|-1400;0"],
    statuses: ["Current", "Expiring", "Expired", "Superseded", "Awaited"],
    measure: "sizeMb",
  },

  "price-agreements": {
    name: "Price Agreements", kind: "list", summary: "Agreed prices by item and season",
    entity: "Price Agreement", ref: "PRA",
    fields: [BUYER, "item|Item|enum|@items", "season|Season|enum|SS26;AW26;SS27;Carry-over;Basic programme", "unitPrice|Unit Price|float|0.02;3.8;USD;3", "moq|Minimum Order Qty|int|5000;480000;pcs", "validFrom|Valid From|date|-300;60", "validTo|Valid To|date|30;600", MERCH],
    statuses: ["Active", "Draft", "Under Negotiation", "Expired", "Rejected"],
    measure: "unitPrice", rows: 52,
  },

  "buyer-onboarding": {
    name: "Buyer Onboarding", kind: "board", summary: "From first contact to first order",
    entity: "Onboarding Case", ref: "ONB",
    fields: [BUYER, "stage|Current Stage|enum|Introduction;Capability audit;Sample approval;Terms agreed;System setup;First order", REGION, "daysOpen|Open For|int|1;180;days", "potential|Annual Potential|money|48000;4800000", MERCH, "date|Started On|date|-300;0"],
    statuses: ["Prospect", "In Assessment", "Documentation", "Approved", "Declined"],
    measure: "potential",
  },

  classification: {
    name: "Buyer Classification", kind: "analytics", summary: "ABC and strategic segmentation",
    entity: "Classification", ref: "CLS",
    fields: [BUYER, SEGMENT, "abc|ABC Class|enum|A;B;C", "value|Annual Value|money|8000;9800000", "margin|Gross Margin|pct|6;42", "orderFrequency|Orders / Year|int|1;96", "loyaltyYears|Relationship|float|0.2;22;yrs;1", "date|Classified On|date|-330;0"],
    statuses: ["Strategic", "Core", "Developing", "Marginal", "Exit Candidate"],
    measure: "value",
  },

  "buyer-performance": {
    name: "Buyer Performance", kind: "analytics", summary: "How each relationship actually performs",
    entity: "Performance Record", ref: "BPF",
    fields: [BUYER, "value|Order Value|money|8000;4800000", "onTime|On-Time Delivery|pct|62;100", "quality|Quality Acceptance|pct|82;100", "claims|Claims Raised|int|0;18", "collectionDays|Collection Days|int|10;180;days", "margin|Margin|pct|2;38", "date|Period End|date|-330;0"],
    statuses: ["Excellent", "Good", "Needs Attention", "Problematic"],
    measure: "value", rows: 48,
  },

  "buyer-compliance": {
    name: "Buyer Compliance", kind: "list", summary: "Audits and code-of-conduct status",
    entity: "Compliance Record", ref: "BCM",
    fields: [BUYER, "audit|Audit|enum|Social compliance audit;Environmental audit;Quality system audit;Security (C-TPAT) audit;Chemical management audit;Higg FEM verification", "grade|Grade|enum|Green;Amber;Red;Not rated", "findings|Findings|int|0;24", "score|Score|pct|38;100", "auditor|Auditor|person", "nextAudit|Next Audit|date|-30;420", "date|Audited On|date|-700;0"],
    statuses: ["Passed", "Conditional Pass", "Follow-up Required", "Failed", "Scheduled"],
    measure: "score",
  },

  "packing-instructions": {
    name: "Packing Instructions", kind: "list", summary: "Buyer packing manual by item",
    entity: "Packing Instruction", ref: "PKI",
    fields: [BUYER, "item|Item|enum|@items", "innerPack|Inner Pack|enum|Polybag 100 pcs;Paper box 50 pcs;Blister card 12 pcs;Bulk pack 1000 pcs;Hangtag set", "cartonQty|Carton Quantity|int|500;24000;pcs", "cartonWeight|Carton Weight|float|2;22;kg;2", "labelSpec|Label Spec|enum|GS1-128 carton label;Buyer barcode label;Plain shipping mark;QR + human readable", "revision|Revision|enum|Rev A;Rev B;Rev C;Rev D", "date|Effective From|date|-600;60"],
    statuses: ["Released", "Draft", "Under Revision", "Superseded"],
    measure: "cartonQty",
  },

  "buyer-calendar": {
    name: "Buyer Calendar", kind: "calendar", summary: "Meetings, audits and season deadlines",
    entity: "Calendar Entry", ref: "BCL",
    fields: [BUYER, "event|Event|enum|Season kick-off meeting;Range review;Factory audit;Price negotiation;Sample submission deadline;Order placement window;Shipment cut-off", "location|Location|enum|Dhaka office;Buyer head office;Factory;Video call;Trade fair", "owner|Owner|person", "durationDays|Duration|int|1;5;days", "date|Scheduled For|date|-90;220"],
    statuses: ["Scheduled", "Confirmed", "Completed", "Rescheduled", "Cancelled"],
    measure: "durationDays",
  },

  "buyer-risk": {
    name: "Buyer Risk", kind: "analytics", summary: "Credit and concentration exposure",
    entity: "Risk Position", ref: "BRK",
    fields: [BUYER, "exposure|Open Exposure|money|8000;4800000", "concentration|Share of Book|pct|0.4;28", "creditRating|Credit Rating|enum|AAA;AA;A;BBB;BB;B;Unrated", "overdueDays|Oldest Overdue|int|0;220;days", "riskScore|Risk Score|int|1;100", "insuranceCover|Insured|bool|Yes;No", "date|Assessed On|date|-300;0"],
    statuses: ["Low Risk", "Watch", "Elevated", "High Risk", "Credit Hold"],
    measure: "exposure",
  },

  "master-approval": {
    name: "Master Change Approval", kind: "board", summary: "Controlled changes to buyer data",
    entity: "Change Request", ref: "MCR",
    fields: [BUYER, "changeType|Change|enum|New buyer creation;Credit limit change;Payment term change;Address change;Bank detail change;Blacklist request;Reactivation", "requestedBy|Requested By|person", "approver|Approver|person", "impact|Financial Impact|money|0;4800000", "ageDays|Pending For|int|0;45;days", "date|Raised On|date|-200;0"],
    statuses: ["Submitted", "Under Review", "Approved", "Rejected", "Returned"],
    measure: "impact",
  },
};
