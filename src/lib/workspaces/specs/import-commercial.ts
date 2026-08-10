import type { ModuleSpecs } from "../types";

/**
 * Module 27 — Import Commercial Management (Enterprise Edition).
 *
 * The complete import commercial desk in master serial order: executive and
 * KPI dashboards, import planning and requisition, supplier and contract
 * control, proforma invoices, the full LC instrument family, cost and landed
 * cost build-up, tariff, bond and customs compliance, shipment and container
 * tracking, document control, duty and tax, port and receiving, payment and
 * settlement, workflow and audit, the report pack, and the AI layer that reads
 * documents and predicts what the shipment is about to do.
 */

/* ── Shared field fragments ────────────────────────────────────────────── */

const SUPPLIER = "supplier|Supplier|enum|@suppliers";
const ITEM = "item|Item|enum|@items";
const OFFICER = "officer|Commercial Officer|person";
const CURRENCY = "currency|Currency|enum|USD;EUR;CNY;JPY;GBP;CHF;INR;KRW";
const ORIGIN = "origin|Country of Origin|enum|China;Japan;South Korea;Taiwan;India;Vietnam;Germany;Italy;Turkey;Thailand";
const LOAD_PORT = "loadPort|Port of Loading|enum|Shanghai;Ningbo;Shenzhen;Busan;Kaohsiung;Nhava Sheva;Hamburg;Istanbul;Laem Chabang";
const DISCHARGE_PORT = "dischargePort|Port of Discharge|enum|Chattogram;Mongla;Payra;Dhaka ICD;Benapole Land Port;Hazrat Shahjalal Air";
const LC_REF = "lcNo|LC Number|enum|ILC-26-4411;ILC-26-4428;ILC-26-4452;ILC-26-4477;ILC-26-4490;ILC-26-4516;ILC-26-4533;ILC-26-4558";
const PI_REF = "piNo|PI Number|enum|IPI-26-2041;IPI-26-2058;IPI-26-2073;IPI-26-2090;IPI-26-2114;IPI-26-2138;IPI-26-2166";
const SHIPMENT_REF = "shipment|Shipment|enum|IMP-26-1041;IMP-26-1058;IMP-26-1072;IMP-26-1090;IMP-26-1114;IMP-26-1138;IMP-26-1163";
const INCOTERM = "incoterm|Incoterm|enum|FOB;CFR;CIF;EXW;FCA;CPT;CIP;DAP;DDP";
const HS_CODE = "hsCode|HS Code|enum|7407.21.00;7907.00.00;8308.10.00;8308.20.00;8308.90.00;9606.10.00;9607.11.00;3208.90.00;2827.60.00";
const BANK = "bank|Bank|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank;Dutch-Bangla Bank;Prime Bank";
const MATERIAL = "material|Material|enum|Brass strip;Zinc alloy ingot;Stainless steel wire;Nickel anode;Plating chemical;Packaging board;Machine spares;Tooling steel";
const PERIOD = "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026;Jun 2026";
const CNF_AGENT = "agent|C&F Agent|enum|Prime Clearing;Unity C&F;Chattogram Clearing House;Speedway Agents;Meridian Logistics";
const FORWARDER = "forwarder|Freight Forwarder|enum|DHL Global Forwarding;Kuehne+Nagel;DB Schenker;Expeditors;Agility Logistics;Local NVOCC";
const CARRIER = "carrier|Shipping Line|enum|Maersk;MSC;CMA CGM;Hapag-Lloyd;ONE;Evergreen;COSCO";
const VESSEL = "vessel|Vessel|enum|MV Ocean Pearl;MSC Aurora;Maersk Kensington;CMA CGM Lyra;Ever Lambent;ONE Harbour";
const CONTAINER_NO = "containerNo|Container No|enum|MSKU4471820;MSCU7712045;CMAU3348771;HLXU9921663;TCLU5580214;ONEU4402117";
const BOE_REF = "boeNo|Bill of Entry|enum|BOE-26-77121;BOE-26-77188;BOE-26-77244;BOE-26-77301;BOE-26-77366;BOE-26-77420";

