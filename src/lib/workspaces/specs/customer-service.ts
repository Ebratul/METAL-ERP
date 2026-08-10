import type { ModuleSpecs } from "../types";

/** Module 66 — Customer Service & Complaint Management. */

const BUYER = "buyer|Buyer|enum|@buyers";
const AGENT = "agent|Handled By|person";
const CATEGORY = "category|Category|enum|Quality defect;Short shipment;Wrong item;Late delivery;Packing damage;Documentation error;Labelling mistake;Colour mismatch;Plating failure";
const CHANNEL = "channel|Channel|enum|Email;Buyer portal;Phone;WhatsApp;Agent;Factory visit;Formal letter";
const PRIORITY = "priority|Priority|enum|Critical;High;Medium;Low";

export const CUSTOMER_SERVICE: ModuleSpecs = {
  "service-desk": {
    name: "Service Desk", kind: "overview", summary: "Live ticket queue",
    entity: "Ticket", ref: "TKT",
    fields: [BUYER, CATEGORY, PRIORITY, CHANNEL, AGENT, "ageHrs|Open For|int|1;720;hrs", "impact|Value at Stake|money|200;480000", "date|Raised On|date|-90;0"],
    statuses: ["New", "In Progress", "Awaiting Buyer", "Resolved", "Escalated"],
    measure: "impact", rows: 54,
    insight: "Plating-failure complaints have tripled since the barrel line changeover — four of the last six critical tickets trace back to the same two shifts on Plating-B.",
  },

  "complaint-register": {
    name: "Complaint Register", kind: "list", summary: "Every complaint we have logged",
    entity: "Complaint", ref: "CPL",
    fields: [BUYER, CATEGORY, "order|Related Order|enum|SO-26-1042;SO-26-1078;SO-26-1104;SO-26-1136;SO-26-1180;SO-26-1211", "quantity|Affected Quantity|int|100;480000;pcs", "value|Claim Value|money|200;680000", PRIORITY, AGENT, "date|Logged On|date|-330;0"],
    statuses: ["Open", "Under Investigation", "Action Taken", "Closed", "Rejected"],
    measure: "value", rows: 56,
  },

  "log-complaint": {
    name: "Log a Complaint", kind: "form", summary: "Intake from any channel",
    entity: "Intake", ref: "ITK",
    fields: [BUYER, CHANNEL, CATEGORY, "description|Summary|enum|Plating peeled after wash test;Carton short by 2400 pcs;Wrong colour shipped;Delivery three weeks late;Cartons crushed in transit;Barcode unreadable;Nickel release above limit", "quantity|Affected Quantity|int|50;480000;pcs", PRIORITY, "reporter|Reported By|person", "date|Received On|date|-60;0"],
    statuses: ["Draft", "Submitted", "Acknowledged", "Assigned", "Duplicate"],
    measure: "quantity",
  },

  "resolution-board": {
    name: "Resolution Board", kind: "board", summary: "Stage-wise handling",
    entity: "Case", ref: "RES",
    fields: [BUYER, CATEGORY, PRIORITY, AGENT, "ageDays|Age|int|0;90;days", "value|Value at Stake|money|200;680000", "slaHrs|SLA|int|4;168;hrs", "date|Assigned On|date|-120;0"],
    statuses: ["Triage", "Investigating", "Corrective Action", "Buyer Confirmation", "Closed"],
    measure: "value",
  },

  "root-cause": {
    name: "Root Cause Analysis", kind: "list", summary: "What actually caused it",
    entity: "RCA", ref: "RCA",
    fields: [BUYER, CATEGORY, "cause|Root Cause|enum|Bath chemistry drift;Die wear;Operator error;Incorrect work instruction;Supplier material variation;Packing line mix-up;System master data error;Transport handling", "area|Responsible Area|enum|Plating;Press shop;Assembly;Packing;Quality;Warehouse;Procurement;Logistics", "method|Method|enum|5 Why;Fishbone;8D;Pareto;FMEA review", "recurrence|Recurrence Count|int|1;12", "analyst|Analyst|person", "date|Completed On|date|-300;0"],
    statuses: ["In Analysis", "Cause Identified", "Verified", "Inconclusive", "Closed"],
    measure: "recurrence",
  },

  "capa-actions": {
    name: "Corrective Actions", kind: "board", summary: "Fixing the cause, not the symptom",
    entity: "Action", ref: "CSA",
    fields: [BUYER, "action|Action|enum|Revise plating bath schedule;Replace worn die;Retrain the operator;Update the work instruction;Change the supplier;Add a packing checkpoint;Correct master data;Improve carton spec", "area|Responsible Area|enum|Plating;Press shop;Assembly;Packing;Quality;Warehouse;Procurement;Logistics", "owner|Owner|person", "progress|Progress|pct|0;100", "due|Due Date|date|-45;150", "date|Raised On|date|-260;0"],
    statuses: ["Assigned", "In Progress", "Awaiting Verification", "Effective", "Overdue"],
    measure: "progress",
  },

  "sla-monitor": {
    name: "SLA Monitor", kind: "analytics", summary: "Response and closure time",
    entity: "SLA Record", ref: "SLA",
    fields: [BUYER, PRIORITY, CATEGORY, "targetHrs|Target|int|4;168;hrs", "responseHrs|First Response|float|0.2;96;hrs;1", "resolutionHrs|Resolution|float|1;480;hrs;1", "compliance|SLA Compliance|pct|38;100", AGENT, "date|Period End|date|-330;0"],
    statuses: ["Within SLA", "At Risk", "Breached", "Under Review"],
    measure: "resolutionHrs", rows: 48,
  },

  compensation: {
    name: "Compensation & Credit Notes", kind: "list", summary: "What settlements cost us",
    entity: "Settlement", ref: "CMP",
    fields: [BUYER, CATEGORY, "settlementType|Settlement|enum|Credit note;Replacement shipment;Price discount;Freight reimbursement;Rework free of charge;Goodwill gesture", "claimed|Claimed|money|200;980000", "settled|Settled|money|0;880000", "recovery|Recovered from Supplier|money|0;480000", "approver|Approved By|person", "date|Settled On|date|-330;0"],
    statuses: ["Proposed", "Under Approval", "Approved", "Settled", "Rejected"],
    measure: "settled", rows: 46,
  },

  csat: {
    name: "CSAT & Feedback", kind: "analytics", summary: "Satisfaction after closure",
    entity: "Feedback", ref: "CST",
    fields: [BUYER, CATEGORY, "score|CSAT Score|float|1;5;/5;1", "nps|NPS|int|-100;100", "responseTime|Rated Response|pct|20;100", "resolution|Rated Resolution|pct|20;100", AGENT, "date|Surveyed On|date|-300;0"],
    statuses: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "No Response"],
    measure: "score", rows: 50,
  },

  "response-library": {
    name: "Response Library", kind: "list", summary: "Standard replies that keep tone consistent",
    entity: "Response Template", ref: "RSP",
    fields: ["template|Template|enum|Acknowledgement of complaint;Investigation update;Root cause explanation;Replacement offer;Credit note confirmation;Closure confirmation;Escalation apology", CATEGORY, "language|Language|enum|English;Spanish;Japanese;Chinese;German;French", "usage|Used (90d)|int|0;480", "rating|Effectiveness|pct|38;100", "author|Author|person", "date|Last Updated|date|-500;0"],
    statuses: ["Published", "Draft", "Under Review", "Retired"],
    measure: "usage",
  },

  escalation: {
    name: "Escalation Matrix", kind: "settings", summary: "Who handles what, and when",
    entity: "Escalation Rule", ref: "ESC",
    fields: [PRIORITY, CATEGORY, "level|Escalation Level|enum|L1 — Service desk;L2 — Team lead;L3 — Department head;L4 — Commercial head;L5 — Managing Director", "triggerHrs|Trigger After|int|2;168;hrs", "owner|Escalates To|person", "notify|Notify Channel|enum|Email;SMS;WhatsApp;In-app;Phone call", "date|Effective From|date|-500;30"],
    statuses: ["Active", "Draft", "Suspended", "Superseded"],
    measure: "triggerHrs",
    settings: ["Auto-escalate any critical ticket untouched for four hours", "Copy the commercial head on every claim above USD 10,000"],
  },

  "complaint-trends": {
    name: "Complaint Trends", kind: "analytics", summary: "Recurring patterns worth fixing",
    entity: "Trend Record", ref: "TRD",
    fields: [CATEGORY, BUYER, "count|Complaints|int|1;68", "quantity|Quantity Affected|int|500;980000;pcs", "value|Value Impact|money|500;1800000", "share|Share of Total|pct|0.4;38", "changeVsPrior|Change vs Prior|pct|0;180", "date|Period End|date|-330;0"],
    statuses: ["Rising", "Stable", "Falling", "New Pattern"],
    measure: "value", rows: 48,
  },

  "agent-performance": {
    name: "Agent Performance", kind: "analytics", summary: "Workload and quality per handler",
    entity: "Agent Record", ref: "AGP",
    fields: [AGENT, "handled|Tickets Handled|int|4;220", "closed|Closed|int|2;210", "avgResolutionHrs|Average Resolution|float|1;180;hrs;1", "slaCompliance|SLA Compliance|pct|42;100", "csat|Average CSAT|float|1;5;/5;1", "reopened|Reopened|int|0;18", "date|Period End|date|-330;0"],
    statuses: ["Exceeding", "Meeting", "Below Standard", "Under Coaching"],
    measure: "handled",
  },

  "channel-inbox": {
    name: "Channel Inbox", kind: "list", summary: "Everything arriving from every channel",
    entity: "Message", ref: "MSG",
    fields: [CHANNEL, BUYER, "subject|Subject|enum|Urgent — plating defect on PO 44821;Short shipment query;Request for credit note;Delivery schedule change;Test report request;Packing instruction clarification", "sentiment|Sentiment|enum|Angry;Concerned;Neutral;Positive", "waitHrs|Waiting|int|0;220;hrs", AGENT, "date|Received On|date|-60;0"],
    statuses: ["Unread", "Read", "Replied", "Converted to Ticket", "Archived"],
    measure: "waitHrs", rows: 56,
  },

  "knowledge-articles": {
    name: "Service Knowledge", kind: "list", summary: "How to handle each situation",
    entity: "Article", ref: "KBA",
    fields: ["article|Article|enum|Handling a plating adhesion claim;Short shipment verification steps;Issuing a credit note;Arranging a replacement shipment;Nickel release test explained;Escalating to the plant", CATEGORY, "views|Views (90d)|int|0;980", "helpful|Rated Helpful|pct|30;100", "author|Author|person", "date|Last Reviewed|date|-500;0"],
    statuses: ["Published", "Draft", "Needs Review", "Retired"],
    measure: "views",
  },

  "callback-schedule": {
    name: "Callback Schedule", kind: "calendar", summary: "Promised follow-ups",
    entity: "Callback", ref: "CBK",
    fields: [BUYER, "reason|Reason|enum|Investigation update;Test result sharing;Settlement discussion;Replacement schedule;Courtesy follow-up", AGENT, "durationMin|Planned Duration|int|10;90;min", PRIORITY, "date|Scheduled For|date|-30;90"],
    statuses: ["Scheduled", "Completed", "Missed", "Rescheduled", "Cancelled"],
    measure: "durationMin",
  },

  "warranty-claims": {
    name: "Warranty Claims", kind: "list", summary: "Claims under our stated warranty",
    entity: "Warranty Claim", ref: "WCL",
    fields: [BUYER, "item|Item|enum|@items", "defect|Defect|enum|Plating corrosion;Spring failure;Breakage under load;Colour fading;Dimension drift;Sharp edge", "quantity|Quantity|int|20;98000;pcs", "value|Claim Value|money|100;480000", "withinWarranty|Within Warranty|bool|Yes;No", "assessor|Assessed By|person", "date|Claimed On|date|-330;0"],
    statuses: ["Received", "Under Assessment", "Accepted", "Partially Accepted", "Rejected"],
    measure: "value",
  },

  "service-visits": {
    name: "Service Visits", kind: "calendar", summary: "On-site visits to resolve issues",
    entity: "Service Visit", ref: "SVT",
    fields: [BUYER, "purpose|Purpose|enum|Joint inspection;Defect verification;Sorting support;Process demonstration;Relationship repair", "location|Location|enum|Buyer warehouse;Buyer office;Third-party lab;Port;Our factory", "team|Visiting Officer|person", "cost|Visit Cost|money|100;24000", "durationDays|Duration|int|1;6;days", "date|Visit Date|date|-150;120"],
    statuses: ["Planned", "Confirmed", "Completed", "Report Pending", "Cancelled"],
    measure: "cost",
  },

  "voice-of-customer": {
    name: "Voice of Customer", kind: "analytics", summary: "What buyers keep telling us",
    entity: "VoC Theme", ref: "VOC",
    fields: ["theme|Theme|enum|Plating durability;Delivery reliability;Packing quality;Documentation accuracy;Price competitiveness;Responsiveness;Sustainability credentials", BUYER, "mentions|Mentions|int|1;180", "sentiment|Sentiment Score|float|-1;1;;2", "impact|Revenue at Stake|money|8000;4800000", "trend|Trend vs Prior|pct|0;180", "date|Period End|date|-330;0"],
    statuses: ["Improving", "Stable", "Deteriorating", "Emerging"],
    measure: "mentions",
  },

  "service-settings": {
    name: "Service Configuration", kind: "settings", summary: "SLA targets and desk behaviour",
    entity: "Service Rule", ref: "SVS",
    fields: ["rule|Rule|enum|Critical response target;Standard response target;Auto-close after buyer silence;Mandatory RCA threshold;Survey trigger;Reopen window", "value|Configured Value|enum|4 hours;24 hours;10 days;Above USD 5,000;On closure;7 days", "owner|Rule Owner|person", "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Require a root cause analysis for every critical complaint", "Send a satisfaction survey automatically when a ticket closes", "Allow a buyer to reopen a closed ticket within seven days"],
  },
};
