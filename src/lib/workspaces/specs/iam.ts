import type { ModuleSpecs } from "../types";

/** Module 69 — Identity & Access Management (IAM). */

const USER = "user|User|person";
const ROLE = "role|Role|enum|System Administrator;Merchandiser;Production Planner;Store Keeper;QC Inspector;Accounts Officer;HR Officer;Plant Manager;Auditor (read only);Buyer Portal User";
const APP_MODULE = "area|Module|enum|Sales Order;Procurement;Inventory;Production;Quality;Payroll;Finance;Master Data;Reports;Administration";
const DEPT = "department|Department|enum|Commercial;Production;Quality;Warehouse;Procurement;Finance;HR;IT;Maintenance;Logistics";
const REVIEWER = "reviewer|Reviewer|person";

export const IAM: ModuleSpecs = {
  identities: {
    name: "Identity Directory", kind: "list", summary: "Every account that exists",
    entity: "Identity", ref: "IDN",
    fields: [USER, "identityType|Type|enum|Employee;Contractor;Service account;Buyer portal;Supplier portal;Integration", DEPT, ROLE, "lastLoginDays|Last Sign-in|int|0;220;days ago", "mfaEnabled|MFA Enabled|bool|Yes;No", "date|Created On|date|-2400;0"],
    statuses: ["Active", "Invited", "Locked", "Dormant", "Deactivated"],
    measure: "lastLoginDays", rows: 54,
    insight: "Nine accounts have not signed in for over 90 days yet still hold write access to Finance — dormant privilege is the largest single gap in the current entitlement picture.",
  },

  roles: {
    name: "Role Definitions", kind: "list", summary: "The role catalogue",
    entity: "Role", ref: "ROL",
    fields: [ROLE, "roleType|Role Type|enum|Business role;Technical role;Approval role;Read-only role;Emergency role", DEPT, "members|Members|int|0;180", "privileges|Privileges|int|2;120", "riskLevel|Risk Level|enum|Low;Medium;High;Critical", "owner|Role Owner|person", "date|Defined On|date|-1800;0"],
    statuses: ["Active", "Draft", "Under Review", "Deprecated"],
    measure: "members",
  },

  "permission-matrix": {
    name: "Permission Matrix", kind: "settings", summary: "Role to privilege mapping",
    entity: "Permission", ref: "PRM",
    fields: [ROLE, APP_MODULE, "privilege|Privilege|enum|View;Create;Edit;Delete;Approve;Export;Post;Configure", "scope|Scope|enum|All plants;Own plant;Own department;Own records;Assigned buyers", "granted|Granted|bool|Yes;No", "sensitive|Sensitive|bool|Yes;No", "date|Last Changed|date|-900;0"],
    statuses: ["Granted", "Denied", "Conditional", "Under Review"],
    settings: ["Deny by default — a privilege must be granted explicitly", "Require role-owner approval before any sensitive privilege is added", "Log every permission change to the audit trail"],
  },

  "access-requests": {
    name: "Access Requests", kind: "board", summary: "Grant and revoke workflow",
    entity: "Access Request", ref: "ARQ",
    fields: [USER, "requestType|Request|enum|New access;Additional role;Privilege upgrade;Temporary access;Access removal;Account reactivation", ROLE, APP_MODULE, "justification|Justification|enum|New joiner;Role change;Project assignment;Cover during leave;Audit requirement;System integration", "approver|Approver|person", "ageDays|Pending For|int|0;45;days", "date|Raised On|date|-200;0"],
    statuses: ["Submitted", "Manager Approved", "Owner Approved", "Provisioned", "Rejected"],
    measure: "ageDays", rows: 48,
  },

  "access-review": {
    name: "Access Recertification", kind: "calendar", summary: "Periodic entitlement review",
    entity: "Review Campaign", ref: "REV",
    fields: ["campaign|Campaign|enum|Q1 FY26 entitlement review;Finance privileged review;Contractor access review;Dormant account sweep;Segregation of duties review", DEPT, "identities|Identities in Scope|int|4;240", "reviewed|Reviewed|int|0;240", "revoked|Access Revoked|int|0;68", "completion|Completion|pct|0;100", REVIEWER, "date|Due On|date|-60;180"],
    statuses: ["Scheduled", "In Progress", "Completed", "Overdue", "Cancelled"],
    measure: "identities",
  },

  "sso-directory": {
    name: "SSO & Directory Sync", kind: "settings", summary: "Identity provider connection",
    entity: "Directory Connection", ref: "SSO",
    fields: ["provider|Provider|enum|Microsoft Entra ID;Google Workspace;Okta;On-premise Active Directory;Local database", "protocol|Protocol|enum|SAML 2.0;OpenID Connect;LDAP;SCIM;Local", "syncFrequency|Sync|enum|Real time;Every 15 minutes;Hourly;Nightly;Manual", "identitiesSynced|Identities Synced|int|10;980", "syncErrors|Sync Errors|int|0;48", "owner|Owner|person", "date|Last Sync|date|-10;0"],
    statuses: ["Connected", "Degraded", "Disconnected", "Not Configured"],
    measure: "identitiesSynced",
    settings: ["Provision new joiners automatically from the directory", "Disable the local account the moment the directory marks a leaver"],
  },

  "mfa-policy": {
    name: "MFA Policy", kind: "settings", summary: "Second-factor enforcement",
    entity: "MFA Rule", ref: "MFA",
    fields: [ROLE, "factor|Second Factor|enum|Authenticator app;SMS code;Email code;Hardware key;Push approval", "enforcement|Enforcement|enum|Mandatory;Mandatory off-network;Optional;Exempt", "enrolled|Enrolment|pct|20;100", "bypasses|Bypasses Granted|int|0;24", "owner|Policy Owner|person", "date|Effective From|date|-500;30"],
    statuses: ["Enforced", "Rolling Out", "Optional", "Suspended"],
    measure: "enrolled",
    settings: ["Require a second factor for every administrative role", "Allow a 24-hour bypass only with IT head approval"],
  },

  "password-policy": {
    name: "Credential Policy", kind: "settings", summary: "Strength and rotation rules",
    entity: "Credential Rule", ref: "CRP",
    fields: ["rule|Rule|enum|Minimum length;Complexity requirement;Rotation interval;History depth;Lockout threshold;Session timeout", "value|Configured Value|enum|12 characters;Upper, lower, digit, symbol;90 days;Last 5;5 attempts;30 minutes", "appliesTo|Applies To|enum|All users;Administrators;Service accounts;Portal users", "compliance|Compliance|pct|42;100", "exceptions|Exceptions|int|0;18", "owner|Policy Owner|person", "date|Effective From|date|-600;30"],
    statuses: ["Enforced", "Advisory", "Draft", "Superseded"],
    measure: "compliance",
    settings: ["Reject any credential found in a known breach list", "Force a change at first sign-in for every newly provisioned account"],
  },

  "active-sessions": {
    name: "Active Sessions", kind: "analytics", summary: "Who is signed in right now",
    entity: "Session", ref: "SSN",
    fields: [USER, "client|Client|enum|Web browser;Mobile app;Shop-floor terminal;Buyer portal;API client;Desktop", "network|Network|enum|Office LAN;Factory Wi-Fi;VPN;Mobile data;External", "durationMin|Session Length|int|1;720;min", "idleMin|Idle|int|0;220;min", "location|Location|enum|Dhaka;Gazipur;Savar;Chattogram;Hong Kong;Unknown", "date|Started At|date|-3;0"],
    statuses: ["Active", "Idle", "Expiring", "Terminated", "Suspicious"],
    measure: "durationMin", rows: 50,
  },

  "login-audit": {
    name: "Sign-in Audit", kind: "list", summary: "Sign-in and failure history",
    entity: "Sign-in Event", ref: "LGA",
    fields: [USER, "result|Result|enum|Success;Wrong credential;MFA failed;Account locked;Blocked by policy;Session expired", "client|Client|enum|Web browser;Mobile app;Shop-floor terminal;Buyer portal;API client", "network|Network|enum|Office LAN;Factory Wi-Fi;VPN;Mobile data;External", "attempts|Attempts|int|1;12", "location|Location|enum|Dhaka;Gazipur;Savar;Chattogram;Hong Kong;Unknown", "date|Occurred At|date|-90;0"],
    statuses: ["Normal", "Repeated Failure", "New Device", "Impossible Travel", "Blocked"],
    measure: "attempts", rows: 58,
  },

  "segregation-of-duties": {
    name: "Segregation of Duties", kind: "analytics", summary: "Conflicting privilege pairs",
    entity: "SoD Conflict", ref: "SOD",
    fields: [USER, "conflict|Conflict|enum|Create supplier + approve payment;Raise PO + receive goods;Post journal + approve journal;Create employee + run payroll;Adjust stock + approve adjustment", "severity|Severity|enum|Critical;High;Medium;Low", DEPT, "exposure|Value Exposed|money|0;4800000", "compensating|Compensating Control|bool|Yes;No", REVIEWER, "date|Detected On|date|-400;0"],
    statuses: ["Open", "Mitigated", "Accepted Risk", "Resolved", "Escalated"],
    measure: "exposure",
  },

  provisioning: {
    name: "Joiner / Mover / Leaver", kind: "board", summary: "Lifecycle provisioning",
    entity: "Lifecycle Case", ref: "JML",
    fields: [USER, "eventType|Event|enum|Joiner;Internal transfer;Promotion;Leaver;Contract end;Long leave", DEPT, ROLE, "systems|Systems Affected|int|1;14", "slaHrs|SLA|int|4;168;hrs", "elapsedHrs|Elapsed|int|0;400;hrs", "date|Effective From|date|-200;60"],
    statuses: ["Notified", "In Progress", "Completed", "Overdue", "Cancelled"],
    measure: "systems",
  },

  "privileged-accounts": {
    name: "Privileged Accounts", kind: "list", summary: "The keys to the kingdom",
    entity: "Privileged Account", ref: "PRV",
    fields: [USER, "accountType|Account Type|enum|System administrator;Database owner;Application super user;Emergency break-glass;Vendor support", APP_MODULE, "lastUsedDays|Last Used|int|0;220;days ago", "checkoutRequired|Checkout Required|bool|Yes;No", "sessionsRecorded|Sessions Recorded|int|0;180", "owner|Accountable Owner|person", "date|Granted On|date|-1200;0"],
    statuses: ["Active", "Checked Out", "Dormant", "Under Review", "Revoked"],
    measure: "sessionsRecorded",
  },

  "service-accounts": {
    name: "Service Accounts", kind: "list", summary: "Non-human identities",
    entity: "Service Account", ref: "SVA",
    fields: ["service|Service Account|enum|svc-integration-edi;svc-bank-sync;svc-iot-collector;svc-report-scheduler;svc-backup-agent;svc-portal-api", "purpose|Purpose|enum|Buyer EDI exchange;Bank statement import;IoT telemetry;Scheduled reporting;Nightly backup;Portal access", APP_MODULE, "rotationDays|Credential Rotation|int|30;400;days", "lastRotatedDays|Last Rotated|int|0;500;days ago", "owner|Technical Owner|person", "date|Created On|date|-1400;0"],
    statuses: ["Active", "Rotation Due", "Overdue Rotation", "Disabled", "Orphaned"],
    measure: "lastRotatedDays",
  },

  delegation: {
    name: "Delegation & Deputies", kind: "list", summary: "Cover during absence",
    entity: "Delegation", ref: "DLG",
    fields: [USER, "delegate|Delegate|person", "authority|Delegated Authority|enum|Order approval;Purchase approval;Payment release;Leave approval;Quality release;Despatch release", "limit|Approval Limit|money|500;980000", "reason|Reason|enum|Annual leave;Business travel;Medical leave;Training;Vacancy cover", "validTo|Valid Until|date|-30;120", "date|Valid From|date|-200;30"],
    statuses: ["Active", "Scheduled", "Expired", "Revoked", "Draft"],
    measure: "limit",
  },

  "network-restrictions": {
    name: "Network Restrictions", kind: "settings", summary: "Where access is allowed from",
    entity: "Network Rule", ref: "NWR",
    fields: [ROLE, "restriction|Restriction|enum|Office network only;VPN required;Country allow-list;Device must be managed;Time-window restricted;No restriction", "network|Network|enum|Office LAN;Factory Wi-Fi;VPN;Mobile data;External", "usersAffected|Users Affected|int|1;220", "blocked|Blocked Attempts (30d)|int|0;480", "owner|Rule Owner|person", "date|Effective From|date|-500;30"],
    statuses: ["Enforced", "Monitoring Only", "Draft", "Suspended"],
    measure: "blocked",
    settings: ["Require VPN for any administrative privilege outside the office network", "Block sign-in from countries with no business presence"],
  },

  "device-trust": {
    name: "Device Trust", kind: "list", summary: "Which devices we recognise",
    entity: "Device", ref: "DVC",
    fields: [USER, "device|Device|enum|Windows laptop;MacBook;Android phone;iPhone;Shop-floor terminal;Shared kiosk;Tablet", "managed|Managed Device|bool|Yes;No", "osVersion|OS Version|enum|Windows 11 24H2;macOS 15;Android 15;iOS 18;Windows 10 22H2", "compliance|Compliance Score|pct|20;100", "lastSeenDays|Last Seen|int|0;220;days ago", "date|Enrolled On|date|-900;0"],
    statuses: ["Trusted", "Compliant", "Non-Compliant", "Quarantined", "Retired"],
    measure: "compliance", rows: 48,
  },

  "failed-logins": {
    name: "Failed Sign-in Analysis", kind: "analytics", summary: "Where the noise is coming from",
    entity: "Failure Pattern", ref: "FLA",
    fields: [USER, "pattern|Pattern|enum|Repeated wrong credential;MFA rejected;Locked account retry;Unknown user;Disabled account;Automated scan", "attempts|Attempts|int|1;480", "distinctIps|Distinct Sources|int|1;48", "network|Network|enum|Office LAN;VPN;Mobile data;External;Unknown", "riskScore|Risk Score|int|1;100", "date|Window End|date|-90;0"],
    statuses: ["Benign", "Watch", "Suspicious", "Confirmed Attack", "Blocked"],
    measure: "attempts",
  },

  "entitlement-catalog": {
    name: "Entitlement Catalogue", kind: "list", summary: "Everything that can be granted",
    entity: "Entitlement", ref: "ENT",
    fields: [APP_MODULE, "entitlement|Entitlement|enum|Approve purchase order;Release payment;Post journal entry;Adjust stock;Release despatch;Run payroll;Change master data;Export report;Configure module", "riskLevel|Risk Level|enum|Low;Medium;High;Critical", "holders|Holders|int|0;120", "requiresApproval|Approval Required|bool|Yes;No", "owner|Entitlement Owner|person", "date|Catalogued On|date|-1400;0"],
    statuses: ["Available", "Restricted", "Under Review", "Retired"],
    measure: "holders", rows: 48,
  },

  "access-policies": {
    name: "Access Policies", kind: "settings", summary: "The rules the platform enforces",
    entity: "Access Policy", ref: "APL",
    fields: ["policy|Policy|enum|Least privilege by default;Quarterly recertification;Automatic dormant lock;Mandatory MFA for admins;Break-glass logging;Leaver same-day revocation", "enforcement|Enforcement|enum|Blocking;Warning;Monitoring;Advisory", "coverage|Coverage|pct|38;100", "exceptions|Exceptions|int|0;24", REVIEWER, "date|Effective From|date|-600;30"],
    statuses: ["Enforced", "Partially Enforced", "Draft", "Suspended"],
    measure: "coverage",
    settings: ["Lock any account dormant for more than 60 days", "Revoke all access on the leaver's last working day", "Recertify every high-risk entitlement each quarter"],
  },
};
