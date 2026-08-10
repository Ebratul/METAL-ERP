import type { ModuleSpecs } from "../types";

/** Module 51 — Maintenance Management. */

const MACHINE = "machine|Equipment|enum|Power Press 60T;Power Press 110T;Hydraulic Press 150T;Vibratory Polisher;Barrel Plating Line;Rack Plating Line;Air Compressor 75HP;Diesel Generator 500kVA;Chiller Unit;Forklift 2T";
const TECH = "technician|Technician|person";
const AREA = "area|Area|enum|Press Shop;Polishing;Plating;Assembly;Utilities;Packing;Warehouse";
const PRIORITY = "priority|Priority|enum|Emergency;High;Normal;Low";
const SPARE = "spare|Spare Part|enum|Hydraulic seal kit;Drive belt;Bearing 6205;Contactor 32A;Pressure gauge;Filter cartridge;Limit switch;Gear oil 20L";

export const MAINTENANCE: ModuleSpecs = {
  "maintenance-dashboard": {
    name: "Maintenance Dashboard", kind: "overview", summary: "Live equipment health",
    entity: "Equipment Status", ref: "MDB",
    fields: [MACHINE, AREA, "availability|Availability|pct|58;99.5", "openJobs|Open Jobs|int|0;12", "mtbfHrs|MTBF|float|20;900;hrs;0", "mttrHrs|MTTR|float|0.4;24;hrs;1", TECH, "date|As On|date|-14;0"],
    statuses: ["Healthy", "Watch", "Degraded", "Down"],
    measure: "availability", rows: 46,
    insight: "Three presses account for 71% of unplanned downtime — moving them to condition-based servicing is the highest-value change.",
  },

  preventive: {
    name: "Preventive Maintenance", kind: "calendar", summary: "The PM schedule ahead",
    entity: "PM Task", ref: "PM",
    fields: [MACHINE, AREA, "taskType|Task|enum|Lubrication;Belt inspection;Filter change;Alignment check;Electrical inspection;Overhaul;Calibration", "frequency|Frequency|enum|Daily;Weekly;Monthly;Quarterly;Half-yearly;Annual", "durationHrs|Duration|float|0.5;16;hrs;1", TECH, "date|Due Date|date|-30;90"],
    statuses: ["Scheduled", "In Progress", "Completed", "Overdue", "Skipped"],
    measure: "durationHrs",
  },

  breakdown: {
    name: "Breakdown Records", kind: "list", summary: "Unplanned stops and their cost",
    entity: "Breakdown", ref: "BRK",
    fields: [MACHINE, AREA, "failure|Failure|enum|Hydraulic leak;Motor burnout;Bearing seizure;Electrical trip;Sensor failure;Belt snap;Control fault", "downHrs|Downtime|float|0.4;48;hrs;1", "productionLoss|Production Loss|money|100;62000", "repairCost|Repair Cost|money|20;28000", "date|Occurred On|date|-240;0"],
    statuses: ["Reported", "Under Repair", "Repaired", "Monitoring", "Closed"],
    measure: "downHrs",
  },

  "work-requests": {
    name: "Maintenance Requests", kind: "list", summary: "Raised by production and support",
    entity: "Request", ref: "MRQ",
    fields: [MACHINE, AREA, "issue|Reported Issue|enum|Abnormal noise;Oil leak;Overheating;Vibration;Poor output quality;Safety guard fault;Not starting", PRIORITY, "requester|Raised By|person", "ageHrs|Open For|int|1;220;hrs", "date|Raised On|date|-90;0"],
    statuses: ["New", "Acknowledged", "Job Card Raised", "Completed", "Rejected"],
    measure: "ageHrs",
  },

  "job-cards": {
    name: "Maintenance Job Cards", kind: "board", summary: "Work in progress on the floor",
    entity: "Job Card", ref: "JOB",
    fields: [MACHINE, "jobType|Job Type|enum|Preventive;Breakdown;Predictive;Improvement;Safety;Installation", TECH, "estimatedHrs|Estimated|float|0.5;24;hrs;1", "actualHrs|Actual|float|0;30;hrs;1", "cost|Job Cost|money|10;42000", PRIORITY],
    statuses: ["Raised", "Assigned", "In Progress", "Awaiting Spare", "Completed", "Verified"],
    measure: "cost",
  },

  "spare-parts": {
    name: "Spare Parts Inventory", kind: "list", summary: "Critical spares on the shelf",
    entity: "Spare", ref: "SPR",
    fields: [SPARE, MACHINE, "stock|Stock|int|0;280;pcs", "reorder|Reorder Level|int|2;80;pcs", "unitCost|Unit Cost|float|1;900;USD;2", "value|Stock Value|money|10;62000", "leadDays|Lead Time|int|3;120;days", "date|Last Issued|date|-200;0"],
    statuses: ["In Stock", "Low Stock", "Out of Stock", "On Order", "Obsolete"],
    measure: "value",
  },

  "mtbf-mttr": {
    name: "MTBF / MTTR", kind: "analytics", summary: "Reliability and repair speed",
    entity: "Reliability Record", ref: "REL",
    fields: [MACHINE, AREA, "failures|Failures|int|0;18", "runHrs|Run Hours|float|100;720;hrs;0", "mtbf|MTBF|float|20;900;hrs;1", "mttr|MTTR|float|0.4;24;hrs;1", "availability|Availability|pct|58;99.5", "date|Period End|date|-300;0"],
    statuses: ["World Class", "Acceptable", "Poor", "Critical"],
    measure: "mtbf",
  },

  "maintenance-cost": {
    name: "Maintenance Cost", kind: "analytics", summary: "Cost per machine and per hour",
    entity: "Cost Record", ref: "MCT",
    fields: [MACHINE, "labourCost|Labour|money|20;28000", "spareCost|Spares|money|10;42000", "contractCost|Contract|money|0;38000", "totalCost|Total|money|40;92000", "costPerRunHr|Cost per Run Hour|float|0.2;62;USD;2", "date|Period End|date|-300;0"],
    statuses: ["Within Budget", "Above Budget", "Under Review", "Approved"],
    measure: "totalCost",
  },

  checklists: {
    name: "Maintenance Checklists", kind: "list", summary: "Standard task lists per machine",
    entity: "Checklist", ref: "CHK",
    fields: [MACHINE, "checklistType|Checklist|enum|Daily start-up;Weekly inspection;Monthly service;Shutdown;Safety check;Post-repair verification", "points|Check Points|int|4;40", "compliance|Completion|pct|40;100", TECH, "date|Last Performed|date|-90;0"],
    statuses: ["Active", "Due", "Overdue", "Under Revision"],
    measure: "points",
  },

  amc: {
    name: "AMC Contracts", kind: "list", summary: "Vendor service agreements",
    entity: "AMC Contract", ref: "AMC",
    fields: [MACHINE, "vendor|Service Vendor|enum|@suppliers", "contractType|Contract|enum|Comprehensive;Non-comprehensive;On-call;Warranty extension", "value|Contract Value|money|500;180000", "visitsPerYear|Visits per Year|int|2;24", "responseHrs|Response SLA|int|2;72;hrs", "date|Contract Until|date|-90;500"],
    statuses: ["Active", "Expiring", "Expired", "Under Renewal", "Terminated"],
    measure: "value",
  },

  lubrication: {
    name: "Lubrication Schedule", kind: "calendar", summary: "Greasing and oil change plan",
    entity: "Lubrication Task", ref: "LUB",
    fields: [MACHINE, "lubricant|Lubricant|enum|Gear oil 320;Hydraulic oil 68;Lithium grease;Chain oil;Compressor oil", "quantity|Quantity|float|0.2;40;L;1", "frequency|Frequency|enum|Weekly;Fortnightly;Monthly;Quarterly", TECH, "date|Due Date|date|-30;90"],
    statuses: ["Scheduled", "Completed", "Overdue", "Skipped"],
    measure: "quantity",
  },

  "technician-roster": {
    name: "Technician Roster", kind: "list", summary: "Skills, shifts and workload",
    entity: "Technician", ref: "TCH",
    fields: [TECH, "skill|Primary Skill|enum|Mechanical;Electrical;Hydraulic;Electronics;Welding;Instrumentation", "shift|Shift|enum|A (06–14);B (14–22);C (22–06);General", "openJobs|Open Jobs|int|0;12", "hoursBooked|Hours Booked|float|0;180;hrs;1", "efficiency|Efficiency|pct|45;120", "date|Roster Date|date|-30;20"],
    statuses: ["On Duty", "Off Duty", "On Leave", "On Training"],
    measure: "hoursBooked",
  },

  "root-cause": {
    name: "Root Cause Analysis", kind: "list", summary: "Why the failure happened",
    entity: "RCA", ref: "RCA",
    fields: [MACHINE, "failure|Failure|enum|Hydraulic leak;Motor burnout;Bearing seizure;Electrical trip;Sensor failure;Belt snap", "rootCause|Root Cause|enum|Lubrication missed;Overload;Ageing component;Poor installation;Power fluctuation;Operator error;Design limitation", "action|Corrective Action|enum|Change PM frequency;Replace component;Upgrade specification;Retrain operator;Install protection", "recurrence|Recurrences|int|0;6", TECH, "date|Analysed On|date|-240;0"],
    statuses: ["Open", "Analysis Done", "Action Implemented", "Verified", "Recurring"],
    measure: "recurrence",
  },

  "predictive-alerts": {
    name: "Predictive Alerts", kind: "list", summary: "Condition-based warnings",
    entity: "Predictive Alert", ref: "PDA",
    fields: [MACHINE, "signal|Signal|enum|Vibration rise;Temperature rise;Current draw;Oil particle count;Noise level;Cycle time drift", "value|Reading|float|0.2;180;;2", "threshold|Threshold|float|0.5;160;;2", "riskScore|Failure Risk|pct|10;98", "leadDays|Predicted Lead|int|1;60;days", "date|Raised On|date|-60;0"],
    statuses: ["New", "Acknowledged", "Job Raised", "Resolved", "False Positive"],
    measure: "riskScore",
  },

  "spare-consumption": {
    name: "Spare Consumption", kind: "analytics", summary: "Which parts drain the budget",
    entity: "Consumption Record", ref: "SCN",
    fields: [SPARE, MACHINE, "issued|Issued Qty|int|1;180;pcs", "value|Value|money|10;42000", "jobs|Jobs Consumed In|int|1;40", "avgPerJob|Average per Job|float|0.2;12;pcs;1", "date|Period End|date|-300;0"],
    statuses: ["Within Norm", "Above Norm", "Under Review", "Optimised"],
    measure: "value",
  },

  "maintenance-kpi": {
    name: "Maintenance KPIs", kind: "analytics", summary: "Programme health at a glance",
    entity: "KPI Reading", ref: "MKP",
    fields: ["kpi|KPI|enum|PM compliance;Schedule adherence;Breakdown share;Wrench time;Backlog weeks;First-time fix rate", AREA, "value|Value|pct|30;100", "target|Target|pct|60;98", "trend|Trend|enum|Improving;Stable;Deteriorating", "date|Period End|date|-300;0"],
    statuses: ["Above Target", "On Target", "Below Target", "Critical"],
    measure: "value",
  },

  "safety-permits": {
    name: "Work Permits", kind: "list", summary: "Safety clearance before hot or height work",
    entity: "Work Permit", ref: "PRM",
    fields: [MACHINE, "permitType|Permit Type|enum|Hot work;Height work;Confined space;Electrical isolation;Chemical handling;Lifting", "issuer|Issued By|person", "holder|Permit Holder|person", "validHrs|Valid For|int|2;24;hrs", "date|Issued On|date|-90;5"],
    statuses: ["Requested", "Issued", "Active", "Closed", "Revoked"],
    measure: "validHrs",
  },

  "maintenance-request": {
    name: "Raise Maintenance Request", kind: "form", summary: "Report a fault from the floor",
    entity: "Request", ref: "RMR",
    fields: [MACHINE, AREA, "issue|Issue|enum|Abnormal noise;Oil leak;Overheating;Vibration;Poor output quality;Safety guard fault;Not starting", PRIORITY, "impact|Production Impact|enum|Line stopped;Reduced output;Quality risk;No impact", "requester|Raised By|person", "date|Reported On|date|-6;0", "downtimeHrs|Downtime So Far|float|0;48;hrs;1"],
    statuses: ["Draft", "Submitted", "Acknowledged", "Job Raised", "Rejected"],
  },

  "equipment-history": {
    name: "Equipment History", kind: "list", summary: "Everything ever done to a machine",
    entity: "History Entry", ref: "EHS",
    fields: [MACHINE, "event|Event|enum|Installation;Preventive service;Breakdown repair;Overhaul;Part replacement;Relocation;Calibration", "downHrs|Downtime|float|0;72;hrs;1", "cost|Cost|money|0;92000", TECH, "date|Event Date|date|-900;0"],
    statuses: ["Logged", "Verified", "Under Query"],
    measure: "cost",
  },

  "maintenance-settings": {
    name: "Maintenance Controls", kind: "settings", summary: "Scheduling and escalation rules",
    entity: "Control Rule", ref: "MSET",
    fields: ["rule|Rule|enum|Auto-raise job card from request;Escalate overdue PM;Block operation without safety permit;Reserve spares on job card;Alert on low spare stock", "threshold|Threshold|pct|50;100", "owner|Rule Owner|person", "date|Effective From|date|-400;0", "machinesCovered|Machines Covered|int|1;40"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Escalate a preventive task to the manager when it is three days overdue", "Reserve spare parts automatically when a job card is raised"],
  },
};
