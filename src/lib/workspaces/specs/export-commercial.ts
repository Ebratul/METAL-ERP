import type { ModuleSpecs } from "../types";

/**
 * Module 43 — Export Commercial Management (Enterprise Edition).
 *
 * One hundred and sixteen workspaces in the master serial order: the executive
 * and analytics dashboards, export planning and scheduling, the buyer and
 * contract book, the full letter-of-credit family, invoicing and the export
 * document set, certificates, booking, containers and transport documents,
 * customs, shipment tracking, banking and realisation, incentives,
 * profitability, approval workflow, compliance and audit, the reporting suite,
 * and the AI layer that reads the documents and predicts what goes wrong.
 */

/* ── Shared field fragments ────────────────────────────────────────────── */

const BUYER = "buyer|Buyer|enum|@buyers";
const ORDER = "order|Sales Order|enum|SO-26-2041;SO-26-2058;SO-26-2073;SO-26-2090;SO-26-2114;SO-26-2138;SO-26-2155;SO-26-2170";
const COUNTRY = "country|Destination|enum|Germany;Netherlands;Spain;USA;UAE;Singapore;Sri Lanka;United Kingdom;Italy;Turkey;Japan;Canada";
const BANK = "bank|Bank|enum|Standard Chartered;HSBC;City Bank;BRAC Bank;Eastern Bank;Dutch-Bangla Bank;Prime Bank;Mutual Trust Bank";
const OWNER = "owner|Commercial Officer|person";
const PORT = "port|Port of Discharge|enum|Hamburg;Rotterdam;Barcelona;New York;Jebel Ali;Singapore;Colombo;Felixstowe;Genoa;Yokohama";
const CURRENCY = "currency|Currency|enum|USD;EUR;GBP;JPY;CNY;CAD;AUD;CHF";
const LC_NO = "lcNo|LC No|enum|LC-88214;LC-88237;LC-88259;LC-88274;LC-88290;LC-88311;LC-88336;LC-88350";
const INCOTERM = "incoterm|Incoterm|enum|FOB;CFR;CIF;EXW;DDP;FCA;DAP;CPT";
const INVOICE = "invoiceNo|Invoice No|enum|CI-26-0411;CI-26-0428;CI-26-0443;CI-26-0461;CI-26-0478;CI-26-0492;CI-26-0507";
const SHIPMENT = "shipment|Shipment|enum|EXP-26-0411;EXP-26-0428;EXP-26-0443;EXP-26-0461;EXP-26-0478;EXP-26-0492";
const CONTRACT = "contractNo|Contract No|enum|CT-26-0411;CT-26-0428;CT-26-0443;CT-26-0461;CT-26-0478";
const CONTAINER = "containerNo|Container No|enum|MSKU4471882;MSCU7712349;CMAU3348017;HLXU9921446;TGHU5580112";
const VESSEL = "vessel|Vessel|enum|MV Ocean Pearl;MV Blue Marlin;MSC Aurora;Maersk Kensington;CMA CGM Lyra;ONE Harbour;Ever Lucid";
const LINE = "line|Shipping Line|enum|Maersk;MSC;CMA CGM;Hapag-Lloyd;ONE;Evergreen;Cosco;Yang Ming";
const AIRLINE = "carrier|Airline|enum|Emirates SkyCargo;Qatar Airways Cargo;Turkish Cargo;Cathay Cargo;Singapore Airlines Cargo;Biman Cargo";
const HS_CODE = "hsCode|HS Code|enum|8308.10.00;8308.20.00;8308.90.00;9606.10.00;9606.22.00;9607.11.00;7326.90.00";
const PERIOD = "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026;Jun 2026";
const CONFIDENCE = "confidence|AI Confidence|pct|46;99.5";

