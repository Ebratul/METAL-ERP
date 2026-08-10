import type { ModuleSpecs } from "../types";

/** Module 59 — Mobile App Management. */

const PLATFORM = "platform|Platform|enum|Android;iOS;Android (rugged);Web app";
const ROLE = "role|User Role|enum|Operator;Supervisor;Manager;Store keeper;Quality inspector;Security;Executive";
const APPVERSION = "appVersion|App Version|enum|v3.1.0;v3.2.1;v3.3.0;v3.4.2;v4.0.0";
const OWNER = "owner|App Owner|person";
const MODULE = "module|Module|enum|Production entry;Quality check;Stock movement;Approvals;Attendance;Gate pass;Dashboards";

export const MOBILE_APP: ModuleSpecs = {
  "app-overview": {
    name: "App Overview", kind: "overview", summary: "Adoption and health at a glance",
    entity: "App Metric", ref: "APP",
    fields: [PLATFORM, MODULE, "activeUsers|Active Users|int|4;480", "sessions|Sessions|int|20;9800", "crashRate|Crash Rate|pct|0;8", "avgSessionMin|Average Session|float|0.5;28;min;1", OWNER, "date|Period End|date|-240;0"],
    statuses: ["Healthy", "Watch", "Degraded", "Critical"],
    measure: "sessions", rows: 44,
    insight: "Shop-floor production entry drives 61% of all sessions — every second of load time there is worth more than anywhere else in the app.",
  },

  devices: {
    name: "Enrolled Devices", kind: "list", summary: "Handsets and tablets in the field",
    entity: "Device", ref: "DEV",
    fields: ["deviceId|Device|enum|DEV-1041;DEV-1058;DEV-1072;DEV-1091;DEV-1114;DEV-1127", PLATFORM, "model|Model|enum|Samsung A25;Zebra TC22;iPad 10th gen;Honeywell CT30;Redmi Note 13", "assignedTo|Assigned To|person", APPVERSION, "batteryHealth|Battery Health|pct|38;100", "date|Enrolled On|date|-700;0"],
    statuses: ["Active", "Idle", "Lost", "Retired", "Under Repair"],
    measure: "batteryHealth",
  },

  "app-users": {
    name: "App Users", kind: "list", summary: "Accounts using the companion app",
    entity: "App User", ref: "USR",
    fields: ["userName|User|person", ROLE, "department|Department|enum|Production;Quality;Stores;Maintenance;Security;Commercial;Management", PLATFORM, "sessions|Sessions (30d)|int|0;220", "lastSeenDays|Last Seen|int|0;120;days", "date|Activated On|date|-700;0"],
    statuses: ["Active", "Invited", "Dormant", "Locked", "Removed"],
    measure: "sessions",
  },

  "feature-flags": {
    name: "Feature Flags", kind: "settings", summary: "Roll features out by role",
    entity: "Feature Flag", ref: "FLG",
    fields: ["feature|Feature|enum|Offline production entry;Barcode scanning;Photo capture in QC;Push approvals;Biometric login;Dark mode;Voice notes", ROLE, "rolloutPct|Rollout|pct|0;100", "usersEnabled|Users Enabled|int|0;480", OWNER, "date|Enabled On|date|-300;0"],
    statuses: ["Enabled", "Partial Rollout", "Disabled", "Deprecated"],
    measure: "usersEnabled",
    settings: ["Roll new features to supervisors before operators", "Disable a flag automatically when its crash rate exceeds 2%"],
  },

  "push-notifications": {
    name: "Push Notifications", kind: "list", summary: "Campaigns and alerts sent",
    entity: "Push Campaign", ref: "PSH",
    fields: ["title|Notification|enum|Approval pending;Shift roster published;Machine breakdown;Order shipped;Quality alert;App update available", ROLE, "sent|Sent|int|4;900", "delivered|Delivered|int|0;900", "opened|Opened|int|0;700", "openRate|Open Rate|pct|4;96", "date|Sent On|date|-180;0"],
    statuses: ["Draft", "Scheduled", "Sent", "Failed", "Cancelled"],
    measure: "sent",
  },

  "offline-sync": {
    name: "Offline Sync", kind: "analytics", summary: "Queued records and conflicts",
    entity: "Sync Record", ref: "SYN",
    fields: [MODULE, "deviceId|Device|enum|DEV-1041;DEV-1058;DEV-1072;DEV-1091;DEV-1114", "queued|Queued Records|int|0;480", "synced|Synced|int|0;480", "conflicts|Conflicts|int|0;24", "offlineHrs|Offline Duration|float|0;72;hrs;1", "date|Sync Date|date|-90;0"],
    statuses: ["Synced", "Pending", "Conflict", "Failed"],
    measure: "queued",
  },

  "app-versions": {
    name: "App Versions", kind: "list", summary: "Release history and adoption",
    entity: "App Release", ref: "VER",
    fields: [APPVERSION, PLATFORM, "releaseType|Release Type|enum|Major;Minor;Patch;Hotfix;Beta", "devices|Devices on Version|int|1;420", "adoption|Adoption|pct|2;100", "crashRate|Crash Rate|pct|0;9", "date|Released On|date|-500;0"],
    statuses: ["Current", "Supported", "Deprecated", "Blocked", "Beta"],
    measure: "devices",
  },

  "crash-reports": {
    name: "Crash Reports", kind: "list", summary: "Stability issues from the field",
    entity: "Crash Report", ref: "CRS",
    fields: [APPVERSION, PLATFORM, MODULE, "errorType|Error|enum|Null reference;Network timeout;Storage full;Camera permission;Sync conflict;Memory pressure", "occurrences|Occurrences|int|1;480", "usersAffected|Users Affected|int|1;180", "date|First Seen|date|-200;0"],
    statuses: ["New", "Triaged", "Fix In Progress", "Fixed", "Cannot Reproduce"],
    measure: "occurrences",
  },

  "usage-analytics": {
    name: "Usage Analytics", kind: "analytics", summary: "Screens, sessions and drop-off",
    entity: "Usage Metric", ref: "USG",
    fields: [MODULE, ROLE, "screenViews|Screen Views|int|20;9800", "uniqueUsers|Unique Users|int|1;420", "avgTimeSec|Average Time|float|2;480;sec;0", "dropOff|Drop-off|pct|0;62", "date|Period End|date|-300;0"],
    statuses: ["Highly Used", "Used", "Rarely Used", "Abandoned"],
    measure: "screenViews",
  },

  screens: {
    name: "Screen Inventory", kind: "list", summary: "What the app actually contains",
    entity: "Screen", ref: "SCR",
    fields: [MODULE, "screenName|Screen|enum|Production entry;Job list;QC checklist;Stock lookup;Approval inbox;Attendance punch;Dashboard;Profile", ROLE, "loadMs|Load Time|int|120;4800;ms", "offlineCapable|Offline Capable|bool|Yes;No", "views|Views (30d)|int|10;9800", "date|Last Updated|date|-300;0"],
    statuses: ["Live", "Beta", "Deprecated", "Planned"],
    measure: "views",
  },

  permissions: {
    name: "App Permissions", kind: "list", summary: "What each role may do on mobile",
    entity: "Permission", ref: "PRM",
    fields: [ROLE, MODULE, "action|Action|enum|View;Create;Edit;Approve;Delete;Export", "granted|Granted|bool|Yes;No", "usersAffected|Users|int|1;220", OWNER, "date|Updated On|date|-400;0"],
    statuses: ["Active", "Pending Approval", "Revoked", "Under Review"],
    measure: "usersAffected",
  },

  "mobile-approvals": {
    name: "Mobile Approvals", kind: "board", summary: "Decisions taken on the phone",
    entity: "Mobile Approval", ref: "MAP",
    fields: ["docType|Document|enum|Purchase requisition;Leave application;Payment voucher;Rework approval;Gate pass;Sample request", "requester|Raised By|person", "approver|Approver|person", "amount|Value|money|50;280000", "responseMin|Response Time|int|1;900;min", "date|Raised On|date|-90;0"],
    statuses: ["Pending", "Viewed", "Approved", "Rejected", "Expired"],
    measure: "amount",
  },

  "field-data-capture": {
    name: "Field Data Capture", kind: "form", summary: "Record an entry from the floor",
    entity: "Field Entry", ref: "FLD",
    fields: [MODULE, "reference|Reference|enum|WO-26-1042;WO-26-1051;SO-26-2041;GRN-26-0311;JOB-26-0411", "quantity|Quantity|int|1;40000;pcs", "photoAttached|Photo Attached|bool|Yes;No", "capturedBy|Captured By|person", "gpsTagged|GPS Tagged|bool|Yes;No", "date|Captured On|date|-30;0"],
    statuses: ["Draft", "Queued Offline", "Synced", "Verified", "Rejected"],
    measure: "quantity",
  },

  "device-enrollment": {
    name: "Device Enrollment", kind: "form", summary: "Register a new device",
    entity: "Enrollment", ref: "ENR",
    fields: [PLATFORM, "model|Model|enum|Samsung A25;Zebra TC22;iPad 10th gen;Honeywell CT30;Redmi Note 13", "assignedTo|Assign To|person", ROLE, "ownership|Ownership|enum|Company owned;Personal device;Shared shop-floor;Contractor", "location|Location|enum|Press Shop;Plating;Assembly;Stores;Gate;Office", "date|Enrollment Date|date|-30;10", "appsInstalled|Apps to Install|int|1;8"],
    statuses: ["Draft", "Submitted", "Approved", "Enrolled", "Rejected"],
  },

  "app-feedback": {
    name: "In-App Feedback", kind: "list", summary: "What users say from inside the app",
    entity: "Feedback", ref: "FBK",
    fields: [MODULE, "userName|User|person", ROLE, "sentiment|Sentiment|enum|Positive;Neutral;Negative", "topic|Topic|enum|Speed;Usability;Missing feature;Bug;Offline behaviour;Login", "rating|Rating|int|1;5", "date|Submitted On|date|-240;0"],
    statuses: ["New", "Reviewed", "Planned", "Implemented", "Declined"],
    measure: "rating",
  },

  "beta-program": {
    name: "Beta Program", kind: "list", summary: "Early access testers and findings",
    entity: "Beta Participant", ref: "BTA",
    fields: ["tester|Tester|person", ROLE, APPVERSION, "issuesRaised|Issues Raised|int|0;24", "sessions|Sessions|int|1;220", "feedbackScore|Feedback Score|pct|30;100", "date|Joined On|date|-300;0"],
    statuses: ["Active", "Invited", "Completed", "Dropped Out"],
    measure: "sessions",
  },

  performance: {
    name: "App Performance", kind: "analytics", summary: "Speed and reliability in the field",
    entity: "Performance Metric", ref: "PRF",
    fields: [MODULE, PLATFORM, "coldStartMs|Cold Start|int|400;6800;ms", "apiLatencyMs|API Latency|int|60;3800;ms", "errorRate|Error Rate|pct|0;12", "networkType|Network|enum|WiFi;4G;3G;Offline", "date|Period End|date|-240;0"],
    statuses: ["Fast", "Acceptable", "Slow", "Failing"],
    measure: "apiLatencyMs",
  },

  "release-calendar": {
    name: "Release Calendar", kind: "calendar", summary: "Planned builds and rollouts",
    entity: "Release", ref: "REL",
    fields: [APPVERSION, PLATFORM, "releaseType|Release Type|enum|Major;Minor;Patch;Hotfix;Beta", "features|Features|int|1;18", "rolloutPct|Planned Rollout|pct|5;100", OWNER, "date|Release Date|date|-200;90"],
    statuses: ["Planned", "In Development", "In Testing", "Released", "Rolled Back"],
    measure: "features",
  },

  "device-security": {
    name: "Device Security", kind: "list", summary: "Policy compliance per device",
    entity: "Security Record", ref: "SEC",
    fields: ["deviceId|Device|enum|DEV-1041;DEV-1058;DEV-1072;DEV-1091;DEV-1114", PLATFORM, "policy|Policy|enum|Screen lock;Encryption;OS version;Remote wipe enabled;Rooted device check;VPN required", "compliant|Compliant|bool|Yes;No", "osVersion|OS Version|enum|Android 12;Android 13;Android 14;iOS 16;iOS 17", "date|Last Checked|date|-90;0", "violations|Open Violations|int|0;12"],
    statuses: ["Compliant", "Warning", "Non-Compliant", "Quarantined"],
  },

  "app-settings": {
    name: "App Configuration", kind: "settings", summary: "Session, sync and update policy",
    entity: "Control Rule", ref: "ASET",
    fields: ["rule|Rule|enum|Force update below minimum version;Session timeout;Offline queue limit;Photo compression;Background sync interval", "value|Value|int|1;480", OWNER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Force an update when a device runs below the minimum supported version", "Cap the offline queue and warn the user before it fills"],
  },
};
