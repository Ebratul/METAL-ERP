import type { ModuleSpecs } from "../types";

/** Module 55 — Security & Gate Pass Management. */

const GATE = "gate|Gate|enum|Main Gate;Material Gate;Worker Gate;Warehouse Gate;Emergency Gate";
const GUARD = "guard|Security Guard|person";
const ZONE = "zone|Zone|enum|Press Shop;Plating;Assembly;Warehouse;Chemical Store;Admin Block;Utility Yard;Perimeter";
const VEHICLE = "vehicle|Vehicle|enum|DH-11-4471;DH-11-6620;CH-14-2288;DH-12-9931;Container 20ft;Container 40ft;Visitor car";
const SHIFT = "shift|Shift|enum|A (06–14);B (14–22);C (22–06)";

export const SECURITY_GATEPASS: ModuleSpecs = {
  "gate-pass": {
    name: "Gate Pass Register", kind: "list", summary: "Every inward and outward movement",
    entity: "Gate Pass", ref: "GP",
    fields: [GATE, "direction|Direction|enum|Inward;Outward", "material|Material|enum|Raw material;Finished goods;Tools & dies;Machinery;Scrap;Packing material;Documents", "qty|Quantity|int|1;9000;units", "value|Declared Value|money|20;280000", "party|Party|enum|@suppliers", GUARD, "date|Pass Date|date|-120;0"],
    statuses: ["Raised", "Approved", "Cleared", "Held at Gate", "Cancelled"],
    measure: "value", rows: 52,
    insight: "Eleven returnable passes are past their expected return date — tools sent for sharpening account for most of them.",
  },

  returnable: {
    name: "Returnable Gate Pass", kind: "list", summary: "Items that must come back",
    entity: "Returnable Pass", ref: "RGP",
    fields: ["item|Item|enum|Die set;Measuring instrument;Laptop;Machine part;Sample box;Testing equipment", "party|Sent To|enum|@suppliers", "purpose|Purpose|enum|Repair;Sharpening;Calibration;Job work;Demonstration;Testing", "qty|Quantity|int|1;40;units", "value|Value|money|50;92000", "dueDays|Return Due In|int|-60;90;days", "date|Expected Return|date|-60;90"],
    statuses: ["Issued", "Due", "Overdue", "Returned", "Written Off"],
    measure: "value",
  },

  "visitor-management": {
    name: "Visitor Management", kind: "list", summary: "Guests on site and their host",
    entity: "Visitor", ref: "VIS",
    fields: ["visitor|Visitor|person", "organisation|Organisation|enum|@buyers", "purpose|Purpose|enum|Buyer audit;Business meeting;Maintenance service;Government inspection;Interview;Delivery", "host|Host|person", GATE, "durationMin|Time on Site|int|10;480;min", "date|Visit Date|date|-120;10"],
    statuses: ["Expected", "Checked In", "On Site", "Checked Out", "Denied Entry"],
    measure: "durationMin",
  },

  "vehicle-entry": {
    name: "Vehicle Entry Log", kind: "list", summary: "Truck and car movements",
    entity: "Vehicle Entry", ref: "VEH",
    fields: [VEHICLE, GATE, "purpose|Purpose|enum|Material delivery;Finished goods pickup;Scrap removal;Staff transport;Visitor;Service", "driver|Driver|person", "waitMin|Wait Time|int|2;240;min", "weightIn|Weight In|float|0.5;28;t;2", "date|Entry Date|date|-120;0"],
    statuses: ["At Gate", "Inside", "Loading", "Departed", "Turned Away"],
    measure: "waitMin",
  },

  "material-movement": {
    name: "Material Movement", kind: "analytics", summary: "Gate-level flow of goods",
    entity: "Movement Record", ref: "MMV",
    fields: [GATE, "direction|Direction|enum|Inward;Outward", "category|Category|enum|Raw material;Finished goods;Scrap;Packing;Tools;Chemicals", "movements|Movements|int|1;180", "quantity|Quantity|float|10;9800;units;0", "value|Value|money|200;620000", "date|Period End|date|-240;0"],
    statuses: ["Normal", "High Volume", "Under Review", "Discrepancy"],
    measure: "value",
  },

  incidents: {
    name: "Security Incidents", kind: "board", summary: "Events raised by the security team",
    entity: "Incident", ref: "INC",
    fields: [ZONE, "incidentType|Incident|enum|Unauthorised entry;Theft attempt;Missing material;Tailgating;Damage to property;Fire alarm;Fight or dispute", "severity|Severity|enum|Critical;High;Medium;Low", "lossValue|Estimated Loss|money|0;62000", GUARD, "date|Occurred On|date|-240;0"],
    statuses: ["Reported", "Under Investigation", "Action Taken", "Closed", "Escalated"],
    measure: "lossValue",
  },

  "cctv-log": {
    name: "CCTV Reference Log", kind: "list", summary: "Footage retrieved and reviewed",
    entity: "Footage Record", ref: "CCT",
    fields: [ZONE, "camera|Camera|enum|CAM-GATE-01;CAM-GATE-02;CAM-PRESS-03;CAM-STORE-04;CAM-PLATE-05;CAM-PERIM-06", "reason|Retrieval Reason|enum|Incident review;Audit evidence;Buyer request;Insurance claim;Routine check", "durationMin|Footage Length|int|5;480;min", "requester|Requested By|person", "date|Footage Date|date|-90;0"],
    statuses: ["Requested", "Retrieved", "Reviewed", "Archived", "Not Available"],
    measure: "durationMin",
  },

  "access-control": {
    name: "Access Control", kind: "settings", summary: "Who may enter which zone",
    entity: "Access Rule", ref: "ACL",
    fields: [ZONE, "role|Role|enum|Operator;Supervisor;Maintenance;Quality;Visitor;Contractor;Management", "accessLevel|Access|enum|Full;Escorted;Time-limited;Denied", "timeWindow|Time Window|enum|Shift hours;Working hours;24 hours;By appointment", "cardsIssued|Cards Issued|int|1;220", "date|Effective From|date|-500;0"],
    statuses: ["Active", "Under Review", "Suspended", "Retired"],
    measure: "cardsIssued",
    settings: ["Require escort for every visitor entering production zones", "Auto-expire contractor access at the end of the work order"],
  },

  "guard-roster": {
    name: "Guard Roster", kind: "calendar", summary: "Security shift deployment",
    entity: "Roster Entry", ref: "RST",
    fields: [GUARD, GATE, SHIFT, "post|Post|enum|Main gate;Material gate;Patrol;CCTV room;Warehouse;Perimeter", "hours|Hours|float|4;12;hrs;1", "date|Duty Date|date|-30;30"],
    statuses: ["Scheduled", "On Duty", "Completed", "Absent", "Swapped"],
    measure: "hours",
  },

  "employee-movement": {
    name: "Employee Movement", kind: "list", summary: "Staff entering and leaving on duty",
    entity: "Movement", ref: "EMV",
    fields: ["employee|Employee|person", "department|Department|enum|Production;Plating;Assembly;Packing;Stores;Maintenance;Admin", "movementType|Movement|enum|Late entry;Early exit;Official duty;Personal;Break out;Overtime entry", GATE, "approvedBy|Approved By|person", "date|Movement Date|date|-90;0", "durationMin|Duration|int|5;480;min"],
    statuses: ["Requested", "Approved", "Recorded", "Rejected"],
  },

  "contractor-passes": {
    name: "Contractor Passes", kind: "list", summary: "Third-party workers on site",
    entity: "Contractor Pass", ref: "CTP",
    fields: ["contractor|Contractor|enum|@suppliers", "workType|Work Type|enum|Machine installation;Civil work;Electrical;Painting;Housekeeping;IT support", "workers|Workers|int|1;40", ZONE, "safetyBriefing|Safety Briefing|bool|Done;Pending", "validUntil|Valid Until|date|-30;120", "date|Issued On|date|-180;0"],
    statuses: ["Issued", "Active", "Expiring", "Expired", "Revoked"],
    measure: "workers",
  },

  "key-register": {
    name: "Key Register", kind: "list", summary: "Custody of keys and access devices",
    entity: "Key Record", ref: "KEY",
    fields: ["keyId|Key|enum|KEY-STORE-01;KEY-CHEM-02;KEY-PANEL-03;KEY-GATE-04;KEY-SERVER-05", ZONE, "holder|Current Holder|person", "issuedBy|Issued By|person", "returnDue|Return Due|date|-20;30", "date|Issued On|date|-180;0", "keysHeld|Keys Held|int|1;12"],
    statuses: ["In Custody", "Issued", "Overdue", "Returned", "Lost"],
  },

  "patrol-log": {
    name: "Patrol Log", kind: "list", summary: "Round-by-round patrol records",
    entity: "Patrol Round", ref: "PTL",
    fields: [GUARD, ZONE, SHIFT, "checkpoints|Checkpoints|int|4;24", "completed|Checkpoints Done|int|0;24", "observations|Observations|int|0;8", "date|Patrol Date|date|-60;0"],
    statuses: ["Completed", "Partial", "Missed", "Observations Raised"],
    measure: "checkpoints",
  },

  "lost-found": {
    name: "Lost & Found", kind: "list", summary: "Items handed in at the gate",
    entity: "Lost Item", ref: "LFN",
    fields: ["item|Item|enum|ID card;Mobile phone;Wallet;Tool;Keys;Bag;Documents", "foundAt|Found At|enum|Press Shop;Plating;Canteen;Washroom;Parking;Gate", "finder|Found By|person", "value|Estimated Value|money|1;900", "claimant|Claimed By|person", "date|Found On|date|-180;0"],
    statuses: ["Logged", "Unclaimed", "Claimed", "Disposed"],
    measure: "value",
  },

  "gate-pass-entry": {
    name: "Gate Pass Entry", kind: "form", summary: "Raise a new gate pass",
    entity: "Gate Pass", ref: "GPE",
    fields: [GATE, "direction|Direction|enum|Inward;Outward", "passType|Pass Type|enum|Returnable;Non-returnable;Vehicle;Visitor;Employee", "material|Material|enum|Raw material;Finished goods;Tools & dies;Scrap;Packing material;Documents", "qty|Quantity|int|1;9000;units", "value|Declared Value|money|20;180000", "requester|Requested By|person", "date|Pass Date|date|-5;5"],
    statuses: ["Draft", "Submitted", "Approved", "Cleared", "Rejected"],
    measure: "value",
  },

  "security-audit": {
    name: "Security Audit", kind: "calendar", summary: "Internal and buyer security checks",
    entity: "Security Audit", ref: "SAD",
    fields: ["scope|Scope|enum|C-TPAT;Physical security;Access control;CCTV coverage;Cargo security;Personnel screening", "auditor|Auditor|person", "findings|Findings|int|0;16", "score|Score|pct|45;100", "date|Audit Date|date|-300;90"],
    statuses: ["Planned", "In Progress", "Report Issued", "Actions Open", "Closed"],
    measure: "score",
  },

  "badge-management": {
    name: "Badge Management", kind: "list", summary: "ID cards issued and returned",
    entity: "Badge", ref: "BDG",
    fields: ["holder|Holder|person", "badgeType|Badge Type|enum|Permanent employee;Contractor;Visitor;Vendor;Temporary", "badgeNo|Badge No|enum|BD-10041;BD-10058;BD-10072;BD-10091;BD-10114", ZONE, "validUntil|Valid Until|date|-60;500", "issuedBy|Issued By|person", "accessZones|Zones Allowed|int|1;8"],
    statuses: ["Active", "Expiring", "Expired", "Lost", "Returned"],
  },

  "emergency-drills": {
    name: "Emergency Drills", kind: "list", summary: "Preparedness exercises run",
    entity: "Drill", ref: "EMD",
    fields: ["drillType|Drill|enum|Fire evacuation;Chemical spill;Earthquake;Intrusion;Medical emergency;Power failure", ZONE, "participants|Participants|int|10;900", "responseMin|Response Time|float|1;18;min;1", "observations|Observations|int|0;10", "date|Drill Date|date|-300;60"],
    statuses: ["Planned", "Completed", "Observations Open", "Overdue"],
    measure: "participants",
  },

  "security-analytics": {
    name: "Security Analytics", kind: "analytics", summary: "Movements, incidents and response",
    entity: "Security Metric", ref: "SAN",
    fields: ["metric|Metric|enum|Gate movements;Average wait time;Incidents;Unclaimed passes;Patrol compliance;Visitor count", GATE, "value|Value|float|1;980;;1", "target|Target|float|1;900;;1", "variance|vs Target|pct|40;180", "date|Period End|date|-300;0"],
    statuses: ["Better than Target", "On Target", "Below Target", "Under Review"],
    measure: "value",
  },

  "security-settings": {
    name: "Security Controls", kind: "settings", summary: "Gate rules and escalation",
    entity: "Control Rule", ref: "SSET",
    fields: [GATE, "rule|Rule|enum|Mandatory approval for outward material;Alert on overdue returnable;Photo capture for visitors;Vehicle weighment on exit;Escort for restricted zones", "threshold|Threshold|money|100;92000", "owner|Rule Owner|person", "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Require management approval for outward material above the value threshold", "Alert security when a returnable pass passes its due date"],
  },
};