export const EXPORT_COMMERCIAL: ModuleSpecs = {
  /* ── 1 ─────────────────────────────────────────────────────────────── */
  "commercial-executive-dashboard": {
    name: "Commercial Executive Dashboard", kind: "overview", summary: "Export value, LC cover and realisation at a glance",
    entity: "Commercial Summary", ref: "CED",
    fields: [PERIOD, COUNTRY, BUYER, "exportValue|Export Value|money|40000;3800000", "shipments|Shipments|int|1;120", "lcCovered|LC Covered|pct|18;100", "realised|Realised Value|money|0;3800000", "outstanding|Outstanding|money|0;1600000", "onTime|On-Time Shipment|pct|42;100", OWNER, "date|Period End|date|-330;0"],
    statuses: ["Ahead of Plan", "On Track", "At Risk", "Behind Plan"],
    measure: "exportValue", rows: 58,
    insight: "Four buyers carry 61% of export value and only 38% of that book sits behind a letter of credit — the concentration risk is commercial, not operational.",
  },

  /* ── 2 ─────────────────────────────────────────────────────────────── */
  "commercial-analytics-dashboard": {
    name: "Commercial Analytics Dashboard", kind: "analytics", summary: "Country, buyer and currency mix",
    entity: "Analytics Slice", ref: "CAD",
    fields: [COUNTRY, BUYER, CURRENCY, "exportValue|Export Value|money|20000;2600000", "share|Share of Book|pct|1;34", "growth|YoY Growth|pct|60;180", "avgShipmentValue|Average Shipment Value|money|6000;420000", "leadDays|Order to Ship|int|18;140;days", PERIOD, "date|Period End|date|-360;0"],
    statuses: ["Growing", "Stable", "Declining", "New Market"],
    measure: "exportValue", rows: 56,
  },

  /* ── 3 ─────────────────────────────────────────────────────────────── */
  "commercial-kpi-dashboard": {
    name: "Commercial KPI Dashboard", kind: "overview", summary: "Targets, attainment and trend per KPI",
    entity: "KPI Record", ref: "CKP",
    fields: ["kpi|KPI|enum|Export value;On-time shipment;Document accuracy;LC realisation days;Discrepancy rate;Freight cost per carton;Incentive recovery;Approval turnaround", PERIOD, OWNER, "target|Target|money|20000;2600000", "actual|Actual|money|0;2600000", "achievement|Achievement|pct|18;145", "trend|Trend|enum|Improving;Stable;Declining;Volatile", "rank|Rank|int|1;24", "date|Period End|date|-330;0"],
    statuses: ["Achieved", "On Track", "At Risk", "Missed"],
    measure: "actual", rows: 54,
    insight: "Document accuracy is the KPI everything else hangs off — every point lost there shows up two weeks later as a discrepancy charge and a longer realisation cycle.",
  },

  /* ── 4 ─────────────────────────────────────────────────────────────── */
  "export-dashboard": {
    name: "Export Dashboard", kind: "overview", summary: "Shipments, cartons and clean documents",
    entity: "Export Summary", ref: "EXD",
    fields: [BUYER, COUNTRY, PORT, "shipments|Shipments|int|1;90", "cartons|Cartons|int|20;9000;cartons", "fobValue|FOB Value|money|8000;1800000", "spaceBooked|Space Booked|pct|20;100", "docsClean|Clean Documents|pct|40;100", OWNER, "date|Period End|date|-330;0"],
    statuses: ["Shipped", "In Progress", "Planned", "Delayed", "Cancelled"],
    measure: "fobValue", rows: 56,
  },

  /* ── 5 ─────────────────────────────────────────────────────────────── */
  "export-planning": {
    name: "Export Planning Management", kind: "list", summary: "Order book turned into a shipment plan",
    entity: "Export Plan", ref: "EPL",
    fields: [BUYER, ORDER, COUNTRY, "planQty|Planned Qty|int|20000;900000;pcs", "planValue|Planned Value|money|8000;620000", "shipWindow|Shipment Window|enum|Week 1;Week 2;Week 3;Week 4;First half;Second half", "readyDate|Goods Ready|date|-60;150", OWNER, "date|Planned On|date|-300;0"],
    statuses: ["Confirmed", "Under Review", "Draft", "Revised", "Dropped"],
    measure: "planValue", rows: 52,
    insight: "Plans built from the goods-ready date rather than the buyer's delivery date leave a median of nine days of slack — that slack is what absorbs a rolled booking without an air freight bill.",
  },

  /* ── 6 ─────────────────────────────────────────────────────────────── */
  "export-scheduling": {
    name: "Export Scheduling Management", kind: "calendar", summary: "Cut-off and sailing schedule",
    entity: "Scheduled Shipment", ref: "ESC",
    fields: [BUYER, ORDER, PORT, VESSEL, "cartons|Cartons|int|10;900;cartons", "value|Value|money|8000;420000", "cutOff|Cut-off|date|-20;60", "date|Sailing Date|date|-20;70"],
    statuses: ["Booked", "Planned", "Cut-off Met", "Sailed", "Missed"],
    measure: "value", rows: 54,
  },

  /* ── 7 ─────────────────────────────────────────────────────────────── */
  "export-calendar": {
    name: "Export Calendar Management", kind: "calendar", summary: "Every commercial date in one view",
    entity: "Calendar Event", ref: "ECL",
    fields: ["eventType|Event|enum|Goods ready;Cut-off date;Sailing date;LC expiry;Document presentation;Buyer inspection;Certificate expiry;Holiday;Follow-up", BUYER, SHIPMENT, OWNER, "value|Value at Stake|money|0;620000", "leadDays|Lead Time|int|0;90;days", "date|Event Date|date|-40;150"],
    statuses: ["Scheduled", "Due Soon", "Completed", "Overdue", "Cancelled"],
    measure: "value", rows: 60,
    insight: "Three LC expiries fall inside a bank holiday week. Presentation has to happen the week before or the documents miss their window entirely.",
  },

  /* ── 8 ─────────────────────────────────────────────────────────────── */
  "export-forecast": {
    name: "Export Forecast Management", kind: "analytics", summary: "Forward book against actuals",
    entity: "Forecast Line", ref: "EFC",
    fields: [BUYER, COUNTRY, PERIOD, "horizon|Horizon|enum|Next month;Next quarter;Next six months;Next year", "forecastValue|Forecast Value|money|20000;2400000", "actualValue|Actual to Date|money|0;2400000", "variance|Variance|pct|0;42", "confidence|Confidence|pct|48;99", "date|Generated On|date|-330;0"],
    statuses: ["Validated", "Monitoring", "New", "Revised", "Rejected"],
    measure: "forecastValue", rows: 52,
  },

  /* ── 9 ─────────────────────────────────────────────────────────────── */
  "buyer-commercial": {
    name: "Buyer Commercial Management", kind: "list", summary: "Terms, limits and exposure per buyer",
    entity: "Buyer Commercial Profile", ref: "BCM",
    fields: [BUYER, COUNTRY, CURRENCY, INCOTERM, "paymentTerms|Payment Terms|enum|LC at sight;LC 30 days;LC 60 days;LC 90 days;TT in advance;TT 30 days;DP at sight;DA 60 days", "creditLimit|Credit Limit|money|20000;1800000", "exposure|Current Exposure|money|0;1800000", "utilisation|Limit Utilisation|pct|0;100", OWNER, "date|Reviewed On|date|-300;0"],
    statuses: ["Active", "Under Review", "On Hold", "New", "Closed"],
    measure: "exposure", rows: 48,
    insight: "Two buyers on open-account terms sit above 90% of their credit limit. Neither has been re-reviewed in the last six months.",
  },

  /* ── 10 ────────────────────────────────────────────────────────────── */
  "buyer-master": {
    name: "Buyer Master Management", kind: "list", summary: "The buyer record everything else points at",
    entity: "Buyer Record", ref: "BMS",
    fields: [BUYER, COUNTRY, "buyerCode|Buyer Code|enum|BY-1041;BY-1058;BY-1073;BY-1090;BY-1114;BY-1138;BY-1155", "segment|Segment|enum|Global brand;Retail chain;Sourcing agent;Buying house;Private label", PORT, CURRENCY, "activeOrders|Active Orders|int|0;40", "annualValue|Annual Value|money|40000;3200000", "completeness|Profile Completeness|pct|40;100", OWNER, "date|Onboarded On|date|-900;0"],
    statuses: ["Active", "Prospect", "Dormant", "Blocked", "Archived"],
    measure: "annualValue", rows: 50,
  },

  /* ── 11 ────────────────────────────────────────────────────────────── */
  "buyer-agreement": {
    name: "Buyer Agreement Management", kind: "list", summary: "Supply, price and rebate agreements",
    entity: "Agreement", ref: "BAG",
    fields: [BUYER, "agreementType|Agreement|enum|Annual supply agreement;Price agreement;Framework agreement;Exclusivity agreement;Rebate agreement;Trial agreement", "value|Agreement Value|money|40000;3800000", "utilised|Utilised|money|0;3800000", "rebatePct|Rebate|pct|0;8", OWNER, "startDate|Start Date|date|-900;0", "date|Expiry Date|date|-60;500"],
    statuses: ["Active", "Under Negotiation", "Pending Approval", "Renewal Due", "Expired"],
    measure: "value", rows: 46,
  },

  /* ── 12 ────────────────────────────────────────────────────────────── */
  "buyer-performance": {
    name: "Buyer Performance Management", kind: "analytics", summary: "Volume, payment behaviour and claims",
    entity: "Performance Record", ref: "BPF",
    fields: [BUYER, PERIOD, "shipments|Shipments|int|1;90", "orderValue|Order Value|money|20000;2400000", "onTimePayment|On-Time Payment|pct|30;100", "claimRate|Claim Rate|pct|0;14", "growth|YoY Growth|pct|60;180", "score|Performance Score|pct|32;99", "date|Period End|date|-330;0"],
    statuses: ["Excellent", "Good", "Average", "Watch", "Poor"],
    measure: "orderValue", rows: 52,
  },

  /* ── 13 ────────────────────────────────────────────────────────────── */
  "buyer-compliance": {
    name: "Buyer Compliance Management", kind: "list", summary: "Code of conduct, audits and declarations",
    entity: "Compliance Item", ref: "BCP",
    fields: [BUYER, "requirement|Requirement|enum|Code of conduct;Social audit;Nickel-free declaration;REACH declaration;Prop 65 statement;Anti-slavery statement;Security audit (C-TPAT);Packaging directive", "auditBody|Audit Body|enum|SGS;Bureau Veritas;Intertek;TUV;Buyer team;Self declaration", "score|Compliance Score|pct|38;100", "findings|Open Findings|int|0;18", "validUntil|Valid Until|date|-60;500", "date|Assessed On|date|-500;0"],
    statuses: ["Compliant", "Minor Finding", "Major Finding", "Expired", "Not Assessed"],
    measure: "score", rows: 48,
  },

  /* ── 14 ────────────────────────────────────────────────────────────── */
  "export-contract": {
    name: "Export Contract Management", kind: "list", summary: "Signed contracts and what has shipped against them",
    entity: "Export Contract", ref: "ECT",
    fields: [BUYER, CONTRACT, COUNTRY, CURRENCY, INCOTERM, "value|Contract Value|money|40000;3800000", "shipped|Shipped Against|money|0;3800000", "signedBy|Signed By|person", "startDate|Effective From|date|-700;0", "date|Expiry Date|date|-60;500"],
    statuses: ["Active", "Pending Signature", "Draft", "Fulfilled", "Terminated"],
    measure: "value", rows: 48,
  },

  /* ── 15 ────────────────────────────────────────────────────────────── */
  "contract-amendment": {
    name: "Contract Amendment Management", kind: "list", summary: "What changed after signature",
    entity: "Amendment", ref: "CAM",
    fields: [CONTRACT, BUYER, "amendmentNo|Amendment No|enum|AMD-01;AMD-02;AMD-03;AMD-04", "changeType|Change|enum|Price revision;Quantity change;Delivery extension;Incoterm change;Payment term change;Scope addition", "valueImpact|Value Impact|money|0;620000", "requestedBy|Requested By|enum|Buyer;Commercial;Production;Finance", "approver|Approved By|person", "date|Raised On|date|-300;0"],
    statuses: ["Approved", "Under Review", "Raised", "Rejected", "Withdrawn"],
    measure: "valueImpact", rows: 44,
  },

  /* ── 16 ────────────────────────────────────────────────────────────── */
  "contract-renewal": {
    name: "Contract Renewal Management", kind: "board", summary: "Expiry pipeline and renewal stage",
    entity: "Renewal", ref: "CRN",
    fields: [BUYER, CONTRACT, "currentValue|Current Value|money|40000;3800000", "proposedValue|Proposed Value|money|40000;4200000", "priceChange|Price Change|pct|80;130", "daysToExpiry|Days to Expiry|int|0;180;days", OWNER, "date|Expiry Date|date|-30;300"],
    statuses: ["Renewed", "In Negotiation", "Proposal Sent", "Not Started", "Lapsed"],
    measure: "proposedValue", rows: 42,
    insight: "Renewals take about eleven weeks to close. Anything expiring inside ninety days that has not started is already late, not merely pending.",
  },

  /* ── 17 ────────────────────────────────────────────────────────────── */
  "contract-version": {
    name: "Contract Version Management", kind: "list", summary: "Which version is the live one",
    entity: "Contract Version", ref: "CVR",
    fields: [CONTRACT, "version|Version|enum|V1;V2;V3;V4;V5", "changeSummary|Change Summary|text|Price schedule replaced;Delivery window extended;Rebate clause added;Penalty clause removed;Bank details updated;Annex B re-issued", "supersededBy|Superseded By|enum|V2;V3;V4;V5;Current", "author|Prepared By|person", "attachments|Attachments|int|1;10;files", "date|Version Date|date|-700;0"],
    statuses: ["Current", "Superseded", "Draft", "Archived"],
    measure: "attachments", rows: 46,
  },

  /* ── 18 ────────────────────────────────────────────────────────────── */
  "export-lc": {
    name: "Export LC Management", kind: "list", summary: "Every export letter of credit on file",
    entity: "Letter of Credit", ref: "ELC",
    fields: [BUYER, BANK, LC_NO, "lcType|LC Type|enum|Master LC;Back-to-back LC;Sight LC;Usance LC;Transferable LC;Standby LC", "amount|LC Amount|money|20000;1800000", "utilised|Utilised|money|0;1800000", "tenorDays|Tenor|int|0;180;days", "expiry|Expiry Date|date|-30;240", "date|Issued On|date|-300;0"],
    statuses: ["Active", "Fully Utilised", "Expiring Soon", "Amended", "Expired"],
    measure: "amount", rows: 58,
    insight: "Roughly one LC in six expires with an unused balance. The balance is almost always the shortfall between the contracted quantity and what actually shipped.",
  },

  /* ── 19 ────────────────────────────────────────────────────────────── */
  "master-lc": {
    name: "Master LC Management", kind: "list", summary: "Buyer LCs and the margin retained on them",
    entity: "Master LC", ref: "MLC",
    fields: [BUYER, BANK, LC_NO, "amount|LC Amount|money|40000;2400000", "btbOpened|B2B Opened Against|money|0;1800000", "marginPct|Retained Margin|pct|4;42", "advisingBank|Advising Bank|enum|Standard Chartered;HSBC;City Bank;Sonali Bank;Prime Bank", "expiry|Expiry Date|date|-30;240", "date|Received On|date|-300;0"],
    statuses: ["Active", "Partially Utilised", "Fully Utilised", "Expiring Soon", "Expired"],
    measure: "amount", rows: 46,
  },

  /* ── 20 ────────────────────────────────────────────────────────────── */
  "btb-lc": {
    name: "Back-to-Back LC Management", kind: "list", summary: "Supplier LCs opened against a master",
    entity: "Back-to-Back LC", ref: "BTB",
    fields: ["supplier|Beneficiary|enum|@suppliers", BANK, "btbNo|B2B LC No|enum|BB-44121;BB-44158;BB-44173;BB-44190;BB-44214", "masterLc|Against Master LC|enum|LC-88214;LC-88237;LC-88259;LC-88274;LC-88290", "amount|B2B Amount|money|8000;900000", "material|Material|enum|Brass rod;Zinc alloy ingot;Zip tape;Nickel-free coating;Packaging board;Dye chemicals", "tenorDays|Tenor|int|30;180;days", "expiry|Expiry Date|date|-30;200", "date|Opened On|date|-300;0"],
    statuses: ["Opened", "Accepted", "Matured", "Paid", "Overdue"],
    measure: "amount", rows: 48,
    insight: "Back-to-back tenor runs longer than the master LC on four openings. That gap is funded out of working capital, not out of the export proceeds.",
  },

  /* ── 21 ────────────────────────────────────────────────────────────── */
  "sight-lc": {
    name: "Sight LC Management", kind: "list", summary: "Pay-on-presentation credits",
    entity: "Sight LC", ref: "SLC",
    fields: [BUYER, BANK, LC_NO, "amount|LC Amount|money|20000;1600000", "charges|Bank Charges|money|60;5200", "paidWithinDays|Paid Within|int|1;21;days", "presentedOn|Documents Presented|date|-200;10", "expiry|Expiry Date|date|-30;180", "date|Issued On|date|-300;0"],
    statuses: ["Paid", "Under Scrutiny", "Presented", "Active", "Discrepant"],
    measure: "amount", rows: 46,
  },

  /* ── 22 ────────────────────────────────────────────────────────────── */
  "usance-lc": {
    name: "Usance LC Management", kind: "list", summary: "Deferred payment credits and maturity",
    entity: "Usance LC", ref: "ULC",
    fields: [BUYER, BANK, LC_NO, "amount|LC Amount|money|20000;1800000", "tenorDays|Usance Tenor|int|30;180;days", "discountRate|Discount Rate|pct|2;9", "acceptedOn|Acceptance Date|date|-200;10", "maturity|Maturity Date|date|-60;220", "date|Issued On|date|-320;0"],
    statuses: ["Accepted", "Awaiting Acceptance", "Discounted", "Matured", "Overdue"],
    measure: "amount", rows: 46,
  },

  /* ── 23 ────────────────────────────────────────────────────────────── */
  "transfer-lc": {
    name: "Transfer LC Management", kind: "list", summary: "Credits transferred to a second beneficiary",
    entity: "Transferred LC", ref: "TLC",
    fields: [BUYER, BANK, LC_NO, "transferredTo|Second Beneficiary|enum|@suppliers", "originalAmount|Original Amount|money|40000;2400000", "transferredAmount|Transferred Amount|money|8000;1800000", "retained|Retained Margin|money|0;620000", "transferCharge|Transfer Charge|money|40;3200", "date|Transferred On|date|-300;0"],
    statuses: ["Transferred", "Partially Transferred", "Requested", "Rejected", "Cancelled"],
    measure: "transferredAmount", rows: 42,
  },

  /* ── 24 ────────────────────────────────────────────────────────────── */
  "standby-lc": {
    name: "Standby LC Management", kind: "list", summary: "Guarantees issued and their exposure",
    entity: "Standby LC", ref: "SBL",
    fields: [BUYER, BANK, "sblcNo|SBLC No|enum|SB-22114;SB-22138;SB-22155;SB-22170;SB-22194", "purpose|Purpose|enum|Payment guarantee;Performance guarantee;Advance payment guarantee;Bid bond;Retention guarantee", "amount|Guarantee Amount|money|20000;1600000", "commissionPct|Commission|pct|0.4;3", "expiry|Expiry Date|date|-30;400", "date|Issued On|date|-500;0"],
    statuses: ["Active", "Expiring Soon", "Released", "Claimed", "Expired"],
    measure: "amount", rows: 42,
  },

  /* ── 25 ────────────────────────────────────────────────────────────── */
  "lc-amendment": {
    name: "LC Amendment Management", kind: "list", summary: "Every change advised against a credit",
    entity: "LC Amendment", ref: "LAM",
    fields: [BUYER, BANK, LC_NO, "amendmentNo|Amendment No|enum|AMD-01;AMD-02;AMD-03;AMD-04", "changeType|Amendment|enum|Value increase;Value decrease;Shipment date extension;Expiry extension;Port change;Description correction;Partial shipment allowed;Document clause change", "valueImpact|Value Impact|money|0;620000", "charges|Amendment Charge|money|30;1800", "requestedBy|Requested By|enum|Beneficiary;Applicant;Bank", "date|Raised On|date|-300;0"],
    statuses: ["Accepted", "Advised", "Requested", "Rejected", "Withdrawn"],
    measure: "valueImpact", rows: 50,
    insight: "Shipment-date extensions are two thirds of all amendments. Each one costs a fee and about nine days, which is why the planning window matters more than the negotiation.",
  },

  /* ── 26 ────────────────────────────────────────────────────────────── */
  "lc-utilization": {
    name: "LC Utilization Management", kind: "analytics", summary: "Drawn, undrawn and about to lapse",
    entity: "Utilisation Line", ref: "LUT",
    fields: [BUYER, BANK, LC_NO, "lcAmount|LC Amount|money|20000;1800000", "shippedValue|Shipped Value|money|0;1800000", "utilisation|Utilisation|pct|0;100", "balance|Unutilised Balance|money|0;900000", "daysToExpiry|Days to Expiry|int|0;180;days", "date|As At|date|-200;0"],
    statuses: ["Fully Utilised", "On Track", "Under-utilised", "Expiring Unused", "Lapsed"],
    measure: "lcAmount", rows: 52,
  },

  /* ── 27 ────────────────────────────────────────────────────────────── */
  "commercial-invoice": {
    name: "Commercial Invoice Management", kind: "list", summary: "Export invoices raised against shipments",
    entity: "Commercial Invoice", ref: "CIV",
    fields: [BUYER, ORDER, INVOICE, "value|Invoice Value|money|8000;620000", CURRENCY, INCOTERM, HS_CODE, OWNER, "date|Invoice Date|date|-240;10"],
    statuses: ["Issued", "Submitted to Bank", "Accepted", "Draft", "Amended"],
    measure: "value", rows: 56,
  },

  /* ── 28 ────────────────────────────────────────────────────────────── */
  "proforma-invoice": {
    name: "Proforma Invoice Management", kind: "list", summary: "The PI the LC is opened against",
    entity: "Proforma Invoice", ref: "PFI",
    fields: [BUYER, ORDER, "piNo|PI No|enum|PI-26-1041;PI-26-1056;PI-26-1072;PI-26-1088;PI-26-1104;PI-26-1121", "value|PI Value|money|8000;620000", CURRENCY, INCOTERM, "paymentTerms|Payment Terms|enum|LC at sight;LC 60 days;LC 90 days;TT in advance;TT 30 days;DP at sight", "lcOpened|LC Opened|bool|LC opened;Awaiting LC", "date|PI Date|date|-300;0"],
    statuses: ["Approved", "Submitted", "Draft", "Amended", "Cancelled"],
    measure: "value", rows: 52,
  },

  /* ── 29 ────────────────────────────────────────────────────────────── */
  "packing-list": {
    name: "Packing List Management", kind: "list", summary: "Cartons, weight and volume per shipment",
    entity: "Packing List", ref: "PKL",
    fields: [BUYER, INVOICE, "cartons|Cartons|int|10;2400;cartons", "netWeight|Net Weight|float|20;24000;kg;1", "grossWeight|Gross Weight|float|22;26000;kg;1", "cbm|CBM|float|0.4;68;CBM;2", "packRatio|Packing Ratio|enum|144 per box;500 per bag;1000 per carton;12 per polybag;2000 per drum", OWNER, "date|Prepared On|date|-240;10"],
    statuses: ["Issued", "Prepared", "Draft", "Amended", "Rejected"],
    measure: "cartons", rows: 54,
  },

  /* ── 30 ────────────────────────────────────────────────────────────── */
  "shipping-mark": {
    name: "Shipping Mark Management", kind: "form", summary: "What gets printed on the carton",
    entity: "Shipping Mark", ref: "SMK",
    fields: [BUYER, ORDER, "markType|Mark|enum|Main mark;Side mark;Carton mark;Hazard mark;Handling mark", "content|Mark Content|text|Buyer name and PO;Style and colour;Carton x of y;Net and gross weight;Made in Bangladesh;Country of destination", "approvedBy|Approved By|person", "cartonsAffected|Cartons Affected|int|10;2400;cartons", "date|Issued On|date|-240;10"],
    statuses: ["Approved", "Submitted", "Draft", "Revised", "Rejected"],
    measure: "cartonsAffected", rows: 44,
  },

  /* ── 31 ────────────────────────────────────────────────────────────── */
  "exp-management": {
    name: "EXP Management", kind: "list", summary: "EXP forms issued and reported",
    entity: "EXP Form", ref: "EXP",
    fields: [BUYER, BANK, "expNo|EXP No|enum|EXP-26-0411;EXP-26-0428;EXP-26-0443;EXP-26-0461;EXP-26-0478;EXP-26-0492", INVOICE, COUNTRY, "value|EXP Value|money|8000;620000", "branch|Issuing Branch|enum|Motijheel;Gulshan;Agrabad;Uttara;Narayanganj", "date|Issued On|date|-260;10"],
    statuses: ["Issued", "Certified", "Reported to BB", "Pending", "Cancelled"],
    measure: "value", rows: 54,
  },

  /* ── 32 ────────────────────────────────────────────────────────────── */
  "exp-amendment": {
    name: "EXP Amendment Management", kind: "list", summary: "Corrections to an issued EXP",
    entity: "EXP Amendment", ref: "EXA",
    fields: ["expNo|EXP No|enum|EXP-26-0411;EXP-26-0428;EXP-26-0443;EXP-26-0461;EXP-26-0478", BUYER, BANK, "changeType|Amendment|enum|Value correction;Quantity correction;Buyer name change;Port change;HS code correction;Date correction", "valueImpact|Value Impact|money|0;280000", "approver|Approved By|person", "date|Raised On|date|-260;0"],
    statuses: ["Approved", "Submitted", "Raised", "Rejected"],
    measure: "valueImpact", rows: 40,
  },

  /* ── 33 ────────────────────────────────────────────────────────────── */
  "certificate-of-origin": {
    name: "Certificate of Origin (COO) Management", kind: "list", summary: "Origin certificates and issuing body",
    entity: "Origin Certificate", ref: "COO",
    fields: [BUYER, COUNTRY, "certNo|Certificate No|enum|COO-7741;COO-7768;COO-7784;COO-7799;COO-7812", "issuer|Issuing Body|enum|EPB;DCCI;FBCCI;Chamber of Commerce;MCCI", HS_CODE, INVOICE, "value|Covered Value|money|8000;620000", "date|Issued On|date|-240;10"],
    statuses: ["Issued", "Submitted", "Applied", "Amended", "Rejected"],
    measure: "value", rows: 52,
    insight: "Certificates rejected by the negotiating bank almost always fail on the HS code — the one on the certificate has drifted from the one on the invoice.",
  },

  /* ── 34 ────────────────────────────────────────────────────────────── */
  "gsp-certificate": {
    name: "GSP Certificate Management", kind: "list", summary: "Form A, REX and the duty it saves",
    entity: "GSP Certificate", ref: "GSP",
    fields: [BUYER, COUNTRY, "formType|Form|enum|EU GSP Form A;REX declaration;GSP+;UK DCTS;Norway GSP", "certNo|Certificate No|enum|GSP-3341;GSP-3368;GSP-3384;GSP-3399;GSP-3412", "rexNo|REX Number|enum|BDREX0041;BDREX0058;BDREX0073;Not applicable", "value|Covered Value|money|8000;620000", "dutySaved|Duty Saved|money|200;62000", "date|Issued On|date|-240;10"],
    statuses: ["Issued", "Accepted by Customs", "Applied", "Queried", "Rejected"],
    measure: "dutySaved", rows: 50,
  },

  /* ── 35 ────────────────────────────────────────────────────────────── */
  "preferential-certificate": {
    name: "Preferential Certificate Management", kind: "list", summary: "SAFTA, APTA and bilateral preference",
    entity: "Preference Certificate", ref: "PRC",
    fields: [BUYER, COUNTRY, "scheme|Scheme|enum|SAFTA;APTA;BIMSTEC;Bangladesh-India PTA;Turkey preferential;Non-preferential", "certNo|Certificate No|enum|PRF-5541;PRF-5568;PRF-5584;PRF-5599", "originRule|Origin Rule|enum|Change of tariff heading;Value added 30%;Value added 40%;Wholly obtained", "value|Covered Value|money|8000;620000", "tariffSaving|Tariff Saving|pct|0;22", "date|Issued On|date|-240;10"],
    statuses: ["Issued", "Accepted", "Applied", "Queried", "Rejected"],
    measure: "value", rows: 44,
  },

  /* ── 36 ────────────────────────────────────────────────────────────── */
  "inspection-certificate": {
    name: "Inspection Certificate Management", kind: "list", summary: "Third-party and buyer inspection results",
    entity: "Inspection Certificate", ref: "ISC",
    fields: [BUYER, ORDER, "inspector|Inspection Body|enum|SGS;Bureau Veritas;Intertek;TUV;Buyer QA team;Internal QC", "inspectionType|Inspection|enum|Pre-shipment inspection;During production inspection;Final random inspection;Loading supervision;Container inspection", "aql|AQL Level|enum|AQL 1.0;AQL 1.5;AQL 2.5;AQL 4.0", "cartonsChecked|Cartons Checked|int|2;220;cartons", "defectRate|Defect Rate|pct|0;12", "date|Inspected On|date|-220;10"],
    statuses: ["Passed", "Passed with Observation", "Re-inspection", "Scheduled", "Failed"],
    measure: "defectRate", rows: 48,
  },

  /* ── 37 ────────────────────────────────────────────────────────────── */
  "fumigation-certificate": {
    name: "Fumigation Certificate Management", kind: "list", summary: "Treatment of wooden packing",
    entity: "Fumigation Certificate", ref: "FUM",
    fields: [BUYER, COUNTRY, "certNo|Certificate No|enum|FUM-2241;FUM-2268;FUM-2284;FUM-2299", "treatment|Treatment|enum|Methyl bromide;Heat treatment ISPM-15;Phosphine;Aluminium phosphide", "material|Material Treated|enum|Wooden pallet;Wooden crate;Carton;Container floor", "validityDays|Valid For|int|7;90;days", "cost|Cost|money|20;900", "date|Treated On|date|-220;10"],
    statuses: ["Issued", "Treated", "Scheduled", "Expired", "Rejected"],
    measure: "cost", rows: 40,
  },

  /* ── 38 ────────────────────────────────────────────────────────────── */
  "phytosanitary-certificate": {
    name: "Phytosanitary Certificate Management", kind: "list", summary: "Plant quarantine clearance",
    entity: "Phytosanitary Certificate", ref: "PHY",
    fields: [BUYER, COUNTRY, "certNo|Certificate No|enum|PHY-1141;PHY-1168;PHY-1184;PHY-1199", "issuer|Issuing Authority|enum|Plant Quarantine Wing;DAE;Port Quarantine Office", "packaging|Packaging|enum|Wooden pallet;Wooden crate;Bamboo dunnage;Paper carton", "fee|Fee|money|10;400", "date|Issued On|date|-220;10"],
    statuses: ["Issued", "Inspected", "Applied", "Not Required", "Rejected"],
    measure: "fee", rows: 38,
  },

  /* ── 39 ────────────────────────────────────────────────────────────── */
  "shipping-instruction": {
    name: "Shipping Instruction Management", kind: "list", summary: "What each buyer requires per shipment",
    entity: "Shipping Instruction", ref: "SIN",
    fields: [BUYER, ORDER, "instruction|Instruction|enum|Consignee details;Notify party;Document set;Marking requirement;Nominated forwarder;Split shipment;Pre-alert timing;Freight prepaid or collect", "mandatory|Mandatory|bool|Mandatory;Advisory", "receivedVia|Received Via|enum|Email;Buyer portal;EDI;Letter", "shipmentsAffected|Shipments Affected|int|1;60", OWNER, "date|Received On|date|-240;10"],
    statuses: ["Applied", "Acknowledged", "Received", "Clarification Needed"],
    measure: "shipmentsAffected", rows: 48,
  },

  /* ── 40 ────────────────────────────────────────────────────────────── */
  booking: {
    name: "Booking Management", kind: "list", summary: "Space requested with lines and forwarders",
    entity: "Space Booking", ref: "BKG",
    fields: [LINE, VESSEL, PORT, "bookingNo|Booking No|enum|BK-77121;BK-77188;BK-77244;BK-77301;BK-77366", "containers|Containers|int|1;12", "containerType|Container Type|enum|20ft GP;40ft GP;40ft HC;LCL;Air ULD", "freight|Freight Cost|money|600;38000", "cutOff|Cut-off Date|date|-30;45", "date|Booked On|date|-240;10"],
    statuses: ["Confirmed", "Requested", "Rolled Over", "Shipped", "Cancelled"],
    measure: "freight", rows: 54,
    insight: "Bookings made less than twelve days before the cut-off are rolled over four times as often as those made earlier. The rolling is a booking-lead-time problem, not a carrier problem.",
  },

  /* ── 41 ────────────────────────────────────────────────────────────── */
  "booking-confirmation": {
    name: "Booking Confirmation Management", kind: "list", summary: "Vessel, voyage and confirmed dates",
    entity: "Booking Confirmation", ref: "BCF",
    fields: [LINE, "bookingNo|Booking No|enum|BK-77121;BK-77188;BK-77244;BK-77301;BK-77366", VESSEL, "voyage|Voyage|enum|V-2604E;V-2607W;V-2611E;V-2615W;V-2620E", PORT, "containers|Containers Confirmed|int|1;12", "confirmedBy|Confirmed By|person", "etd|ETD|date|-20;60", "date|Confirmed On|date|-240;10"],
    statuses: ["Confirmed", "Amended", "Awaiting", "Rolled Over", "Cancelled"],
    measure: "containers", rows: 48,
  },

  /* ── 42 ────────────────────────────────────────────────────────────── */
  "freight-forwarder": {
    name: "Freight Forwarder Management", kind: "list", summary: "Forwarder panel and performance",
    entity: "Forwarder", ref: "FFW",
    fields: ["forwarder|Forwarder|enum|DHL Global Forwarding;Kuehne+Nagel;DB Schenker;Expeditors;Agility;Bollore Logistics;Local NVOCC", "lanes|Lanes Served|enum|Europe;North America;Middle East;Far East;All lanes", "shipments|Shipments (YTD)|int|2;180", "onTime|On-Time|pct|48;100", "spend|Annual Spend|money|4000;380000", "rating|Rating|pct|50;99", "relationshipOwner|Relationship Owner|person", "date|Reviewed On|date|-240;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Suspended"],
    measure: "spend", rows: 42,
  },

  /* ── 43 ────────────────────────────────────────────────────────────── */
  "shipping-line": {
    name: "Shipping Line Management", kind: "list", summary: "Lane rates, transit and reliability",
    entity: "Shipping Line", ref: "SHL",
    fields: [LINE, "lane|Trade Lane|enum|Chattogram-Hamburg;Chattogram-Rotterdam;Chattogram-New York;Chattogram-Jebel Ali;Chattogram-Singapore;Chattogram-Colombo", "transitDays|Transit Time|int|12;46;days", "teuShipped|TEU Shipped|int|2;480;TEU", "rate|Rate per 40ft|money|900;5200", "reliability|Schedule Reliability|pct|32;99", "rateValidity|Rate Validity|date|-30;240", "date|Reviewed On|date|-240;0"],
    statuses: ["Contracted", "Spot", "On Watch", "Suspended"],
    measure: "teuShipped", rows: 40,
    insight: "Schedule reliability and rate move together on the European lanes — the cheapest quote on Rotterdam is also the one that rolls most, which shows up later as air freight.",
  },

  /* ── 44 ────────────────────────────────────────────────────────────── */
  "air-carrier": {
    name: "Air Carrier Management", kind: "list", summary: "Airlines, routes and chargeable weight",
    entity: "Air Carrier", ref: "ACR",
    fields: [AIRLINE, "route|Route|enum|DAC-FRA;DAC-AMS;DAC-JFK;DAC-DXB;DAC-SIN;DAC-IST", "chargeableWeight|Chargeable Weight|float|20;4800;kg;1", "ratePerKg|Rate per Kg|float|1.2;7.4;USD;2", "freight|Air Freight|money|200;28000", "transitHours|Transit|int|8;72;hrs", "onTime|On-Time|pct|40;100", "date|Shipped On|date|-240;10"],
    statuses: ["Booked", "Uplifted", "Delivered", "Delayed", "Offloaded"],
    measure: "freight", rows: 44,
  },

  /* ── 45 ────────────────────────────────────────────────────────────── */
  "container-loading": {
    name: "Container Loading Management", kind: "board", summary: "Loading stages from plan to seal",
    entity: "Loading Job", ref: "CLD",
    fields: [CONTAINER, ORDER, "cartonsLoaded|Cartons Loaded|int|10;2400;cartons", "utilisation|Utilisation|pct|28;100", "loadingPoint|Loading Point|enum|Factory yard;ICD Kamalapur;Chattogram CFS;Off-dock depot", "supervisor|Supervisor|person", "date|Loading Date|date|-60;30"],
    statuses: ["Sealed", "Loaded", "Loading", "Planned", "Held"],
    measure: "utilisation", rows: 50,
  },

  /* ── 46 ────────────────────────────────────────────────────────────── */
  "stuffing-plan": {
    name: "Stuffing Plan Management", kind: "list", summary: "How the cartons go into the box",
    entity: "Stuffing Plan", ref: "STF",
    fields: [ORDER, BUYER, "containerType|Container|enum|20ft GP;40ft GP;40ft HC;LCL consolidation;Air ULD", "cartons|Cartons|int|10;2400;cartons", "cbm|Planned CBM|float|0.4;68;CBM;2", "grossWeight|Gross Weight|float|22;26000;kg;1", "stackHeight|Stack Height|int|2;9;tiers", "plannedBy|Planned By|person", "date|Stuffing Date|date|-40;40"],
    statuses: ["Approved", "Planned", "Executed", "Revised", "Cancelled"],
    measure: "cbm", rows: 46,
    insight: "Metal trims are dense enough that weight, not volume, is the binding limit on about a third of plans — a container closed at 78% CBM is often already at its payload.",
  },

  /* ── 47 ────────────────────────────────────────────────────────────── */
  container: {
    name: "Container Management", kind: "list", summary: "Boxes, demurrage and detention",
    entity: "Container", ref: "CNR",
    fields: [CONTAINER, LINE, "size|Size|enum|20ft GP;40ft GP;40ft HC;45ft HC;Reefer", PORT, "cargoValue|Cargo Value|money|8000;620000", "demurrageDays|Demurrage|int|0;18;days", "demurrageCost|Demurrage Cost|money|0;4800", "date|Gated Out|date|-200;20"],
    statuses: ["In Transit", "At Port", "Discharged", "Returned", "Detained"],
    measure: "cargoValue", rows: 52,
  },

  /* ── 48 ────────────────────────────────────────────────────────────── */
  "container-seal": {
    name: "Container Seal Management", kind: "list", summary: "Seal numbers and chain of custody",
    entity: "Seal Record", ref: "SEL",
    fields: [CONTAINER, "sealNo|Seal No|enum|SL-8841203;SL-8841257;SL-8841311;SL-8841368;SL-8841422", "sealType|Seal Type|enum|Bolt seal;Cable seal;Customs seal;Buyer seal;Carrier seal", "affixedBy|Affixed By|person", "witnessedBy|Witnessed By|enum|Customs officer;C&F agent;Buyer QA;Security in-charge", "verifiedAtPort|Verified at Port|bool|Verified;Not verified", "cargoValue|Cargo Value|money|8000;620000", "date|Sealed On|date|-200;20"],
    statuses: ["Intact", "Verified", "Replaced", "Broken", "Under Investigation"],
    measure: "cargoValue", rows: 46,
  },

  /* ── 49 ────────────────────────────────────────────────────────────── */
  "cargo-consolidation": {
    name: "Cargo Consolidation Management", kind: "list", summary: "LCL combined into full containers",
    entity: "Consolidation", ref: "CON",
    fields: ["consolNo|Consolidation No|enum|CS-3341;CS-3368;CS-3384;CS-3399", "buyersCombined|Buyers Combined|int|2;6", "ordersCombined|Orders Combined|int|2;12", "cbm|Total CBM|float|2;68;CBM;2", "savings|Freight Saved|money|100;9800", PORT, "cfs|CFS|enum|Chattogram CFS;ICD Kamalapur;Off-dock depot;Forwarder warehouse", "date|Consolidated On|date|-200;20"],
    statuses: ["Shipped", "Consolidated", "Planned", "Split", "Cancelled"],
    measure: "savings", rows: 42,
  },

  /* ── 50 ────────────────────────────────────────────────────────────── */
  "bill-of-lading": {
    name: "Bill of Lading (BL) Management", kind: "list", summary: "Every BL and its release status",
    entity: "Bill of Lading", ref: "BLR",
    fields: [BUYER, "blNo|BL No|enum|BL-MAEU4471;BL-MAEU4520;BL-MSCU7712;BL-CMAU3348;BL-HLXU9921", "blType|BL Type|enum|Original;Telex release;Seaway bill;Switch BL;House BL", LINE, PORT, "containers|Containers|int|1;12", "value|Cargo Value|money|8000;620000", "freightTerm|Freight|enum|Prepaid;Collect", "date|BL Date|date|-240;10"],
    statuses: ["Issued", "Released", "Surrendered", "Draft", "Amended"],
    measure: "value", rows: 54,
  },

  /* ── 51 ────────────────────────────────────────────────────────────── */
  "air-waybill": {
    name: "Air Waybill (AWB) Management", kind: "list", summary: "Air consignment notes and freight",
    entity: "Air Waybill", ref: "AWB",
    fields: [BUYER, "awbNo|AWB No|enum|176-44718822;157-77883456;235-99011234;125-33480176", AIRLINE, "route|Route|enum|DAC-FRA;DAC-AMS;DAC-JFK;DAC-DXB;DAC-SIN", "pieces|Pieces|int|1;220;pcs", "chargeableWeight|Chargeable Weight|float|20;4800;kg;1", "freight|Air Freight|money|200;28000", "date|AWB Date|date|-240;10"],
    statuses: ["Issued", "Uplifted", "Delivered", "Draft", "Amended"],
    measure: "freight", rows: 44,
  },

  /* ── 52 ────────────────────────────────────────────────────────────── */
  "export-document": {
    name: "Export Document Management", kind: "list", summary: "The full document set per shipment",
    entity: "Export Document", ref: "EDC",
    fields: [ORDER, BUYER, "docType|Document|enum|Commercial invoice;Packing list;Bill of lading;Air waybill;Certificate of origin;GSP certificate;Insurance certificate;Beneficiary certificate;Inspection certificate;EXP form", "docNo|Document No|enum|DOC-4411;DOC-4438;DOC-4452;DOC-4477;DOC-4491", "copies|Copies|int|1;8;copies", "checklistDone|Checklist Complete|pct|20;100", OWNER, "date|Issued On|date|-240;10"],
    statuses: ["Issued", "Submitted", "Prepared", "Pending", "Discrepant"],
    measure: "checklistDone", rows: 60,
  },

  /* ── 53 ────────────────────────────────────────────────────────────── */
  "document-repository": {
    name: "Export Document Repository", kind: "list", summary: "Where the file actually lives",
    entity: "Repository File", ref: "DRP",
    fields: [BUYER, "docType|Document|enum|Commercial invoice;Packing list;Bill of lading;Certificate of origin;LC copy;EXP form;Contract;Insurance policy", "fileName|File|text|CI-26-0411.pdf;PL-26-0411.xlsx;BL-MAEU4471.pdf;COO-7741.pdf;LC-88214.pdf;EXP-26-0411.pdf", "sizeMb|Size|float|0.1;48;MB;2", "retentionYears|Retention|int|1;10;years", "access|Access|enum|Visible to buyer;Commercial team;Finance only;Restricted", "indexed|Full-text Indexed|bool|Indexed;Not indexed", "date|Archived On|date|-700;0"],
    statuses: ["Archived", "Active", "Under Review", "Purge Due", "Deleted"],
    measure: "sizeMb", rows: 58,
  },

  /* ── 54 ────────────────────────────────────────────────────────────── */
  "document-approval": {
    name: "Document Approval", kind: "board", summary: "Who is holding which document",
    entity: "Approval Task", ref: "DAP",
    fields: ["docType|Document|enum|Commercial invoice;Packing list;Draft BL;Certificate of origin;LC amendment;Export contract;Shipping instruction", BUYER, "approver|Approver|person", "level|Approval Level|enum|Level 1 - Officer;Level 2 - Manager;Level 3 - Head;Level 4 - Director", "value|Value at Stake|money|0;620000", "pendingHours|Pending For|float|0.5;480;hrs;1", "slaHours|SLA|int|4;120;hrs", "date|Raised On|date|-200;0"],
    statuses: ["Approved", "In Review", "Pending", "Escalated", "Rejected"],
    measure: "pendingHours", rows: 56,
    insight: "Two approvers hold nearly half of the open queue. Rebalancing on workload rather than on buyer ownership clears the current backlog in about four working days.",
  },

  /* ── 55 ────────────────────────────────────────────────────────────── */
  "document-verification": {
    name: "Document Verification", kind: "list", summary: "Cross-checks before the bank sees it",
    entity: "Verification Check", ref: "DVF",
    fields: ["docType|Document|enum|Commercial invoice;Packing list;Bill of lading;Certificate of origin;EXP form;Insurance certificate", "checkType|Check|enum|LC term match;Invoice vs packing list;HS code match;Buyer name and address;Quantity match;Signature and stamp;Date sequence", "result|Result|enum|Match;Minor deviation;Mismatch;Not checked", "findings|Findings|int|0;12", "valueAtRisk|Value at Risk|money|0;620000", "verifiedBy|Verified By|person", "date|Checked On|date|-200;0"],
    statuses: ["Verified", "Corrected", "Open", "Escalated", "Waived"],
    measure: "valueAtRisk", rows: 56,
    insight: "Every discrepancy the bank later raises was catchable here. The three checks that matter are LC term match, quantity match and the date sequence.",
  },

  /* ── 56 ────────────────────────────────────────────────────────────── */
  "document-version-control": {
    name: "Document Version Control", kind: "list", summary: "Which draft went to the bank",
    entity: "Document Version", ref: "DVC",
    fields: ["docNo|Document No|enum|DOC-4411;DOC-4438;DOC-4452;DOC-4477;DOC-4491", "docType|Document|enum|Commercial invoice;Packing list;Draft BL;Certificate of origin;Contract;Shipping instruction", "version|Version|enum|V1;V2;V3;V4;V5", "changeReason|Change Reason|text|Buyer address corrected;Quantity revised;Incoterm changed;HS code corrected;Bank details updated;Signature re-applied", "author|Prepared By|person", "supersededBy|Superseded By|enum|V2;V3;V4;V5;Current", "sizeMb|Size|float|0.1;24;MB;2", "date|Version Date|date|-400;0"],
    statuses: ["Current", "Superseded", "Draft", "Archived"],
    measure: "sizeMb", rows: 50,
  },

  /* ── 57 ────────────────────────────────────────────────────────────── */
  "customs-clearance": {
    name: "Customs Clearance Management", kind: "board", summary: "Export declaration stages",
    entity: "Export Entry", ref: "CEX",
    fields: [ORDER, "billNo|Bill of Export|enum|BE-77121;BE-77188;BE-77244;BE-77301;BE-77366", "agent|C&F Agent|enum|Prime Clearing;Unity C&F;Chattogram Clearing House;Speedway Agents", HS_CODE, "value|Declared Value|money|8000;620000", "charges|Clearing Charges|money|60;4800", "date|Filed On|date|-200;10"],
    statuses: ["Cleared", "Examined", "Assessment", "Filed", "Documents Ready", "Held"],
    measure: "value", rows: 54,
  },

  /* ── 58 ────────────────────────────────────────────────────────────── */
  "bond-clearance": {
    name: "Bond Clearance Management", kind: "list", summary: "Bonded material against consumption",
    entity: "Bond Entry", ref: "BND",
    fields: ["bondLicence|Bond Licence|enum|BL-2210441;BL-2210458;BL-2210473;BL-2210490", "material|Bonded Material|enum|Brass rod;Zinc alloy ingot;Zip tape;Nickel-free coating;Packaging board;Dye chemicals", "importedQty|Imported Qty|float|100;48000;kg;1", "consumedQty|Consumed Qty|float|0;48000;kg;1", "balanceQty|Bond Balance|float|0;24000;kg;1", "utilisation|Utilisation|pct|0;100", "auditDue|Audit Due|date|-30;300", "date|Entry Date|date|-400;0"],
    statuses: ["Reconciled", "Open", "Under Audit", "Short", "Expired"],
    measure: "importedQty", rows: 48,
  },

  /* ── 59 ────────────────────────────────────────────────────────────── */
  "shipment-tracking": {
    name: "Export Shipment Tracking", kind: "analytics", summary: "Vessel, voyage and ETA",
    entity: "Tracked Shipment", ref: "TRK",
    fields: [ORDER, BUYER, VESSEL, PORT, "progress|Voyage Progress|pct|4;99", "etaDays|Days to ETA|int|0;42;days", "lastPort|Last Reported Port|enum|Chattogram;Colombo;Singapore;Jebel Ali;Port Said;Algeciras;Rotterdam", "date|ETA|date|-15;50"],
    statuses: ["On Schedule", "Minor Delay", "Delayed", "Arrived", "Discharged"],
    measure: "progress", rows: 56,
  },

  /* ── 60 ────────────────────────────────────────────────────────────── */
  "goods-in-transit": {
    name: "Goods in Transit Monitoring", kind: "analytics", summary: "Value on the water and who carries it",
    entity: "In-Transit Consignment", ref: "GIT",
    fields: [BUYER, SHIPMENT, "mode|Mode|enum|Sea;Air;Sea-air;Road;Courier", "currentLeg|Current Leg|enum|Factory to port;At load port;On water;At transhipment;At discharge port;Inland delivery", "cargoValue|Cargo Value|money|8000;620000", "daysInTransit|Days in Transit|int|0;52;days", "insured|Insured|bool|Insured;Not insured", "date|Departed On|date|-90;0"],
    statuses: ["In Transit", "At Transhipment", "Arrived", "Delivered", "Held"],
    measure: "cargoValue", rows: 54,
  },

  /* ── 61 ────────────────────────────────────────────────────────────── */
  "eta-monitoring": {
    name: "ETA Monitoring", kind: "analytics", summary: "Arrival slippage against the promise",
    entity: "ETA Record", ref: "ETA",
    fields: [BUYER, VESSEL, PORT, "originalEta|Original ETA|date|-30;60", "revisedEta|Revised ETA|date|-30;70", "slipDays|ETA Slip|int|0;21;days", "cargoValue|Cargo Value|money|8000;620000", "buyerNotified|Buyer Notified|bool|Notified;Not notified", "date|Updated On|date|-60;0"],
    statuses: ["On Schedule", "Minor Delay", "Delayed", "Arrived", "Unknown"],
    measure: "cargoValue", rows: 52,
  },

  /* ── 62 ────────────────────────────────────────────────────────────── */
  "etd-monitoring": {
    name: "ETD Monitoring", kind: "analytics", summary: "Did it actually sail when it was meant to",
    entity: "ETD Record", ref: "ETD",
    fields: [BUYER, VESSEL, "loadPort|Port of Loading|enum|Chattogram;Mongla;Pangaon ICT;Dhaka Airport;Payra", "plannedEtd|Planned ETD|date|-40;50", "actualEtd|Actual ETD|date|-40;50", "slipDays|ETD Slip|int|0;18;days", "cartons|Cartons|int|10;2400;cartons", "rolled|Rolled Over|bool|Rolled;Sailed as booked", "date|Updated On|date|-60;0"],
    statuses: ["Sailed on Time", "Minor Delay", "Delayed", "Rolled Over", "Awaiting"],
    measure: "cartons", rows: 50,
  },

  /* ── 63 ────────────────────────────────────────────────────────────── */
  "buyer-document-dispatch": {
    name: "Buyer Document Dispatch Management", kind: "list", summary: "Sending the set to the buyer",
    entity: "Document Dispatch", ref: "BDD",
    fields: [BUYER, "docSet|Document Set|enum|Full negotiation set;Non-negotiable copies;Original BL set;Certificate set;Sample documents", "courier|Courier|enum|DHL;FedEx;UPS;Aramex;Bank courier;Hand delivery", "awbNo|Courier AWB|enum|DHL 4471882201;FedEx 7788345612;UPS 1Z99AA10;Aramex 4471882;Bank courier", "copies|Copies|int|1;8;copies", "cost|Courier Cost|money|10;420", "date|Dispatched On|date|-240;10"],
    statuses: ["Delivered", "In Transit", "Dispatched", "Prepared", "Returned"],
    measure: "cost", rows: 48,
  },

  /* ── 64 ────────────────────────────────────────────────────────────── */
  "courier-tracking": {
    name: "Courier Tracking Management", kind: "list", summary: "Where the paper is right now",
    entity: "Courier Consignment", ref: "CTR",
    fields: [BUYER, COUNTRY, "courier|Courier|enum|DHL;FedEx;UPS;Aramex;Bank courier", "awbNo|Courier AWB|enum|DHL 4471882201;FedEx 7788345612;UPS 1Z99AA10;Aramex 4471882", "lastScan|Last Scan|enum|Picked up;In transit;Customs clearance;Out for delivery;Delivered;Exception", "transitDays|Transit|int|1;14;days", "cost|Cost|money|10;420", "date|Picked Up On|date|-120;0"],
    statuses: ["Delivered", "In Transit", "Exception", "Delayed", "Returned"],
    measure: "cost", rows: 48,
  },

  /* ── 65 ────────────────────────────────────────────────────────────── */
  "foreign-currency": {
    name: "Foreign Currency Management", kind: "analytics", summary: "Receivable book by currency and cover",
    entity: "Currency Position", ref: "FCY",
    fields: [CURRENCY, BUYER, "receivable|Receivable|money|8000;1800000", "hedged|Hedged|money|0;1800000", "openExposure|Open Exposure|money|0;1200000", "gainLoss|Exchange Gain / Loss|money|0;62000", "avgRate|Average Rate|float|0.8;135;BDT;2", "date|As At|date|-330;0"],
    statuses: ["Hedged", "Partially Hedged", "Open", "Settled", "At Risk"],
    measure: "openExposure", rows: 48,
    insight: "The EUR book is 11% of volume and carries most of the exposure — it is the only currency where receipts routinely land more than sixty days after invoicing.",
  },

  /* ── 66 ────────────────────────────────────────────────────────────── */
  "exchange-rate": {
    name: "Exchange Rate Management", kind: "list", summary: "Which rate applies to which document",
    entity: "Rate Record", ref: "FXR",
    fields: [CURRENCY, "rateType|Rate Type|enum|BB spot rate;Bank buying rate;Bank selling rate;Booked forward rate;Contract rate", BANK, "rate|Rate|float|0.8;145;BDT;4", "previousRate|Previous Rate|float|0.8;145;BDT;4", "changePct|Change|pct|90;110", "appliedTo|Applied To|enum|Invoicing;Realisation;Costing;Book revaluation", "date|Rate Date|date|-200;0"],
    statuses: ["Current", "Superseded", "Provisional", "Locked"],
    measure: "rate", rows: 56,
  },

  /* ── 67 ────────────────────────────────────────────────────────────── */
  "bank-negotiation": {
    name: "Bank Negotiation Management", kind: "list", summary: "Document submission to the bank",
    entity: "Negotiation", ref: "LCN",
    fields: [BUYER, BANK, LC_NO, "amount|Negotiated Amount|money|10000;620000", "charges|Bank Charges|money|60;6800", "tenorDays|Tenor|int|0;180;days", "discrepancies|Discrepancies|int|0;6", OWNER, "date|Submitted On|date|-220;10"],
    statuses: ["Negotiated", "Under Scrutiny", "Submitted", "Prepared", "Discrepant"],
    measure: "amount", rows: 54,
  },

  /* ── 68 ────────────────────────────────────────────────────────────── */
  "export-payment-tracking": {
    name: "Export Payment Tracking", kind: "list", summary: "Invoiced against received",
    entity: "Payment", ref: "EPT",
    fields: [BUYER, BANK, INVOICE, "invoiceValue|Invoice Value|money|8000;620000", "received|Received|money|0;620000", "balance|Balance|money|0;480000", "overdueDays|Overdue|int|0;180;days", "dueDate|Due Date|date|-120;120", "date|Received On|date|-240;10"],
    statuses: ["Received", "Partially Received", "Awaited", "Overdue", "Written Off"],
    measure: "invoiceValue", rows: 58,
    insight: "Outstanding runs at about a quarter of invoiced value, but most of it is still inside terms — the genuinely overdue slice sits with one buyer and one shipping dispute.",
  },

  /* ── 69 ────────────────────────────────────────────────────────────── */
  "export-collection": {
    name: "Export Collection Management", kind: "list", summary: "DP and DA bills lodged with the bank",
    entity: "Collection Bill", ref: "COL",
    fields: [BUYER, BANK, "collectionType|Collection|enum|Documents against payment (DP);Documents against acceptance (DA);Clean collection;Direct collection", "amount|Bill Amount|money|8000;620000", "charges|Collection Charges|money|20;2400", "tenorDays|Tenor|int|0;120;days", "acceptedOn|Accepted On|date|-180;10", "date|Lodged On|date|-220;10"],
    statuses: ["Realised", "Accepted", "Lodged", "Overdue", "Returned"],
    measure: "amount", rows: 46,
  },

  /* ── 70 ────────────────────────────────────────────────────────────── */
  "realization-certificate": {
    name: "Realization Certificate Management", kind: "list", summary: "PRC issued against proceeds received",
    entity: "Realisation Certificate", ref: "RLZ",
    fields: [BUYER, BANK, INVOICE, "prcNo|PRC No|enum|PRC-6641;PRC-6668;PRC-6684;PRC-6699", "invoiceValue|Invoice Value|money|8000;620000", "realised|Realised|money|0;620000", "realisedPct|Realised|pct|0;100", "daysToRealise|Days to Realise|int|5;180;days", "date|Realisation Date|date|-240;40"],
    statuses: ["Fully Realised", "Partially Realised", "Awaited", "Overdue", "Written Off"],
    measure: "invoiceValue", rows: 54,
    insight: "The PRC is what every incentive claim is built on. Claims sitting unfiled are almost always waiting on a certificate nobody chased, not on a payment.",
  },

  /* ── 71 ────────────────────────────────────────────────────────────── */
  "export-incentive": {
    name: "Export Incentive Management", kind: "analytics", summary: "Every scheme claimed and recovered",
    entity: "Incentive Claim", ref: "INC",
    fields: [BUYER, "scheme|Scheme|enum|Cash incentive 4%;Duty drawback;Export development fund;Bond facility;VAT rebate;Alternative cash assistance", "exportValue|Export Value|money|20000;900000", "claimAmount|Claim Amount|money|400;38000", "receivedAmount|Received|money|0;38000", BANK, "audit|Audit|enum|Not required;Pending;In progress;Cleared;Objection", "date|Claim Date|date|-330;20"],
    statuses: ["Received", "Under Scrutiny", "Submitted", "Prepared", "Rejected"],
    measure: "claimAmount", rows: 52,
  },

  /* ── 72 ────────────────────────────────────────────────────────────── */
  "cash-assistance": {
    name: "Cash Assistance Management", kind: "list", summary: "Cash incentive on realised FOB",
    entity: "Cash Assistance Claim", ref: "CAS",
    fields: [BUYER, BANK, "expNo|EXP No|enum|EXP-26-0411;EXP-26-0428;EXP-26-0443;EXP-26-0461", "fobValue|FOB Value|money|8000;620000", "ratePct|Assistance Rate|pct|1;4", "claimAmount|Claim Amount|money|100;24000", "received|Received|money|0;24000", "localValueAdd|Local Value Addition|pct|20;80", "date|Claim Date|date|-330;20"],
    statuses: ["Received", "Under Scrutiny", "Submitted", "Prepared", "Rejected"],
    measure: "claimAmount", rows: 48,
  },

  /* ── 73 ────────────────────────────────────────────────────────────── */
  "duty-drawback": {
    name: "Duty Drawback Management", kind: "list", summary: "Duty paid on inputs, claimed back",
    entity: "Drawback Claim", ref: "DDB",
    fields: [BUYER, "inputMaterial|Input Material|enum|Brass rod;Zinc alloy ingot;Nickel-free coating;Zip tape;Packaging board;Dye chemicals", "dutyPaid|Duty Paid|money|100;48000", "drawbackClaimed|Drawback Claimed|money|60;38000", "received|Received|money|0;38000", "recovery|Recovery|pct|0;100", "office|Drawback Office|enum|DEDO Dhaka;DEDO Chattogram;Customs Bond Commissionerate", "date|Claim Date|date|-360;20"],
    statuses: ["Received", "Under Scrutiny", "Submitted", "Prepared", "Rejected"],
    measure: "drawbackClaimed", rows: 46,
  },

  /* ── 74 ────────────────────────────────────────────────────────────── */
  "export-cost-analysis": {
    name: "Export Cost Analysis", kind: "analytics", summary: "What it costs to get FOB to the buyer",
    entity: "Costing Line", ref: "ECS",
    fields: [ORDER, BUYER, "fob|FOB Value|money|8000;620000", "freight|Freight|money|200;38000", "insurance|Insurance|money|20;3400", "clearing|Clearing & Handling|money|60;6800", "docCharges|Documentation & Bank|money|40;5200", "totalCost|Total Export Cost|money|400;56000", "costOfFob|Cost of FOB|pct|2;18", "date|Costed On|date|-300;0"],
    statuses: ["Approved", "Reviewed", "Provisional", "Revised"],
    measure: "fob", rows: 54,
  },

  /* ── 75 ────────────────────────────────────────────────────────────── */
  "export-profitability": {
    name: "Export Profitability Analysis", kind: "analytics", summary: "Revenue, cost and what is left",
    entity: "Profitability Line", ref: "EPF",
    fields: [BUYER, COUNTRY, ORDER, "revenue|Revenue|money|8000;620000", "cogs|Cost of Goods|money|4000;480000", "exportCost|Export Cost|money|400;56000", "incentive|Incentive Credit|money|0;24000", "netProfit|Net Profit|money|0;180000", "marginPct|Net Margin|pct|2;42", "date|Period End|date|-330;0"],
    statuses: ["Profitable", "On Target", "Thin Margin", "Under Review", "Loss Making"],
    measure: "netProfit", rows: 58,
  },

  /* ── 76 ────────────────────────────────────────────────────────────── */
  "margin-analysis": {
    name: "Margin Analysis", kind: "analytics", summary: "Price against cost, style by style",
    entity: "Margin Line", ref: "MRG",
    fields: [BUYER, "style|Style|enum|SM-DENIM-1180;SM-TRIM-2240;SM-BTN-3310;SM-ZIP-4420;SM-RVT-5150;SM-EYE-6280;SM-BKL-7360", "unitPrice|Unit Price|float|0.02;4.8;USD;3", "unitCost|Unit Cost|float|0.01;3.9;USD;3", "grossMargin|Gross Margin|pct|2;52", "contribution|Contribution|money|400;280000", "volume|Volume|int|20000;900000;pcs", "date|Period End|date|-330;0"],
    statuses: ["Above Target", "On Target", "Below Target", "Negative"],
    measure: "contribution", rows: 56,
    insight: "Brass-heavy styles carry the thinnest margins and the largest volumes. A metal-price move of five percent wipes out more contribution than any freight saving can recover.",
  },

  /* ── 77 ────────────────────────────────────────────────────────────── */
  "buyer-profitability": {
    name: "Buyer Profitability Analysis", kind: "analytics", summary: "Which buyers actually pay their way",
    entity: "Buyer P&L", ref: "BPL",
    fields: [BUYER, COUNTRY, PERIOD, "revenue|Revenue|money|20000;2400000", "directCost|Direct Cost|money|10000;1800000", "costToServe|Cost to Serve|money|400;180000", "netProfit|Net Profit|money|0;620000", "marginPct|Net Margin|pct|2;42", "shareOfProfit|Share of Profit|pct|1;34", "date|Period End|date|-330;0"],
    statuses: ["Key Account", "Profitable", "Marginal", "Loss Making", "Exit Candidate"],
    measure: "netProfit", rows: 50,
    insight: "Cost to serve is what separates the list — two mid-volume buyers earn more net profit than the largest account once inspection, amendment and courier costs are loaded back on.",
  },

  /* ── 78 ────────────────────────────────────────────────────────────── */
  "commercial-approval-workflow": {
    name: "Commercial Approval Workflow", kind: "board", summary: "Everything waiting on a signature",
    entity: "Approval Request", ref: "CAW",
    fields: ["requestType|Request|enum|Invoice approval;LC acceptance;Contract signature;Amendment approval;Freight rate approval;Discount approval;Document release", BUYER, "raisedBy|Raised By|person", "approver|Current Approver|person", "value|Value|money|0;620000", "pendingHours|Pending For|float|0.5;480;hrs;1", "slaHours|SLA|int|4;120;hrs", "date|Raised On|date|-200;0"],
    statuses: ["Approved", "In Review", "Pending", "Escalated", "Rejected"],
    measure: "value", rows: 60,
  },

  /* ── 79 ────────────────────────────────────────────────────────────── */
  "multi-level-approval": {
    name: "Multi-Level Approval Workflow", kind: "settings", summary: "Thresholds, levels and escalation",
    entity: "Approval Rule", ref: "MLA",
    fields: ["documentType|Document|enum|Commercial invoice;Export contract;LC amendment;Freight booking;Discount request;Document release", "level|Level|enum|Level 1 - Officer;Level 2 - Manager;Level 3 - Head;Level 4 - Director;Level 5 - MD", "threshold|Value Threshold|money|1000;1800000", "approver|Approver|person", "escalateAfter|Escalate After|int|4;168;hrs", "delegation|Delegation|bool|Delegation allowed;No delegation", "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    measure: "threshold", rows: 42,
    settings: ["Escalate to the next level automatically when the SLA lapses", "Require a second approver on anything above USD 100,000"],
  },

  /* ── 80 ────────────────────────────────────────────────────────────── */
  "digital-signature": {
    name: "Digital Signature Management", kind: "list", summary: "Who signed what, and with which certificate",
    entity: "Signature Event", ref: "DSG",
    fields: ["docType|Document|enum|Commercial invoice;Export contract;Bill of lading instruction;Certificate application;LC amendment request;Bank forwarding letter", "signer|Signer|person", "method|Method|enum|Digital certificate;E-signature pad;Scanned signature;Bank token;Two-factor approval", "documents|Documents Signed|int|1;48", "verified|Verified|bool|Verified;Unverified", "certificateExpiry|Certificate Valid Until|date|-30;500", "date|Signed On|date|-300;0"],
    statuses: ["Signed", "Verified", "Pending", "Expired", "Revoked"],
    measure: "documents", rows: 46,
  },

  /* ── 81 ────────────────────────────────────────────────────────────── */
  "commercial-notification": {
    name: "Commercial Notification Center", kind: "list", summary: "What was sent, to whom, on which channel",
    entity: "Notification", ref: "CNT",
    fields: ["event|Event|enum|LC expiring;Document discrepancy raised;Shipment delayed;Payment received;Booking confirmed;Certificate rejected;Approval pending;Buyer message", "channel|Channel|enum|Email;SMS;In-app;WhatsApp;Buyer portal", "recipient|Recipient|person", "priority|Priority|enum|Critical;High;Medium;Low", "sent|Sent|int|1;480", "readPct|Read|pct|10;100", "date|Sent On|date|-200;0"],
    statuses: ["Delivered", "Read", "Acknowledged", "Queued", "Failed"],
    measure: "sent", rows: 58,
  },

  /* ── 82 ────────────────────────────────────────────────────────────── */
  "commercial-task": {
    name: "Commercial Task Management", kind: "board", summary: "The desk's open work",
    entity: "Task", ref: "CTK",
    fields: ["task|Task|enum|Prepare invoice set;Chase buyer confirmation;Apply for COO;Submit documents to bank;Follow up realisation;Book vessel space;Correct discrepancy;File incentive claim", BUYER, "assignee|Assigned To|person", "priority|Priority|enum|Critical;High;Medium;Low", "value|Value at Stake|money|0;620000", "ageDays|Age|int|0;90;days", "dueDate|Due Date|date|-30;60", "date|Raised On|date|-200;0"],
    statuses: ["Completed", "In Progress", "Open", "Blocked", "Overdue"],
    measure: "value", rows: 60,
  },

  /* ── 83 ────────────────────────────────────────────────────────────── */
  "reminder-management": {
    name: "Reminder Management", kind: "calendar", summary: "Deadlines that must not be missed",
    entity: "Reminder", ref: "RMD",
    fields: ["reminderFor|Reminder For|enum|LC expiry;Document presentation deadline;Shipment cut-off;Payment due;Contract renewal;Certificate expiry;Incentive claim window", BUYER, OWNER, "leadDays|Lead Time|int|1;60;days", "channel|Channel|enum|Email;SMS;In-app;Calendar invite", "repeat|Repeat|enum|Once;Daily until done;Every 3 days;Weekly", "date|Reminder Date|date|-30;120"],
    statuses: ["Scheduled", "Sent", "Acknowledged", "Snoozed", "Missed"],
    measure: "leadDays", rows: 52,
  },

  /* ── 84 ────────────────────────────────────────────────────────────── */
  "export-compliance": {
    name: "Export Compliance Management", kind: "list", summary: "Bangladesh Bank, NBR and EPB obligations",
    entity: "Compliance Check", ref: "ECP",
    fields: [BUYER, COUNTRY, "requirement|Requirement|enum|EXP form issued;LC terms met;COO obtained;Correct HS code;Bond reconciliation;Repatriation within 120 days;ERQ account rules", "authority|Authority|enum|Bangladesh Bank;NBR;EPB;Customs;Buyer", "result|Result|enum|Compliant;Observation;Non-compliant;Not applicable", "valueAtRisk|Value at Risk|money|0;620000", "actionDue|Action Due|date|-30;120", "date|Checked On|date|-300;0"],
    statuses: ["Compliant", "Under Review", "Observation", "Non-compliant", "Waived"],
    measure: "valueAtRisk", rows: 54,
  },

  /* ── 85 ────────────────────────────────────────────────────────────── */
  "trade-compliance": {
    name: "Trade Compliance Management", kind: "list", summary: "Sanctions and denied-party screening",
    entity: "Trade Control Check", ref: "TCP",
    fields: [BUYER, COUNTRY, "screening|Screening|enum|Denied party screening;Sanctioned country check;Dual-use goods check;End-use declaration;Embargo check;Vessel sanction screening", "list|List|enum|OFAC SDN;EU consolidated list;UN sanctions;UK HMT;Internal watchlist", "matchScore|Match Score|pct|0;99", "hits|Hits|int|0;6", "clearedBy|Cleared By|person", "date|Screened On|date|-300;0"],
    statuses: ["Cleared", "False Positive", "Under Review", "Escalated", "Blocked"],
    measure: "hits", rows: 48,
  },

  /* ── 86 ────────────────────────────────────────────────────────────── */
  "regulatory-compliance": {
    name: "Regulatory Compliance Management", kind: "list", summary: "Destination-market product rules",
    entity: "Regulatory Item", ref: "RCP",
    fields: [COUNTRY, "regulation|Regulation|enum|EU REACH;RoHS;California Prop 65;UKCA marking;CPSIA;Packaging waste directive;Nickel release EN 1811", "evidence|Evidence|enum|Test report;Supplier declaration;Buyer approval;Third-party certificate;Self declaration", "itemsCovered|Items Covered|int|1;180", "exposure|Exposure|money|0;620000", OWNER, "validUntil|Valid Until|date|-60;500", "date|Assessed On|date|-500;0"],
    statuses: ["Compliant", "Renewal Due", "Under Test", "Expired", "Non-compliant"],
    measure: "exposure", rows: 46,
    insight: "Nickel release is the one test that gates the whole European book. Every certificate behind it expires on the supplier's schedule, not on ours.",
  },

  /* ── 87 ────────────────────────────────────────────────────────────── */
  "commercial-audit": {
    name: "Commercial Audit Management", kind: "list", summary: "Internal, bank and regulator audits",
    entity: "Audit", ref: "CAU",
    fields: ["auditType|Audit|enum|Internal commercial audit;Bank audit;Bangladesh Bank inspection;Customs bond audit;Buyer audit;External statutory audit", "scope|Scope|enum|LC documentation;Export realisation;Incentive claims;Bond register;Freight contracts;Approval controls", "findings|Findings|int|0;24", "majorFindings|Major Findings|int|0;8", "closedPct|Findings Closed|pct|0;100", "auditor|Lead Auditor|person", "date|Audit Date|date|-500;30"],
    statuses: ["Closed", "Follow-up", "In Progress", "Planned", "Overdue"],
    measure: "findings", rows: 44,
  },

  /* ── 88 ────────────────────────────────────────────────────────────── */
  "audit-trail": {
    name: "Audit Trail Management", kind: "list", summary: "Every change, with a name against it",
    entity: "Audit Entry", ref: "ATR",
    fields: ["action|Action|enum|Record created;Record edited;Document approved;Document deleted;Status changed;Export downloaded;Permission changed;LC amended", "area|Area|enum|Invoice;LC;Documents;Booking;Payments;Incentives;Master data", "user|User|person", "recordRef|Record|enum|CI-26-0411;LC-88214;BL-MAEU4471;EXP-26-0411;BK-77121;COO-7741", "fieldsChanged|Fields Changed|int|0;18", "source|Source|enum|Office network;VPN;Mobile app;Buyer portal;Integration service", "date|Logged On|date|-300;0"],
    statuses: ["Logged", "Reviewed", "Flagged", "Investigated"],
    measure: "fieldsChanged", rows: 64,
  },

  /* ── 89 ────────────────────────────────────────────────────────────── */
  "exception-management": {
    name: "Exception Management", kind: "list", summary: "What went wrong and who owns it",
    entity: "Exception", ref: "EXC",
    fields: ["exceptionType|Exception|enum|Document discrepancy;Shipment delay;Short shipment;Payment shortfall;Wrong HS code;Missing certificate;Container detained;Rate mismatch", BUYER, "severity|Severity|enum|Critical;High;Medium;Low", "valueAtRisk|Value at Risk|money|0;620000", "ageDays|Age|int|0;120;days", "rootCause|Root Cause|text|Buyer term communicated late;Bank clause misread;Vessel rolled by line;Data entry error;Supplier delay;Customs query", OWNER, "date|Raised On|date|-300;0"],
    statuses: ["Resolved", "Under Correction", "Open", "Escalated", "Accepted"],
    measure: "valueAtRisk", rows: 58,
    insight: "Discrepancies and rolled vessels are two thirds of all exceptions, and both are visible days before they bite — the exception log is really a lagging view of the approval queue.",
  },

  /* ── 90 ────────────────────────────────────────────────────────────── */
  "commercial-reports": {
    name: "Commercial Reports", kind: "list", summary: "Standing reports and who receives them",
    entity: "Report", ref: "CRP",
    fields: ["report|Report|enum|Commercial summary;LC position;Document status;Approval pending;Exception summary;Buyer ledger;Contract register", "frequency|Frequency|enum|Daily;Weekly;Monthly;Quarterly;On demand", "format|Format|enum|PDF;Excel;CSV;Dashboard link", "recipients|Recipients|int|1;24", "runs|Runs (YTD)|int|1;260", OWNER, "date|Last Run|date|-120;0"],
    statuses: ["Published", "Scheduled", "Draft", "Failed", "Retired"],
    measure: "runs", rows: 46,
  },

  /* ── 91 ────────────────────────────────────────────────────────────── */
  "export-reports": {
    name: "Export Reports", kind: "list", summary: "Register, country and item-wise export",
    entity: "Export Report", ref: "ERR",
    fields: [COUNTRY, BUYER, PERIOD, "report|Report|enum|Export register;Country-wise export;Buyer-wise export;Item-wise export;EXP realisation;Shipment summary", "exportValue|Export Value|money|20000;2400000", "shipments|Shipments|int|1;120", "cartons|Cartons|int|100;24000;cartons", "date|Period End|date|-330;0"],
    statuses: ["Published", "Provisional", "Draft", "Superseded"],
    measure: "exportValue", rows: 52,
  },

  /* ── 92 ────────────────────────────────────────────────────────────── */
  "shipment-reports": {
    name: "Shipment Reports", kind: "list", summary: "Lane, carrier and freight spend",
    entity: "Shipment Report", ref: "SRP",
    fields: [PERIOD, LINE, PORT, "shipments|Shipments|int|1;120", "containers|Containers|int|1;180", "onTime|On-Time|pct|38;100", "avgTransitDays|Average Transit|int|10;48;days", "freightSpend|Freight Spend|money|2000;380000", "date|Period End|date|-330;0"],
    statuses: ["Published", "Provisional", "Draft", "Superseded"],
    measure: "freightSpend", rows: 48,
  },

  /* ── 93 ────────────────────────────────────────────────────────────── */
  "buyer-reports": {
    name: "Buyer Reports", kind: "list", summary: "One page per buyer relationship",
    entity: "Buyer Report", ref: "BRP",
    fields: [BUYER, COUNTRY, PERIOD, "orderValue|Order Value|money|20000;2400000", "shippedValue|Shipped Value|money|0;2400000", "outstanding|Outstanding|money|0;900000", "claims|Claims|int|0;12", "satisfaction|Satisfaction|pct|40;100", "date|Period End|date|-330;0"],
    statuses: ["Published", "Provisional", "Draft", "Superseded"],
    measure: "orderValue", rows: 48,
  },

  /* ── 94 ────────────────────────────────────────────────────────────── */
  "bank-reports": {
    name: "Bank Reports", kind: "list", summary: "LC position, negotiation and charges",
    entity: "Bank Report", ref: "BKR",
    fields: [BANK, PERIOD, "report|Report|enum|LC position;Negotiation summary;Realisation statement;Bank charges;Discrepancy summary;Forward booking", "lcCount|LCs|int|1;60", "negotiated|Negotiated Value|money|20000;2400000", "realised|Realised Value|money|0;2400000", "charges|Bank Charges|money|200;38000", "date|Period End|date|-330;0"],
    statuses: ["Published", "Provisional", "Draft", "Superseded"],
    measure: "negotiated", rows: 46,
  },

  /* ── 95 ────────────────────────────────────────────────────────────── */
  "incentive-reports": {
    name: "Incentive Reports", kind: "list", summary: "Claimed, received and still pending",
    entity: "Incentive Report", ref: "IRP",
    fields: [PERIOD, BANK, "scheme|Scheme|enum|Cash incentive 4%;Duty drawback;Export development fund;VAT rebate;Alternative cash assistance", "claimed|Claimed|money|400;180000", "received|Received|money|0;180000", "pending|Pending|money|0;120000", "recovery|Recovery|pct|0;100", "date|Period End|date|-330;0"],
    statuses: ["Published", "Provisional", "Draft", "Superseded"],
    measure: "claimed", rows: 44,
  },

  /* ── 96 ────────────────────────────────────────────────────────────── */
  "profitability-reports": {
    name: "Profitability Reports", kind: "analytics", summary: "Revenue, cost and margin by period",
    entity: "Profitability Report", ref: "PRP",
    fields: [PERIOD, BUYER, COUNTRY, "revenue|Revenue|money|20000;2400000", "totalCost|Total Cost|money|10000;1800000", "profit|Profit|money|0;620000", "marginPct|Margin|pct|2;42", "yoyChange|YoY Change|pct|60;160", "date|Period End|date|-330;0"],
    statuses: ["Published", "Provisional", "Draft", "Superseded"],
    measure: "profit", rows: 50,
  },

  /* ── 97 ────────────────────────────────────────────────────────────── */
  "kpi-reports": {
    name: "KPI Reports", kind: "analytics", summary: "Attainment against the commercial scorecard",
    entity: "KPI Report", ref: "KRP",
    fields: ["kpi|KPI|enum|Export value;On-time shipment;Document accuracy;Realisation days;Discrepancy rate;Freight cost per carton;Incentive recovery;Approval turnaround", PERIOD, OWNER, "target|Target|float|1;100;index;1", "actual|Actual|float|1;140;index;1", "achievement|Achievement|pct|18;145", "trend|Trend|enum|Improving;Stable;Declining;Volatile", "date|Period End|date|-330;0"],
    statuses: ["Achieved", "On Track", "At Risk", "Missed"],
    measure: "achievement", rows: 48,
  },

  /* ── 98 ────────────────────────────────────────────────────────────── */
  "executive-analytics": {
    name: "Executive Analytics", kind: "analytics", summary: "The board-level read on the export book",
    entity: "Executive View", ref: "EXV",
    fields: [PERIOD, COUNTRY, "exportValue|Export Value|money|40000;3800000", "growth|YoY Growth|pct|60;180", "marginPct|Net Margin|pct|2;38", "realisationDays|Realisation Days|int|18;140;days", "riskExposure|Risk Exposure|money|0;1600000", "headline|Headline|text|Europe lane carries the book;Realisation slipping on two buyers;Freight rates easing on the US lane;Incentive recovery ahead of plan;New market opening in Japan;Discrepancy rate halved", "date|Period End|date|-330;0"],
    statuses: ["Ahead of Plan", "On Track", "At Risk", "Behind Plan"],
    measure: "exportValue", rows: 50,
  },

  /* ── 99 ────────────────────────────────────────────────────────────── */
  "business-intelligence": {
    name: "Business Intelligence Dashboard", kind: "analytics", summary: "Mix, seasonality and the margin bridge",
    entity: "BI Insight", ref: "BID",
    fields: ["analysis|Analysis|enum|Country mix;Buyer concentration;Lane cost curve;Seasonality;Margin bridge;Working capital cycle;Freight benchmark", BUYER, COUNTRY, "metricValue|Metric|money|8000;2400000", "share|Share|pct|1;42", "variance|Variance to Plan|pct|60;160", "confidence|Confidence|pct|48;99", "date|Generated On|date|-330;0"],
    statuses: ["Adopted", "Validated", "Monitoring", "New", "Rejected"],
    measure: "metricValue", rows: 54,
  },

  /* ── 100 ───────────────────────────────────────────────────────────── */
  "ai-export-assistant": {
    name: "AI Export Assistant", kind: "form", summary: "Ask the export book a question",
    entity: "Assistant Session", ref: "AEA",
    fields: ["question|Asked|text|Which shipments miss the LC expiry?;What is my exposure on open-account buyers?;Which lane got more expensive this quarter?;Draft the invoice set for SO-26-2073;Why did realisation slip in May?;Which certificates expire this month?", "intent|Intent|enum|Status lookup;Document drafting;Exception triage;Analysis;Forecast;Compliance check", "recordsRead|Records Read|int|4;480", CONFIDENCE, "action|Action|enum|Answer only;Draft created;Task raised;Alert sent;Escalated to owner", "askedBy|Asked By|person", "responseSec|Response Time|float|0.4;24;s;1", "date|Asked On|date|-200;0"],
    statuses: ["Answered", "Action Taken", "Clarification Needed", "Escalated", "Failed"],
    measure: "recordsRead", rows: 56,
    settings: ["Let the assistant draft documents but never send them without approval", "Cite the source record on every answer"],
  },

  /* ── 101 ───────────────────────────────────────────────────────────── */
  "ai-document-intelligence": {
    name: "AI Document Intelligence", kind: "list", summary: "Reading, classifying and checking documents",
    entity: "Document Insight", ref: "ADI",
    fields: ["docType|Document|enum|Commercial invoice;Packing list;Bill of lading;Air waybill;Certificate of origin;LC copy;Contract", "capability|Capability|enum|Field extraction;Clause detection;LC term matching;Anomaly detection;Classification;Summarisation", "fieldsRead|Fields Read|int|8;180;fields", CONFIDENCE, "issuesFound|Issues Found|int|0;18", "autoFiled|Auto Filed|bool|Auto filed;Held for review", "reviewer|Reviewed By|person", "date|Processed On|date|-200;0"],
    statuses: ["Processed", "Auto Filed", "Needs Review", "Low Confidence", "Failed"],
    measure: "fieldsRead", rows: 56,
    insight: "Clause detection on the LC copy is where the value sits — it catches the presentation-period trap weeks before the documents are ready to present.",
  },

  /* ── 102 ───────────────────────────────────────────────────────────── */
  "ai-ocr-extraction": {
    name: "AI OCR & Data Extraction", kind: "list", summary: "Scans and photos turned into fields",
    entity: "OCR Job", ref: "OCR",
    fields: ["fileName|Source File|text|BL-MAEU4471.pdf;COO-7741-scan.jpg;PackingList-0411.xlsx;LC-88214.pdf;EXP-26-0411.tiff;Courier-POD.png", "sourceType|Source|enum|Native PDF;Scanned image;Fax copy;Photo from mobile;Excel;Email attachment", "pages|Pages Read|int|1;60;pages", "fieldsExtracted|Fields Extracted|int|4;180;fields", CONFIDENCE, "manualFixes|Manual Fixes|int|0;24", "language|Language|enum|English;Bangla;Chinese;German;Mixed", "date|Processed On|date|-200;0"],
    statuses: ["Extracted", "Auto Filed", "Awaiting Review", "Low Confidence", "Failed"],
    measure: "fieldsExtracted", rows: 54,
    insight: "Native PDF and Excel clear without a human nineteen times in twenty. Phone photos of a stamped certificate are where the manual fixes concentrate.",
  },

  /* ── 103 ───────────────────────────────────────────────────────────── */
  "ai-invoice-reader": {
    name: "AI Invoice Reader", kind: "list", summary: "Invoice lines read and matched to the LC",
    entity: "Invoice Read", ref: "AIR",
    fields: [INVOICE, BUYER, "lineItems|Line Items Read|int|1;180", "valueRead|Value Read|money|8000;620000", "currencyDetected|Currency Detected|enum|USD;EUR;GBP;JPY;CNY", CONFIDENCE, "mismatches|Mismatches vs LC|int|0;8", "autoPosted|Auto Posted|bool|Auto posted;Held", "date|Read On|date|-200;0"],
    statuses: ["Read", "Auto Posted", "Needs Review", "Mismatch", "Failed"],
    measure: "valueRead", rows: 52,
  },

  /* ── 104 ───────────────────────────────────────────────────────────── */
  "ai-packing-list-reader": {
    name: "AI Packing List Reader", kind: "list", summary: "Cartons and weights checked against the invoice",
    entity: "Packing List Read", ref: "APL",
    fields: [BUYER, INVOICE, "cartonsRead|Cartons Read|int|10;2400;cartons", "netWeightRead|Net Weight Read|float|20;24000;kg;1", "cbmRead|CBM Read|float|0.4;68;CBM;2", CONFIDENCE, "invoiceMatch|Matches Invoice|bool|Matched;Mismatched", "mismatchedLines|Mismatched Lines|int|0;18", "date|Read On|date|-200;0"],
    statuses: ["Read", "Matched", "Needs Review", "Mismatch", "Failed"],
    measure: "cartonsRead", rows: 50,
  },

  /* ── 105 ───────────────────────────────────────────────────────────── */
  "ai-bl-reader": {
    name: "AI BL Reader", kind: "list", summary: "Bill of lading clauses against LC terms",
    entity: "BL Read", ref: "ABL",
    fields: ["blNo|BL No|enum|BL-MAEU4471;BL-MAEU4520;BL-MSCU7712;BL-CMAU3348;BL-HLXU9921", LINE, PORT, "containersRead|Containers Read|int|1;12", "clausesFlagged|Clauses Flagged|int|0;8", CONFIDENCE, "lcTermMatch|LC Term Match|bool|Matched;Deviation", "date|Read On|date|-200;0"],
    statuses: ["Read", "Matched", "Deviation", "Needs Review", "Failed"],
    measure: "containersRead", rows: 48,
  },

  /* ── 106 ───────────────────────────────────────────────────────────── */
  "ai-awb-reader": {
    name: "AI AWB Reader", kind: "list", summary: "Air waybill weight and freight extraction",
    entity: "AWB Read", ref: "AAW",
    fields: ["awbNo|AWB No|enum|176-44718822;157-77883456;235-99011234;125-33480176", AIRLINE, "piecesRead|Pieces Read|int|1;220;pcs", "weightRead|Weight Read|float|20;4800;kg;1", "freightRead|Freight Read|money|200;28000", CONFIDENCE, "date|Read On|date|-200;0"],
    statuses: ["Read", "Auto Posted", "Needs Review", "Mismatch", "Failed"],
    measure: "freightRead", rows: 44,
  },

  /* ── 107 ───────────────────────────────────────────────────────────── */
  "ai-shipment-tracking": {
    name: "AI Shipment Tracking", kind: "analytics", summary: "Carrier, AIS and terminal feeds combined",
    entity: "Tracking Signal", ref: "AST",
    fields: [SHIPMENT, VESSEL, PORT, "source|Signal Source|enum|Carrier API;AIS vessel feed;Port terminal feed;Forwarder update;Email parse", "progress|Voyage Progress|pct|4;99", "signalsPerDay|Signals per Day|int|1;48", CONFIDENCE, "date|Last Signal|date|-30;0"],
    statuses: ["Tracking", "Stale Signal", "Delay Predicted", "Arrived", "Lost"],
    measure: "progress", rows: 54,
  },

  /* ── 108 ───────────────────────────────────────────────────────────── */
  "ai-delivery-prediction": {
    name: "AI Delivery Prediction", kind: "analytics", summary: "Will the buyer get it when promised",
    entity: "Delivery Prediction", ref: "ADP",
    fields: [BUYER, SHIPMENT, PORT, "promisedDate|Promised Date|date|-30;90", "predictedDate|Predicted Date|date|-30;100", "slipDays|Predicted Slip|int|0;24;days", CONFIDENCE, "valueAtRisk|Value at Risk|money|0;620000", "date|Predicted On|date|-60;0"],
    statuses: ["On Time", "At Risk", "Late Predicted", "Delivered", "Missed"],
    measure: "valueAtRisk", rows: 52,
    insight: "The model flags a slip a median of eleven days before the carrier revises its own ETA — long enough to move the shipment or warn the buyer, which is the whole point.",
  },

  /* ── 109 ───────────────────────────────────────────────────────────── */
  "ai-eta-prediction": {
    name: "AI ETA Prediction", kind: "analytics", summary: "Predicted arrival against the carrier's",
    entity: "ETA Prediction", ref: "AEP",
    fields: [VESSEL, PORT, "carrierEta|Carrier ETA|date|-20;70", "predictedEta|AI Predicted ETA|date|-20;75", "deltaDays|Delta vs Carrier|int|0;14;days", CONFIDENCE, "congestion|Port Congestion|pct|4;98", "date|Predicted On|date|-60;0"],
    statuses: ["Aligned", "Earlier than Carrier", "Later than Carrier", "Arrived", "Uncertain"],
    measure: "congestion", rows: 50,
  },

  /* ── 110 ───────────────────────────────────────────────────────────── */
  "ai-profitability-analysis": {
    name: "AI Profitability Analysis", kind: "analytics", summary: "What is actually moving the margin",
    entity: "Profit Insight", ref: "APA",
    fields: [BUYER, COUNTRY, "driver|Driver|enum|Freight rate;Material cost;Exchange rate;Order size;Incentive recovery;Rework and claims;Air freight substitution", "impact|Profit Impact|money|0;280000", "direction|Direction|enum|Improving;Eroding;Neutral", CONFIDENCE, "recommendation|Recommendation|text|Shift the Hamburg lane to a contracted rate;Consolidate two buyers into one container;Hedge the EUR receivable;Re-quote brass-heavy styles;Claim the pending drawback;Move to sea-air for late orders", "date|Generated On|date|-330;0"],
    statuses: ["Adopted", "Validated", "Monitoring", "New", "Rejected"],
    measure: "impact", rows: 52,
  },

  /* ── 111 ───────────────────────────────────────────────────────────── */
  "ai-risk-analysis": {
    name: "AI Risk Analysis", kind: "analytics", summary: "Scored exposure across the commercial book",
    entity: "Risk Signal", ref: "ARK",
    fields: ["riskType|Risk|enum|Buyer payment risk;LC expiry risk;Shipment delay risk;Currency risk;Compliance risk;Concentration risk;Carrier risk", BUYER, "riskScore|AI Risk Score|pct|4;98", "exposure|Exposure|money|2000;1600000", "likelihood|Likelihood|enum|Very high;High;Medium;Low;Remote", "mitigation|Mitigation|text|Ask for a confirmed LC;Present documents a week early;Book earlier vessel space;Hedge the EUR exposure;Split the shipment;Escalate to the buyer merchandiser", "riskOwner|Risk Owner|person", "date|Assessed On|date|-330;0"],
    statuses: ["Mitigated", "Monitored", "High", "Critical", "Closed"],
    measure: "exposure", rows: 56,
  },

  /* ── 112 ───────────────────────────────────────────────────────────── */
  "ai-compliance-monitoring": {
    name: "AI Compliance Monitoring", kind: "list", summary: "Rules watched continuously, not at audit",
    entity: "Compliance Signal", ref: "ACM",
    fields: ["rule|Rule Watched|enum|Repatriation within 120 days;LC expiry vs shipment date;COO required for EU;HS code consistency;Sanctioned party screening;Bond balance vs consumption", "breaches|Potential Breaches|int|0;14", CONFIDENCE, "valueAtRisk|Value at Risk|money|0;620000", "autoAlert|Auto Alert|bool|Alert raised;Silent", "reviewer|Reviewed By|person", "date|Checked On|date|-300;0"],
    statuses: ["Clear", "Watch", "Breach Predicted", "Breach", "Waived"],
    measure: "valueAtRisk", rows: 52,
  },

  /* ── 113 ───────────────────────────────────────────────────────────── */
  "ai-fraud-detection": {
    name: "AI Fraud Detection", kind: "list", summary: "Anomalies in documents, prices and accounts",
    entity: "Fraud Signal", ref: "AFD",
    fields: ["pattern|Pattern|enum|Duplicate invoice number;Altered BL scan;Bank account changed;Over-invoicing;Under-invoicing;Unusual consignee address;Round-tripping shipment", BUYER, "anomalyScore|Anomaly Score|pct|10;99", "amount|Amount Involved|money|1000;620000", "evidence|Evidence|text|Same invoice number on two shipments;Font mismatch in the scanned BL;Beneficiary account differs from master;Unit price 40% above contract;Consignee address newly created;Shipment returns to origin port", "investigator|Investigator|person", "date|Flagged On|date|-300;0"],
    statuses: ["Cleared", "False Positive", "Under Investigation", "Flagged", "Confirmed Fraud"],
    measure: "amount", rows: 48,
    insight: "A changed beneficiary account is the signal worth acting on immediately. Everything else on this list can wait for a review; that one cannot.",
  },

  /* ── 114 ───────────────────────────────────────────────────────────── */
  "ai-smart-alerts": {
    name: "AI Smart Alerts", kind: "settings", summary: "What fires, to whom, and how well it aims",
    entity: "Alert Rule", ref: "ASA",
    fields: ["trigger|Trigger|enum|LC expiring in 10 days;Document discrepancy raised;Shipment delayed over 3 days;Payment overdue;Container detained;Certificate expiring;Incentive claim window closing;Anomaly score above 80", "channel|Channel|enum|Email;SMS;In-app;WhatsApp;Buyer portal", "recipient|Recipient|person", "leadDays|Lead Time|int|1;30;days", "fired|Fired (YTD)|int|0;220", "precision|Alert Precision|pct|20;100", "date|Effective From|date|-400;0"],
    statuses: ["Active", "Tuning", "Draft", "Muted", "Retired"],
    measure: "fired", rows: 46,
    settings: ["Alert the commercial team ten days before an LC expires", "Mute an alert automatically when its precision falls below 40%"],
  },

  /* ── 115 ───────────────────────────────────────────────────────────── */
  "ai-smart-recommendations": {
    name: "AI Smart Recommendations", kind: "list", summary: "Next actions ranked by what they are worth",
    entity: "Recommendation", ref: "ASR",
    fields: ["area|Area|enum|Freight and routing;Document preparation;LC structuring;Buyer terms;Incentive recovery;Container utilisation;Working capital", "recommendation|Recommendation|text|Consolidate the two Rotterdam bookings;Present documents before the bank holiday;Switch this buyer to a confirmed LC;Claim the drawback on brass rod imports;Load one 40ft HC instead of two 20ft;Move the EUR book to forward cover", "impact|Estimated Impact|money|200;180000", CONFIDENCE, "effort|Effort|enum|Low;Medium;High", OWNER, "date|Generated On|date|-330;0"],
    statuses: ["Adopted", "Accepted", "New", "Under Review", "Declined"],
    measure: "impact", rows: 52,
  },

  /* ── 116 ───────────────────────────────────────────────────────────── */
  "ai-commercial-copilot": {
    name: "AI Commercial Copilot", kind: "form", summary: "Hand it a commercial task and check the draft",
    entity: "Copilot Action", ref: "ACP",
    fields: ["task|Task|enum|Draft the commercial invoice;Prepare the negotiation set;Draft an LC amendment request;Summarise the buyer's open shipments;Reconcile packing list to invoice;Write the discrepancy reply;Build the incentive claim file", BUYER, "recordsTouched|Records Touched|int|1;180", CONFIDENCE, "humanEdits|Human Edits|int|0;24", "timeSaved|Time Saved|float|2;240;min;0", "approvedBy|Approved By|person", "date|Run On|date|-200;0"],
    statuses: ["Approved", "Draft Ready", "Running", "Edited", "Rejected"],
    measure: "timeSaved", rows: 56,
    insight: "Drafts that go out with no human edit are the ones to watch, not celebrate — the negotiation set is where a confident wrong answer costs a discrepancy charge.",
    settings: ["Require a human approval before any copilot draft leaves the building", "Log every copilot action against the audit trail"],
  },
};
