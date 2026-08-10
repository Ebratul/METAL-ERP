import type { ModuleSpecs } from "../types";

/** Module 70 — Notification & Communication Center. */

const CHANNEL = "channel|Channel|enum|Email;SMS;WhatsApp;Push notification;In-app;Buyer portal;Notice board";
const AUDIENCE = "audience|Audience|enum|All employees;Management;Production floor;Merchandising;Finance;Quality;Warehouse;Suppliers;Buyers";
const EVENT = "event|Trigger Event|enum|Order confirmed;Shipment despatched;Payment received;Stock below reorder;QC failure;Machine breakdown;Approval pending;Document expiring;Attendance anomaly";
const OWNER = "owner|Owner|person";
const PRIORITY = "priority|Priority|enum|Critical;High;Normal;Low";

export const NOTIFICATION_CENTER: ModuleSpecs = {
  "my-inbox": {
    name: "My Inbox", kind: "overview", summary: "Everything addressed to me",
    entity: "Notification", ref: "NTF",
    fields: ["subject|Subject|enum|Purchase order awaiting your approval;QC hold raised on WO-26-1063;Shipment SO-26-1104 cleared customs;Payroll ready for review;Machine Press-02 breakdown;Factory licence expiring in 30 days;Buyer complaint escalated", EVENT, CHANNEL, PRIORITY, "sender|From|person", "ageHrs|Age|int|0;480;hrs", "date|Received On|date|-45;0"],
    statuses: ["Unread", "Read", "Actioned", "Snoozed", "Archived"],
    measure: "ageHrs", rows: 56,
    insight: "Approval reminders make up 44% of everything sent this month and are opened within nine minutes on average — operational alerts, by contrast, sit unread for four hours.",
  },

  announcements: {
    name: "Announcements", kind: "list", summary: "Company-wide notices",
    entity: "Announcement", ref: "ANN",
    fields: ["title|Title|enum|Eid holiday schedule;New attendance policy;Annual health camp;Fire drill on Thursday;Quarterly results briefing;Canteen menu change;Buyer audit next week", AUDIENCE, "category|Category|enum|HR;Safety;Operations;Finance;Facilities;Event;Policy", "reach|Recipients|int|10;2400", "readRate|Read Rate|pct|8;100", "author|Published By|person", "expiry|Visible Until|date|-30;120", "date|Published On|date|-260;0"],
    statuses: ["Published", "Scheduled", "Draft", "Expired", "Withdrawn"],
    measure: "reach",
  },

  "notification-rules": {
    name: "Notification Rules", kind: "settings", summary: "Which event goes to which channel",
    entity: "Rule", ref: "RUL",
    fields: [EVENT, CHANNEL, AUDIENCE, PRIORITY, "delayMin|Send After|int|0;240;min", "triggered|Triggered (30d)|int|0;4800", "muted|Muted By Users|int|0;180", OWNER, "date|Effective From|date|-500;30"],
    statuses: ["Active", "Draft", "Paused", "Retired"],
    measure: "triggered", rows: 48,
    settings: ["Suppress duplicate alerts for the same event within 15 minutes", "Fall back to SMS when a critical email bounces"],
  },

  templates: {
    name: "Message Templates", kind: "list", summary: "Reusable message bodies",
    entity: "Template", ref: "TPL",
    fields: ["template|Template|enum|Order confirmation to buyer;Despatch advice;Payment reminder;Approval request;QC hold notice;Document expiry warning;Welcome to the portal;Password reset instruction", CHANNEL, "language|Language|enum|English;Bengali;Chinese;Japanese;Spanish", "variables|Merge Fields|int|1;18", "usage|Used (30d)|int|0;4800", "author|Author|person", "date|Last Updated|date|-500;0"],
    statuses: ["Published", "Draft", "Under Review", "Deprecated"],
    measure: "usage",
  },

  "email-center": {
    name: "Email Center", kind: "list", summary: "Outbound email log",
    entity: "Email", ref: "EML",
    fields: ["subject|Subject|enum|Order confirmation — SO-26-1104;Despatch advice — CTN 001-220;Payment reminder — INV-26-2211;Monthly production report;Approval required — PO-26-0871;Test report attached", "recipientType|Recipient|enum|Buyer;Supplier;Employee;Bank;Auditor;Logistics partner", "attachments|Attachments|int|0;9", "sizeKb|Size|float|2;9800;KB;0", "opens|Opens|int|0;48", "sender|Sent By|person", "date|Sent On|date|-90;0"],
    statuses: ["Sent", "Delivered", "Opened", "Bounced", "Failed"],
    measure: "opens", rows: 56,
  },

  "sms-whatsapp": {
    name: "SMS & WhatsApp", kind: "list", summary: "Mobile messaging log",
    entity: "Mobile Message", ref: "SMS",
    fields: ["messageType|Message|enum|OTP verification;Shift change alert;Salary credited;Gate pass approved;Delivery confirmation;Emergency notice", "channel|Channel|enum|SMS;WhatsApp", AUDIENCE, "recipients|Recipients|int|1;2400", "segments|Segments|int|1;6", "cost|Cost|money|0;480", "deliveryRate|Delivery Rate|pct|42;100", "date|Sent On|date|-90;0"],
    statuses: ["Queued", "Sent", "Delivered", "Failed", "Blocked"],
    measure: "cost",
  },

  "push-center": {
    name: "Push Notifications", kind: "list", summary: "App push campaigns",
    entity: "Push Campaign", ref: "PSH",
    fields: ["campaign|Campaign|enum|Shift roster published;New SOP released;Approval pending reminder;Safety drill alert;Payslip available;App update available", AUDIENCE, "devices|Devices Targeted|int|10;1800", "delivered|Delivered|int|0;1800", "opened|Opened|int|0;1400", "openRate|Open Rate|pct|2;92", OWNER, "date|Sent On|date|-160;0"],
    statuses: ["Scheduled", "Sending", "Sent", "Partially Failed", "Cancelled"],
    measure: "devices",
  },

  "in-app-alerts": {
    name: "In-App Alerts", kind: "list", summary: "Banners and toasts inside the ERP",
    entity: "In-App Alert", ref: "IAP",
    fields: [EVENT, "placement|Placement|enum|Top banner;Notification bell;Module header;Toast;Modal", AUDIENCE, PRIORITY, "impressions|Impressions|int|0;9800", "clicks|Clicks|int|0;2400", "dismissRate|Dismiss Rate|pct|2;98", "date|Active From|date|-120;30"],
    statuses: ["Active", "Scheduled", "Expired", "Dismissed", "Draft"],
    measure: "impressions",
  },

  subscriptions: {
    name: "Subscriptions", kind: "settings", summary: "Who receives what",
    entity: "Subscription", ref: "SUB",
    fields: ["subscriber|Subscriber|person", EVENT, CHANNEL, "frequency|Frequency|enum|Immediate;Hourly digest;Daily digest;Weekly summary;Off", "optedIn|Opted In|bool|Yes;No", "received|Received (30d)|int|0;480", "date|Updated On|date|-400;0"],
    statuses: ["Subscribed", "Digest Only", "Muted", "Unsubscribed"],
    measure: "received", rows: 52,
    settings: ["Let every user mute non-critical alerts for their own account", "Never allow critical safety alerts to be unsubscribed"],
  },

  "delivery-log": {
    name: "Delivery Log", kind: "list", summary: "Sent, opened and failed",
    entity: "Delivery", ref: "DLV",
    fields: [CHANNEL, EVENT, "recipientType|Recipient|enum|Employee;Buyer;Supplier;Bank;Auditor;Logistics partner", "attempts|Attempts|int|1;8", "latencySec|Delivery Latency|float|0.2;900;sec;1", "failureReason|Failure Reason|enum|None;Invalid address;Mailbox full;Number unreachable;Device unregistered;Provider throttle;Blocked by filter", "date|Attempted On|date|-60;0"],
    statuses: ["Delivered", "Queued", "Retrying", "Bounced", "Failed"],
    measure: "latencySec", rows: 58,
  },

  "channel-analytics": {
    name: "Channel Analytics", kind: "analytics", summary: "Reach and engagement per channel",
    entity: "Channel Record", ref: "CHA",
    fields: [CHANNEL, "sent|Sent|int|10;48000", "delivered|Delivered|int|8;48000", "opened|Opened|int|0;42000", "deliveryRate|Delivery Rate|pct|40;100", "cost|Cost|money|0;4800", "costPerMessage|Cost / Message|float|0;0.4;USD;4", "date|Period End|date|-330;0"],
    statuses: ["Healthy", "Degraded", "Under Review", "Suspended"],
    measure: "sent", rows: 46,
  },

  "escalation-alerts": {
    name: "Escalation Alerts", kind: "list", summary: "When nobody responded in time",
    entity: "Escalation", ref: "ESL",
    fields: [EVENT, "level|Escalation Level|enum|L1 — Owner;L2 — Supervisor;L3 — Department head;L4 — Management", "originalRecipient|Original Recipient|person", "escalatedTo|Escalated To|person", "waitedHrs|Waited|int|1;168;hrs", PRIORITY, "date|Escalated On|date|-160;0"],
    statuses: ["Raised", "Acknowledged", "Resolved", "Re-escalated", "Suppressed"],
    measure: "waitedHrs",
  },

  "approval-notifications": {
    name: "Approval Notifications", kind: "list", summary: "Reminders that keep work moving",
    entity: "Approval Alert", ref: "APN",
    fields: ["documentType|Document|enum|Purchase order;Sales order;Payment voucher;Leave application;Gate pass;Stock adjustment;Contract;Expense claim", "approver|Approver|person", "reminders|Reminders Sent|int|0;12", "pendingHrs|Pending For|int|1;720;hrs", "value|Document Value|money|0;2400000", CHANNEL, "date|First Notified|date|-120;0"],
    statuses: ["Pending", "Reminded", "Approved", "Rejected", "Escalated"],
    measure: "value", rows: 50,
  },

  "campaign-scheduler": {
    name: "Campaign Scheduler", kind: "calendar", summary: "What goes out and when",
    entity: "Scheduled Campaign", ref: "SCH",
    fields: ["campaign|Campaign|enum|Monthly newsletter;Safety week reminders;Payslip availability;Buyer season update;Supplier portal maintenance;Training invitation", CHANNEL, AUDIENCE, "recipients|Recipients|int|10;2400", "sendWindow|Send Window|enum|08:00–09:00;12:00–13:00;17:00–18:00;Immediate;Off-peak", OWNER, "date|Scheduled For|date|-60;120"],
    statuses: ["Scheduled", "Sending", "Sent", "Paused", "Cancelled"],
    measure: "recipients",
  },

  "recipient-groups": {
    name: "Recipient Groups", kind: "list", summary: "Named distribution lists",
    entity: "Group", ref: "GRP",
    fields: ["group|Group|enum|All employees;Plant supervisors;Merchandising team;Finance approvers;Store keepers;Buyer contacts;Supplier contacts;Management committee", AUDIENCE, "members|Members|int|2;2400", "dynamic|Dynamic Membership|bool|Yes;No", "usage|Used (90d)|int|0;480", OWNER, "date|Created On|date|-1200;0"],
    statuses: ["Active", "Draft", "Stale", "Retired"],
    measure: "members",
  },

  "bounce-management": {
    name: "Bounce Management", kind: "list", summary: "Bad addresses and numbers",
    entity: "Bounce", ref: "BNC",
    fields: [CHANNEL, "recipientType|Recipient|enum|Employee;Buyer;Supplier;Bank;Logistics partner", "bounceType|Bounce Type|enum|Hard bounce;Soft bounce;Spam complaint;Unsubscribed;Number invalid;Device unregistered", "occurrences|Occurrences|int|1;48", "lastError|Last Error|enum|550 Mailbox not found;552 Mailbox full;Blocked by recipient filter;Number not in service;Token expired", "date|Last Bounced|date|-200;0"],
    statuses: ["New", "Suppressed", "Corrected", "Under Review", "Permanently Blocked"],
    measure: "occurrences",
  },

  "quiet-hours": {
    name: "Quiet Hours", kind: "settings", summary: "When not to disturb",
    entity: "Quiet Rule", ref: "QHR",
    fields: [AUDIENCE, CHANNEL, "window|Quiet Window|enum|22:00–06:00;Weekly holiday;Public holiday;During shift;Custom", "overrideFor|Override For|enum|Critical only;Critical and high;Safety alerts;None", "affected|Users Affected|int|2;2400", "deferred|Messages Deferred (30d)|int|0;4800", OWNER, "date|Effective From|date|-500;30"],
    statuses: ["Active", "Draft", "Suspended", "Superseded"],
    measure: "deferred",
    settings: ["Hold non-critical messages until the quiet window closes", "Always deliver safety and evacuation alerts regardless of quiet hours"],
  },

  compose: {
    name: "Compose Message", kind: "form", summary: "Send something now",
    entity: "Message", ref: "CMP",
    fields: ["subject|Subject|enum|Shift change notice;Urgent quality hold;Holiday announcement;Buyer audit preparation;System maintenance window;Training reminder", CHANNEL, AUDIENCE, PRIORITY, "recipients|Recipients|int|1;2400", "attachments|Attachments|int|0;6", "scheduleFor|Send At|date|0;30", "sender|Sent By|person"],
    statuses: ["Draft", "Queued", "Sent", "Failed", "Cancelled"],
    measure: "recipients",
  },

  engagement: {
    name: "Engagement Analytics", kind: "analytics", summary: "Who actually reads what we send",
    entity: "Engagement Record", ref: "ENG",
    fields: [AUDIENCE, CHANNEL, "sent|Sent|int|10;24000", "openRate|Open Rate|pct|2;98", "clickRate|Click Rate|pct|0;68", "actionRate|Action Rate|pct|0;62", "avgResponseMin|Average Response|float|1;2400;min;0", "date|Period End|date|-330;0"],
    statuses: ["Highly Engaged", "Engaged", "Low Engagement", "Ignored"],
    measure: "sent", rows: 46,
  },

  "provider-config": {
    name: "Provider Configuration", kind: "settings", summary: "Gateways and sending limits",
    entity: "Provider", ref: "PRV",
    fields: ["provider|Provider|enum|Corporate SMTP;SendGrid;Local SMS gateway;WhatsApp Business API;Firebase push;In-app service", CHANNEL, "dailyLimit|Daily Limit|int|100;98000", "usedToday|Used Today|int|0;98000", "utilisation|Utilisation|pct|0;128", "uptime|Uptime|pct|82;100", OWNER, "date|Configured On|date|-700;0"],
    statuses: ["Connected", "Degraded", "Rate Limited", "Disconnected", "Not Configured"],
    measure: "dailyLimit",
    settings: ["Fail over to the secondary gateway when the primary exceeds its rate limit", "Retry a failed send three times with exponential backoff"],
  },
};
