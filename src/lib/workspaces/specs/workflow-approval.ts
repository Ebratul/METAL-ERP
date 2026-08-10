import type { ModuleSpecs } from "../types";

/** Module 57 — Workflow & Approval Management. */

const DOCTYPE = "docType|Document|enum|Purchase requisition;Purchase order;Sales quotation;Payment voucher;Journal entry;Leave application;Sample request;Rework approval;Asset request;Price revision";
const DEPT = "department|Department|enum|Production;Quality;Commercial;Finance;Stores;HR;Maintenance;IT";
const APPROVER = "approver|Approver|person";
const REQUESTER = "requester|Raised By|person";
const PRIORITY = "priority|Priority|enum|Urgent;High;Normal;Low";

export const WORKFLOW_APPROVAL: ModuleSpecs = {
  "my-approvals": {
    name: "My Approvals", kind: "list", summary: "Everything waiting on me",
    entity: "Approval Item", ref: "APR",
    fields: [DOCTYPE, DEPT, REQUESTER, "amount|Value|money|100;620000", PRIORITY, "ageHrs|Waiting|int|1;240;hrs", "slaHrs|SLA|int|4;120;hrs", "date|Raised On|date|-60;0"],
    statuses: ["Pending", "In Review", "Approved", "Rejected", "Returned"],
    measure: "amount", rows: 52,
    insight: "Payment vouchers spend 62% of their approval time at a single step — that queue is where the working-capital delay comes from.",
  },

  "workflow-designer": {
    name: "Workflow Designer", kind: "form", summary: "Build an approval chain",
    entity: "Workflow", ref: "WFD",
    fields: [DOCTYPE, "workflowName|Workflow Name|enum|Standard PR approval;High-value PO;Export pricing;Capital expenditure;Leave approval;Rework sign-off", "steps|Approval Steps|int|1;6", "triggerCondition|Trigger|enum|Always;Above value threshold;Specific department;Specific buyer;Exception only", "thresholdValue|Threshold|money|500;280000", "owner|Workflow Owner|person", "date|Effective From|date|-400;0"],
    statuses: ["Draft", "Under Review", "Active", "Suspended", "Retired"],
    measure: "thresholdValue",
  },

  "approval-matrix": {
    name: "Approval Matrix", kind: "settings", summary: "Authority limits by role",
    entity: "Authority Limit", ref: "AMX",
    fields: ["role|Role|enum|Supervisor;Manager;Head of Department;General Manager;Director;Managing Director", DOCTYPE, "minValue|From|money|0;100000", "maxValue|Up To|money|1000;2400000", DEPT, "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Superseded", "Suspended"],
    measure: "maxValue",
    settings: ["Require two approvers above the department limit", "Block self-approval regardless of role limit"],
  },

  delegation: {
    name: "Delegation Rules", kind: "list", summary: "Who covers whom and when",
    entity: "Delegation", ref: "DLG",
    fields: ["delegator|Delegator|person", "delegate|Delegate|person", DOCTYPE, "reason|Reason|enum|Annual leave;Business travel;Medical leave;Training;Workload sharing", "maxValue|Value Cap|money|500;280000", "fromDate|From|date|-90;30", "date|Until|date|-60;60"],
    statuses: ["Scheduled", "Active", "Expired", "Revoked"],
    measure: "maxValue",
  },

  "pending-queue": {
    name: "Pending Queue", kind: "board", summary: "Every open approval by stage",
    entity: "Queue Item", ref: "PQU",
    fields: [DOCTYPE, DEPT, REQUESTER, APPROVER, "amount|Value|money|100;620000", PRIORITY, "ageHrs|Waiting|int|1;240;hrs"],
    statuses: ["Submitted", "Level 1", "Level 2", "Final Approval", "Completed"],
    measure: "amount",
  },

  history: {
    name: "Approval History", kind: "list", summary: "The full decision trail",
    entity: "Decision", ref: "HIS",
    fields: [DOCTYPE, "reference|Reference|enum|PR-26-0411;PO-26-0428;PV-26-0443;JV-26-0461;SQ-26-0478", APPROVER, "decision|Decision|enum|Approved;Rejected;Returned for correction;Delegated;Auto-approved", "amount|Value|money|100;620000", "turnaroundHrs|Turnaround|float|0.2;180;hrs;1", "date|Decided On|date|-300;0"],
    statuses: ["Approved", "Rejected", "Returned", "Auto-Approved"],
    measure: "amount",
  },

  "sla-monitor": {
    name: "SLA Monitor", kind: "analytics", summary: "Turnaround against the promise",
    entity: "SLA Record", ref: "SLA",
    fields: [DOCTYPE, DEPT, "slaHrs|SLA|int|4;120;hrs", "avgHrs|Average Actual|float|0.5;220;hrs;1", "withinSla|Within SLA|pct|20;100", "breaches|Breaches|int|0;40", "volume|Volume|int|1;240", "date|Period End|date|-300;0"],
    statuses: ["Within SLA", "Marginal", "Breached", "Under Review"],
    measure: "volume",
  },

  escalation: {
    name: "Escalation Log", kind: "list", summary: "What got pushed up and why",
    entity: "Escalation", ref: "ESC",
    fields: [DOCTYPE, "fromApprover|From|person", "toApprover|Escalated To|person", "reason|Reason|enum|SLA breach;Approver unavailable;Value threshold;Repeated rejection;Urgent business need", "amount|Value|money|100;620000", "delayHrs|Delay|int|1;220;hrs", "date|Escalated On|date|-200;0"],
    statuses: ["Raised", "Acknowledged", "Resolved", "Withdrawn"],
    measure: "amount",
  },

  bottleneck: {
    name: "Approval Bottlenecks", kind: "analytics", summary: "Who is holding things up",
    entity: "Bottleneck", ref: "BNK",
    fields: [APPROVER, DEPT, "pending|Pending Items|int|0;48", "avgHoldHrs|Average Hold|float|0.5;220;hrs;1", "oldestHrs|Oldest Item|int|1;480;hrs", "valueHeld|Value Held|money|500;1400000", "date|As On|date|-30;0"],
    statuses: ["Clear", "Building", "Bottleneck", "Critical"],
    measure: "valueHeld",
  },

  "workflow-templates": {
    name: "Workflow Templates", kind: "list", summary: "Reusable approval patterns",
    entity: "Template", ref: "WTP",
    fields: [DOCTYPE, "templateName|Template|enum|Two-step finance;Three-step capex;Single-step routine;Parallel review;Conditional by value", "steps|Steps|int|1;6", "usageCount|Times Used|int|1;480", "avgTurnaroundHrs|Average Turnaround|float|1;120;hrs;1", "owner|Owner|person", "date|Created On|date|-600;0"],
    statuses: ["Active", "Draft", "Deprecated"],
    measure: "usageCount",
  },

  "rules-engine": {
    name: "Business Rules", kind: "list", summary: "Conditions that steer routing",
    entity: "Business Rule", ref: "RUL",
    fields: [DOCTYPE, "condition|Condition|enum|Value above threshold;Supplier not approved;Budget exceeded;Buyer credit hold;Item restricted;Urgent flag set", "action|Action|enum|Add approver;Skip step;Auto-reject;Auto-approve;Notify only;Route to committee", "triggers|Triggered (30d)|int|0;180", "owner|Rule Owner|person", "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    measure: "triggers",
  },

  notifications: {
    name: "Approval Notifications", kind: "list", summary: "Reminders sent to approvers",
    entity: "Notification", ref: "NTF",
    fields: [DOCTYPE, APPROVER, "channel|Channel|enum|Email;Mobile push;In-app;SMS;Digest", "trigger|Trigger|enum|New item;Reminder;SLA warning;Escalation;Daily digest", "opened|Opened|bool|Yes;No", "date|Sent On|date|-120;0", "reminders|Reminders Sent|int|1;12"],
    statuses: ["Sent", "Delivered", "Opened", "Actioned", "Failed"],
  },

  "approval-analytics": {
    name: "Approval Analytics", kind: "analytics", summary: "Volume, value and outcome mix",
    entity: "Analytics Point", ref: "AAN",
    fields: [DOCTYPE, DEPT, "volume|Items|int|1;480", "value|Value|money|1000;2400000", "approvalRate|Approval Rate|pct|40;100", "avgSteps|Average Steps|float|1;5;;1", "avgHrs|Average Hours|float|0.5;180;hrs;1", "date|Period End|date|-300;0"],
    statuses: ["Improving", "Stable", "Slowing", "Under Review"],
    measure: "value",
  },

  "out-of-office": {
    name: "Out of Office", kind: "list", summary: "Approvers unavailable and their cover",
    entity: "Absence", ref: "OOO",
    fields: [APPROVER, "reason|Reason|enum|Annual leave;Business travel;Medical;Training;Public holiday", "backup|Backup Approver|person", "itemsRerouted|Items Rerouted|int|0;40", "fromDate|From|date|-60;40", "date|Until|date|-40;60"],
    statuses: ["Scheduled", "Active", "Ended", "Cancelled"],
    measure: "itemsRerouted",
  },

  "workflow-versions": {
    name: "Workflow Versions", kind: "list", summary: "How a chain changed over time",
    entity: "Workflow Version", ref: "WVR",
    fields: [DOCTYPE, "version|Version|enum|v1.0;v1.1;v2.0;v2.1;v3.0", "change|Change|enum|Added approver;Removed step;Threshold change;Parallel review added;SLA tightened", "steps|Steps|int|1;6", "author|Changed By|person", "date|Effective From|date|-500;0"],
    statuses: ["Current", "Superseded", "Draft", "Rolled Back"],
    measure: "steps",
  },

  "approval-limits": {
    name: "Approval Limits", kind: "list", summary: "Personal authority per approver",
    entity: "Limit", ref: "LIM",
    fields: [APPROVER, DEPT, DOCTYPE, "limitValue|Authority Limit|money|500;1400000", "usedThisMonth|Used This Month|money|0;1200000", "utilisation|Utilisation|pct|0;110", "date|Reviewed On|date|-300;0"],
    statuses: ["Active", "Under Review", "Suspended", "Expired"],
    measure: "limitValue",
  },

  "audit-trail": {
    name: "Workflow Audit Trail", kind: "list", summary: "Every state change recorded",
    entity: "Audit Entry", ref: "AUD",
    fields: [DOCTYPE, "reference|Reference|enum|PR-26-0411;PO-26-0428;PV-26-0443;JV-26-0461", "event|Event|enum|Submitted;Viewed;Approved;Rejected;Returned;Delegated;Escalated;Auto-approved", "actor|Actor|person", "ipRegion|Region|enum|Head Office;Plant 1;Plant 2;Remote;Mobile", "date|Occurred On|date|-300;0", "amount|Document Value|money|100;480000"],
    statuses: ["Recorded", "Verified", "Flagged", "Under Review"],
  },

  "workflow-calendar": {
    name: "Approval Calendar", kind: "calendar", summary: "Deadlines and cut-offs ahead",
    entity: "Deadline", ref: "WCL",
    fields: [DOCTYPE, DEPT, "deadline|Deadline Type|enum|Payment run cut-off;Month-end approval;Budget submission;Payroll sign-off;Purchase committee", "items|Items Due|int|1;90", "value|Value|money|1000;1400000", APPROVER, "date|Due Date|date|-30;60"],
    statuses: ["Upcoming", "Due Today", "Overdue", "Completed"],
    measure: "value",
  },

  "exception-handling": {
    name: "Exception Handling", kind: "board", summary: "Items that broke the normal path",
    entity: "Exception", ref: "EXC",
    fields: [DOCTYPE, "exceptionType|Exception|enum|No approver defined;Circular routing;Approver left company;Value outside all limits;Duplicate submission;System error", "amount|Value|money|100;620000", REQUESTER, "ageHrs|Open For|int|1;220;hrs", "date|Raised On|date|-90;0"],
    statuses: ["Detected", "Under Review", "Reassigned", "Resolved", "Cancelled"],
    measure: "amount",
  },

  "workflow-settings": {
    name: "Workflow Controls", kind: "settings", summary: "Global routing and reminder rules",
    entity: "Control Rule", ref: "WSET",
    fields: ["rule|Rule|enum|Auto-escalate on SLA breach;Block self-approval;Reminder frequency;Auto-approve below threshold;Require comment on rejection", "slaHrs|SLA|int|4;120;hrs", "owner|Rule Owner|person", "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Escalate to the next level when the SLA elapses", "Require a written reason on every rejection"],
  },
};
