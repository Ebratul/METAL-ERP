import type { ModuleSpecs } from "../types";

/** Module 75 — Return (RMA) & Claims Management. */

const BUYER = "buyer|Buyer|enum|@buyers";
const ITEM = "item|Item|enum|@items";
const REASON = "reason|Reason|enum|Plating defect;Dimension out of tolerance;Wrong item shipped;Short shipment;Colour mismatch;Surface scratch;Corrosion;Packing damage;Late delivery;Buyer cancellation";
const HANDLER = "handler|Handled By|person";
const ORDER = "order|Original Order|enum|SO-26-1042;SO-26-1078;SO-26-1104;SO-26-1136;SO-26-1180;SO-26-1211;SO-26-1245";

export const RMA_CLAIMS: ModuleSpecs = {
  "rma-register": {
    name: "RMA Register", kind: "list", summary: "Every return authorisation",
    entity: "RMA", ref: "RMA",
    fields: [BUYER, ITEM, ORDER, REASON, "quantity|Return Quantity|int|100;480000;pcs", "value|Return Value|money|200;980000", HANDLER, "date|Raised On|date|-330;0"],
    statuses: ["Open", "Authorised", "Goods Received", "Closed", "Rejected"],
    measure: "value", rows: 52,
    insight: "Plating defects drive 38% of returned quantity but 61% of return cost — the affected items are the high-value antique-brass range, not the volume snaps.",
  },

  "return-request": {
    name: "Return Request", kind: "form", summary: "Buyer return intake",
    entity: "Return Request", ref: "RRQ",
    fields: [BUYER, ITEM, ORDER, REASON, "quantity|Requested Quantity|int|50;480000;pcs", "shipmentRef|Shipment|enum|SHP-26-0412;SHP-26-0455;SHP-26-0488;SHP-26-0501;SHP-26-0533", "requestedBy|Requested By|person", "date|Requested On|date|-260;0"],
    statuses: ["Draft", "Submitted", "Under Assessment", "Accepted", "Declined"],
    measure: "quantity",
  },

  authorization: {
    name: "Return Authorisation", kind: "board", summary: "Approve, reject or divert",
    entity: "Authorisation", ref: "AUT",
    fields: [BUYER, ITEM, REASON, "requestedQty|Requested|int|50;480000;pcs", "authorisedQty|Authorised|int|0;480000;pcs", "value|Authorised Value|money|0;980000", "approver|Approver|person", "ageDays|Pending For|int|0;60;days", "date|Requested On|date|-200;0"],
    statuses: ["Submitted", "Under Review", "Authorised", "Partially Authorised", "Rejected"],
    measure: "value", rows: 48,
  },

  "inbound-inspection": {
    name: "Inbound Inspection", kind: "list", summary: "Condition of goods on arrival",
    entity: "Inspection", ref: "INS",
    fields: [BUYER, ITEM, "receivedQty|Received|int|50;480000;pcs", "confirmedQty|Defect Confirmed|int|0;480000;pcs", "defectRate|Defect Rate|pct|0;100", "condition|Condition|enum|As claimed;Better than claimed;Worse than claimed;Not our product;Mixed", "inspector|Inspector|person", "date|Inspected On|date|-260;0"],
    statuses: ["Awaiting Inspection", "In Inspection", "Claim Confirmed", "Claim Disputed", "Completed"],
    measure: "receivedQty",
  },

  disposition: {
    name: "Disposition", kind: "board", summary: "Repair, replace, refund or scrap",
    entity: "Disposition", ref: "DSP",
    fields: [BUYER, ITEM, "quantity|Quantity|int|50;480000;pcs", "decision|Decision|enum|Rework and return;Replace free of charge;Credit note;Scrap;Sell as second grade;Return to buyer", "recoveryValue|Recovery Value|money|0;480000", "costToServe|Cost to Serve|money|0;280000", "decidedBy|Decided By|person", "date|Decided On|date|-260;0"],
    statuses: ["Pending Decision", "Decided", "In Execution", "Completed", "On Hold"],
    measure: "costToServe", rows: 48,
  },

  claims: {
    name: "Claims Register", kind: "list", summary: "Quality and shipment claims",
    entity: "Claim", ref: "CLM",
    fields: [BUYER, "claimType|Claim Type|enum|Quality claim;Short shipment;Late delivery penalty;Air freight recovery;Sorting cost;Rework cost;Buyer chargeback", ORDER, "claimedAmount|Claimed|money|200;1800000", "acceptedAmount|Accepted|money|0;1800000", "acceptanceRate|Acceptance|pct|0;100", HANDLER, "date|Claimed On|date|-330;0"],
    statuses: ["Received", "Under Assessment", "Accepted", "Partially Accepted", "Rejected", "Settled"],
    measure: "claimedAmount", rows: 52,
  },

  investigation: {
    name: "Claim Investigation", kind: "list", summary: "Establishing what happened",
    entity: "Investigation", ref: "IVG",
    fields: [BUYER, REASON, "batch|Batch / Heat Lot|enum|HL-4471;HL-4489;HL-4502;HL-4517;HL-4530;HL-4548", "stage|Failure Stage|enum|Raw material;Pressing;Plating;Assembly;Packing;Transit;Buyer handling", "rootCause|Root Cause|enum|Bath chemistry drift;Die wear;Operator error;Supplier material;Handling damage;Specification gap;Not established", "liability|Liability|enum|Ours;Supplier;Buyer;Carrier;Shared;Undetermined", "quantity|Quantity Affected|int|50;480000;pcs", "investigator|Investigator|person", "date|Concluded On|date|-300;0"],
    statuses: ["Open", "In Progress", "Cause Established", "Inconclusive", "Closed"],
    measure: "quantity",
  },

  "credit-debit-notes": {
    name: "Credit & Debit Notes", kind: "list", summary: "Financial settlement of a claim",
    entity: "Note", ref: "CDN",
    fields: [BUYER, "noteType|Note Type|enum|Credit note;Debit note;Adjustment note", "againstInvoice|Against Invoice|enum|INV-26-2211;INV-26-2244;INV-26-2280;INV-26-2312;INV-26-2350", "amount|Amount|money|100;1800000", "taxAmount|Tax|money|0;180000", "approver|Approved By|person", "date|Issued On|date|-330;0"],
    statuses: ["Draft", "Approved", "Issued", "Applied", "Cancelled"],
    measure: "amount", rows: 50,
  },

  "claim-recovery": {
    name: "Claim Recovery", kind: "analytics", summary: "What we recover from others",
    entity: "Recovery", ref: "RCV",
    fields: ["source|Recovery Source|enum|Raw material supplier;Plating chemical supplier;Subcontractor;Carrier;Insurance;Not recoverable", "supplier|Counterparty|enum|@suppliers", "claimValue|Our Loss|money|200;1800000", "recovered|Recovered|money|0;1800000", "recoveryRate|Recovery Rate|pct|0;100", "ageDays|Open For|int|0;400;days", HANDLER, "date|Claimed On|date|-400;0"],
    statuses: ["Claim Raised", "Under Negotiation", "Recovered", "Partially Recovered", "Written Off"],
    measure: "recovered", rows: 46,
  },

  "return-reasons": {
    name: "Return Reason Analysis", kind: "analytics", summary: "Why goods come back",
    entity: "Reason Record", ref: "RSN",
    fields: [REASON, BUYER, "returns|Return Count|int|1;68", "quantity|Quantity|int|500;2400000;pcs", "value|Value|money|500;1800000", "share|Share of Returns|pct|0.4;42", "trend|Change vs Prior|pct|0;180", "date|Period End|date|-330;0"],
    statuses: ["Rising", "Stable", "Falling", "New Pattern"],
    measure: "value", rows: 46,
  },

  "warranty-terms": {
    name: "Warranty Terms", kind: "settings", summary: "What we stand behind",
    entity: "Warranty Term", ref: "WTM",
    fields: [BUYER, "productFamily|Product Family|enum|Snap fasteners;Jeans buttons;Zipper sliders;Rivets;Eyelets;Buckles;Metal labels", "coverage|Coverage|enum|Manufacturing defect only;Plating adhesion;Corrosion resistance;Dimensional accuracy;Full replacement;No warranty", "periodMonths|Warranty Period|int|3;36;months", "claimWindow|Claim Window|int|7;180;days", "liabilityCap|Liability Cap|pct|10;100", "owner|Term Owner|person", "date|Effective From|date|-900;60"],
    statuses: ["Active", "Draft", "Under Negotiation", "Superseded"],
    measure: "periodMonths",
    settings: ["Reject any claim raised outside the agreed claim window", "Cap total liability at the invoice value of the affected lot"],
  },

  "rma-cost": {
    name: "Cost of Returns", kind: "analytics", summary: "Total impact on margin",
    entity: "Cost Record", ref: "RCS",
    fields: [BUYER, "head|Cost Head|enum|Credit issued;Replacement production;Return freight;Sorting and inspection;Rework;Scrap write-off;Air freight;Administration", "amount|Amount|money|100;980000", "recovered|Recovered|money|0;680000", "netCost|Net Cost|money|0;980000", "asPctSales|As % of Sales|pct|0;12", "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026", "date|Period End|date|-330;0"],
    statuses: ["Absorbed", "Recovered", "Under Recovery", "Written Off"],
    measure: "netCost", rows: 50,
  },

  "replacement-orders": {
    name: "Replacement Orders", kind: "list", summary: "Free-of-charge replacements",
    entity: "Replacement", ref: "RPL",
    fields: [BUYER, ITEM, "linkedRma|Linked RMA|enum|RMA-26-1041;RMA-26-1056;RMA-26-1078;RMA-26-1092;RMA-26-1113", "quantity|Quantity|int|50;480000;pcs", "productionCost|Production Cost|money|100;480000", "priority|Priority|enum|Air freight urgent;Next shipment;Normal;Combine with next order", "promisedDate|Promised Date|date|-30;90", "date|Raised On|date|-260;0"],
    statuses: ["Raised", "In Production", "Ready", "Despatched", "Cancelled"],
    measure: "productionCost",
  },

  "return-logistics": {
    name: "Return Logistics", kind: "list", summary: "Getting the goods back",
    entity: "Return Shipment", ref: "RLG",
    fields: [BUYER, "mode|Mode|enum|Sea freight;Air freight;Courier;Buyer arranged;Local pickup;Destroyed at destination", "cartons|Cartons|int|1;480", "weightKg|Weight|float|1;4800;kg;1", "freightCost|Freight Cost|money|20;68000", "bearer|Cost Borne By|enum|Us;Buyer;Shared;Carrier;Insurance", "eta|Expected Arrival|date|-60;60", "date|Despatched On|date|-260;0"],
    statuses: ["Awaiting Pickup", "In Transit", "Customs", "Received", "Lost"],
    measure: "freightCost",
  },

  "supplier-claims": {
    name: "Supplier Claims", kind: "list", summary: "Claims we raise upstream",
    entity: "Supplier Claim", ref: "SCL",
    fields: ["supplier|Supplier|enum|@suppliers", "material|Material|enum|Brass Strip 0.8mm;Zinc Alloy Ingot;Nickel Anode;Plating chemical;Packing carton;Steel Wire 2.0mm", "issue|Issue|enum|Off-specification material;Short supply;Late delivery;Contamination;Wrong grade;Damaged in transit", "claimAmount|Claim Amount|money|200;980000", "settled|Settled Amount|money|0;980000", "ageDays|Open For|int|0;400;days", HANDLER, "date|Raised On|date|-400;0"],
    statuses: ["Raised", "Acknowledged", "Under Negotiation", "Settled", "Rejected"],
    measure: "claimAmount", rows: 46,
  },

  "insurance-claims": {
    name: "Insurance Claims", kind: "list", summary: "Where the policy responds",
    entity: "Insurance Claim", ref: "ICL",
    fields: ["insurer|Insurer|enum|Green Delta Insurance;Pragati Insurance;Reliance Insurance;Sadharan Bima;Marine underwriter", "policyType|Policy|enum|Marine cargo;Fire and allied perils;Product liability;Transit;Credit insurance", "incident|Incident|enum|Container water damage;Cargo lost overboard;Fire at warehouse;Theft in transit;Buyer insolvency", "claimAmount|Claim Amount|money|1000;4800000", "settled|Settled Amount|money|0;4800000", "excess|Policy Excess|money|0;98000", "ageDays|Open For|int|0;540;days", "date|Claimed On|date|-540;0"],
    statuses: ["Notified", "Surveyor Appointed", "Under Assessment", "Settled", "Repudiated"],
    measure: "claimAmount",
  },

  "quarantine-stock": {
    name: "Quarantine Stock", kind: "list", summary: "Returned goods held aside",
    entity: "Quarantine Lot", ref: "QRT",
    fields: [ITEM, BUYER, "quantity|Quantity|int|50;480000;pcs", "location|Location|enum|Quarantine Bay 1;Quarantine Bay 2;Rework area;Scrap yard;Sample room", "ageDays|Held For|int|0;300;days", "value|Book Value|money|100;680000", "nextAction|Next Action|enum|Awaiting inspection;Awaiting decision;Rework scheduled;Scrap approval;Return to buyer", "custodian|Custodian|person", "date|Received On|date|-300;0"],
    statuses: ["Quarantined", "Under Inspection", "Released", "Scrapped", "Aged Stock"],
    measure: "value",
  },

  "rework-from-returns": {
    name: "Rework from Returns", kind: "board", summary: "Recovering what can be saved",
    entity: "Rework Job", ref: "RWK",
    fields: [ITEM, "quantity|Quantity|int|50;480000;pcs", "operation|Rework Operation|enum|Re-plating;Re-polishing;Sorting;Re-packing;Re-labelling;Deburring;Full rebuild", "yieldPct|Recovery Yield|pct|20;99", "reworkCost|Rework Cost|money|20;280000", "savedValue|Value Recovered|money|0;680000", "supervisor|Supervisor|person", "date|Scheduled On|date|-200;45"],
    statuses: ["Planned", "In Progress", "Completed", "Partially Recovered", "Abandoned"],
    measure: "savedValue", rows: 48,
  },

  "claim-sla": {
    name: "Claim SLA", kind: "analytics", summary: "How fast we close them out",
    entity: "SLA Record", ref: "CSL",
    fields: [BUYER, "claimType|Claim Type|enum|Quality claim;Short shipment;Late delivery penalty;Air freight recovery;Sorting cost;Buyer chargeback", "targetDays|Target|int|3;45;days", "acknowledgeDays|Acknowledged In|float|0.1;20;days;1", "closureDays|Closed In|float|1;180;days;1", "compliance|SLA Compliance|pct|22;100", HANDLER, "date|Period End|date|-330;0"],
    statuses: ["Within SLA", "At Risk", "Breached", "Under Review"],
    measure: "closureDays", rows: 48,
  },

  "rma-settings": {
    name: "RMA Configuration", kind: "settings", summary: "Authorisation limits and rules",
    entity: "RMA Rule", ref: "RST",
    fields: ["rule|Rule|enum|Auto-authorise threshold;Management approval threshold;Return window;Mandatory inspection;Scrap approval level;Recovery pursuit threshold", "value|Configured Value|enum|Below USD 500;Above USD 25,000;90 days from despatch;Always;Plant manager;Above USD 1,000", "owner|Rule Owner|person", "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Require inbound inspection before any credit note is issued", "Raise a supplier claim automatically when liability is attributed upstream", "Block a return request raised outside the agreed return window"],
  },
};
