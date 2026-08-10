import type { ModuleSpecs } from "../types";

/** Module 44 — Customer & Buyer Portal Management. */

const BUYER = "buyer|Buyer|enum|@buyers";
const ITEM = "item|Item|enum|@items";
const ORDER = "order|Sales Order|enum|SO-26-2041;SO-26-2058;SO-26-2073;SO-26-2090;SO-26-2114;SO-26-2138";
const OWNER = "owner|Account Manager|person";
const CHANNEL = "channel|Channel|enum|Web portal;Mobile app;Email digest;API";

export const BUYER_PORTAL: ModuleSpecs = {
  "portal-users": {
    name: "Portal Users", kind: "list", summary: "Buyer-side accounts and access",
    entity: "Portal User", ref: "PUS",
    fields: [BUYER, "userName|User|person", "role|Portal Role|enum|Buyer admin;Merchandiser;QA;Logistics;Finance;Read only", "logins|Logins (30d)|int|0;120", "lastSeenDays|Last Seen|int|0;180;days", OWNER, "date|Registered On|date|-600;0"],
    statuses: ["Active", "Invited", "Dormant", "Locked", "Removed"],
    measure: "logins", rows: 44,
    insight: "Nine buyer accounts have not signed in for over 90 days — a re-onboarding note would lift portal adoption before the next season.",
  },

  "order-visibility": {
    name: "Order Visibility", kind: "analytics", summary: "What buyers can see of their orders",
    entity: "Visible Order", ref: "OVS",
    fields: [BUYER, ORDER, ITEM, "orderQty|Order Qty|int|20000;480000;pcs", "produced|Produced|int|0;480000;pcs", "progress|Progress Shown|pct|0;100", "lastUpdateDays|Last Update|int|0;30;days", "date|Ship Date|date|-20;70"],
    statuses: ["Live", "Delayed Update", "Hidden", "Closed"],
    measure: "orderQty",
  },

  "sample-status": {
    name: "Sample Status", kind: "list", summary: "Buyer-facing sample tracker",
    entity: "Sample", ref: "SMP",
    fields: [BUYER, ITEM, "round|Round|enum|Proto;Fit;Salesman;Pre-production;Shipment", "qty|Pieces|int|2;40;pcs", "courier|Courier AWB|enum|AWB-77412;AWB-77468;AWB-77501;AWB-77534", OWNER, "date|Sent On|date|-150;10"],
    statuses: ["Requested", "In Development", "Dispatched", "Approved", "Rejected"],
    measure: "qty",
  },

  "shipment-status": {
    name: "Shipment Status", kind: "list", summary: "Live shipment view for buyers",
    entity: "Shipment", ref: "SHP",
    fields: [BUYER, ORDER, "mode|Mode|enum|Sea;Air;Courier;Road", "cartons|Cartons|int|10;900", "value|Value|money|8000;420000", "milestone|Milestone|enum|Packed;Gate out;At port;On board;In transit;Arrived;Delivered", "date|ETA|date|-20;60"],
    statuses: ["On Schedule", "Minor Delay", "Delayed", "Delivered", "Exception"],
    measure: "value",
  },

  "document-share": {
    name: "Document Sharing", kind: "list", summary: "Files published to the buyer",
    entity: "Shared Document", ref: "SDC",
    fields: [BUYER, "docType|Document|enum|Test certificate;Packing list;Commercial invoice;Inspection report;Compliance certificate;Artwork approval", "fileRef|File Ref|enum|DOC-4411;DOC-4438;DOC-4452;DOC-4477;DOC-4491", "downloads|Downloads|int|0;40", "sharedBy|Shared By|person", "date|Shared On|date|-200;0"],
    statuses: ["Published", "Viewed", "Downloaded", "Expired", "Withdrawn"],
    measure: "downloads",
  },

  "buyer-requests": {
    name: "Buyer Requests", kind: "board", summary: "Inbound asks from the buyer side",
    entity: "Request", ref: "BRQ",
    fields: [BUYER, "type|Request Type|enum|New quotation;Sample request;Order amendment;Document copy;Price revision;Delivery advance", ITEM, "value|Indicative Value|money|500;180000", "priority|Priority|enum|Urgent;High;Normal", OWNER, "date|Raised On|date|-90;0"],
    statuses: ["New", "Acknowledged", "In Progress", "Responded", "Closed"],
    measure: "value",
  },

  complaints: {
    name: "Complaint Register", kind: "list", summary: "Issues raised through the portal",
    entity: "Complaint", ref: "CMP",
    fields: [BUYER, ITEM, "category|Category|enum|Quality;Delivery delay;Short shipment;Documentation;Pricing;Packaging", "severity|Severity|enum|Critical;Major;Minor", "claimValue|Claim Value|money|200;68000", "ageDays|Open For|int|0;90;days", OWNER, "date|Raised On|date|-200;0"],
    statuses: ["Received", "Under Investigation", "Response Sent", "Settled", "Rejected"],
    measure: "claimValue",
  },

  "portal-analytics": {
    name: "Portal Analytics", kind: "analytics", summary: "Adoption, usage and engagement",
    entity: "Usage Metric", ref: "PAN",
    fields: [BUYER, CHANNEL, "sessions|Sessions|int|2;900", "pageViews|Page Views|int|10;6400", "avgMinutes|Average Session|float|0.5;22;min;1", "activeUsers|Active Users|int|1;24", "date|Period End|date|-240;0"],
    statuses: ["Highly Engaged", "Engaged", "Low Usage", "Inactive"],
    measure: "sessions",
  },

  branding: {
    name: "Portal Branding", kind: "settings", summary: "White-label look for each buyer",
    entity: "Branding Profile", ref: "BRD",
    fields: [BUYER, "theme|Theme|enum|Buyer brand;Neutral;Smart Metal default;High contrast", "logoRef|Logo Asset|enum|LOGO-311;LOGO-348;LOGO-372;LOGO-395", "domain|Portal Domain|enum|portal.smartmetal.com;buyer.smartmetal.com;Custom domain", OWNER, "date|Updated On|date|-300;0", "pagesBranded|Pages Branded|int|1;24"],
    statuses: ["Active", "Draft", "Pending Approval", "Retired"],
    settings: ["Allow buyers to use their own logo on documents", "Show factory contact details on every portal page"],
  },

  announcements: {
    name: "Announcements", kind: "list", summary: "Notices published to buyers",
    entity: "Announcement", ref: "ANN",
    fields: ["title|Title|enum|Factory holiday notice;New compliance certificate;Price list update;Capacity expansion;Shipping delay advisory;Portal maintenance", BUYER, CHANNEL, "reads|Reads|int|0;90", "author|Published By|person", "date|Published On|date|-200;20"],
    statuses: ["Draft", "Scheduled", "Published", "Expired", "Withdrawn"],
    measure: "reads",
  },

  "rfq-inbox": {
    name: "RFQ Inbox", kind: "list", summary: "Quotation requests arriving from buyers",
    entity: "RFQ", ref: "RFQ",
    fields: [BUYER, ITEM, "qty|Indicative Qty|int|5000;600000;pcs", "targetPrice|Target Price|float|0.01;1.2;USD;3", "value|Indicative Value|money|500;280000", "responseDays|Response Due|int|1;20;days", OWNER, "date|Received On|date|-120;0"],
    statuses: ["New", "Under Costing", "Quoted", "Won", "Lost"],
    measure: "value",
  },

  "price-list-view": {
    name: "Buyer Price Lists", kind: "list", summary: "Agreed prices visible to the buyer",
    entity: "Price Line", ref: "PLV",
    fields: [BUYER, ITEM, "price|Unit Price|float|0.01;1.6;USD;3", "moq|MOQ|int|1000;120000;pcs", "currency|Currency|enum|USD;EUR;GBP", "validUntil|Valid Until|date|-40;300", "approver|Approved By|person"],
    statuses: ["Active", "Expiring", "Expired", "Under Revision", "Withdrawn"],
    measure: "moq",
  },

  "invoice-view": {
    name: "Invoice View", kind: "list", summary: "Invoices exposed to the buyer",
    entity: "Invoice", ref: "IVW",
    fields: [BUYER, ORDER, "invoiceNo|Invoice No|enum|CI-26-0411;CI-26-0428;CI-26-0443;CI-26-0461", "value|Invoice Value|money|4000;420000", "dueDays|Due In|int|-40;120;days", "currency|Currency|enum|USD;EUR;GBP", "date|Invoice Date|date|-200;0"],
    statuses: ["Issued", "Viewed", "Disputed", "Paid", "Overdue"],
    measure: "value",
  },

  "payment-status": {
    name: "Payment Status", kind: "list", summary: "What the buyer has settled",
    entity: "Payment", ref: "PMT",
    fields: [BUYER, "invoiceNo|Invoice No|enum|CI-26-0411;CI-26-0428;CI-26-0443;CI-26-0461", "invoiceValue|Invoice Value|money|4000;420000", "received|Received|money|0;420000", "outstanding|Outstanding|money|0;380000", "method|Method|enum|LC;TT;Open account;Advance", "date|Value Date|date|-200;40"],
    statuses: ["Awaited", "Partially Received", "Settled", "Overdue", "Disputed"],
    measure: "invoiceValue",
  },

  "feedback-survey": {
    name: "Feedback & Survey", kind: "analytics", summary: "Buyer satisfaction scores",
    entity: "Survey Response", ref: "FBK",
    fields: [BUYER, "topic|Topic|enum|Quality;Delivery;Communication;Pricing;Portal experience;Sampling", "score|Score|pct|30;100", "nps|NPS|int|-40;100", "responses|Responses|int|1;30", OWNER, "date|Survey Date|date|-300;0"],
    statuses: ["Promoter", "Passive", "Detractor", "No Response"],
    measure: "score",
  },

  "support-tickets": {
    name: "Support Tickets", kind: "board", summary: "Portal help requests",
    entity: "Ticket", ref: "TKT",
    fields: [BUYER, "category|Category|enum|Login issue;Missing document;Data mismatch;Feature request;Access request;Bug report", "priority|Priority|enum|Urgent;High;Normal;Low", "ageHrs|Open For|int|1;220;hrs", "assignee|Assigned To|person", "date|Raised On|date|-90;0"],
    statuses: ["New", "Assigned", "In Progress", "Waiting on Buyer", "Resolved", "Closed"],
    measure: "ageHrs",
  },

  "access-permissions": {
    name: "Access Permissions", kind: "list", summary: "What each buyer role can open",
    entity: "Permission", ref: "ACP",
    fields: [BUYER, "role|Role|enum|Buyer admin;Merchandiser;QA;Logistics;Finance;Read only", "module|Portal Area|enum|Orders;Samples;Shipments;Documents;Invoices;Quality reports", "level|Access Level|enum|Full;Read only;Hidden", "grantedBy|Granted By|person", "date|Granted On|date|-400;0", "usersAffected|Users Affected|int|1;24"],
    statuses: ["Active", "Pending Approval", "Revoked", "Expired"],
  },

  "activity-log": {
    name: "Portal Activity Log", kind: "list", summary: "Who did what on the portal",
    entity: "Activity", ref: "ACT",
    fields: [BUYER, "userName|User|person", "action|Action|enum|Logged in;Downloaded document;Raised request;Viewed order;Submitted complaint;Updated profile", CHANNEL, "ipRegion|Region|enum|Europe;North America;Middle East;Asia;Unknown", "date|Occurred On|date|-90;0", "durationMin|Session Length|int|1;90;min"],
    statuses: ["Normal", "Unusual", "Flagged", "Reviewed"],
  },

  onboarding: {
    name: "Buyer Onboarding", kind: "form", summary: "Bring a new buyer onto the portal",
    entity: "Onboarding Request", ref: "ONB",
    fields: [BUYER, "contactName|Primary Contact|person", "roleRequested|Role Requested|enum|Buyer admin;Merchandiser;QA;Logistics;Finance", "modules|Modules Requested|enum|Orders;Samples;Shipments;Documents;All areas", OWNER, "date|Requested On|date|-90;10", "usersRequested|Users Requested|int|1;12"],
    statuses: ["Draft", "Submitted", "Under Approval", "Activated", "Rejected"],
  },

  "notification-preferences": {
    name: "Notification Preferences", kind: "settings", summary: "What the portal pushes and when",
    entity: "Notification Rule", ref: "NSET",
    fields: [BUYER, "event|Event|enum|Order status change;Shipment departed;Document published;Sample approved;Invoice raised;Complaint response", CHANNEL, "frequency|Frequency|enum|Immediate;Daily digest;Weekly digest;Off", OWNER, "date|Updated On|date|-200;0", "recipients|Recipients|int|1;24"],
    statuses: ["Active", "Paused", "Draft", "Retired"],
    settings: ["Send a daily order-status digest to every active buyer", "Notify the account manager whenever a buyer raises a complaint"],
  },
};