export const IMPORT_COMMERCIAL: ModuleSpecs = {
  /* ── 1 ─────────────────────────────────────────────────────────────── */
  "commercial-executive-dashboard": {
    name: "Commercial Executive Dashboard", kind: "overview", summary: "Import value, exposure and risk in one screen",
    entity: "Executive Summary", ref: "CXD",
    fields: [PERIOD, "importValue|Import Value|money|60000;4800000", "openLcValue|Open LC Value|money|0;3200000", "inTransitValue|Goods in Transit|money|0;2400000", "dutyPaid|Duty Paid|money|4000;620000", "landedCostVariance|Landed Cost Variance|pct|0;22", "shipments|Shipments|int|2;140", "onTimeArrival|On-Time Arrival|pct|48;99", OFFICER, "date|Period End|date|-360;0"],
    statuses: ["Healthy", "On Track", "Watch", "At Risk", "Escalated"],
    measure: "importValue", rows: 60,
    insight: "Three suppliers in China carry 58% of import value and 71% of open LC exposure — a single lane disruption there moves both the production plan and the cash forecast.",
  },

  /* ── 2 ─────────────────────────────────────────────────────────────── */
  "commercial-analytics-dashboard": {
    name: "Commercial Analytics Dashboard", kind: "analytics", summary: "Value, volume and cost trends across imports",
    entity: "Analytics Point", ref: "CAD",
    fields: [PERIOD, ORIGIN, SUPPLIER, "importValue|Import Value|money|20000;2400000", "volume|Volume|int|2000;480000;kg", "shipments|Shipments|int|1;60", "avgLeadTime|Avg Lead Time|int|12;120;days", "costPerKg|Cost per Kg|float|0.8;18;USD;2", "yoyGrowth|YoY Growth|pct|60;180", "date|Period End|date|-360;0"],
    statuses: ["Growing", "Stable", "Declining", "New Lane"],
    measure: "importValue", rows: 62,
    insight: "Cost per kilo on the brass strip lane has drifted 9% while volume held flat — the movement is freight and duty, not metal price.",
  },

  /* ── 3 ─────────────────────────────────────────────────────────────── */
  "commercial-kpi-dashboard": {
    name: "Commercial KPI Dashboard", kind: "analytics", summary: "Targets against actual for every commercial KPI",
    entity: "KPI", ref: "CKP",
    fields: ["kpi|KPI|enum|LC opening lead time;Customs clearance days;Landed cost accuracy;On-time arrival;Demurrage per shipment;Document discrepancy rate;Supplier OTIF;Duty saving realised", "target|Target|float|1;98;;1", "actual|Actual|float|1;99;;1", "attainment|Attainment|pct|38;128", PERIOD, "owner|KPI Owner|person", "trendNote|Trend|enum|Improving;Flat;Deteriorating;Volatile", "date|Measured On|date|-330;0"],
    statuses: ["Achieved", "On Track", "Behind", "Missed", "Under Review"],
    measure: "attainment", rows: 56,
    settings: ["Publish the KPI pack to the executive dashboard on the first working day", "Raise an exception when attainment drops below 85% for two periods"],
  },

  /* ── 4 ─────────────────────────────────────────────────────────────── */
  "import-dashboard": {
    name: "Import Dashboard", kind: "overview", summary: "Value in the pipeline, stage by stage",
    entity: "Pipeline Entry", ref: "IMD",
    fields: [SHIPMENT_REF, SUPPLIER, ORIGIN, MATERIAL, "value|Consignment Value|money|8000;620000", "stage|Pipeline Stage|enum|PI raised;LC opened;Shipped;In transit;Arrived;Under clearance;Received", "etaDays|Days to ETA|int|0;65;days", INCOTERM, OFFICER, "date|ETA|date|-40;70"],
    statuses: ["On Schedule", "In Transit", "Under Clearance", "Delayed", "Received"],
    measure: "value", rows: 64,
    insight: "Value concentrates at the customs stage: consignments sit there four days on average against a two-day target, and every extra day is port rent.",
  },

  /* ── 5 ─────────────────────────────────────────────────────────────── */
  "import-planning": {
    name: "Import Planning Management", kind: "list", summary: "What must be imported, when and against which plan",
    entity: "Import Plan Line", ref: "IPL",
    fields: ["planNo|Plan No|code|IPL", MATERIAL, SUPPLIER, ORIGIN, "requiredQty|Required Qty|int|500;480000;kg", "coveredQty|Covered by Order|int|0;480000;kg", "gapQty|Open Gap|int|0;180000;kg", "requiredBy|Required By|date|-30;180", "estValue|Estimated Value|money|4000;620000", "leadTimeDays|Lead Time|int|14;120;days", OFFICER, "date|Planned On|date|-300;0"],
    statuses: ["Planned", "Partially Covered", "Fully Covered", "Gap Open", "Deferred"],
    measure: "estValue", rows: 58,
    insight: "Roughly one plan line in five carries an open gap inside its lead time — those are the lines that end up on air freight.",
  },

  /* ── 6 ─────────────────────────────────────────────────────────────── */
  "import-scheduling": {
    name: "Import Scheduling Management", kind: "calendar", summary: "Booking, sailing and arrival slots",
    entity: "Schedule Slot", ref: "ISC",
    fields: [SHIPMENT_REF, SUPPLIER, MATERIAL, CARRIER, LOAD_PORT, "bookingCutoff|Booking Cut-off|date|-30;60", "transitDays|Transit|int|8;45;days", "value|Value|money|8000;620000", "date|Sailing Date|date|-25;70"],
    statuses: ["Planned", "Booked", "Cut-off Met", "Sailed", "Rolled Over"],
    measure: "value", rows: 56,
  },

  /* ── 7 ─────────────────────────────────────────────────────────────── */
  "import-calendar": {
    name: "Import Calendar Management", kind: "calendar", summary: "Every dated commercial commitment in one calendar",
    entity: "Calendar Event", ref: "ICA",
    fields: ["event|Event|enum|LC opening;LC expiry;Document presentation;Shipment sailing;Vessel arrival;BOE filing;Duty payment;Delivery order;Supplier audit", SHIPMENT_REF, SUPPLIER, "leadDays|Notice Given|int|0;30;days", "value|Value Involved|money|0;620000", OFFICER, "date|Event Date|date|-60;90"],
    statuses: ["Scheduled", "Due Soon", "Completed", "Overdue", "Rescheduled"],
    measure: "value", rows: 66,
  },

  /* ── 8 ─────────────────────────────────────────────────────────────── */
  "annual-import-planning": {
    name: "Annual Import Planning", kind: "analytics", summary: "The year's import budget by material and origin",
    entity: "Annual Plan Line", ref: "AIP",
    fields: ["fiscalYear|Fiscal Year|enum|FY 2025-26;FY 2026-27", MATERIAL, ORIGIN, "annualQty|Annual Quantity|int|20000;2400000;kg", "annualValue|Annual Value|money|60000;4800000", "committedValue|Committed|money|0;4800000", "consumedPct|Consumed|pct|0;100", CURRENCY, "owner|Plan Owner|person", "date|Approved On|date|-360;0"],
    statuses: ["Approved", "Under Review", "Draft", "Revised", "Closed"],
    measure: "annualValue", rows: 48,
    insight: "The annual plan is the ceiling every requisition is checked against — a line above 90% consumed can no longer absorb an unplanned indent without a revision.",
  },

  /* ── 9 ─────────────────────────────────────────────────────────────── */
  "monthly-import-planning": {
    name: "Monthly Import Planning", kind: "list", summary: "Month-by-month phasing of the annual plan",
    entity: "Monthly Plan Line", ref: "MIP",
    fields: [PERIOD, MATERIAL, SUPPLIER, "plannedQty|Planned Qty|int|1000;280000;kg", "actualQty|Actual Qty|int|0;280000;kg", "plannedValue|Planned Value|money|8000;680000", "actualValue|Actual Value|money|0;680000", "variancePct|Variance|pct|0;48", OFFICER, "date|Month End|date|-330;30"],
    statuses: ["On Plan", "Under Plan", "Over Plan", "Not Started", "Closed"],
    measure: "plannedValue", rows: 60,
  },

  /* ── 10 ────────────────────────────────────────────────────────────── */
  "import-forecast": {
    name: "Import Forecast Management", kind: "analytics", summary: "Projected import demand and value",
    entity: "Forecast Line", ref: "IFC",
    fields: [PERIOD, MATERIAL, ORIGIN, "forecastQty|Forecast Qty|int|2000;320000;kg", "actualQty|Actual Qty|int|0;320000;kg", "forecastValue|Forecast Value|money|10000;720000", "accuracy|Forecast Accuracy|pct|42;99", "method|Method|enum|Order-driven;Consumption trend;AI projection;Manual override", "date|Forecast For|date|-180;180"],
    statuses: ["Accurate", "Within Tolerance", "Under Forecast", "Over Forecast", "Draft"],
    measure: "forecastValue", rows: 58,
    insight: "AI projections beat the consumption trend by eleven accuracy points on fast-moving brass, but lose to it on chemicals where order sizes are lumpy.",
  },

  /* ── 11 ────────────────────────────────────────────────────────────── */
  "mrp-integration": {
    name: "Material Requirement Planning (MRP) Integration", kind: "list", summary: "MRP net requirement pulled into the import plan",
    entity: "MRP Requirement", ref: "MRPI",
    fields: ["mrpRun|MRP Run|enum|MRP-26-W14;MRP-26-W15;MRP-26-W16;MRP-26-W17;MRP-26-W18", MATERIAL, ITEM, "grossReq|Gross Requirement|int|500;420000;kg", "onHand|On Hand|int|0;180000;kg", "onOrder|On Order|int|0;280000;kg", "netReq|Net Requirement|int|0;320000;kg", "requiredBy|Required By|date|-15;150", "convertedTo|Converted To|enum|Import requisition;Import indent;Local purchase;Not converted", "date|Run Date|date|-120;0"],
    statuses: ["Converted", "Pending Conversion", "Covered", "Shortfall", "Ignored"],
    measure: "netReq", rows: 62,
    settings: ["Create an import requisition automatically from every net requirement above the import threshold", "Re-check coverage against open LCs before each MRP run is published"],
  },

  /* ── 12 ────────────────────────────────────────────────────────────── */
  "import-requisition": {
    name: "Import Requisition Management", kind: "list", summary: "Requests to import, from raise to approval",
    entity: "Import Requisition", ref: "IRQ",
    fields: ["requisitionNo|Requisition No|code|IRQ", MATERIAL, "requestedBy|Requested By|person", "department|Department|enum|Production;Plating;Tool Room;Maintenance;Packaging;Laboratory;Stores", "qty|Quantity|int|200;280000;kg", "estValue|Estimated Value|money|2000;480000", "urgency|Urgency|enum|Routine;Planned;Urgent;Emergency", "requiredBy|Required By|date|-20;150", "budgetLine|Budget Line|enum|Raw material;Chemicals;Spares;Packaging;Capital goods", "date|Raised On|date|-300;0"],
    statuses: ["Approved", "Pending Approval", "Draft", "Converted to Indent", "Rejected"],
    measure: "estValue", rows: 60,
  },

  /* ── 13 ────────────────────────────────────────────────────────────── */
  "import-indent": {
    name: "Import Indent Management", kind: "list", summary: "Indents raised on foreign suppliers",
    entity: "Import Indent", ref: "IND",
    fields: ["indentNo|Indent No|code|IND", SUPPLIER, ORIGIN, MATERIAL, "qty|Quantity|int|200;280000;kg", "unitPrice|Unit Price|float|0.4;42;USD;2", "value|Indent Value|money|2000;620000", CURRENCY, INCOTERM, "deliveryBy|Delivery By|date|-20;160", OFFICER, "date|Indent Date|date|-300;0"],
    statuses: ["Approved", "Sent to Supplier", "PI Received", "Pending Approval", "Cancelled"],
    measure: "value", rows: 58,
    insight: "An indent only becomes a commitment when the supplier PI comes back — the gap between the two is where most price drift is caught.",
  },

  /* ── 14 ────────────────────────────────────────────────────────────── */
  "purchase-requisition-integration": {
    name: "Purchase Requisition Integration", kind: "list", summary: "Local PR routed into the import channel",
    entity: "Linked Requisition", ref: "PRI",
    fields: ["prNo|PR Number|enum|PR-26-3041;PR-26-3058;PR-26-3072;PR-26-3090;PR-26-3114;PR-26-3138", "source|Source Module|enum|Procurement;MRP;Production planning;Maintenance;Stores", MATERIAL, "qty|Quantity|int|100;280000;kg", "estValue|Estimated Value|money|1000;480000", "routedTo|Routed To|enum|Import indent;Import requisition;Local purchase;Returned to requester", "linkedIndent|Linked Indent|enum|IND-26-0411;IND-26-0428;IND-26-0452;IND-26-0477;Not linked", OFFICER, "date|Received On|date|-280;0"],
    statuses: ["Linked", "Routing", "Pending", "Returned", "Closed"],
    measure: "estValue", rows: 54,
  },

  /* ── 15 ────────────────────────────────────────────────────────────── */
  "supplier-commercial": {
    name: "Supplier Commercial Management", kind: "list", summary: "Commercial terms held against each supplier",
    entity: "Supplier Terms", ref: "SCM",
    fields: [SUPPLIER, ORIGIN, INCOTERM, "paymentTerms|Payment Terms|enum|TT in advance;TT 30 days;LC at sight;LC 60 days;LC 90 days;UPAS 120 days;DA 90 days", CURRENCY, "creditDays|Credit Days|int|0;180;days", "annualSpend|Annual Spend|money|20000;2400000", "openExposure|Open Exposure|money|0;1400000", "priceValidity|Price Valid Till|date|-60;240", OFFICER, "date|Terms Agreed|date|-900;0"],
    statuses: ["Active", "Under Negotiation", "On Hold", "Expiring", "Terminated"],
    measure: "annualSpend", rows: 52,
    insight: "Suppliers on UPAS terms hold the largest exposure but the cheapest financing — the trade-off only works while the acceptance bank line stays open.",
  },

  /* ── 16 ────────────────────────────────────────────────────────────── */
  "supplier-master": {
    name: "Supplier Master Management", kind: "list", summary: "The supplier record of truth",
    entity: "Supplier", ref: "SUP",
    fields: [SUPPLIER, ORIGIN, "category|Category|enum|Metal;Chemical;Packaging;Spares;Tooling;Machinery;Service", "contactPerson|Contact Person|person", "address|Address|text|Ningbo Free Trade Zone;Shenzhen Bao'an District;Osaka Chuo-ku;Busan Sasang-gu;Mumbai Andheri East;Istanbul Beylikduzu", "bankDetails|Bank|enum|Bank of China;ICBC;Mizuho;KEB Hana;HSBC;Deutsche Bank", "taxId|Tax / VAT ID|enum|CN-9144031;JP-3120044;KR-2208871;IN-27AABC;DE-812345;TR-4470022", "annualSpend|Annual Spend|money|10000;2400000", "rating|Rating|pct|42;99", "date|Onboarded|date|-1400;-20"],
    statuses: ["Active", "Approved", "Under Review", "Dormant", "Blacklisted"],
    measure: "annualSpend", rows: 58,
  },

  /* ── 17 ────────────────────────────────────────────────────────────── */
  "supplier-registration": {
    name: "Supplier Registration", kind: "form", summary: "Onboard a new foreign supplier",
    entity: "Registration", ref: "SRG",
    fields: ["supplierName|Supplier Name|enum|@suppliers", ORIGIN, "category|Category|enum|Metal;Chemical;Packaging;Spares;Tooling;Machinery;Service", "contactPerson|Contact Person|person", "email|Contact Email|text|sales@zhejiangmetal.cn;export@guangzhoualloy.com;info@nipponplating.jp;trade@koreazipper.kr;hello@taiwansprings.tw", "businessLicense|Business Licence|bool|Uploaded;Not uploaded", "bankDetails|Bank Details|bool|Verified;Pending verification", "documentsCount|Documents Received|int|0;14;files", "declaredCapacity|Declared Capacity|int|1000;480000;kg", "sponsor|Internal Sponsor|person", "date|Applied On|date|-400;0"],
    statuses: ["Registered", "Documents Pending", "Under Verification", "Draft", "Rejected"],
    measure: "documentsCount", rows: 46,
    settings: ["Require a verified bank detail before a supplier can be used on an LC", "Send the registration pack to compliance automatically on submission"],
  },

  /* ── 18 ────────────────────────────────────────────────────────────── */
  "supplier-qualification": {
    name: "Supplier Qualification Management", kind: "board", summary: "Audit, sample and approval stages",
    entity: "Qualification", ref: "SQL",
    fields: [SUPPLIER, ORIGIN, "stage|Stage|enum|Document check;Factory audit;Sample submission;Lab testing;Commercial review;Final approval", "auditScore|Audit Score|pct|38;99", "sampleResult|Sample Result|enum|Passed;Passed with observation;Failed;Awaited", "auditor|Auditor|person", "capaOpen|Open CAPA|int|0;12", "validTill|Qualification Valid Till|date|-30;540", "date|Assessed On|date|-500;0"],
    statuses: ["Qualified", "In Assessment", "Conditional", "Requalification Due", "Disqualified"],
    measure: "auditScore", rows: 50,
  },

  /* ── 19 ────────────────────────────────────────────────────────────── */
  "supplier-evaluation": {
    name: "Supplier Evaluation Management", kind: "analytics", summary: "Scored on quality, price, delivery and service",
    entity: "Evaluation", ref: "SEV",
    fields: [SUPPLIER, PERIOD, "qualityScore|Quality|pct|40;99", "deliveryScore|Delivery|pct|40;99", "priceScore|Price|pct|40;99", "serviceScore|Service|pct|40;99", "overallScore|Overall Score|pct|40;99", "grade|Grade|enum|A;B;C;D", "evaluator|Evaluator|person", "date|Evaluated On|date|-330;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Improvement Required", "Delisted"],
    measure: "overallScore", rows: 54,
    insight: "Delivery is the score that separates the panel — quality is above 90% almost everywhere, so on-time performance is what actually decides the next indent.",
  },

  /* ── 20 ────────────────────────────────────────────────────────────── */
  "supplier-performance": {
    name: "Supplier Performance Management", kind: "analytics", summary: "OTIF, rejection and claim history",
    entity: "Performance Record", ref: "SPF",
    fields: [SUPPLIER, PERIOD, "shipments|Shipments|int|1;60", "onTimePct|On-Time|pct|38;100", "inFullPct|In Full|pct|38;100", "rejectionPct|Rejection|pct|0;14", "claimsRaised|Claims Raised|int|0;12", "claimValue|Claim Value|money|0;180000", "avgLeadTime|Avg Lead Time|int|10;120;days", "date|Period End|date|-330;0"],
    statuses: ["Excellent", "Acceptable", "Below Target", "Critical", "Under Review"],
    measure: "claimValue", rows: 56,
  },

  /* ── 21 ────────────────────────────────────────────────────────────── */
  "supplier-compliance": {
    name: "Supplier Compliance Management", kind: "list", summary: "Certificates, declarations and sanctions screening",
    entity: "Compliance Record", ref: "SCP",
    fields: [SUPPLIER, ORIGIN, "requirement|Requirement|enum|ISO 9001;ISO 14001;REACH declaration;RoHS declaration;Nickel-free certificate;Sanctions screening;Code of conduct;Anti-bribery declaration", "evidence|Evidence|bool|On file;Not received", "expiryDate|Expires On|date|-90;720", "screeningResult|Screening Result|enum|Clear;Match to review;Adverse media;Not screened", "riskLevel|Risk Level|enum|Low;Medium;High;Critical", "reviewer|Reviewer|person", "date|Verified On|date|-500;0"],
    statuses: ["Compliant", "Expiring Soon", "Pending Evidence", "Non-Compliant", "Escalated"],
    measure: "riskLevel", rows: 60,
    settings: ["Block LC opening while a mandatory supplier certificate is expired", "Re-screen every supplier against sanctions lists each quarter"],
  },

  /* ── 22 ────────────────────────────────────────────────────────────── */
  "supplier-blacklist": {
    name: "Supplier Blacklist Management", kind: "list", summary: "Barred suppliers and the reason on record",
    entity: "Blacklist Entry", ref: "SBL",
    fields: [SUPPLIER, ORIGIN, "reason|Reason|enum|Repeated quality failure;Document fraud;Sanctions match;Non-delivery;Price manipulation;Compliance breach;Payment dispute", "raisedBy|Raised By|person", "approvedBy|Approved By|person", "exposureAtBlock|Exposure at Block|money|0;680000", "reviewDue|Review Due|date|-60;540", "appealFiled|Appeal Filed|bool|Yes;No", "date|Blacklisted On|date|-800;0"],
    statuses: ["Blacklisted", "Under Appeal", "Provisional Block", "Reinstated", "Permanent"],
    measure: "exposureAtBlock", rows: 42,
  },

  /* ── 23 ────────────────────────────────────────────────────────────── */
  "supplier-contract": {
    name: "Supplier Contract Management", kind: "list", summary: "Supply agreements and their coverage",
    entity: "Supplier Contract", ref: "SCT",
    fields: ["contractNo|Contract No|code|SCT", SUPPLIER, "contractType|Contract Type|enum|Annual supply;Framework;Spot;Tolling;Consignment;Service", "contractValue|Contract Value|money|20000;3200000", "consumedValue|Consumed|money|0;3200000", "consumedPct|Consumed|pct|0;100", CURRENCY, INCOTERM, "startDate|Valid From|date|-720;0", "endDate|Valid Till|date|-30;540", OFFICER, "date|Signed On|date|-760;0"],
    statuses: ["Active", "Expiring", "Under Negotiation", "Expired", "Terminated"],
    measure: "contractValue", rows: 52,
    insight: "Framework contracts cover 64% of import value but only 31% of the supplier count — the long tail still buys on spot terms every time.",
  },

  /* ── 24 ────────────────────────────────────────────────────────────── */
  "commercial-agreement": {
    name: "Commercial Agreement Management", kind: "list", summary: "Every commercial instrument other than the supply contract",
    entity: "Agreement", ref: "AGR",
    fields: ["agreementNo|Agreement No|code|AGR", "counterparty|Counterparty|enum|@suppliers", "agreementType|Agreement Type|enum|Agency agreement;Distribution;Rebate;Price protection;Tooling ownership;Consignment stock;Service level", "value|Agreement Value|money|4000;1800000", "signedBy|Signed By|person", "governingLaw|Governing Law|enum|Bangladesh;Singapore;England & Wales;Hong Kong;Swiss", "startDate|Effective From|date|-720;0", "endDate|Valid Till|date|-30;720", "date|Executed On|date|-760;0"],
    statuses: ["Executed", "In Draft", "Under Legal Review", "Expiring", "Terminated"],
    measure: "value", rows: 48,
  },

  /* ── 25 ────────────────────────────────────────────────────────────── */
  "nda-management": {
    name: "NDA Management", kind: "list", summary: "Confidentiality agreements and their term",
    entity: "NDA", ref: "NDA",
    fields: ["ndaNo|NDA No|code|NDA", "counterparty|Counterparty|enum|@suppliers", "ndaType|Type|enum|Mutual;One-way inbound;One-way outbound;Multi-party", "scope|Scope|enum|Tooling drawings;Buyer designs;Price data;Process know-how;Full commercial", "termMonths|Term|int|12;120;months", "signedBy|Signed By|person", "expiryDate|Expires On|date|-90;1080", "breachReported|Breach Reported|bool|Yes;No", "date|Signed On|date|-900;0"],
    statuses: ["Active", "Expiring", "Pending Signature", "Expired", "Breached"],
    measure: "termMonths", rows: 44,
  },

  /* ── 26 ────────────────────────────────────────────────────────────── */
  "import-contract": {
    name: "Import Contract Management", kind: "list", summary: "The contract behind each import consignment",
    entity: "Import Contract", ref: "ICT",
    fields: ["contractNo|Contract No|code|ICT", SUPPLIER, MATERIAL, "qty|Contracted Qty|int|1000;1200000;kg", "unitPrice|Unit Price|float|0.4;42;USD;2", "contractValue|Contract Value|money|8000;2400000", CURRENCY, INCOTERM, "shipmentWindow|Shipment Window|enum|Within 30 days;Within 45 days;Within 60 days;Within 90 days;Phased monthly", "priceBasis|Price Basis|enum|Fixed;LME linked;Formula;Indexed;Provisional", "date|Contract Date|date|-500;0"],
    statuses: ["Active", "Partially Shipped", "Fully Shipped", "Under Amendment", "Cancelled"],
    measure: "contractValue", rows: 54,
  },

  /* ── 27 ────────────────────────────────────────────────────────────── */
  "contract-amendment": {
    name: "Contract Amendment Management", kind: "list", summary: "What changed, why and at what cost",
    entity: "Amendment", ref: "CAM",
    fields: ["amendmentNo|Amendment No|code|CAM", "contractNo|Contract|enum|ICT-26-0411;ICT-26-0428;ICT-26-0452;ICT-26-0477;SCT-26-0203;SCT-26-0219", "changeType|Change|enum|Quantity change;Price revision;Delivery date;Incoterm change;Payment terms;Specification;Scope extension", "oldValue|Value Before|money|8000;2400000", "newValue|Value After|money|8000;2600000", "deltaValue|Value Impact|money|0;420000", "requestedBy|Requested By|enum|Supplier;Buyer;Internal;Regulatory", "approvedBy|Approved By|person", "date|Amended On|date|-400;0"],
    statuses: ["Approved", "Pending Approval", "Draft", "Rejected", "Superseded"],
    measure: "deltaValue", rows: 52,
    insight: "Delivery-date amendments outnumber price amendments four to one, and almost every one of them shows up later as a demurrage or air-freight cost.",
  },

  /* ── 28 ────────────────────────────────────────────────────────────── */
  "contract-renewal": {
    name: "Contract Renewal Management", kind: "calendar", summary: "What expires when, and what happens next",
    entity: "Renewal", ref: "CRN",
    fields: ["contractNo|Contract|enum|ICT-26-0411;ICT-26-0428;SCT-26-0203;SCT-26-0219;AGR-26-0104;NDA-26-0088", SUPPLIER, "contractType|Type|enum|Annual supply;Framework;Agency;NDA;Service level;Tooling", "currentValue|Current Value|money|8000;2400000", "proposedValue|Proposed Value|money|8000;2800000", "noticeDays|Notice Period|int|15;120;days", "decision|Renewal Decision|enum|Renew as is;Renew with revision;Retender;Do not renew;Undecided", OFFICER, "date|Expiry Date|date|-30;300"],
    statuses: ["Renewed", "Renewal Due", "Under Negotiation", "Notice Served", "Lapsed"],
    measure: "currentValue", rows: 48,
    settings: ["Alert the contract owner 60 days before an import contract expires", "Require a retender when a renewal raises value by more than 10%"],
  },

  /* ── 29 ────────────────────────────────────────────────────────────── */
  "contract-version": {
    name: "Contract Version Management", kind: "list", summary: "Every version of every contract document",
    entity: "Contract Version", ref: "CVR",
    fields: ["contractNo|Contract|enum|ICT-26-0411;ICT-26-0428;SCT-26-0203;SCT-26-0219;AGR-26-0104", "version|Version|enum|V1.0;V1.1;V2.0;V2.1;V3.0;V3.1", "changeSummary|Change Summary|text|Price clause revised;Delivery window extended;Force majeure added;Payment terms softened;Quality annexure updated;Arbitration seat changed", "author|Author|person", "fileSize|File Size|int|60;9800;KB", "isCurrent|Current Version|bool|Current;Superseded", "approvedBy|Approved By|person", "date|Version Date|date|-700;0"],
    statuses: ["Current", "Superseded", "In Draft", "Withdrawn"],
    measure: "fileSize", rows: 56,
  },

  /* ── 30 ────────────────────────────────────────────────────────────── */
  "proforma-invoice": {
    name: "Proforma Invoice (PI) Management", kind: "list", summary: "Supplier PIs against every indent",
    entity: "Proforma Invoice", ref: "IPI",
    fields: ["piNumber|PI Number|code|IPI", SUPPLIER, ORIGIN, MATERIAL, "qty|Quantity|int|200;280000;kg", "unitPrice|Unit Price|float|0.4;42;USD;2", "piValue|PI Value|money|2000;620000", CURRENCY, INCOTERM, "validTill|Valid Till|date|-30;120", "linkedIndent|Against Indent|enum|IND-26-0411;IND-26-0428;IND-26-0452;IND-26-0477;IND-26-0490", OFFICER, "date|PI Date|date|-330;0"],
    statuses: ["Approved", "Under Review", "Received", "Expired", "Rejected"],
    measure: "piValue", rows: 62,
    insight: "A PI is what the LC is opened against — an expired PI on an unopened LC is the most common reason an indent quietly slips a month.",
  },

  /* ── 31 ────────────────────────────────────────────────────────────── */
  "pi-approval-workflow": {
    name: "PI Approval Workflow", kind: "board", summary: "Commercial, technical and finance sign-off",
    entity: "PI Approval", ref: "PIA",
    fields: [PI_REF, SUPPLIER, "piValue|PI Value|money|2000;620000", "stage|Approval Stage|enum|Commercial check;Technical check;Budget check;Finance approval;Director approval", "approver|Approver|person", "slaHours|SLA|int|4;96;hours", "ageHours|Age|int|0;180;hours", "priceVariance|Price Variance vs Last|pct|0;24", "date|Submitted On|date|-300;0"],
    statuses: ["Approved", "Awaiting Approval", "In Review", "Returned", "Rejected"],
    measure: "piValue", rows: 58,
  },

  /* ── 32 ────────────────────────────────────────────────────────────── */
  "pi-revision": {
    name: "PI Revision Management", kind: "list", summary: "Revised PIs and what moved",
    entity: "PI Revision", ref: "PIV",
    fields: [PI_REF, SUPPLIER, "revisionNo|Revision|enum|R1;R2;R3;R4;R5", "changedField|Changed|enum|Unit price;Quantity;Delivery date;Incoterm;Payment terms;Bank details;Specification", "oldValue|Value Before|money|2000;620000", "newValue|Value After|money|2000;680000", "deltaPct|Change|pct|0;32", "requestedBy|Requested By|enum|Supplier;Internal;Buyer;Bank", "date|Revised On|date|-300;0"],
    statuses: ["Accepted", "Under Review", "Pending Supplier", "Rejected", "Superseded"],
    measure: "newValue", rows: 54,
  },

  /* ── 33 ────────────────────────────────────────────────────────────── */
  "pi-comparison": {
    name: "PI Comparison Management", kind: "analytics", summary: "Competing PIs side by side",
    entity: "Comparison Line", ref: "PIC",
    fields: ["comparisonNo|Comparison|code|PIC", MATERIAL, SUPPLIER, ORIGIN, "unitPrice|Unit Price|float|0.4;42;USD;2", "landedEstimate|Estimated Landed|float|0.5;52;USD;2", "leadTimeDays|Lead Time|int|10;120;days", "paymentTerms|Payment Terms|enum|TT in advance;LC at sight;LC 60 days;UPAS 120 days;DA 90 days", "score|Evaluation Score|pct|40;99", "recommended|Recommendation|bool|Recommended;Not selected", "date|Compared On|date|-300;0"],
    statuses: ["Selected", "Shortlisted", "Under Evaluation", "Not Selected"],
    measure: "landedEstimate", rows: 60,
    insight: "The cheapest unit price wins the comparison only about half the time — once freight and duty are added the second-lowest quote often lands cheaper.",
  },

  /* ── 34 ────────────────────────────────────────────────────────────── */
  "pi-history": {
    name: "PI History Management", kind: "list", summary: "Price and term history per supplier and item",
    entity: "History Entry", ref: "PIH",
    fields: [SUPPLIER, MATERIAL, PERIOD, "unitPrice|Unit Price|float|0.4;42;USD;2", "priceChange|Change vs Previous|pct|0;28", "qty|Quantity|int|200;280000;kg", "value|Value|money|2000;620000", CURRENCY, INCOTERM, "date|PI Date|date|-900;0"],
    statuses: ["Price Increased", "Price Held", "Price Reduced", "First Purchase"],
    measure: "value", rows: 68,
  },

  /* ── 35 ────────────────────────────────────────────────────────────── */
  "pi-version-control": {
    name: "PI Version Control", kind: "list", summary: "Which PI version the LC was opened against",
    entity: "PI Version", ref: "PVC",
    fields: [PI_REF, "version|Version|enum|V1;V2;V3;V4;V5", "isCurrent|Status|bool|Current;Superseded", "lcOpenedAgainst|LC Opened Against|bool|Yes;No", LC_REF, "checksum|Document Hash|enum|a41f8c;7b0d92;c53e17;e2a4b8;9f61d0", "author|Uploaded By|person", "date|Version Date|date|-330;0"],
    statuses: ["Current", "Superseded", "Locked to LC", "Withdrawn"],
    rows: 56,
    settings: ["Lock the PI version once an LC has been opened against it", "Keep every superseded PI version for the full audit retention period"],
  },

  /* ── 36 ────────────────────────────────────────────────────────────── */
  "import-lc": {
    name: "Import LC Management", kind: "list", summary: "Every import letter of credit on the book",
    entity: "Import LC", ref: "ILC",
    fields: ["lcNumber|LC Number|code|ILC", SUPPLIER, BANK, "lcType|LC Type|enum|Sight;Usance;UPAS;Deferred;Revolving;Back-to-back;Transferable;Standby", "lcValue|LC Value|money|8000;1800000", "utilised|Utilised|money|0;1800000", CURRENCY, "expiryDate|Expiry Date|date|-30;180", "shipmentDate|Latest Shipment|date|-45;150", OFFICER, "date|Opened On|date|-330;0"],
    statuses: ["Open", "Partially Utilised", "Fully Utilised", "Expiring", "Settled"],
    measure: "lcValue", rows: 66,
    insight: "Open LC value is the single largest liability on the commercial book — 38% of it expires inside sixty days, which is what makes the expiry calendar a treasury tool, not a filing exercise.",
  },

  /* ── 37 ────────────────────────────────────────────────────────────── */
  "master-lc": {
    name: "Master LC Management", kind: "list", summary: "Export master LCs backing the import book",
    entity: "Master LC", ref: "MLC",
    fields: ["masterLcNo|Master LC No|code|MLC", "buyer|Buyer|enum|@buyers", BANK, "masterValue|Master LC Value|money|40000;3200000", "btbIssued|B2B Issued Against|money|0;2400000", "availableMargin|Available Margin|money|0;1400000", "utilisationPct|Utilisation|pct|0;100", "expiryDate|Expiry Date|date|-20;220", OFFICER, "date|Received On|date|-330;0"],
    statuses: ["Open", "Partially Utilised", "Fully Utilised", "Expiring", "Closed"],
    measure: "masterValue", rows: 52,
  },

  /* ── 38 ────────────────────────────────────────────────────────────── */
  "back-to-back-lc": {
    name: "Back-to-Back LC Management", kind: "list", summary: "Import LCs opened against a master LC",
    entity: "B2B LC", ref: "BTB",
    fields: ["btbLcNo|B2B LC No|code|BTB", "masterLcNo|Against Master LC|enum|MLC-26-0411;MLC-26-0428;MLC-26-0452;MLC-26-0477;MLC-26-0490", SUPPLIER, BANK, "btbValue|B2B Value|money|6000;1400000", "marginPct|Margin Retained|pct|4;38", "tenorDays|Tenor|int|0;180;days", "expiryDate|Expiry Date|date|-20;180", "date|Opened On|date|-300;0"],
    statuses: ["Open", "Shipped", "Accepted", "Settled", "Expired"],
    measure: "btbValue", rows: 56,
    insight: "The margin between a master LC and the B2B opened against it is the working capital of the whole arrangement — anything under 12% leaves nothing for freight variation.",
  },

  /* ── 39 ────────────────────────────────────────────────────────────── */
  "sight-lc": {
    name: "Sight LC Management", kind: "list", summary: "Payment on presentation of documents",
    entity: "Sight LC", ref: "SLC",
    fields: [LC_REF, SUPPLIER, BANK, "lcValue|LC Value|money|6000;1200000", "presentedValue|Documents Presented|money|0;1200000", "paidValue|Paid|money|0;1200000", "daysToPay|Days to Payment|int|0;21;days", "discrepancies|Discrepancies|int|0;6", "expiryDate|Expiry Date|date|-20;150", "date|Opened On|date|-300;0"],
    statuses: ["Open", "Documents Presented", "Paid", "Discrepant", "Expired"],
    measure: "lcValue", rows: 54,
  },

  /* ── 40 ────────────────────────────────────────────────────────────── */
  "usance-lc": {
    name: "Usance LC Management", kind: "list", summary: "Deferred payment at an agreed tenor",
    entity: "Usance LC", ref: "ULC",
    fields: [LC_REF, SUPPLIER, BANK, "lcValue|LC Value|money|8000;1600000", "tenorDays|Tenor|int|30;180;days", "acceptedOn|Accepted On|date|-200;20", "maturityDate|Maturity Date|date|-30;200", "interestRate|Interest Rate|pct|2;12", "interestCost|Interest Cost|money|60;68000", "date|Opened On|date|-330;0"],
    statuses: ["Open", "Accepted", "Matured", "Settled", "Overdue"],
    measure: "lcValue", rows: 56,
  },

  /* ── 41 ────────────────────────────────────────────────────────────── */
  "upas-lc": {
    name: "UPAS LC Management", kind: "list", summary: "Supplier paid at sight, buyer pays at usance",
    entity: "UPAS LC", ref: "UPS",
    fields: [LC_REF, SUPPLIER, BANK, "lcValue|LC Value|money|10000;1800000", "supplierPaidOn|Supplier Paid On|date|-200;20", "buyerTenorDays|Buyer Tenor|int|60;180;days", "maturityDate|Buyer Maturity|date|-20;220", "financeRate|Finance Rate|pct|3;11", "financeCost|Finance Cost|money|200;98000", "date|Opened On|date|-330;0"],
    statuses: ["Open", "Supplier Paid", "Awaiting Maturity", "Settled", "Overdue"],
    measure: "lcValue", rows: 52,
    insight: "UPAS financing costs sit outside the landed cost sheet unless they are pushed there deliberately — on a 120-day tenor that is roughly 3% of consignment value hiding in finance charges.",
  },

  /* ── 42 ────────────────────────────────────────────────────────────── */
  "deferred-lc": {
    name: "Deferred LC Management", kind: "list", summary: "Payment deferred without a draft",
    entity: "Deferred LC", ref: "DLC",
    fields: [LC_REF, SUPPLIER, BANK, "lcValue|LC Value|money|6000;1400000", "deferralDays|Deferral|int|30;180;days", "dueDate|Payment Due|date|-30;200", "provisionMade|Provision Made|money|0;1400000", "expiryDate|Expiry Date|date|-20;180", "date|Opened On|date|-330;0"],
    statuses: ["Open", "Documents Accepted", "Payment Due", "Settled", "Overdue"],
    measure: "lcValue", rows: 50,
  },

  /* ── 43 ────────────────────────────────────────────────────────────── */
  "revolving-lc": {
    name: "Revolving LC Management", kind: "list", summary: "Reinstating credit lines for repeat supply",
    entity: "Revolving LC", ref: "RLC",
    fields: [LC_REF, SUPPLIER, BANK, "lcValue|Cycle Value|money|8000;900000", "revolvesBy|Revolves By|enum|Time - monthly;Time - quarterly;Value on utilisation;Value on settlement", "cyclesUsed|Cycles Used|int|0;12", "cyclesTotal|Cycles Allowed|int|2;12", "cumulativeValue|Cumulative Value|money|8000;4800000", "expiryDate|Final Expiry|date|-20;300", "date|Opened On|date|-400;0"],
    statuses: ["Open", "Reinstated", "Cycle Exhausted", "Expiring", "Closed"],
    measure: "cumulativeValue", rows: 46,
  },

  /* ── 44 ────────────────────────────────────────────────────────────── */
  "transfer-lc": {
    name: "Transfer LC Management", kind: "list", summary: "Credit transferred to a second beneficiary",
    entity: "Transferred LC", ref: "TLC",
    fields: [LC_REF, "firstBeneficiary|First Beneficiary|enum|@suppliers", "secondBeneficiary|Second Beneficiary|enum|@suppliers", BANK, "originalValue|Original Value|money|8000;1600000", "transferredValue|Transferred Value|money|4000;1600000", "retainedMargin|Retained Margin|money|0;280000", "transferCharges|Transfer Charges|money|40;3800", "expiryDate|Expiry Date|date|-20;180", "date|Transferred On|date|-300;0"],
    statuses: ["Transferred", "Partially Transferred", "Pending Consent", "Settled", "Cancelled"],
    measure: "transferredValue", rows: 44,
  },

  /* ── 45 ────────────────────────────────────────────────────────────── */
  "standby-lc": {
    name: "Standby LC Management", kind: "list", summary: "Guarantee-style credit held against performance",
    entity: "Standby LC", ref: "SBL",
    fields: ["sblcNo|SBLC No|code|SBLC", "beneficiary|Beneficiary|enum|@suppliers", BANK, "guaranteeValue|Guarantee Value|money|10000;1200000", "purpose|Purpose|enum|Performance guarantee;Payment guarantee;Advance payment;Bid bond;Customs guarantee", "commissionPct|Commission|pct|0.4;3.2", "commissionCost|Commission Cost|money|60;38000", "expiryDate|Expiry Date|date|-30;540", "claimed|Claimed|bool|Yes;No", "date|Issued On|date|-500;0"],
    statuses: ["Active", "Expiring", "Claimed", "Released", "Expired"],
    measure: "guaranteeValue", rows: 44,
  },

  /* ── 46 ────────────────────────────────────────────────────────────── */
  "lc-amendment": {
    name: "LC Amendment Management", kind: "list", summary: "Every amendment raised on an open LC",
    entity: "LC Amendment", ref: "LCA",
    fields: [LC_REF, SUPPLIER, BANK, "amendmentNo|Amendment|enum|A1;A2;A3;A4;A5", "changeType|Change|enum|Value increase;Value decrease;Expiry extension;Shipment date;Partial shipment allowed;Port change;Description;Document set", "valueImpact|Value Impact|money|0;420000", "amendmentCharge|Amendment Charge|money|20;2400", "supplierConsent|Supplier Consent|bool|Received;Awaited", "date|Amended On|date|-300;0"],
    statuses: ["Advised", "Pending Bank", "Awaiting Consent", "Rejected", "Cancelled"],
    measure: "valueImpact", rows: 58,
    insight: "Roughly one open LC in three is amended at least once, and expiry extension is the single most common change — usually because the supplier missed the latest shipment date.",
  },

  /* ── 47 ────────────────────────────────────────────────────────────── */
  "lc-extension": {
    name: "LC Extension Management", kind: "list", summary: "Expiry and shipment date extensions",
    entity: "Extension", ref: "LCE",
    fields: [LC_REF, SUPPLIER, BANK, "originalExpiry|Original Expiry|date|-120;60", "newExpiry|New Expiry|date|-30;220", "extensionDays|Extension|int|7;120;days", "reason|Reason|enum|Supplier production delay;Vessel roll-over;Document delay;Buyer instruction;Raw material shortage;Port congestion", "extensionCharge|Extension Charge|money|20;2800", "date|Requested On|date|-300;0"],
    statuses: ["Extended", "Pending Bank", "Requested", "Declined", "Not Required"],
    measure: "extensionDays", rows: 52,
  },

  /* ── 48 ────────────────────────────────────────────────────────────── */
  "lc-utilization": {
    name: "LC Utilization Management", kind: "analytics", summary: "Opened against drawn, per LC and per bank",
    entity: "Utilisation Line", ref: "LCU",
    fields: [LC_REF, SUPPLIER, BANK, "lcValue|LC Value|money|8000;1800000", "drawnValue|Drawn|money|0;1800000", "balanceValue|Undrawn Balance|money|0;1800000", "utilisationPct|Utilisation|pct|0;100", "shipmentsDrawn|Shipments Drawn|int|0;12", "expiryDate|Expiry Date|date|-20;180", "date|As At|date|-30;0"],
    statuses: ["Fully Utilised", "Partially Utilised", "Unutilised", "Expiring Unutilised", "Closed"],
    measure: "lcValue", rows: 60,
  },

  /* ── 49 ────────────────────────────────────────────────────────────── */
  "lc-liability": {
    name: "LC Liability Monitoring", kind: "analytics", summary: "Contingent liability by bank and maturity",
    entity: "Liability Position", ref: "LCL",
    fields: [BANK, "lcType|LC Type|enum|Sight;Usance;UPAS;Deferred;Revolving;Back-to-back;Standby", "openLiability|Open Liability|money|10000;3200000", "acceptedLiability|Accepted Liability|money|0;2400000", "maturingIn30|Maturing in 30 Days|money|0;1400000", "limitSanctioned|Limit Sanctioned|money|100000;6400000", "limitUsedPct|Limit Used|pct|0;100", "date|Position Date|date|-120;0"],
    statuses: ["Within Limit", "Approaching Limit", "Limit Breached", "Under Review"],
    measure: "openLiability", rows: 54,
    insight: "Two banks are above 85% of sanctioned limit while a third sits under 40% — rebalancing the next three LCs across them costs nothing and buys back headroom.",
  },

  /* ── 50 ────────────────────────────────────────────────────────────── */
  "tt-payment": {
    name: "TT Payment Management", kind: "list", summary: "Telegraphic transfers against imports",
    entity: "TT Payment", ref: "TTP",
    fields: ["ttNo|TT Reference|code|TT", SUPPLIER, BANK, "amount|Amount|money|500;620000", CURRENCY, "exchangeRate|Exchange Rate|float|0.8;145;BDT;4", "localAmount|Local Amount|money|60000;68000000", "purpose|Purpose|enum|Advance payment;Balance payment;Sample payment;Freight payment;Commission;Full payment", "swiftRef|SWIFT Reference|enum|SWF-4471820;SWF-7712045;SWF-3348771;SWF-9921663;SWF-5580214", "date|Value Date|date|-300;10"],
    statuses: ["Executed", "Pending Bank", "Under Approval", "Returned", "Cancelled"],
    measure: "amount", rows: 60,
  },

  /* ── 51 ────────────────────────────────────────────────────────────── */
  "advance-payment": {
    name: "Advance Payment Management", kind: "list", summary: "Money paid before shipment, and its recovery",
    entity: "Advance", ref: "ADV",
    fields: [SUPPLIER, PI_REF, "advanceValue|Advance Paid|money|500;480000", "advancePct|Advance|pct|5;100", "adjustedValue|Adjusted|money|0;480000", "outstandingValue|Outstanding|money|0;480000", "guaranteeHeld|Guarantee Held|bool|APG held;No guarantee", "ageDays|Age|int|0;240;days", OFFICER, "date|Paid On|date|-330;0"],
    statuses: ["Adjusted", "Partially Adjusted", "Outstanding", "Overdue", "Written Off"],
    measure: "advanceValue", rows: 56,
    settings: ["Require an advance payment guarantee above the sanctioned advance threshold", "Flag any advance unadjusted for more than 90 days to finance"],
  },

  /* ── 52 ────────────────────────────────────────────────────────────── */
  "bank-acceptance": {
    name: "Bank Acceptance Management", kind: "list", summary: "Accepted drafts and their maturity",
    entity: "Acceptance", ref: "ACP",
    fields: [LC_REF, SUPPLIER, BANK, "acceptedValue|Accepted Value|money|6000;1600000", "acceptanceDate|Accepted On|date|-220;10", "maturityDate|Maturity Date|date|-30;200", "tenorDays|Tenor|int|30;180;days", "acceptanceCommission|Acceptance Commission|money|40;18000", "fundedBy|Funded By|enum|Own funds;Bank finance;UPAS discounting;Buyer credit", "date|Documents Received|date|-240;0"],
    statuses: ["Accepted", "Awaiting Maturity", "Settled", "Overdue", "Dishonoured"],
    measure: "acceptedValue", rows: 52,
  },

  /* ── 53 ────────────────────────────────────────────────────────────── */
  "commercial-cost-sheet": {
    name: "Commercial Cost Sheet Management", kind: "analytics", summary: "Every cost element per consignment",
    entity: "Cost Sheet", ref: "CCS",
    fields: [SHIPMENT_REF, SUPPLIER, MATERIAL, "fobValue|FOB Value|money|6000;620000", "freight|Freight|money|200;42000", "insurance|Insurance|money|20;6800", "duty|Duty & Tax|money|400;180000", "clearing|Clearing & Handling|money|60;18000", "otherCharges|Other Charges|money|20;12000", "totalLanded|Total Landed|money|8000;780000", "loadingPct|Loading over FOB|pct|4;42", "date|Costed On|date|-300;0"],
    statuses: ["Final", "Provisional", "Under Review", "Revised", "Draft"],
    measure: "totalLanded", rows: 62,
    insight: "Loading over FOB averages 27% and swings by nine points between lanes — the cost sheet is the only place that difference is visible before the item hits stock valuation.",
  },

  /* ── 54 ────────────────────────────────────────────────────────────── */
  "landed-cost": {
    name: "Landed Cost Management", kind: "analytics", summary: "True cost per unit once everything lands",
    entity: "Landed Cost Line", ref: "LDC",
    fields: [SHIPMENT_REF, ITEM, MATERIAL, "qty|Quantity|int|500;280000;kg", "fobUnit|FOB per Unit|float|0.4;42;USD;3", "landedUnit|Landed per Unit|float|0.5;56;USD;3", "variancePct|Variance vs Standard|pct|0;34", "standardCost|Standard Cost|float|0.4;52;USD;3", "postedToStock|Posted to Stock|bool|Posted;Pending", "date|Landed On|date|-300;0"],
    statuses: ["Posted", "Provisional", "Variance Review", "Pending Costs", "Draft"],
    measure: "landedUnit", rows: 64,
  },

  /* ── 55 ────────────────────────────────────────────────────────────── */
  "import-budget": {
    name: "Import Budget Management", kind: "analytics", summary: "Budget, commitment and actual by head",
    entity: "Budget Line", ref: "IBG",
    fields: ["budgetHead|Budget Head|enum|Raw material;Chemicals;Packaging;Spares;Tooling;Capital goods;Freight;Duty & tax", PERIOD, "budgetValue|Budget|money|20000;2400000", "committedValue|Committed|money|0;2400000", "actualValue|Actual|money|0;2400000", "availableValue|Available|money|0;1400000", "utilisationPct|Utilisation|pct|0;128", "owner|Budget Owner|person", "date|Period End|date|-330;30"],
    statuses: ["Within Budget", "Near Limit", "Over Budget", "Not Started", "Closed"],
    measure: "budgetValue", rows: 56,
    settings: ["Block an indent when the budget head has no available balance", "Treat an opened LC as a commitment against the budget, not just the payment"],
  },

  /* ── 56 ────────────────────────────────────────────────────────────── */
  "commercial-expense": {
    name: "Commercial Expense Management", kind: "list", summary: "Bills booked against import activity",
    entity: "Expense", ref: "CEX",
    fields: ["expenseNo|Expense No|code|CEX", SHIPMENT_REF, "expenseType|Expense Type|enum|Bank charges;Courier;Inspection fee;Legal fee;Agency commission;Sampling;Translation;Miscellaneous", "payee|Payee|enum|@suppliers", "amount|Amount|money|20;68000", CURRENCY, "billNo|Bill Reference|enum|BL-4471;BL-4488;BL-4502;BL-4517;BL-4533", "allocated|Allocated to Shipment|bool|Allocated;Unallocated", OFFICER, "date|Booked On|date|-300;0"],
    statuses: ["Approved", "Pending Approval", "Paid", "Disputed", "Rejected"],
    measure: "amount", rows: 60,
  },

  /* ── 57 ────────────────────────────────────────────────────────────── */
  "freight-cost": {
    name: "Freight Cost Management", kind: "analytics", summary: "Ocean, air and inland freight per lane",
    entity: "Freight Line", ref: "FRT",
    fields: [SHIPMENT_REF, CARRIER, FORWARDER, LOAD_PORT, "mode|Mode|enum|Sea FCL;Sea LCL;Air;Land;Multimodal", "containers|Containers|int|0;14", "weight|Chargeable Weight|int|200;280000;kg", "freightCost|Freight Cost|money|200;68000", "costPerKg|Cost per Kg|float|0.05;6.8;USD;3", "surcharges|Surcharges|money|0;18000", "date|Shipped On|date|-300;10"],
    statuses: ["Booked", "Invoiced", "Paid", "Under Dispute", "Credited"],
    measure: "freightCost", rows: 60,
    insight: "Air freight is under 6% of shipments but 23% of freight spend — nearly all of it traces back to an import plan gap raised inside lead time.",
  },

  /* ── 58 ────────────────────────────────────────────────────────────── */
  "insurance-cost": {
    name: "Insurance Cost Management", kind: "analytics", summary: "Marine cover premium per consignment",
    entity: "Insurance Cost", ref: "ICS",
    fields: [SHIPMENT_REF, "insurer|Insurer|enum|Green Delta;Pragati Insurance;Sadharan Bima;Reliance Insurance;Eastland Insurance", "coverType|Cover|enum|Institute Cargo Clause A;Clause B;Clause C;War risk;All risk", "sumInsured|Sum Insured|money|8000;720000", "premiumRate|Premium Rate|pct|0.05;1.8", "premium|Premium|money|20;9800", "claimsMade|Claims Made|int|0;4", "claimValue|Claim Value|money|0;180000", "date|Cover From|date|-300;20"],
    statuses: ["Covered", "Policy Issued", "Claimed", "Expired", "Not Covered"],
    measure: "premium", rows: 54,
  },

  /* ── 59 ────────────────────────────────────────────────────────────── */
  "port-cost": {
    name: "Port Cost Management", kind: "analytics", summary: "What the port charged, line by line",
    entity: "Port Cost", ref: "PCS",
    fields: [SHIPMENT_REF, DISCHARGE_PORT, "chargeType|Charge|enum|Terminal handling;Wharfage;Storage;Scanning;Shifting;Weighment;Labour;Documentation", "containers|Containers|int|0;14", "amount|Amount|money|20;48000", "daysAtPort|Days at Port|int|0;40;days", CNF_AGENT, "billRef|Port Bill|enum|PB-77121;PB-77188;PB-77244;PB-77301;PB-77366", "date|Charged On|date|-300;0"],
    statuses: ["Paid", "Payable", "Under Verification", "Disputed", "Waived"],
    measure: "amount", rows: 58,
  },

  /* ── 60 ────────────────────────────────────────────────────────────── */
  "clearing-cost": {
    name: "Clearing Cost Management", kind: "analytics", summary: "C&F agent bills and what sits inside them",
    entity: "Clearing Cost", ref: "CLC",
    fields: [SHIPMENT_REF, CNF_AGENT, BOE_REF, "agencyFee|Agency Fee|money|40;18000", "reimbursables|Reimbursables|money|20;38000", "totalBill|Total Bill|money|60;56000", "supportedByReceipt|Receipts Attached|pct|20;100", "verifiedBy|Verified By|person", "daysToClear|Days to Clear|int|1;28;days", "date|Billed On|date|-300;0"],
    statuses: ["Verified", "Under Verification", "Paid", "Query Raised", "Rejected"],
    measure: "totalBill", rows: 56,
    insight: "Reimbursables run about twice the agency fee and are where unsupported charges hide — the receipt-coverage column is the fastest check on any bill.",
  },

  /* ── 61 ────────────────────────────────────────────────────────────── */
  "customs-cost": {
    name: "Customs Cost Management", kind: "analytics", summary: "Assessment, examination and customs-side charges",
    entity: "Customs Cost", ref: "CUC",
    fields: [BOE_REF, SHIPMENT_REF, "assessedValue|Assessed Value|money|6000;680000", "declaredValue|Declared Value|money|6000;680000", "valuationUplift|Valuation Uplift|pct|0;28", "examinationFee|Examination Fee|money|20;6800", "penalty|Penalty|money|0;48000", "totalCustomsCost|Total Customs Cost|money|400;220000", CNF_AGENT, "date|Assessed On|date|-300;0"],
    statuses: ["Assessed", "Under Assessment", "Query Raised", "Penalty Applied", "Cleared"],
    measure: "totalCustomsCost", rows: 56,
  },

  /* ── 62 ────────────────────────────────────────────────────────────── */
  "duty-tax-cost": {
    name: "Duty & Tax Cost Management", kind: "analytics", summary: "CD, RD, SD, VAT, AIT and ATV per consignment",
    entity: "Duty Line", ref: "DTC",
    fields: [BOE_REF, HS_CODE, "assessedValue|Assessed Value|money|6000;680000", "customsDuty|Customs Duty|money|0;180000", "regulatoryDuty|Regulatory Duty|money|0;68000", "supplementaryDuty|Supplementary Duty|money|0;68000", "vat|VAT|money|0;120000", "ait|AIT|money|0;38000", "totalDuty|Total Duty & Tax|money|400;420000", "effectiveRate|Effective Rate|pct|2;68", "date|Paid On|date|-300;0"],
    statuses: ["Paid", "Assessed", "Under Protest", "Exempted", "Refund Claimed"],
    measure: "totalDuty", rows: 62,
    insight: "Effective duty rate varies from 12% to 61% across the item book — a single HS reclassification on the plating chemical line is worth more than a year of freight negotiation.",
  },

  /* ── 63 ────────────────────────────────────────────────────────────── */
  "hs-code": {
    name: "HS Code Management", kind: "list", summary: "Classification held against every imported item",
    entity: "HS Classification", ref: "HSC",
    fields: [ITEM, MATERIAL, HS_CODE, "description|Tariff Description|text|Copper alloy strip not exceeding 0.15mm;Unwrought zinc alloy;Base metal clasps and fittings;Slide fasteners parts;Buttons of base metal;Electroplating preparations;Nickel anode plates", "cdRate|Customs Duty|pct|0;25", "rdRate|Regulatory Duty|pct|0;20", "sdRate|Supplementary Duty|pct|0;45", "vatRate|VAT|pct|0;15", "rulingRef|Binding Ruling|enum|NBR-2024-118;NBR-2025-042;NBR-2025-207;No ruling", "classifiedBy|Classified By|person", "date|Effective From|date|-720;30"],
    statuses: ["Confirmed", "Provisional", "Under Dispute", "Reclassified", "Superseded"],
    measure: "cdRate", rows: 60,
  },

  /* ── 64 ────────────────────────────────────────────────────────────── */
  "customs-tariff": {
    name: "Customs Tariff Management", kind: "list", summary: "The tariff schedule the system assesses against",
    entity: "Tariff Line", ref: "CTF",
    fields: [HS_CODE, "tariffYear|Tariff Year|enum|FY 2024-25;FY 2025-26;FY 2026-27", "cdRate|CD|pct|0;25", "rdRate|RD|pct|0;20", "sdRate|SD|pct|0;45", "vatRate|VAT|pct|0;15", "aitRate|AIT|pct|0;10", "atvRate|ATV|pct|0;5", "totalTaxIncidence|Total Tax Incidence|pct|0;128", "sroReference|SRO Reference|enum|SRO 128/2025;SRO 204/2025;SRO 311/2026;None", "date|Effective From|date|-720;60"],
    statuses: ["Current", "Superseded", "Draft", "Withdrawn"],
    measure: "totalTaxIncidence", rows: 58,
  },

  /* ── 65 ────────────────────────────────────────────────────────────── */
  "import-tariff": {
    name: "Import Tariff Management", kind: "analytics", summary: "Preferential rates and what they actually save",
    entity: "Tariff Application", ref: "ITF",
    fields: [HS_CODE, ORIGIN, "scheme|Scheme|enum|MFN;SAFTA;APTA;Bilateral FTA;Bond facility;Duty exemption SRO", "standardRate|Standard Rate|pct|0;68", "preferentialRate|Preferential Rate|pct|0;45", "savingPct|Saving|pct|0;48", "savingValue|Saving Value|money|0;180000", "evidenceHeld|Origin Evidence|bool|COO on file;Not available", "date|Applied On|date|-330;0"],
    statuses: ["Claimed", "Eligible Not Claimed", "Under Verification", "Rejected", "Not Eligible"],
    measure: "savingValue", rows: 56,
    insight: "Eligible-not-claimed is the row that matters: preferential rates were available on shipments worth six figures where the certificate of origin simply arrived too late.",
  },

  /* ── 66 ────────────────────────────────────────────────────────────── */
  incoterms: {
    name: "Incoterms Management", kind: "settings", summary: "Which term applies where, and who carries what",
    entity: "Incoterm Rule", ref: "ITM",
    fields: [INCOTERM, "version|Version|enum|Incoterms 2010;Incoterms 2020", "freightBorneBy|Freight Borne By|enum|Supplier;Buyer;Shared", "insuranceBorneBy|Insurance Borne By|enum|Supplier;Buyer;Not required", "riskTransferPoint|Risk Transfers At|enum|Seller premises;Port of loading;On board vessel;Port of discharge;Named destination", "defaultForOrigin|Default For|enum|China;Japan;South Korea;India;Europe;All origins", "usageCount|Shipments Using|int|0;140", "date|Effective From|date|-500;0"],
    statuses: ["Active", "Preferred", "Restricted", "Retired"],
    measure: "usageCount", rows: 42,
    settings: ["Default new indents to the incoterm agreed on the supplier contract", "Require insurance evidence whenever the term leaves cover with the buyer"],
  },

  /* ── 67 ────────────────────────────────────────────────────────────── */
  "country-of-origin": {
    name: "Country of Origin Management", kind: "list", summary: "Origin declared, evidenced and verified",
    entity: "Origin Record", ref: "COO",
    fields: [SHIPMENT_REF, SUPPLIER, ORIGIN, "certificateNo|Certificate No|enum|COO-7741;COO-7768;COO-7784;COO-7799;COO-7812;COO-7830", "issuer|Issuing Body|enum|CCPIT China;JCCI Japan;KCCI Korea;FICCI India;Chamber of Commerce;Exporter declaration", "scheme|Preference Scheme|enum|MFN;SAFTA;APTA;Bilateral FTA;Non-preferential", "coveredValue|Covered Value|money|6000;680000", "verified|Verified|bool|Verified;Pending", "date|Issued On|date|-300;10"],
    statuses: ["Verified", "Received", "Awaited", "Discrepant", "Rejected"],
    measure: "coveredValue", rows: 56,
  },

  /* ── 68 ────────────────────────────────────────────────────────────── */
  "import-permit": {
    name: "Import Permit Management", kind: "list", summary: "IRC, IP and item-specific permissions",
    entity: "Permit", ref: "PMT",
    fields: ["permitNo|Permit No|code|PMT", "permitType|Permit Type|enum|Import Registration Certificate;Import Permit;Chemical import permission;Explosives licence;Radiation clearance;Standards clearance", "issuingAuthority|Authority|enum|CCI&E;Department of Explosives;BSTI;Bangladesh Atomic Energy;Ministry of Commerce;Environment Department", MATERIAL, "coveredValue|Covered Value|money|8000;1200000", "issuedOn|Issued On|date|-720;0", "expiryDate|Expires On|date|-60;540", "renewalDue|Renewal Due|date|-30;480", "date|Applied On|date|-760;0"],
    statuses: ["Valid", "Expiring", "Under Renewal", "Applied", "Expired"],
    measure: "coveredValue", rows: 50,
  },

  /* ── 69 ────────────────────────────────────────────────────────────── */
  "regulatory-compliance": {
    name: "Regulatory Compliance Management", kind: "list", summary: "Every rule an import consignment must satisfy",
    entity: "Compliance Item", ref: "RGC",
    fields: [SHIPMENT_REF, "regulation|Regulation|enum|Import policy order;Chemical handling rules;BSTI conformity;Environmental clearance;Customs valuation rules;Foreign exchange regulation;Packaging & labelling", "requirement|Requirement|text|Pre-shipment inspection certificate;MSDS for every chemical line;Marking in English and Bangla;Bank encashment certificate;Valuation declaration;Radiation-free certificate", "evidence|Evidence|bool|On file;Missing", "riskLevel|Risk Level|enum|Low;Medium;High;Critical", "penaltyExposure|Penalty Exposure|money|0;280000", "reviewer|Reviewer|person", "date|Checked On|date|-300;0"],
    statuses: ["Compliant", "Evidence Pending", "Non-Compliant", "Under Review", "Waived"],
    measure: "penaltyExposure", rows: 60,
  },

  /* ── 70 ────────────────────────────────────────────────────────────── */
  "bond-license": {
    name: "Bond License Management", kind: "list", summary: "Bonded warehouse licences and their limits",
    entity: "Bond Licence", ref: "BLC",
    fields: ["licenceNo|Licence No|code|BLC", "bondType|Bond Type|enum|Special bonded warehouse;General bonded warehouse;Diplomatic bond;Home consumption bond", "entitlementQty|Entitlement|int|10000;2400000;kg", "utilisedQty|Utilised|int|0;2400000;kg", "balanceQty|Balance|int|0;1400000;kg", "utilisationPct|Utilisation|pct|0;100", "issuedOn|Issued On|date|-900;-30", "expiryDate|Expires On|date|-30;540", "auditDue|Audit Due|date|-30;360", "date|Renewed On|date|-500;0"],
    statuses: ["Active", "Renewal Due", "Under Audit", "Suspended", "Expired"],
    measure: "entitlementQty", rows: 46,
    settings: ["Block a bonded import when entitlement balance falls below the consignment quantity", "Alert 90 days before a bond licence expires"],
  },

  /* ── 71 ────────────────────────────────────────────────────────────── */
  "bond-utilization": {
    name: "Bond Utilization Management", kind: "analytics", summary: "Entitlement consumed against production",
    entity: "Utilisation Entry", ref: "BUT",
    fields: ["licenceNo|Licence|enum|BLC-26-0104;BLC-26-0118;BLC-26-0132;BLC-26-0147", MATERIAL, PERIOD, "openingBalance|Opening Balance|int|0;1400000;kg", "importedQty|Imported|int|0;480000;kg", "consumedQty|Consumed in Production|int|0;480000;kg", "closingBalance|Closing Balance|int|0;1400000;kg", "wastagePct|Wastage|pct|0;12", "date|Period End|date|-330;0"],
    statuses: ["Reconciled", "Under Reconciliation", "Variance Found", "Pending Entry", "Closed"],
    measure: "importedQty", rows: 58,
  },

  /* ── 72 ────────────────────────────────────────────────────────────── */
  "bond-register": {
    name: "Bond Register Management", kind: "list", summary: "The statutory bond registers, entry by entry",
    entity: "Register Entry", ref: "BRG",
    fields: ["registerType|Register|enum|Register 1 - Import;Register 2 - Issue;Register 3 - Production;Register 4 - Export;Register 5 - Wastage", "licenceNo|Licence|enum|BLC-26-0104;BLC-26-0118;BLC-26-0132;BLC-26-0147", BOE_REF, MATERIAL, "qty|Quantity|int|100;480000;kg", "value|Value|money|2000;620000", "signedBy|Signed By|person", "customsVerified|Customs Verified|bool|Verified;Pending", "date|Entry Date|date|-330;0"],
    statuses: ["Posted", "Pending Posting", "Verified", "Under Query", "Rectified"],
    measure: "value", rows: 64,
  },

  /* ── 73 ────────────────────────────────────────────────────────────── */
  "customs-bond": {
    name: "Customs Bond Management", kind: "list", summary: "Bonds and guarantees lodged with customs",
    entity: "Customs Bond", ref: "CBD",
    fields: ["bondNo|Bond No|code|CBD", "bondType|Bond Type|enum|Provisional assessment bond;Duty deferment bond;Warehousing bond;Transit bond;Re-export bond", BANK, "bondValue|Bond Value|money|8000;1400000", "securedDuty|Duty Secured|money|0;620000", "lodgedOn|Lodged On|date|-500;0", "validTill|Valid Till|date|-30;540", "releaseRequested|Release Requested|bool|Yes;No", "date|Executed On|date|-540;0"],
    statuses: ["Active", "Release Requested", "Released", "Expiring", "Forfeited"],
    measure: "bondValue", rows: 48,
  },

  /* ── 74 ────────────────────────────────────────────────────────────── */
  "customs-clearance": {
    name: "Customs Clearance Management", kind: "board", summary: "Every consignment through the clearance stages",
    entity: "Clearance Case", ref: "CCL",
    fields: [SHIPMENT_REF, BOE_REF, CNF_AGENT, DISCHARGE_PORT, "stage|Stage|enum|Documents ready;BOE filed;Assessment;Duty paid;Examination;Out of charge;Delivered", "declaredValue|Declared Value|money|6000;680000", "daysAtStage|Days at Stage|int|0;18;days", "totalDaysToClear|Total Days|int|1;32;days", "queryRaised|Query Raised|bool|Yes;No", "date|Filed On|date|-300;0"],
    statuses: ["Cleared", "Under Assessment", "Under Examination", "Query Raised", "Held"],
    measure: "declaredValue", rows: 64,
    insight: "Held and query-raised consignments account for a fifth of the board but nearly all of the demurrage — a query answered on day one costs nothing, on day four it costs the container.",
  },

  /* ── 75 ────────────────────────────────────────────────────────────── */
  "customs-declaration": {
    name: "Customs Declaration Management", kind: "list", summary: "What was declared, and against which document set",
    entity: "Declaration", ref: "CDC",
    fields: [BOE_REF, SHIPMENT_REF, HS_CODE, "declaredQty|Declared Qty|int|100;480000;kg", "declaredValue|Declared Value|money|6000;680000", "assessedValue|Assessed Value|money|6000;720000", INCOTERM, ORIGIN, "channel|Assessment Channel|enum|Green;Yellow;Red;Blue", "filedBy|Filed By|person", "date|Filed On|date|-300;0"],
    statuses: ["Accepted", "Under Assessment", "Amended", "Query Raised", "Rejected"],
    measure: "declaredValue", rows: 62,
  },

  /* ── 76 ────────────────────────────────────────────────────────────── */
  "c-and-f-agent": {
    name: "C&F Agent Management", kind: "list", summary: "The clearing panel and how it performs",
    entity: "C&F Agent", ref: "CFA",
    fields: [CNF_AGENT, DISCHARGE_PORT, "licenceNo|AIN / Licence|enum|AIN-4471;AIN-4488;AIN-4502;AIN-4517;AIN-4533", "consignmentsYtd|Consignments (YTD)|int|1;180", "avgClearanceDays|Avg Clearance|int|1;22;days", "billingYtd|Billing (YTD)|money|4000;480000", "disputeCount|Disputes|int|0;12", "rating|Rating|pct|42;99", "contractTill|Contract Till|date|-30;480", "date|Reviewed On|date|-300;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Suspended", "Terminated"],
    measure: "billingYtd", rows: 46,
  },

  /* ── 77 ────────────────────────────────────────────────────────────── */
  "freight-forwarder": {
    name: "Freight Forwarder Management", kind: "list", summary: "Forwarder panel, lanes and spend",
    entity: "Forwarder", ref: "FFW",
    fields: [FORWARDER, "lanes|Lanes Served|enum|Far East;South Asia;Europe;Middle East;All lanes", "shipmentsYtd|Shipments (YTD)|int|1;180", "onTimePct|On-Time|pct|42;100", "annualSpend|Annual Spend|money|4000;620000", "avgTransitDays|Avg Transit|int|8;45;days", "claimCount|Claims|int|0;10", "rating|Rating|pct|42;99", "contractTill|Contract Till|date|-30;480", "date|Reviewed On|date|-300;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Suspended"],
    measure: "annualSpend", rows: 46,
  },

  /* ── 78 ────────────────────────────────────────────────────────────── */
  "shipping-line": {
    name: "Shipping Line Management", kind: "list", summary: "Carriers, rates and schedule reliability",
    entity: "Shipping Line", ref: "SPL",
    fields: [CARRIER, LOAD_PORT, DISCHARGE_PORT, "serviceName|Service|enum|Far East Express;China-Chattogram Direct;Intra-Asia Feeder;Gulf Connect;Europe Loop", "transitDays|Transit|int|8;45;days", "scheduleReliability|Schedule Reliability|pct|38;99", "rate20ft|20ft Rate|money|200;3800", "rate40ft|40ft Rate|money|300;5800", "containersYtd|Containers (YTD)|int|1;280", "date|Rate Valid From|date|-300;30"],
    statuses: ["Contracted", "Spot", "Preferred", "On Watch", "Not Used"],
    measure: "rate40ft", rows: 48,
  },

  /* ── 79 ────────────────────────────────────────────────────────────── */
  "insurance-company": {
    name: "Insurance Company Management", kind: "list", summary: "Insurer panel and claim experience",
    entity: "Insurer", ref: "INC",
    fields: ["insurer|Insurer|enum|Green Delta;Pragati Insurance;Sadharan Bima;Reliance Insurance;Eastland Insurance", "coverTypes|Cover Types|enum|Marine cargo;Marine hull;War risk;All risk;Open cover", "policiesYtd|Policies (YTD)|int|1;180", "premiumYtd|Premium (YTD)|money|400;98000", "claimsMade|Claims Made|int|0;14", "claimsSettled|Claims Settled|int|0;14", "settlementDays|Avg Settlement|int|7;180;days", "rating|Rating|pct|42;99", "date|Reviewed On|date|-330;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Not Used"],
    measure: "premiumYtd", rows: 42,
  },

  /* ── 80 ────────────────────────────────────────────────────────────── */
  "insurance-policy": {
    name: "Insurance Policy Management", kind: "list", summary: "Open cover and per-shipment declarations",
    entity: "Policy", ref: "POL",
    fields: ["policyNo|Policy No|code|POL", "insurer|Insurer|enum|Green Delta;Pragati Insurance;Sadharan Bima;Reliance Insurance;Eastland Insurance", "policyType|Policy Type|enum|Open cover;Specific policy;Annual declaration;Certificate under open cover", SHIPMENT_REF, "sumInsured|Sum Insured|money|8000;780000", "premium|Premium|money|20;9800", "coverFrom|Cover From|date|-300;20", "coverTill|Cover Till|date|-30;180", "claimStatus|Claim|enum|No claim;Claim lodged;Claim settled;Claim rejected", "date|Issued On|date|-330;0"],
    statuses: ["Active", "Issued", "Expiring", "Claimed", "Expired"],
    measure: "sumInsured", rows: 56,
  },
  /* ── 81 ────────────────────────────────────────────────────────────── */
  "shipment-booking": {
    name: "Shipment Booking Management", kind: "list", summary: "Space booked with the line or forwarder",
    entity: "Booking", ref: "SBK",
    fields: ["bookingNo|Booking No|code|SBK", SUPPLIER, CARRIER, FORWARDER, LOAD_PORT, "containers|Containers|int|1;14", "containerType|Container Type|enum|20ft;40ft;40ft HC;LCL;Reefer;Open top", "freightRate|Freight Rate|money|200;5800", "cutoffDate|Cut-off|date|-30;60", "date|Booked On|date|-300;10"],
    statuses: ["Confirmed", "Requested", "Rolled Over", "Shipped", "Cancelled"],
    measure: "freightRate", rows: 58,
  },

  /* ── 82 ────────────────────────────────────────────────────────────── */
  "shipment-schedule": {
    name: "Shipment Schedule Management", kind: "calendar", summary: "Sailing and arrival schedule per consignment",
    entity: "Scheduled Shipment", ref: "SSC",
    fields: [SHIPMENT_REF, SUPPLIER, VESSEL, LOAD_PORT, DISCHARGE_PORT, "value|Value|money|6000;680000", "transitDays|Transit|int|8;45;days", "etaDate|ETA|date|-20;80", "date|ETD|date|-40;60"],
    statuses: ["Scheduled", "Sailed", "On Water", "Arrived", "Delayed"],
    measure: "value", rows: 60,
  },

  /* ── 83 ────────────────────────────────────────────────────────────── */
  "shipment-allocation": {
    name: "Shipment Allocation Management", kind: "list", summary: "Which order, plan and department the cargo serves",
    entity: "Allocation", ref: "SAL",
    fields: [SHIPMENT_REF, MATERIAL, "allocatedTo|Allocated To|enum|Production plan;Sales order;Stock replenishment;Maintenance;Tool room;Sample development", "reference|Reference|enum|SO-26-2041;PP-26-0418;WO-26-1120;MNT-26-0207;Stock", "allocatedQty|Allocated Qty|int|100;280000;kg", "balanceQty|Unallocated|int|0;180000;kg", "priority|Priority|enum|Critical;High;Normal;Low", OFFICER, "date|Allocated On|date|-300;10"],
    statuses: ["Allocated", "Partially Allocated", "Unallocated", "Reallocated", "Released"],
    measure: "allocatedQty", rows: 58,
  },

  /* ── 84 ────────────────────────────────────────────────────────────── */
  "container-management": {
    name: "Container Management", kind: "list", summary: "Every container against every consignment",
    entity: "Container", ref: "CNT",
    fields: [CONTAINER_NO, SHIPMENT_REF, CARRIER, "containerType|Type|enum|20ft;40ft;40ft HC;LCL;Reefer;Open top", "grossWeight|Gross Weight|int|2000;28000;kg", "cbm|Volume|float|4;68;CBM;1", "packages|Packages|int|10;2400;pkgs", "value|Cargo Value|money|6000;680000", DISCHARGE_PORT, "date|Gated In|date|-300;20"],
    statuses: ["Loaded", "On Water", "Discharged", "Under Clearance", "Returned"],
    measure: "value", rows: 62,
  },

  /* ── 85 ────────────────────────────────────────────────────────────── */
  "container-allocation": {
    name: "Container Allocation Management", kind: "list", summary: "What went into which box",
    entity: "Container Line", ref: "CAL",
    fields: [CONTAINER_NO, MATERIAL, ITEM, "qty|Quantity|int|100;180000;kg", "packages|Packages|int|5;1200;pkgs", "weight|Weight|int|200;24000;kg", "utilisationPct|Space Used|pct|38;100", "stuffedBy|Stuffed By|enum|Supplier factory;CFS;Consolidator;Forwarder warehouse", "date|Stuffed On|date|-300;10"],
    statuses: ["Stuffed", "Planned", "Partially Stuffed", "Reallocated", "Discharged"],
    measure: "utilisationPct", rows: 60,
    insight: "Average space utilisation is 84% — the shipments below 70% are almost all part-loads that could have waited three days and travelled with the next consignment.",
  },

  /* ── 86 ────────────────────────────────────────────────────────────── */
  "container-tracking": {
    name: "Container Tracking Management", kind: "analytics", summary: "Where each box is right now",
    entity: "Tracked Container", ref: "CTK",
    fields: [CONTAINER_NO, SHIPMENT_REF, CARRIER, VESSEL, "currentLocation|Current Location|enum|Origin port;On water;Transhipment port;Discharge port;Port yard;In transit inland;Delivered", "voyageProgress|Voyage Progress|pct|2;100", "daysToEta|Days to ETA|int|0;45;days", "lastEventAt|Last Event|date|-40;0", "date|ETA|date|-15;60"],
    statuses: ["On Schedule", "Minor Delay", "Delayed", "Arrived", "Delivered"],
    measure: "voyageProgress", rows: 62,
  },

  /* ── 87 ────────────────────────────────────────────────────────────── */
  "container-seal": {
    name: "Container Seal Management", kind: "list", summary: "Seal numbers, checks and integrity findings",
    entity: "Seal Record", ref: "SEL",
    fields: [CONTAINER_NO, "sealNo|Seal No|enum|SL-4471820;SL-7712045;SL-3348771;SL-9921663;SL-5580214;SL-6640922", "sealType|Seal Type|enum|Bolt seal;Cable seal;Customs seal;Line seal;Buyer seal", "affixedBy|Affixed By|enum|Supplier;Forwarder;Customs;Shipping line;Surveyor", "verifiedAt|Verified At|enum|Load port;Transhipment;Discharge port;Factory gate;Warehouse", "intact|Seal Intact|bool|Intact;Broken", "photoOnFile|Photo Evidence|bool|On file;Not available", "date|Verified On|date|-300;10"],
    statuses: ["Verified", "Pending Verification", "Seal Broken", "Replaced", "Under Investigation"],
    rows: 58,
  },

  /* ── 88 ────────────────────────────────────────────────────────────── */
  "vessel-management": {
    name: "Vessel Management", kind: "list", summary: "Vessels carrying our cargo and their record",
    entity: "Vessel", ref: "VSL",
    fields: [VESSEL, CARRIER, "imoNo|IMO No|enum|IMO-9412207;IMO-9530118;IMO-9647302;IMO-9718844;IMO-9803166", "flag|Flag|enum|Panama;Liberia;Marshall Islands;Singapore;Hong Kong;Malta", "capacityTeu|Capacity|int|1200;24000;TEU", "voyagesYtd|Voyages (YTD)|int|1;40", "onTimePct|On-Time|pct|38;99", "cargoValueYtd|Cargo Value (YTD)|money|20000;2400000", "date|Last Voyage|date|-300;20"],
    statuses: ["Active", "Preferred", "On Watch", "Not Used", "Blacklisted"],
    measure: "cargoValueYtd", rows: 46,
  },

  /* ── 89 ────────────────────────────────────────────────────────────── */
  "voyage-management": {
    name: "Voyage Management", kind: "list", summary: "Voyage numbers, legs and transhipment",
    entity: "Voyage", ref: "VOY",
    fields: ["voyageNo|Voyage No|enum|VY-2604E;VY-2611W;VY-2618E;VY-2625W;VY-2632E;VY-2639W", VESSEL, CARRIER, LOAD_PORT, DISCHARGE_PORT, "transhipmentPort|Transhipment|enum|Singapore;Port Klang;Colombo;Tanjung Pelepas;Direct - none", "legs|Legs|int|1;4", "containers|Containers|int|1;28", "transitDays|Transit|int|8;45;days", "date|Departure|date|-300;40"],
    statuses: ["On Schedule", "Delayed", "Transhipping", "Completed", "Cancelled"],
    measure: "containers", rows: 54,
  },

  /* ── 90 ────────────────────────────────────────────────────────────── */
  "eta-management": {
    name: "ETA Management", kind: "calendar", summary: "Arrival estimates and how far they have moved",
    entity: "ETA Record", ref: "ETA",
    fields: [SHIPMENT_REF, VESSEL, DISCHARGE_PORT, "originalEta|Original ETA|date|-40;60", "revisions|ETA Revisions|int|0;6", "slipDays|Slip|int|0;28;days", "value|Consignment Value|money|6000;680000", "productionImpact|Production Impact|enum|None;Buffer absorbs;Plan reshuffle;Line stoppage risk", "date|Current ETA|date|-20;75"],
    statuses: ["Confirmed", "Revised", "At Risk", "Arrived", "Overdue"],
    measure: "value", rows: 60,
    insight: "An ETA that has been revised twice slips again four times out of five — two revisions is the point to reshuffle the plan rather than wait for a third.",
  },

  /* ── 91 ────────────────────────────────────────────────────────────── */
  "etd-management": {
    name: "ETD Management", kind: "calendar", summary: "Departure estimates against cut-off",
    entity: "ETD Record", ref: "ETD",
    fields: [SHIPMENT_REF, SUPPLIER, VESSEL, LOAD_PORT, "cutoffDate|Cut-off|date|-40;50", "originalEtd|Original ETD|date|-40;55", "slipDays|Slip|int|0;24;days", "cargoReadyDate|Cargo Ready|date|-50;45", "value|Consignment Value|money|6000;680000", "date|Current ETD|date|-35;60"],
    statuses: ["Confirmed", "Revised", "Cut-off Missed", "Sailed", "Rolled Over"],
    measure: "value", rows: 56,
  },

  /* ── 92 ────────────────────────────────────────────────────────────── */
  "shipment-tracking": {
    name: "Shipment Tracking Management", kind: "analytics", summary: "End-to-end status of every consignment",
    entity: "Tracked Shipment", ref: "STK",
    fields: [SHIPMENT_REF, SUPPLIER, CARRIER, VESSEL, DISCHARGE_PORT, "milestone|Last Milestone|enum|Cargo ready;Gated in;Loaded on board;Departed;Transhipped;Arrived;Discharged;Gated out;Delivered", "progress|Progress|pct|2;100", "daysElapsed|Days Elapsed|int|0;90;days", "value|Value|money|6000;680000", "date|ETA|date|-20;70"],
    statuses: ["On Schedule", "Minor Delay", "Delayed", "Arrived", "Delivered"],
    measure: "value", rows: 64,
  },

  /* ── 93 ────────────────────────────────────────────────────────────── */
  "goods-in-transit": {
    name: "Goods in Transit Monitoring", kind: "analytics", summary: "Value on the water and who carries the risk",
    entity: "Transit Position", ref: "GIT",
    fields: [SHIPMENT_REF, SUPPLIER, MATERIAL, "transitValue|Value in Transit|money|6000;680000", "riskBornBy|Risk Borne By|enum|Supplier;Buyer;Insurer;Shared", INCOTERM, "insuredValue|Insured Value|money|0;780000", "daysInTransit|Days in Transit|int|1;60;days", "glPosted|Posted to GIT Account|bool|Posted;Pending", "date|Departed On|date|-90;0"],
    statuses: ["In Transit", "Arrived Not Cleared", "Cleared", "Uninsured Exposure", "Written Back"],
    measure: "transitValue", rows: 60,
    insight: "Goods-in-transit sits on the balance sheet the moment risk transfers, not when the container lands — every FOB consignment on the water is already our inventory.",
  },

  /* ── 94 ────────────────────────────────────────────────────────────── */
  "commercial-documents": {
    name: "Commercial Document Management", kind: "list", summary: "The document set behind every consignment",
    entity: "Document", ref: "CDM",
    fields: [SHIPMENT_REF, "docType|Document|enum|Commercial invoice;Packing list;Bill of lading;Certificate of origin;Insurance certificate;Inspection certificate;Beneficiary certificate;MSDS", "docNo|Document No|enum|DOC-4471;DOC-4488;DOC-4502;DOC-4517;DOC-4533;DOC-4549", SUPPLIER, "copies|Copies|int|1;8", "receivedVia|Received Via|enum|Bank;Courier;Email;Supplier portal;Agent", "originalHeld|Original Held|bool|Original on file;Copy only", OFFICER, "date|Received On|date|-300;10"],
    statuses: ["Complete", "Partially Received", "Awaited", "Discrepant", "Rejected"],
    rows: 66,
  },

  /* ── 95 ────────────────────────────────────────────────────────────── */
  "import-document-repository": {
    name: "Import Document Repository", kind: "list", summary: "Searchable archive of every import file",
    entity: "Repository Item", ref: "IDR",
    fields: [SHIPMENT_REF, "category|Category|enum|Contract;PI;LC;Shipping;Customs;Insurance;Payment;Compliance;Correspondence", "fileName|File|text|BL-MSKU4471820.pdf;CI-IPI-26-2041.pdf;COO-7741.pdf;BOE-26-77121.pdf;LC-ILC-26-4411.pdf;MSDS-plating-chem.pdf", "fileSize|Size|int|40;48000;KB", "retentionYears|Retention|int|3;12;years", "accessLevel|Access|enum|Public internal;Commercial only;Finance only;Restricted", "uploadedBy|Uploaded By|person", "date|Archived On|date|-700;0"],
    statuses: ["Archived", "Active", "Under Retention", "Due for Purge", "Purged"],
    measure: "fileSize", rows: 68,
  },

  /* ── 96 ────────────────────────────────────────────────────────────── */
  "document-verification": {
    name: "Document Verification", kind: "board", summary: "Checked against the LC and the contract",
    entity: "Verification", ref: "DVF",
    fields: [SHIPMENT_REF, LC_REF, "docType|Document|enum|Commercial invoice;Packing list;Bill of lading;Certificate of origin;Insurance certificate;Inspection certificate", "checkedAgainst|Checked Against|enum|LC terms;Contract;PI;Import policy;All of them", "discrepancies|Discrepancies Found|int|0;8", "discrepancyType|Discrepancy|enum|None;Description mismatch;Late presentation;Amount over-drawn;Missing signature;Wrong consignee;Short document", "verifier|Verified By|person", "date|Verified On|date|-300;10"],
    statuses: ["Verified", "Under Verification", "Discrepant", "Waiver Sought", "Rejected"],
    measure: "discrepancies", rows: 60,
  },

  /* ── 97 ────────────────────────────────────────────────────────────── */
  "document-approval": {
    name: "Document Approval", kind: "board", summary: "Sign-off before documents go to the bank",
    entity: "Document Approval", ref: "DAP",
    fields: [SHIPMENT_REF, "docSet|Document Set|enum|LC document set;Customs document set;Payment document set;Release document set", "value|Value Covered|money|6000;780000", "stage|Stage|enum|Commercial check;Finance check;Compliance check;Head of department;Director", "approver|Approver|person", "slaHours|SLA|int|4;72;hours", "ageHours|Age|int|0;168;hours", "date|Submitted On|date|-300;0"],
    statuses: ["Approved", "Awaiting Approval", "In Review", "Returned", "Rejected"],
    measure: "value", rows: 58,
  },

  /* ── 98 ────────────────────────────────────────────────────────────── */
  "document-version-control": {
    name: "Document Version Control", kind: "list", summary: "Which copy is the one the bank holds",
    entity: "Document Version", ref: "DVC",
    fields: ["docNo|Document|enum|DOC-4471;DOC-4488;DOC-4502;DOC-4517;DOC-4533", "docType|Type|enum|Commercial invoice;Packing list;Bill of lading;Certificate of origin;Insurance certificate", "version|Version|enum|V1;V2;V3;V4;V5", "changeReason|Change Reason|text|Consignee corrected;Description aligned to LC;Quantity amended;Marks and numbers added;Signature page replaced;Date corrected", "isCurrent|Status|bool|Current;Superseded", "submittedToBank|Submitted to Bank|bool|Yes;No", "author|Uploaded By|person", "date|Version Date|date|-300;0"],
    statuses: ["Current", "Superseded", "Draft", "Withdrawn"],
    rows: 58,
    settings: ["Lock a document version once it has been presented to the bank", "Keep every superseded version against the shipment for audit"],
  },

  /* ── 99 ────────────────────────────────────────────────────────────── */
  "bill-of-entry": {
    name: "Bill of Entry (BOE) Management", kind: "list", summary: "Every BOE filed and its assessment",
    entity: "Bill of Entry", ref: "BOE",
    fields: ["boeNumber|BOE Number|code|BOE", SHIPMENT_REF, CNF_AGENT, DISCHARGE_PORT, "boeType|BOE Type|enum|Home consumption;Warehousing;Ex-bond;Transit;Re-import", "declaredValue|Declared Value|money|6000;680000", "assessedValue|Assessed Value|money|6000;720000", "totalDuty|Total Duty|money|400;420000", "channel|Channel|enum|Green;Yellow;Red;Blue", "filedOn|Filed On|date|-300;0", "date|Out of Charge|date|-290;20"],
    statuses: ["Out of Charge", "Assessed", "Under Assessment", "Query Raised", "Rejected"],
    measure: "totalDuty", rows: 62,
  },

  /* ── 100 ───────────────────────────────────────────────────────────── */
  "customs-duty": {
    name: "Customs Duty Management", kind: "analytics", summary: "Duty assessed, paid and challaned",
    entity: "Duty Payment", ref: "CDU",
    fields: [BOE_REF, HS_CODE, "assessedValue|Assessed Value|money|6000;720000", "dutyRate|Duty Rate|pct|0;25", "dutyAmount|Duty Amount|money|0;180000", "challanNo|Challan No|enum|CHL-4471820;CHL-7712045;CHL-3348771;CHL-9921663", BANK, "paidOn|Paid On|date|-300;10", "refundClaimed|Refund Claimed|money|0;68000", "date|Assessed On|date|-300;0"],
    statuses: ["Paid", "Assessed", "Under Protest", "Refund Claimed", "Refunded"],
    measure: "dutyAmount", rows: 60,
  },

  /* ── 101 ───────────────────────────────────────────────────────────── */
  "vat-management": {
    name: "VAT Management", kind: "analytics", summary: "Import VAT paid and rebate claimed",
    entity: "VAT Entry", ref: "VAT",
    fields: [BOE_REF, HS_CODE, "assessableValue|Assessable Value|money|6000;720000", "vatRate|VAT Rate|pct|0;15", "vatPaid|VAT Paid|money|0;120000", "rebateClaimed|Rebate Claimed|money|0;120000", "rebateAvailed|Rebate Availed|money|0;120000", "mushakRef|Mushak Reference|enum|6.3-44718;6.3-77120;6.3-33487;6.3-99216;4.3-55802", PERIOD, "date|Paid On|date|-300;10"],
    statuses: ["Rebate Availed", "Rebate Claimed", "Paid", "Under Query", "Not Claimable"],
    measure: "vatPaid", rows: 58,
    insight: "Import VAT is fully rebatable on bonded raw material but not on spares — the unclaimed balance is almost entirely spares and packaging booked to the wrong head.",
  },

  /* ── 102 ───────────────────────────────────────────────────────────── */
  "tax-management": {
    name: "Tax Management", kind: "list", summary: "AIT, ATV and every other import-side tax",
    entity: "Tax Entry", ref: "TAX",
    fields: [BOE_REF, "taxType|Tax Type|enum|Advance income tax;Advance trade VAT;Supplementary duty;Regulatory duty;Environment surcharge;Development surcharge", "baseValue|Base Value|money|6000;720000", "rate|Rate|pct|0;20", "amount|Amount|money|0;98000", "adjustable|Adjustable|bool|Adjustable;Cost to P&L", "adjustedAgainst|Adjusted Against|enum|Corporate tax;Output VAT;Not adjusted;Refund claim", PERIOD, "date|Paid On|date|-300;10"],
    statuses: ["Paid", "Adjusted", "Pending Adjustment", "Expensed", "Under Query"],
    measure: "amount", rows: 60,
  },

  /* ── 103 ───────────────────────────────────────────────────────────── */
  "duty-exemption": {
    name: "Duty Exemption Management", kind: "list", summary: "SRO, bond and treaty exemptions claimed",
    entity: "Exemption", ref: "DEX",
    fields: [BOE_REF, HS_CODE, "exemptionType|Exemption|enum|SRO exemption;Bond facility;Capital machinery concession;FTA preference;Sample import;Re-import relief", "sroReference|Reference|enum|SRO 128/2025;SRO 204/2025;SRO 311/2026;Bond licence;FTA certificate", "dutyWithout|Duty Without Exemption|money|400;420000", "dutyWith|Duty With Exemption|money|0;280000", "savingValue|Saving|money|0;280000", "evidenceHeld|Evidence|bool|On file;Missing", "date|Claimed On|date|-300;0"],
    statuses: ["Allowed", "Claimed", "Under Verification", "Disallowed", "Not Claimed"],
    measure: "savingValue", rows: 56,
  },

  /* ── 104 ───────────────────────────────────────────────────────────── */
  "bond-adjustment": {
    name: "Bond Adjustment Management", kind: "list", summary: "Bonded material reconciled against export",
    entity: "Bond Adjustment", ref: "BAD",
    fields: ["licenceNo|Licence|enum|BLC-26-0104;BLC-26-0118;BLC-26-0132;BLC-26-0147", BOE_REF, MATERIAL, "importedQty|Imported Qty|int|100;480000;kg", "consumedQty|Consumed Qty|int|0;480000;kg", "exportedQty|Exported Against|int|0;480000;kg", "wastageQty|Wastage|int|0;38000;kg", "adjustedQty|Adjusted Qty|int|0;480000;kg", "shortfallQty|Shortfall|int|0;68000;kg", "dutyExposure|Duty Exposure on Shortfall|money|0;180000", "date|Adjusted On|date|-330;0"],
    statuses: ["Adjusted", "Partially Adjusted", "Pending Adjustment", "Shortfall", "Duty Paid"],
    measure: "dutyExposure", rows: 58,
    settings: ["Reconcile bond consumption against export shipments every month", "Escalate any shortfall carrying duty exposure above the sanctioned threshold"],
  },

  /* ── 105 ───────────────────────────────────────────────────────────── */
  "port-handling": {
    name: "Port Handling Management", kind: "list", summary: "Discharge, yard movement and gate-out",
    entity: "Handling Record", ref: "PHM",
    fields: [CONTAINER_NO, DISCHARGE_PORT, "activity|Activity|enum|Discharge;Yard shifting;Scanning;Weighment;Examination;Stuffing;Gate out", "handledBy|Handled By|enum|Port authority;Terminal operator;C&F agent;Own transport", "startedOn|Started On|date|-300;10", "completedOn|Completed On|date|-295;15", "durationHours|Duration|int|1;168;hours", "charge|Charge|money|20;18000", "date|Activity Date|date|-300;10"],
    statuses: ["Completed", "In Progress", "Awaiting Slot", "Delayed", "Held"],
    measure: "charge", rows: 60,
  },

  /* ── 106 ───────────────────────────────────────────────────────────── */
  "port-expense": {
    name: "Port Expense Management", kind: "analytics", summary: "Total port spend and what drives it",
    entity: "Port Expense", ref: "PEX",
    fields: [DISCHARGE_PORT, PERIOD, "containers|Containers|int|1;180", "handlingCharges|Handling|money|100;98000", "storageCharges|Storage|money|0;68000", "demurrageCharges|Demurrage|money|0;98000", "detentionCharges|Detention|money|0;68000", "totalExpense|Total Expense|money|200;280000", "costPerContainer|Cost per Container|money|40;6800", "date|Period End|date|-330;0"],
    statuses: ["Within Budget", "Above Budget", "Under Review", "Disputed"],
    measure: "totalExpense", rows: 54,
  },

  /* ── 107 ───────────────────────────────────────────────────────────── */
  demurrage: {
    name: "Demurrage Management", kind: "analytics", summary: "Free time used and what the delay cost",
    entity: "Demurrage Case", ref: "DEM",
    fields: [CONTAINER_NO, SHIPMENT_REF, DISCHARGE_PORT, "freeDays|Free Days|int|3;21;days", "daysUsed|Days Used|int|1;45;days", "chargeableDays|Chargeable Days|int|0;30;days", "ratePerDay|Rate per Day|money|20;480", "demurrageAmount|Demurrage|money|0;98000", "rootCause|Root Cause|enum|Document delay;Customs query;Duty payment delay;Agent delay;Transport shortage;Buyer instruction;Port congestion", CNF_AGENT, "date|Incurred On|date|-300;0"],
    statuses: ["Incurred", "At Risk", "Within Free Time", "Waiver Sought", "Waived"],
    measure: "demurrageAmount", rows: 60,
    insight: "Document delay and customs query cause two-thirds of chargeable days — both are internal, and both are visible two days before the free time expires.",
  },

  /* ── 108 ───────────────────────────────────────────────────────────── */
  detention: {
    name: "Detention Management", kind: "analytics", summary: "Container held beyond the line's free period",
    entity: "Detention Case", ref: "DET",
    fields: [CONTAINER_NO, CARRIER, "freeDays|Free Days|int|3;14;days", "daysHeld|Days Held|int|1;40;days", "chargeableDays|Chargeable Days|int|0;28;days", "ratePerDay|Rate per Day|money|20;380", "detentionAmount|Detention|money|0;68000", "rootCause|Root Cause|enum|Unloading delay;Warehouse space;Transport shortage;Empty return queue;Inspection hold;Holiday closure", "returnedOn|Empty Returned|date|-280;20", "date|Gated Out|date|-300;10"],
    statuses: ["Incurred", "At Risk", "Within Free Time", "Disputed", "Waived"],
    measure: "detentionAmount", rows: 56,
  },

  /* ── 109 ───────────────────────────────────────────────────────────── */
  "delivery-order": {
    name: "Delivery Order (DO) Management", kind: "list", summary: "Release orders from the line and the agent",
    entity: "Delivery Order", ref: "DO",
    fields: ["doNo|DO Number|code|DO", CONTAINER_NO, SHIPMENT_REF, CARRIER, "issuedBy|Issued By|enum|Shipping line;Forwarder;Agent;Port authority", "chargesPaid|Charges Paid|money|20;28000", "validTill|Valid Till|date|-10;30", "collectedBy|Collected By|person", "date|Issued On|date|-300;10"],
    statuses: ["Issued", "Requested", "Collected", "Expired", "Cancelled"],
    measure: "chargesPaid", rows: 56,
  },

  /* ── 110 ───────────────────────────────────────────────────────────── */
  "goods-receiving": {
    name: "Goods Receiving (GRN) Management", kind: "list", summary: "What actually arrived against what was ordered",
    entity: "Goods Receipt", ref: "GRN",
    fields: ["grnNo|GRN No|code|GRN", SHIPMENT_REF, SUPPLIER, MATERIAL, "orderedQty|Ordered Qty|int|100;480000;kg", "receivedQty|Received Qty|int|0;480000;kg", "shortQty|Short / Excess|int|0;38000;kg", "damagedQty|Damaged|int|0;18000;kg", "warehouse|Warehouse|enum|RM Store A;RM Store B;Chemical Store;Spares Store;Bonded Warehouse", "receivedBy|Received By|person", "date|Received On|date|-300;10"],
    statuses: ["Received", "Partially Received", "Under Inspection", "Short Received", "Rejected"],
    measure: "receivedQty", rows: 62,
  },

  /* ── 111 ───────────────────────────────────────────────────────────── */
  "warehouse-receiving-integration": {
    name: "Warehouse Receiving Integration", kind: "list", summary: "Handover from the import desk to the store",
    entity: "Handover", ref: "WRI",
    fields: ["grnNo|GRN|enum|GRN-26-0411;GRN-26-0428;GRN-26-0452;GRN-26-0477;GRN-26-0490", "warehouse|Warehouse|enum|RM Store A;RM Store B;Chemical Store;Spares Store;Bonded Warehouse", "binLocation|Bin|enum|A-01-04;A-02-11;B-03-07;C-01-02;BOND-04-01;CHM-02-05", "putAwayQty|Put-away Qty|int|100;480000;kg", "putAwayBy|Put-away By|person", "systemPosted|Posted to Inventory|bool|Posted;Pending", "variance|Variance vs GRN|int|0;18000;kg", "date|Put Away On|date|-300;10"],
    statuses: ["Put Away", "In Progress", "Awaiting Space", "Variance Found", "Rejected"],
    measure: "putAwayQty", rows: 58,
  },

  /* ── 112 ───────────────────────────────────────────────────────────── */
  "inventory-integration": {
    name: "Inventory Integration", kind: "list", summary: "Import receipts posted into the stock ledger",
    entity: "Inventory Posting", ref: "IVI",
    fields: ["grnNo|GRN|enum|GRN-26-0411;GRN-26-0428;GRN-26-0452;GRN-26-0477;GRN-26-0490", ITEM, MATERIAL, "qty|Quantity|int|100;480000;kg", "landedUnitCost|Landed Unit Cost|float|0.4;56;USD;3", "stockValue|Stock Value Posted|money|2000;720000", "valuationMethod|Valuation|enum|Weighted average;FIFO;Standard cost;Specific identification", "postedOn|Posted On|date|-300;10", "glAccount|GL Account|enum|Raw material;Chemicals;Packaging;Spares;Capital goods;Goods in transit", "date|Effective Date|date|-300;10"],
    statuses: ["Posted", "Pending Posting", "Provisional", "Reversed", "Under Review"],
    measure: "stockValue", rows: 60,
  },

  /* ── 113 ───────────────────────────────────────────────────────────── */
  "batch-receiving": {
    name: "Batch Receiving Management", kind: "list", summary: "Batch numbers captured at receipt",
    entity: "Batch Receipt", ref: "BTR",
    fields: ["batchNo|Batch No|enum|BT-26-4471;BT-26-4488;BT-26-4502;BT-26-4517;BT-26-4533;BT-26-4549", "grnNo|GRN|enum|GRN-26-0411;GRN-26-0428;GRN-26-0452;GRN-26-0477", MATERIAL, SUPPLIER, "qty|Batch Quantity|int|100;180000;kg", "manufactureDate|Manufactured|date|-500;-10", "expiryDate|Expires On|date|-30;720", "certificateHeld|Mill / Analysis Certificate|bool|On file;Not received", "date|Received On|date|-300;10"],
    statuses: ["Accepted", "Under Test", "Quarantined", "Expiring", "Rejected"],
    measure: "qty", rows: 60,
  },

  /* ── 114 ───────────────────────────────────────────────────────────── */
  "lot-receiving": {
    name: "Lot Receiving Management", kind: "list", summary: "Lot-wise split of a received consignment",
    entity: "Lot Receipt", ref: "LTR",
    fields: ["lotNo|Lot No|enum|LT-26-8841;LT-26-8858;LT-26-8872;LT-26-8890;LT-26-8914;LT-26-8938", "batchNo|Batch|enum|BT-26-4471;BT-26-4488;BT-26-4502;BT-26-4517", MATERIAL, "lotQty|Lot Quantity|int|50;98000;kg", "packages|Packages|int|1;480;pkgs", "binLocation|Bin|enum|A-01-04;A-02-11;B-03-07;C-01-02;BOND-04-01", "gradeResult|Grade|enum|Grade A;Grade B;Grade C;Off-grade;Awaiting grading", "date|Received On|date|-300;10"],
    statuses: ["Available", "Reserved", "Under Test", "Quarantined", "Consumed"],
    measure: "lotQty", rows: 60,
  },

  /* ── 115 ───────────────────────────────────────────────────────────── */
  "serial-number-receiving": {
    name: "Serial Number Receiving", kind: "list", summary: "Serialised machinery, tooling and spares",
    entity: "Serial Item", ref: "SRN",
    fields: ["serialNo|Serial No|enum|SN-441782;SN-771204;SN-334877;SN-992166;SN-558021;SN-664092", ITEM, SUPPLIER, "grnNo|GRN|enum|GRN-26-0411;GRN-26-0428;GRN-26-0452;GRN-26-0477", "assetTag|Asset Tag|enum|AST-26-0104;AST-26-0118;AST-26-0132;AST-26-0147;Not tagged", "warrantyMonths|Warranty|int|0;60;months", "warrantyTill|Warranty Till|date|-60;900", "value|Item Value|money|200;180000", "installedAt|Installed At|enum|Press shop;Plating line;Tool room;Packing hall;Laboratory;Utility;Store", "date|Received On|date|-500;10"],
    statuses: ["Received", "Tagged", "Installed", "In Warranty", "Warranty Expired"],
    measure: "value", rows: 56,
  },

  /* ── 116 ───────────────────────────────────────────────────────────── */
  "quality-inspection-integration": {
    name: "Quality Inspection Integration", kind: "list", summary: "Incoming inspection results against imports",
    entity: "Inspection", ref: "QII",
    fields: ["grnNo|GRN|enum|GRN-26-0411;GRN-26-0428;GRN-26-0452;GRN-26-0477;GRN-26-0490", MATERIAL, SUPPLIER, "inspectionType|Inspection|enum|Visual;Dimensional;Chemical composition;Coating thickness;Nickel release;Mechanical test;Documentation", "sampleSize|Sample Size|int|1;480;pcs", "passedQty|Passed|int|0;480000;kg", "rejectedQty|Rejected|int|0;68000;kg", "rejectionPct|Rejection|pct|0;24", "inspector|Inspector|person", "date|Inspected On|date|-300;10"],
    statuses: ["Passed", "Passed with Deviation", "Under Test", "Quarantined", "Rejected"],
    measure: "rejectedQty", rows: 62,
    insight: "Rejections at incoming inspection cluster on two suppliers and one material — coating thickness on imported strip, which is a supplier process problem, not a transit problem.",
  },

  /* ── 117 ───────────────────────────────────────────────────────────── */
  "import-payment": {
    name: "Import Payment Management", kind: "list", summary: "Everything paid out against imports",
    entity: "Payment", ref: "IPM",
    fields: ["paymentNo|Payment No|code|IPM", SUPPLIER, BANK, "paymentMode|Mode|enum|LC settlement;TT;Advance;Acceptance maturity;UPAS settlement;Open account", "amount|Amount|money|500;780000", CURRENCY, "localAmount|Local Amount|money|60000;88000000", "againstDocument|Against|enum|Import LC;Proforma invoice;Commercial invoice;Contract;Expense bill", "valueDate|Value Date|date|-300;20", OFFICER, "date|Initiated On|date|-300;10"],
    statuses: ["Paid", "Pending Bank", "Under Approval", "Returned", "Cancelled"],
    measure: "amount", rows: 64,
  },

  /* ── 118 ───────────────────────────────────────────────────────────── */
  "bank-settlement": {
    name: "Bank Settlement Management", kind: "list", summary: "Bank advices reconciled against our records",
    entity: "Settlement", ref: "BST",
    fields: [BANK, LC_REF, "adviceNo|Bank Advice|enum|ADV-4471820;ADV-7712045;ADV-3348771;ADV-9921663;ADV-5580214", "settledAmount|Settled Amount|money|500;780000", "bankCharges|Bank Charges|money|20;18000", "exchangeRate|Exchange Rate|float|0.8;145;BDT;4", "ourRecord|Our Record|money|500;780000", "difference|Difference|money|0;28000", "reconciledBy|Reconciled By|person", "date|Settled On|date|-300;10"],
    statuses: ["Reconciled", "Pending Reconciliation", "Difference Found", "Under Query", "Written Off"],
    measure: "settledAmount", rows: 60,
  },

  /* ── 119 ───────────────────────────────────────────────────────────── */
  "foreign-currency": {
    name: "Foreign Currency Management", kind: "analytics", summary: "Currency exposure across the import book",
    entity: "Currency Position", ref: "FCY",
    fields: [CURRENCY, PERIOD, "payableAmount|Payable|money|10000;3200000", "hedgedAmount|Hedged|money|0;2400000", "unhedgedAmount|Unhedged Exposure|money|0;2400000", "hedgedPct|Hedged|pct|0;100", "avgRate|Average Rate|float|0.8;145;BDT;4", "spotRate|Spot Rate|float|0.8;150;BDT;4", "revaluationGain|Revaluation Gain / Loss|money|0;180000", "date|Position Date|date|-330;0"],
    statuses: ["Hedged", "Partially Hedged", "Unhedged", "Under Review", "Closed"],
    measure: "payableAmount", rows: 54,
    insight: "USD is 78% of the payable book and largely hedged; the unhedged tail is EUR and JPY, where a two-percent move is worth more than the whole freight budget.",
  },

  /* ── 120 ───────────────────────────────────────────────────────────── */
  "exchange-rate": {
    name: "Exchange Rate Management", kind: "list", summary: "Rates applied to every import transaction",
    entity: "Rate Entry", ref: "FXR",
    fields: [CURRENCY, "rateType|Rate Type|enum|Customs assessment;Bank selling;Bank buying;Contract rate;Booked forward;Month-end revaluation", "rate|Rate|float|0.8;150;BDT;4", "source|Source|enum|Bangladesh Bank;Dealing bank;Customs schedule;Forward contract;Manual entry", "effectiveFrom|Effective From|date|-330;10", "effectiveTill|Effective Till|date|-300;40", "appliedTo|Applied To|int|1;120;transactions", "date|Recorded On|date|-330;0"],
    statuses: ["Current", "Superseded", "Draft", "Overridden"],
    measure: "rate", rows: 62,
    settings: ["Pull the customs assessment rate automatically before each BOE is filed", "Revalue open foreign currency payables at every month end"],
  },
  /* ── 121 ───────────────────────────────────────────────────────────── */
  "swift-payment": {
    name: "SWIFT Payment Management", kind: "list", summary: "MT messages behind each remittance",
    entity: "SWIFT Message", ref: "SWF",
    fields: ["swiftRef|SWIFT Reference|code|SWF", "messageType|Message Type|enum|MT103 - Customer transfer;MT202 - Bank transfer;MT700 - LC issue;MT707 - LC amendment;MT710 - LC advice;MT799 - Free format", BANK, "correspondentBank|Correspondent|enum|Citibank NA;Deutsche Bank AG;Standard Chartered NY;HSBC Hong Kong;Bank of China", "beneficiary|Beneficiary|enum|@suppliers", "amount|Amount|money|500;780000", CURRENCY, "chargeBearer|Charges|enum|OUR;BEN;SHA", "ackReceived|Acknowledgement|bool|Received;Awaited", "date|Sent On|date|-300;10"],
    statuses: ["Acknowledged", "Sent", "Pending Release", "Returned", "Cancelled"],
    measure: "amount", rows: 58,
  },

  /* ── 122 ───────────────────────────────────────────────────────────── */
  "commercial-approval-workflow": {
    name: "Commercial Approval Workflow", kind: "board", summary: "Every commercial decision waiting on someone",
    entity: "Approval", ref: "CAW",
    fields: ["requestType|Request|enum|Indent approval;PI approval;LC opening;LC amendment;Payment release;Budget override;Supplier onboarding;Contract signing", "reference|Reference|enum|IND-26-0411;IPI-26-2041;ILC-26-4411;IPM-26-0304;SCT-26-0203", "value|Value|money|500;1800000", "requestedBy|Requested By|person", "approver|Current Approver|person", "level|Level|enum|Level 1;Level 2;Level 3;Level 4;Final", "slaHours|SLA|int|4;96;hours", "ageHours|Age|int|0;240;hours", "date|Raised On|date|-300;0"],
    statuses: ["Approved", "Awaiting Approval", "In Review", "Returned", "Rejected"],
    measure: "value", rows: 64,
    insight: "Requests that pass level two clear within a day; the queue builds almost entirely at level one, where a single approver holds sixty per cent of the open items.",
  },

  /* ── 123 ───────────────────────────────────────────────────────────── */
  "multi-level-approval": {
    name: "Multi-Level Approval Workflow", kind: "board", summary: "Authority matrix by value and document type",
    entity: "Approval Rule", ref: "MLA",
    fields: ["documentType|Document|enum|Indent;Proforma invoice;LC opening;LC amendment;Payment;Contract;Budget override;Supplier onboarding", "valueFrom|Value From|money|0;480000", "valueTo|Value To|money|10000;3200000", "level1|Level 1|person", "level2|Level 2|person", "level3|Level 3|person", "levelsRequired|Levels Required|int|1;5", "escalationHours|Escalate After|int|4;120;hours", "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Under Review", "Suspended", "Retired"],
    measure: "valueTo", rows: 46,
    settings: ["Escalate to the next level automatically when an approval breaches its SLA", "Require two approvers for any request above the board-sanctioned threshold"],
  },

  /* ── 124 ───────────────────────────────────────────────────────────── */
  "digital-signature": {
    name: "Digital Signature Management", kind: "list", summary: "Signed documents and their certificates",
    entity: "Signature", ref: "DSG",
    fields: ["documentRef|Document|enum|ICT-26-0411;ILC-26-4411;IPI-26-2041;AGR-26-0104;NDA-26-0088", "documentType|Document Type|enum|Contract;LC application;PI acceptance;Agreement;NDA;Bank instruction", "signatory|Signatory|person", "certificateAuthority|Certificate Authority|enum|Bangladesh CCA;DigiCert;GlobalSign;Entrust;Bank-issued token", "certificateExpiry|Certificate Expires|date|-60;720", "signedHash|Signature Hash|enum|a41f8c;7b0d92;c53e17;e2a4b8;9f61d0;3d7c44", "verified|Verified|bool|Verified;Not verified", "date|Signed On|date|-500;0"],
    statuses: ["Valid", "Pending Signature", "Certificate Expiring", "Invalid", "Revoked"],
    rows: 54,
  },

  /* ── 125 ───────────────────────────────────────────────────────────── */
  "commercial-notification-center": {
    name: "Commercial Notification Center", kind: "list", summary: "Every alert the commercial desk receives",
    entity: "Notification", ref: "NTF",
    fields: ["alertType|Alert|enum|LC expiring;Shipment delayed;Document discrepancy;Duty payment due;Demurrage risk;Budget breach;Contract renewal;Supplier certificate expiring", "reference|Reference|enum|ILC-26-4411;IMP-26-1041;BOE-26-77121;SCT-26-0203;BLC-26-0104", "severity|Severity|enum|Critical;High;Medium;Low;Information", "channel|Channel|enum|In-app;Email;SMS;Mobile push;All channels", "recipient|Recipient|person", "valueAtRisk|Value at Risk|money|0;780000", "acknowledged|Acknowledged|bool|Acknowledged;Unread", "date|Raised On|date|-120;0"],
    statuses: ["Actioned", "Acknowledged", "Unread", "Escalated", "Expired"],
    measure: "valueAtRisk", rows: 66,
  },

  /* ── 126 ───────────────────────────────────────────────────────────── */
  "commercial-task": {
    name: "Commercial Task Management", kind: "board", summary: "Who owes what, and by when",
    entity: "Task", ref: "TSK",
    fields: ["task|Task|enum|Open LC;Collect original documents;File BOE;Pay duty;Arrange transport;Verify GRN;Chase supplier;Reconcile bank advice;Renew licence", "reference|Reference|enum|IMP-26-1041;ILC-26-4411;BOE-26-77121;GRN-26-0411;BLC-26-0104", "assignee|Assignee|person", "priority|Priority|enum|Critical;High;Normal;Low", "dueDate|Due Date|date|-30;45", "ageDays|Age|int|0;60;days", "valueLinked|Linked Value|money|0;780000", "date|Created On|date|-200;0"],
    statuses: ["Completed", "In Progress", "Not Started", "Overdue", "Blocked"],
    measure: "valueLinked", rows: 64,
  },

  /* ── 127 ───────────────────────────────────────────────────────────── */
  "reminder-management": {
    name: "Reminder Management", kind: "calendar", summary: "Scheduled nudges before a date bites",
    entity: "Reminder", ref: "RMD",
    fields: ["reminderFor|Reminder For|enum|LC expiry;Shipment cut-off;Document presentation;Duty payment;Free time expiry;Contract renewal;Licence renewal;Advance adjustment", "reference|Reference|enum|ILC-26-4411;IMP-26-1041;BOE-26-77121;SCT-26-0203;BLC-26-0104", "leadDays|Lead Time|int|1;90;days", "repeatRule|Repeat|enum|Once;Daily until done;Every 3 days;Weekly;Escalating", "recipient|Recipient|person", "channel|Channel|enum|In-app;Email;SMS;Mobile push", "date|Reminder Date|date|-30;90"],
    statuses: ["Scheduled", "Sent", "Acknowledged", "Snoozed", "Cancelled"],
    rows: 60,
    settings: ["Send LC expiry reminders at 30, 15 and 5 days before the date", "Escalate to the department head when a reminder is snoozed twice"],
  },

  /* ── 128 ───────────────────────────────────────────────────────────── */
  "compliance-management": {
    name: "Compliance Management", kind: "list", summary: "The commercial compliance register",
    entity: "Compliance Obligation", ref: "CMP",
    fields: ["obligation|Obligation|enum|Import policy order;Foreign exchange regulation;Customs act;VAT & SD act;Bond rules;Money laundering prevention;Sanctions screening;Environmental clearance", "frequency|Frequency|enum|Per consignment;Monthly;Quarterly;Annual;On event", "owner|Owner|person", "lastChecked|Last Checked|date|-330;0", "nextDue|Next Due|date|-30;330", "evidenceHeld|Evidence|bool|On file;Missing", "penaltyExposure|Penalty Exposure|money|0;480000", "date|Assessed On|date|-330;0"],
    statuses: ["Compliant", "Due", "Overdue", "Non-Compliant", "Waived"],
    measure: "penaltyExposure", rows: 58,
  },

  /* ── 129 ───────────────────────────────────────────────────────────── */
  "commercial-audit": {
    name: "Commercial Audit Management", kind: "list", summary: "Internal, external and customs audits",
    entity: "Audit", ref: "AUD",
    fields: ["auditType|Audit Type|enum|Internal audit;External audit;Customs bond audit;Bank inspection;Supplier audit;Statutory audit", "scope|Scope|enum|LC operations;Landed costing;Bond register;Supplier payments;Document control;Duty & tax;Full commercial", "auditor|Lead Auditor|person", "findingsRaised|Findings Raised|int|0;24", "findingsClosed|Findings Closed|int|0;24", "highRiskFindings|High Risk|int|0;10", "exposureValue|Exposure Identified|money|0;680000", "closureDue|Closure Due|date|-30;220", "date|Audit Date|date|-500;0"],
    statuses: ["Closed", "Findings Open", "In Progress", "Overdue", "Planned"],
    measure: "exposureValue", rows: 52,
  },

  /* ── 130 ───────────────────────────────────────────────────────────── */
  "audit-trail": {
    name: "Audit Trail Management", kind: "list", summary: "Every change on every commercial record",
    entity: "Audit Entry", ref: "ATR",
    fields: ["recordType|Record|enum|Indent;Proforma invoice;LC;Contract;Payment;BOE;GRN;Supplier;Budget", "reference|Reference|enum|IND-26-0411;IPI-26-2041;ILC-26-4411;IPM-26-0304;BOE-26-77121", "action|Action|enum|Created;Updated;Approved;Rejected;Deleted;Exported;Reopened;Amended", "fieldChanged|Field Changed|text|Unit price;Quantity;Delivery date;Approval status;Bank details;Incoterm;Supplier;Budget head", "changedBy|Changed By|person", "valueImpact|Value Impact|money|0;680000", "ipRecorded|Source|enum|Web app;Mobile app;API;Bulk import;System job", "date|Changed On|date|-330;0"],
    statuses: ["Recorded", "Reviewed", "Flagged", "Investigated"],
    measure: "valueImpact", rows: 68,
  },

  /* ── 131 ───────────────────────────────────────────────────────────── */
  "exception-management": {
    name: "Exception Management", kind: "board", summary: "What broke, who owns it, what it costs",
    entity: "Exception", ref: "EXC",
    fields: ["exceptionType|Exception|enum|Shipment delay;Short shipment;Quality rejection;Document discrepancy;Duty dispute;Demurrage incurred;Budget breach;Payment failure;Supplier default", "reference|Reference|enum|IMP-26-1041;ILC-26-4411;GRN-26-0411;BOE-26-77121", "severity|Severity|enum|Critical;High;Medium;Low", "financialImpact|Financial Impact|money|0;480000", "owner|Owner|person", "rootCause|Root Cause|enum|Supplier;Carrier;Customs;Bank;Internal process;Regulatory;Force majeure", "ageDays|Age|int|0;90;days", "date|Raised On|date|-300;0"],
    statuses: ["Resolved", "Under Investigation", "Open", "Escalated", "Accepted"],
    measure: "financialImpact", rows: 62,
    insight: "Internal process is the root cause on 41% of exceptions by count but only 18% by value — the expensive ones come from suppliers and carriers, the frequent ones from us.",
  },

  /* ── 132 ───────────────────────────────────────────────────────────── */
  "commercial-reports": {
    name: "Commercial Reports", kind: "list", summary: "The standard report pack and who receives it",
    entity: "Report", ref: "RPT",
    fields: ["reportName|Report|enum|Import register;LC position;Landed cost summary;Duty & tax register;Supplier performance;Shipment status;Budget utilisation;Bond register;Exception summary", "frequency|Frequency|enum|Daily;Weekly;Fortnightly;Monthly;Quarterly;On demand", "format|Format|enum|PDF;Excel;CSV;Dashboard link;Email digest", "recipients|Recipients|int|1;24", "lastRun|Last Run|date|-60;0", "runtimeSeconds|Runtime|int|1;180;sec", "owner|Report Owner|person", "date|Next Run|date|-5;35"],
    statuses: ["Scheduled", "Published", "Failed", "Paused", "Draft"],
    measure: "recipients", rows: 54,
  },

  /* ── 133 ───────────────────────────────────────────────────────────── */
  "financial-reports": {
    name: "Financial Reports", kind: "analytics", summary: "Import spend, liability and cost of finance",
    entity: "Financial Line", ref: "FRP",
    fields: [PERIOD, "head|Head|enum|Import spend;LC liability;Advance outstanding;Duty & tax;Bank charges;Finance cost;Forex gain / loss;Goods in transit", "amount|Amount|money|1000;3200000", "budgetAmount|Budget|money|1000;3200000", "variance|Variance|money|0;680000", "variancePct|Variance|pct|0;48", CURRENCY, "date|Period End|date|-330;0"],
    statuses: ["Within Budget", "Over Budget", "Under Budget", "Under Review", "Closed"],
    measure: "amount", rows: 58,
  },

  /* ── 134 ───────────────────────────────────────────────────────────── */
  "shipment-reports": {
    name: "Shipment Reports", kind: "analytics", summary: "Volume, transit and reliability by lane",
    entity: "Shipment Metric", ref: "SRP",
    fields: [PERIOD, ORIGIN, CARRIER, "shipments|Shipments|int|1;80", "containers|Containers|int|1;180", "volume|Volume|int|2000;480000;kg", "value|Value|money|20000;2400000", "avgTransitDays|Avg Transit|int|8;45;days", "onTimePct|On-Time|pct|38;100", "date|Period End|date|-330;0"],
    statuses: ["On Target", "Below Target", "Improving", "Deteriorating"],
    measure: "value", rows: 58,
  },

  /* ── 135 ───────────────────────────────────────────────────────────── */
  "supplier-reports": {
    name: "Supplier Reports", kind: "analytics", summary: "Spend, performance and concentration",
    entity: "Supplier Metric", ref: "SUR",
    fields: [SUPPLIER, ORIGIN, PERIOD, "spend|Spend|money|4000;2400000", "spendShare|Share of Spend|pct|0.5;42", "shipments|Shipments|int|1;60", "otifPct|OTIF|pct|38;100", "rejectionPct|Rejection|pct|0;18", "openExposure|Open Exposure|money|0;1400000", "date|Period End|date|-330;0"],
    statuses: ["Strategic", "Preferred", "Standard", "Under Review", "Exit Planned"],
    measure: "spend", rows: 56,
    insight: "The top five suppliers hold 68% of spend. Concentration is efficient until one of them slips — two of the five have OTIF below 80%.",
  },

  /* ── 136 ───────────────────────────────────────────────────────────── */
  "customs-reports": {
    name: "Customs Reports", kind: "analytics", summary: "Clearance performance and customs exposure",
    entity: "Customs Metric", ref: "CRP",
    fields: [PERIOD, DISCHARGE_PORT, CNF_AGENT, "boeFiled|BOEs Filed|int|1;120", "avgClearanceDays|Avg Clearance|int|1;22;days", "greenChannelPct|Green Channel|pct|10;96", "queriesRaised|Queries Raised|int|0;40", "penaltyPaid|Penalty Paid|money|0;180000", "declaredValue|Declared Value|money|20000;2400000", "date|Period End|date|-330;0"],
    statuses: ["On Target", "Below Target", "Improving", "Deteriorating"],
    measure: "declaredValue", rows: 54,
  },

  /* ── 137 ───────────────────────────────────────────────────────────── */
  "duty-reports": {
    name: "Duty Reports", kind: "analytics", summary: "Duty paid, saved and recoverable",
    entity: "Duty Metric", ref: "DRP",
    fields: [PERIOD, HS_CODE, MATERIAL, "assessedValue|Assessed Value|money|10000;2400000", "dutyPaid|Duty Paid|money|400;620000", "effectiveRate|Effective Rate|pct|2;68", "exemptionSaving|Exemption Saving|money|0;280000", "rebateRecoverable|Rebate Recoverable|money|0;180000", "rebateAvailed|Rebate Availed|money|0;180000", "date|Period End|date|-330;0"],
    statuses: ["Fully Recovered", "Partially Recovered", "Not Recovered", "Under Claim", "Not Recoverable"],
    measure: "dutyPaid", rows: 58,
  },

  /* ── 138 ───────────────────────────────────────────────────────────── */
  "kpi-reports": {
    name: "KPI Reports", kind: "analytics", summary: "The published commercial KPI pack",
    entity: "KPI Report Line", ref: "KRP",
    fields: ["kpi|KPI|enum|LC opening lead time;Clearance days;Landed cost accuracy;On-time arrival;Demurrage per shipment;Discrepancy rate;Supplier OTIF;Budget utilisation;Duty saving", PERIOD, "target|Target|float|1;98;;1", "actual|Actual|float|1;99;;1", "priorPeriod|Prior Period|float|1;99;;1", "attainment|Attainment|pct|38;128", "trendNote|Trend|enum|Improving;Flat;Deteriorating;Volatile", "owner|Owner|person", "date|Published On|date|-330;0"],
    statuses: ["Achieved", "On Track", "Behind", "Missed", "Draft"],
    measure: "attainment", rows: 60,
  },

  /* ── 139 ───────────────────────────────────────────────────────────── */
  "executive-analytics": {
    name: "Executive Analytics", kind: "analytics", summary: "The board view of the import book",
    entity: "Executive Metric", ref: "EAN",
    fields: [PERIOD, "dimension|Dimension|enum|By origin;By supplier;By material;By currency;By bank;By incoterm;By port", "importValue|Import Value|money|20000;3200000", "share|Share|pct|1;48", "yoyChange|YoY Change|pct|60;180", "landedCostIndex|Landed Cost Index|float|82;138;;1", "exposure|Open Exposure|money|0;2400000", "riskScore|Risk Score|pct|4;96", "date|Period End|date|-360;0"],
    statuses: ["Healthy", "Watch", "At Risk", "Escalated"],
    measure: "importValue", rows: 60,
  },

  /* ── 140 ───────────────────────────────────────────────────────────── */
  "business-intelligence": {
    name: "Business Intelligence Dashboard", kind: "analytics", summary: "Cross-module analysis of the import chain",
    entity: "BI Measure", ref: "BID",
    fields: ["measure|Measure|enum|Import value;Landed cost per kg;Cash conversion days;LC utilisation;Duty incidence;Transit reliability;Supplier concentration;Exception cost", "dimension|Sliced By|enum|Origin;Supplier;Material;Period;Bank;Port;Carrier", PERIOD, "value|Value|money|1000;3200000", "changePct|Change|pct|60;180", "correlatedWith|Correlates With|enum|Production output;Sales order book;Freight index;Metal price;Exchange rate;Port congestion", "confidence|Model Confidence|pct|42;99", "date|Period End|date|-360;0"],
    statuses: ["Published", "Refreshing", "Stale", "Draft"],
    measure: "value", rows: 62,
  },

  /* ── 141 ───────────────────────────────────────────────────────────── */
  "ai-import-assistant": {
    name: "AI Import Assistant", kind: "overview", summary: "Ask anything about the import book",
    entity: "Assistant Session", ref: "AIA",
    fields: ["question|Question|text|Which LCs expire this month;What is the landed cost of brass strip;Why did IMP-26-1041 slip;Which supplier is cheapest after duty;How much duty can we still recover;Where is my chemical consignment", "intent|Intent|enum|Status lookup;Cost analysis;Risk check;Compliance check;Forecast;Document search;Recommendation", "recordsScanned|Records Scanned|int|20;48000", "answerConfidence|Answer Confidence|pct|42;99.5", "actionTaken|Action Taken|enum|Answer only;Report generated;Task created;Alert raised;Escalated;No action", "responseSeconds|Response Time|float|0.4;12;sec;1", "askedBy|Asked By|person", "date|Asked On|date|-120;0"],
    statuses: ["Answered", "Answered with Caveat", "Clarification Needed", "Escalated", "Failed"],
    measure: "recordsScanned", rows: 58,
    insight: "Status lookups make up two-thirds of questions and answer in under two seconds — the slow queries are cost analyses, which read the whole landed cost history.",
  },

  /* ── 142 ───────────────────────────────────────────────────────────── */
  "ai-document-intelligence": {
    name: "AI Document Intelligence", kind: "list", summary: "Documents read, classified and cross-checked",
    entity: "Document Read", ref: "ADI",
    fields: ["fileName|Source File|text|BL-MSKU4471820.pdf;CI-supplier-4471.pdf;PackingList-scan.jpg;LC-ILC-26-4411.pdf;COO-7741.pdf;MSDS-plating.pdf", "detectedType|Detected Type|enum|Commercial invoice;Packing list;Bill of lading;Certificate of origin;LC;Insurance certificate;MSDS;Unknown", "pages|Pages|int|1;60;pages", "fieldsExtracted|Fields Extracted|int|6;180;fields", "confidence|Confidence|pct|42;99.5", "crossCheckResult|Cross-Check|enum|Matches LC;Matches contract;Mismatch found;Nothing to check against", "discrepancies|Discrepancies|int|0;12", "date|Processed On|date|-300;0"],
    statuses: ["Verified", "Extracted", "Processing", "Review Needed", "Failed"],
    measure: "fieldsExtracted", rows: 62,
    settings: ["Cross-check every extracted invoice against the LC terms automatically", "Route any document below 90% confidence to manual verification"],
  },

  /* ── 143 ───────────────────────────────────────────────────────────── */
  "ai-ocr-extraction": {
    name: "AI OCR & Data Extraction", kind: "form", summary: "Scans and photographs turned into fields",
    entity: "OCR Job", ref: "OCR",
    fields: ["fileName|Source File|text|Scanned-BL-4471.jpg;Fax-invoice-882.pdf;Photo-packinglist.jpg;Stamped-COO.png;Handwritten-note.jpg", "sourceQuality|Source Quality|enum|Clean digital;Good scan;Poor scan;Photograph;Handwritten;Faxed", "language|Language|enum|English;Chinese;Japanese;Korean;Mixed", "pages|Pages|int|1;40;pages", "charactersRead|Characters Read|int|200;98000", "ocrConfidence|OCR Confidence|pct|38;99.5", "manualCorrections|Manual Corrections|int|0;48", "processingSeconds|Processing Time|float|0.5;90;sec;1", "date|Processed On|date|-300;0"],
    statuses: ["Extracted", "Processing", "Correction Needed", "Low Confidence", "Failed"],
    measure: "charactersRead", rows: 56,
  },

  /* ── 144 ───────────────────────────────────────────────────────────── */
  "ai-pi-reader": {
    name: "AI PI Reader", kind: "form", summary: "Supplier PI read straight into an indent line",
    entity: "PI Read", ref: "APR",
    fields: ["fileName|PI File|text|PI-Zhejiang-4471.pdf;PI-Guangzhou-8802.xlsx;PI-Nippon-scan.jpg;PI-Korea-2240.pdf", SUPPLIER, "itemsDetected|Items Detected|int|1;48", "qtyDetected|Quantity Detected|int|100;480000;kg", "valueDetected|Value Detected|money|2000;620000", CURRENCY, "termsDetected|Terms Detected|enum|Incoterm and payment;Incoterm only;Payment only;None detected", "priceVsLast|Price vs Last PI|pct|0;32", "confidence|Confidence|pct|42;99.5", "date|Read On|date|-300;0"],
    statuses: ["Indent Created", "Extracted", "Review Needed", "Price Alert", "Failed"],
    measure: "valueDetected", rows: 56,
    insight: "The reader flags a price move against the last PI on the same item before anyone opens the file — that check alone catches most silent increases.",
  },

  /* ── 145 ───────────────────────────────────────────────────────────── */
  "ai-lc-reader": {
    name: "AI LC Reader", kind: "form", summary: "LC text parsed into terms and deadlines",
    entity: "LC Read", ref: "ALR",
    fields: ["fileName|LC File|text|MT700-ILC-26-4411.txt;LC-advice-4428.pdf;LC-amendment-A2.pdf;SBLC-issue.pdf", LC_REF, BANK, "lcValueDetected|Value Detected|money|8000;1800000", "expiryDetected|Expiry Detected|date|-20;180", "latestShipmentDetected|Latest Shipment|date|-40;150", "documentsRequired|Documents Required|int|3;14", "unusualClauses|Unusual Clauses Flagged|int|0;8", "confidence|Confidence|pct|42;99.5", "date|Read On|date|-300;0"],
    statuses: ["Parsed", "Terms Confirmed", "Clause Flagged", "Review Needed", "Failed"],
    measure: "lcValueDetected", rows: 54,
    settings: ["Create calendar reminders automatically from every parsed LC deadline", "Flag any clause that differs from the standard document set for review"],
  },

  /* ── 146 ───────────────────────────────────────────────────────────── */
  "ai-invoice-reader": {
    name: "AI Invoice Reader", kind: "form", summary: "Supplier and agent invoices read and matched",
    entity: "Invoice Read", ref: "AIR",
    fields: ["fileName|Invoice File|text|CI-supplier-4471.pdf;Freight-invoice-DHL.pdf;CF-bill-Prime.pdf;Port-bill-77121.pdf;Bank-charge-advice.pdf", "invoiceType|Invoice Type|enum|Supplier commercial;Freight;Clearing;Port;Bank charges;Insurance", "amountDetected|Amount Detected|money|20;780000", CURRENCY, "matchedTo|Matched To|enum|Purchase order;LC;Cost sheet;Expense head;Not matched", "matchVariance|Match Variance|money|0;68000", "duplicateSuspected|Duplicate Suspected|bool|Yes;No", "confidence|Confidence|pct|42;99.5", "date|Read On|date|-300;0"],
    statuses: ["Matched", "Extracted", "Variance Found", "Duplicate Flagged", "Failed"],
    measure: "amountDetected", rows: 60,
  },

  /* ── 147 ───────────────────────────────────────────────────────────── */
  "ai-shipment-tracking": {
    name: "AI Shipment Tracking", kind: "analytics", summary: "Carrier feeds stitched into one position",
    entity: "AI Track", ref: "AST",
    fields: [SHIPMENT_REF, CONTAINER_NO, CARRIER, "sourcesUsed|Feeds Used|enum|Carrier API;Port community system;AIS vessel feed;Forwarder portal;Email parsing;All sources", "lastEventDetected|Last Event|enum|Gated in;Loaded;Departed;Transhipped;Arrived;Discharged;Gated out", "positionConfidence|Position Confidence|pct|42;99.5", "staleHours|Feed Age|int|0;120;hours", "anomalyDetected|Anomaly|enum|None;Unexpected transhipment;Route deviation;Long dwell;Silent feed", "date|Last Update|date|-40;0"],
    statuses: ["Tracking", "Stale Feed", "Anomaly Detected", "Arrived", "Lost Signal"],
    measure: "positionConfidence", rows: 60,
  },

  /* ── 148 ───────────────────────────────────────────────────────────── */
  "ai-eta-prediction": {
    name: "AI ETA Prediction", kind: "analytics", summary: "Predicted arrival against the carrier's date",
    entity: "ETA Prediction", ref: "AEP",
    fields: [SHIPMENT_REF, VESSEL, DISCHARGE_PORT, "carrierEta|Carrier ETA|date|-15;65", "predictedEta|Predicted ETA|date|-15;75", "deltaDays|Predicted Slip|int|0;18;days", "confidence|Confidence|pct|42;99", "driver|Main Driver|enum|Port congestion;Weather;Transhipment wait;Vessel schedule history;Customs backlog;Carrier reliability", "accuracyLastRun|Accuracy Last Run|pct|48;99", "date|Predicted On|date|-60;0"],
    statuses: ["On Schedule", "Slip Predicted", "High Risk", "Arrived", "Model Uncertain"],
    measure: "deltaDays", rows: 60,
    insight: "The model beats the carrier ETA by roughly two days of accuracy on the Far East lane, mostly by pricing in transhipment wait at Singapore that the carrier schedule ignores.",
  },

  /* ── 149 ───────────────────────────────────────────────────────────── */
  "ai-delay-prediction": {
    name: "AI Delay Prediction", kind: "analytics", summary: "Which consignment is about to slip, and why",
    entity: "Delay Prediction", ref: "ADP",
    fields: [SHIPMENT_REF, SUPPLIER, MATERIAL, "delayRisk|Delay Risk|pct|2;98", "predictedDelayDays|Predicted Delay|int|0;30;days", "primaryRisk|Primary Risk|enum|Supplier production;Cargo readiness;Vessel roll-over;Port congestion;Customs query;Document delay;Payment delay", "productionImpact|Production Impact|enum|None;Buffer absorbs;Plan reshuffle;Line stoppage risk", "valueAtRisk|Value at Risk|money|0;780000", "recommendedAction|Recommended Action|text|Expedite documents;Book alternate vessel;Split shipment;Air freight balance;Advance duty payment;Escalate to supplier", "date|Predicted On|date|-60;0"],
    statuses: ["Low Risk", "Watch", "High Risk", "Delay Confirmed", "Mitigated"],
    measure: "valueAtRisk", rows: 62,
  },

  /* ── 150 ───────────────────────────────────────────────────────────── */
  "ai-risk-analysis": {
    name: "AI Risk Analysis", kind: "analytics", summary: "Supplier, country, currency and credit risk scored",
    entity: "Risk Assessment", ref: "ARK",
    fields: ["riskType|Risk Type|enum|Supplier concentration;Country risk;Currency exposure;Credit risk;Compliance risk;Logistics risk;Price volatility", "subject|Subject|enum|@suppliers", ORIGIN, "riskScore|Risk Score|pct|4;98", "exposureValue|Exposure|money|0;2400000", "trend|Trend|enum|Rising;Stable;Falling;Volatile", "mitigation|Mitigation|text|Dual-source the material;Hedge the currency;Reduce advance exposure;Add alternate port;Tighten payment terms;Increase safety stock", "reviewDue|Review Due|date|-30;180", "date|Assessed On|date|-300;0"],
    statuses: ["Low", "Moderate", "High", "Critical", "Mitigated"],
    measure: "exposureValue", rows: 60,
  },

  /* ── 151 ───────────────────────────────────────────────────────────── */
  "ai-fraud-detection": {
    name: "AI Fraud Detection", kind: "list", summary: "Patterns that do not look right",
    entity: "Fraud Signal", ref: "AFD",
    fields: ["signalType|Signal|enum|Duplicate invoice;Altered bank details;Round-number pricing;Unusual supplier;Price far above market;Split payment to evade limit;Document tampering;Shell counterparty", "reference|Reference|enum|IPI-26-2041;IPM-26-0304;CEX-26-0117;ILC-26-4411", "subject|Subject|enum|@suppliers", "riskScore|Risk Score|pct|20;99.5", "valueInvolved|Value Involved|money|500;780000", "evidence|Evidence|text|Bank account changed 3 days before payment;Same invoice number seen twice;Price 41% above last six PIs;Counterparty registered last month;Signature differs from file", "investigator|Investigator|person", "date|Detected On|date|-300;0"],
    statuses: ["Confirmed", "Under Investigation", "Flagged", "False Positive", "Closed"],
    measure: "valueInvolved", rows: 56,
    settings: ["Hold any payment where the beneficiary bank detail changed within 14 days", "Route every confirmed signal to internal audit automatically"],
  },

  /* ── 152 ───────────────────────────────────────────────────────────── */
  "ai-cost-optimization": {
    name: "AI Cost Optimization", kind: "analytics", summary: "Where the landed cost can actually come down",
    entity: "Optimisation", ref: "ACO",
    fields: ["opportunity|Opportunity|enum|Consolidate part-loads;Switch carrier on lane;Renegotiate freight rate;Reclassify HS code;Claim available preference;Shift incoterm;Reduce demurrage;Change payment instrument", "subject|Applies To|enum|@suppliers", MATERIAL, "currentCost|Current Cost|money|1000;620000", "optimisedCost|Optimised Cost|money|800;580000", "savingValue|Saving|money|20;180000", "savingPct|Saving|pct|0.5;28", "effort|Implementation Effort|enum|Immediate;Low;Medium;High", "confidence|Confidence|pct|42;99", "date|Identified On|date|-300;0"],
    statuses: ["Realised", "Approved", "Proposed", "Under Review", "Rejected"],
    measure: "savingValue", rows: 60,
    insight: "Consolidating part-loads and reclaiming missed preferences together account for most of the identified saving, and both are immediate-effort items.",
  },

  /* ── 153 ───────────────────────────────────────────────────────────── */
  "ai-duty-estimation": {
    name: "AI Duty Estimation", kind: "analytics", summary: "Duty predicted before the BOE is filed",
    entity: "Duty Estimate", ref: "ADE",
    fields: [SHIPMENT_REF, HS_CODE, MATERIAL, "declaredValue|Declared Value|money|6000;680000", "estimatedDuty|Estimated Duty|money|400;420000", "actualDuty|Actual Duty|money|0;420000", "variance|Variance|money|0;68000", "variancePct|Variance|pct|0;32", "valuationRisk|Valuation Uplift Risk|pct|0;38", "confidence|Confidence|pct|42;99", "date|Estimated On|date|-300;0"],
    statuses: ["Accurate", "Within Tolerance", "Under Estimated", "Over Estimated", "Pending Actual"],
    measure: "estimatedDuty", rows: 58,
  },

  /* ── 154 ───────────────────────────────────────────────────────────── */
  "ai-compliance-monitoring": {
    name: "AI Compliance Monitoring", kind: "list", summary: "Continuous checks against rules and lists",
    entity: "Compliance Check", ref: "ACM",
    fields: ["checkType|Check|enum|Sanctions screening;Import policy conformity;HS classification consistency;Document completeness;Bond entitlement;Forex regulation;Licence validity", "subject|Subject|enum|@suppliers", "reference|Reference|enum|IMP-26-1041;ILC-26-4411;BOE-26-77121;BLC-26-0104", "result|Result|enum|Clear;Attention needed;Breach detected;Inconclusive", "riskScore|Risk Score|pct|2;98", "exposureValue|Exposure|money|0;680000", "checkedEvery|Frequency|enum|Real time;Daily;Weekly;Per transaction;Monthly", "date|Last Checked|date|-120;0"],
    statuses: ["Clear", "Attention Needed", "Breach Detected", "Under Review", "Resolved"],
    measure: "exposureValue", rows: 60,
  },

  /* ── 155 ───────────────────────────────────────────────────────────── */
  "ai-smart-alerts": {
    name: "AI Smart Alerts", kind: "list", summary: "Alerts raised on pattern, not just threshold",
    entity: "Smart Alert", ref: "ASA",
    fields: ["alert|Alert|text|LC will expire before cargo is ready;Free time expires in 48 hours;Supplier price moved outside normal range;Duty payment will miss the assessment window;Container dwelling longer than usual;Budget head will breach this month", "trigger|Trigger|enum|Pattern deviation;Predictive threshold;Correlation break;Anomaly score;Deadline projection", "severity|Severity|enum|Critical;High;Medium;Low", "reference|Reference|enum|ILC-26-4411;IMP-26-1041;BOE-26-77121;IBG-26-0104", "valueAtRisk|Value at Risk|money|0;780000", "leadTimeHours|Lead Time Given|int|2;720;hours", "actioned|Actioned|bool|Actioned;Not actioned", "date|Raised On|date|-120;0"],
    statuses: ["Actioned", "Acknowledged", "Open", "Escalated", "Expired"],
    measure: "valueAtRisk", rows: 62,
  },

  /* ── 156 ───────────────────────────────────────────────────────────── */
  "ai-smart-recommendations": {
    name: "AI Smart Recommendations", kind: "list", summary: "What the system suggests doing next",
    entity: "Recommendation", ref: "ASR",
    fields: ["recommendation|Recommendation|text|Open the LC this week to hold the shipment window;Split the consignment across two vessels;Switch to UPAS to release working capital;Reclassify under 8308.90 with a binding ruling;Dual-source the plating chemical;Pay duty in advance to release the container", "category|Category|enum|Cost;Cash flow;Risk;Compliance;Lead time;Supplier", "expectedBenefit|Expected Benefit|money|200;280000", "confidence|Confidence|pct|42;99", "effort|Effort|enum|Immediate;Low;Medium;High", "owner|Owner|person", "outcome|Outcome|enum|Benefit realised;Partially realised;Too early;No benefit;Not applicable", "date|Suggested On|date|-300;0"],
    statuses: ["Accepted", "Under Review", "Suggested", "Declined", "Realised"],
    measure: "expectedBenefit", rows: 60,
  },

  /* ── 157 ───────────────────────────────────────────────────────────── */
  "ai-commercial-copilot": {
    name: "AI Commercial Copilot", kind: "overview", summary: "The desk assistant that drafts and acts",
    entity: "Copilot Action", ref: "ACC",
    fields: ["request|Request|text|Draft the LC application for IND-26-0411;Summarise this month's import position;Compare three PIs for brass strip;Write the query response to customs;Build the landed cost sheet;Prepare the board slide on import risk", "capability|Capability|enum|Draft document;Summarise;Compare;Analyse;Create task;Raise alert;Answer question", "modulesTouched|Modules Touched|int|1;12", "recordsUsed|Records Used|int|10;48000", "outputType|Output|enum|Draft document;Summary;Comparison table;Report;Task list;Alert;Answer", "confidence|Confidence|pct|42;99.5", "humanEdits|Human Edits|int|0;40", "acceptedAsIs|Accepted As Is|bool|Accepted;Edited", "date|Requested On|date|-120;0"],
    statuses: ["Completed", "In Progress", "Needs Review", "Escalated", "Failed"],
    measure: "recordsUsed", rows: 60,
    insight: "Drafting is where the copilot earns its place — LC applications and customs query responses come back with a handful of edits, while analysis still gets checked line by line.",
    settings: ["Let the copilot create tasks and reminders without a confirmation step", "Require a human signature on every document the copilot drafts"],
  },
};
