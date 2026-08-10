import type { ModuleSpecs } from "../types";

/** Module 72 — Capacity Planning & Scheduling. */

const WC = "workCenter|Work Center|enum|Press-01;Press-02;Press-03;Polish-01;Polish-02;Plating-A;Plating-B;Assembly-1;Assembly-2;Packing-1";
const PLANNER = "planner|Planner|person";
const SHIFT = "shift|Shift|enum|A (06–14);B (14–22);C (22–06)";
const ORDER = "order|Work Order|enum|WO-26-1042;WO-26-1051;WO-26-1063;WO-26-1078;WO-26-1090;WO-26-1104;WO-26-1136;WO-26-1180";
const ITEM = "item|Item|enum|@items";
const WEEK = "week|Week|enum|W-14;W-15;W-16;W-17;W-18;W-19;W-20;W-21";

export const CAPACITY_SCHEDULING: ModuleSpecs = {
  "capacity-overview": {
    name: "Capacity Overview", kind: "overview", summary: "Load against what is available",
    entity: "Capacity Line", ref: "CAP",
    fields: [WC, WEEK, "available|Available Hours|float|40;720;hrs;0", "loaded|Loaded Hours|float|10;820;hrs;0", "utilisation|Utilisation|pct|18;136", "backlogHrs|Backlog|float|0;480;hrs;0", PLANNER, "date|Period Start|date|-60;90"],
    statuses: ["Balanced", "Tight", "Overloaded", "Under-loaded", "Blocked"],
    measure: "loaded", rows: 50,
    insight: "Plating-B is loaded to 128% for weeks 17 and 18 while Plating-A sits at 64% — moving three barrel jobs across removes the overload without overtime.",
  },

  "resource-calendar": {
    name: "Resource Calendar", kind: "calendar", summary: "Machine and manpower availability",
    entity: "Calendar Entry", ref: "RCL",
    fields: [WC, "resourceType|Resource|enum|Machine;Operator group;Tooling;Plating bath;Inspection bench", "entryType|Entry|enum|Working shift;Planned maintenance;Holiday;Shutdown;Training;Trial run", SHIFT, "hours|Hours|float|0;24;hrs;1", "capacityPct|Capacity Available|pct|0;100", "date|Calendar Date|date|-30;90"],
    statuses: ["Available", "Reserved", "Blocked", "Holiday", "Tentative"],
    measure: "hours", rows: 56,
  },

  "finite-scheduling": {
    name: "Finite Scheduling", kind: "board", summary: "Constraint-based sequencing",
    entity: "Scheduled Job", ref: "FSC",
    fields: [ORDER, ITEM, WC, "quantity|Quantity|int|5000;480000;pcs", "runHrs|Run Hours|float|0.5;96;hrs;1", "setupMin|Setup|int|10;240;min", "sequence|Sequence|int|1;48", "dueDate|Due Date|date|-15;90", "date|Planned Start|date|-20;60"],
    statuses: ["Queued", "Scheduled", "Released", "In Progress", "Completed", "Blocked"],
    measure: "runHrs", rows: 52,
  },

  "machine-loading": {
    name: "Machine Loading", kind: "analytics", summary: "Hours booked per machine",
    entity: "Load Record", ref: "MLD",
    fields: [WC, "machine|Machine|enum|Power Press 60T;Power Press 110T;Hydraulic Press 150T;Vibratory Polisher;Barrel Plating Line;Rack Plating Line;Auto Assembly Cell", WEEK, "capacityHrs|Capacity|float|40;720;hrs;0", "bookedHrs|Booked|float|4;820;hrs;0", "load|Load|pct|8;138", "jobs|Jobs Loaded|int|1;42", "date|Period Start|date|-60;90"],
    statuses: ["Within Capacity", "Near Capacity", "Overloaded", "Idle"],
    measure: "bookedHrs", rows: 50,
  },

  "manpower-planning": {
    name: "Manpower Planning", kind: "analytics", summary: "Heads needed per shift",
    entity: "Manpower Plan", ref: "MPP",
    fields: [WC, SHIFT, WEEK, "required|Required Heads|int|2;80", "available|Available Heads|int|1;82", "gap|Gap|int|0;28", "coverage|Coverage|pct|32;128", "skillLevel|Skill Required|enum|Trainee;Skilled;Highly skilled;Certified operator", "date|Period Start|date|-40;90"],
    statuses: ["Adequate", "Tight", "Short", "Surplus"],
    measure: "required", rows: 48,
  },

  "changeover-plan": {
    name: "Changeover Plan", kind: "list", summary: "Setup-optimised job order",
    entity: "Changeover", ref: "CHG",
    fields: [WC, "fromItem|From Item|enum|@items", "toItem|To Item|enum|@items", "setupMin|Setup Minutes|int|15;280;min", "savedMin|Saved by Sequencing|int|0;180;min", "die|Die / Tool|enum|DIE-1102;DIE-1148;DIE-1176;DIE-1209;DIE-1233", "operator|Setter|person", "date|Planned On|date|-20;60"],
    statuses: ["Planned", "In Progress", "Completed", "Delayed", "Cancelled"],
    measure: "setupMin",
  },

  "overload-alerts": {
    name: "Overload Alerts", kind: "list", summary: "Where the plan breaks",
    entity: "Overload Alert", ref: "OVL",
    fields: [WC, WEEK, "overloadHrs|Overload|float|0.5;280;hrs;1", "load|Load|pct|100;186", "affectedOrders|Orders Affected|int|1;24", "option|Suggested Action|enum|Overtime;Shift to alternate machine;Subcontract;Re-sequence;Move due date;Add a shift", PLANNER, "date|Detected On|date|-40;0"],
    statuses: ["New", "Acknowledged", "Action Planned", "Resolved", "Accepted"],
    measure: "overloadHrs",
  },

  "schedule-simulation": {
    name: "Schedule Simulation", kind: "analytics", summary: "What-if before committing",
    entity: "Simulation", ref: "SIM",
    fields: ["scenario|Scenario|enum|Add third shift on plating;Subcontract 20% polishing;Delay two low-margin orders;Buy one more press;Reduce setup by 30%;Split the largest lot", "assumption|Key Assumption|enum|No new hires;Same machine list;Overtime allowed;Buyer accepts split delivery;Tooling available", "onTime|On-Time Delivery|pct|48;100", "utilisation|Average Utilisation|pct|38;98", "makespanDays|Makespan|int|4;120;days", "extraCost|Additional Cost|money|0;480000", PLANNER, "date|Simulated On|date|-160;0"],
    statuses: ["Draft", "Evaluated", "Recommended", "Adopted", "Rejected"],
    measure: "extraCost",
  },

  utilization: {
    name: "Capacity Utilisation", kind: "analytics", summary: "Used against idle",
    entity: "Utilisation Record", ref: "UTL",
    fields: [WC, SHIFT, "availableHrs|Available|float|40;720;hrs;0", "productiveHrs|Productive|float|4;700;hrs;0", "setupHrs|Setup|float|0;120;hrs;1", "idleHrs|Idle|float|0;280;hrs;1", "utilisation|Utilisation|pct|12;99", "date|Period End|date|-330;0"],
    statuses: ["World Class", "On Target", "Below Target", "Poor"],
    measure: "productiveHrs", rows: 48,
  },

  "long-range-plan": {
    name: "Long-Range Plan", kind: "calendar", summary: "Twelve-month capacity outlook",
    entity: "Plan Period", ref: "LRP",
    fields: ["month|Month|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026;Jun 2026;Jul 2026;Aug 2026;Sep 2026;Oct 2026;Nov 2026;Dec 2026", "demandPcs|Forecast Demand|int|400000;24000000;pcs", "capacityPcs|Capacity|int|400000;22000000;pcs", "gap|Gap|int|0;4800000;pcs", "coverage|Demand Coverage|pct|42;128", "action|Planned Action|enum|None;Overtime;Subcontract;New line;Hire operators;Shift demand", PLANNER, "date|Period Start|date|-60;340"],
    statuses: ["Sufficient", "Tight", "Shortfall", "Surplus", "Under Review"],
    measure: "demandPcs",
  },

  "work-center-master": {
    name: "Work Center Master", kind: "list", summary: "The resources we schedule against",
    entity: "Work Center", ref: "WCM",
    fields: [WC, "wcType|Type|enum|Press;Polishing;Plating;Assembly;Packing;Inspection;Tool room", "machines|Machines|int|1;12", "manning|Standard Manning|int|1;18", "hourlyRate|Hourly Rate|money|2;48", "stdCapacity|Standard Capacity|float|20;720;hrs/week;0", "efficiency|Standard Efficiency|pct|55;98", "date|Effective From|date|-1400;0"],
    statuses: ["Active", "Under Maintenance", "Being Commissioned", "Retired"],
    measure: "stdCapacity",
  },

  "shift-capacity": {
    name: "Shift Capacity", kind: "list", summary: "Capacity available per shift pattern",
    entity: "Shift Capacity", ref: "SHC",
    fields: [WC, SHIFT, "workingDays|Working Days|int|4;7;days", "hoursPerShift|Hours / Shift|float|6;12;hrs;1", "weeklyHrs|Weekly Hours|float|24;168;hrs;1", "manning|Manning|int|1;24", "efficiency|Efficiency|pct|48;98", "date|Effective From|date|-600;60"],
    statuses: ["Active", "Planned", "Suspended", "Seasonal"],
    measure: "weeklyHrs",
  },

  bottleneck: {
    name: "Bottleneck Analysis", kind: "analytics", summary: "What limits the whole plant",
    entity: "Bottleneck", ref: "BTL",
    fields: [WC, "constraint|Constraint|enum|Machine hours;Tooling availability;Skilled manpower;Plating bath time;Inspection capacity;Material availability", "load|Load|pct|82;186", "throughputPcs|Throughput|int|10000;4800000;pcs", "lostOutput|Output Lost|int|0;980000;pcs", "impactValue|Value Impact|money|0;980000", "recommendation|Recommendation|enum|Add capacity;Offload;Reduce setup;Improve uptime;Re-sequence;Accept", "date|Analysed On|date|-200;0"],
    statuses: ["Primary Bottleneck", "Secondary", "Intermittent", "Resolved"],
    measure: "impactValue",
  },

  "sequencing-rules": {
    name: "Sequencing Rules", kind: "settings", summary: "How the scheduler orders work",
    entity: "Sequencing Rule", ref: "SEQ",
    fields: [WC, "rule|Rule|enum|Earliest due date;Shortest processing time;Critical ratio;Minimum setup;Buyer priority;First in first out", "weight|Weight|pct|0;100", "appliesTo|Applies To|enum|All jobs;Urgent only;Export orders;Sample orders;Rework jobs", "overrideAllowed|Manual Override|bool|Yes;No", PLANNER, "date|Effective From|date|-500;30"],
    statuses: ["Active", "Draft", "Suspended", "Superseded"],
    measure: "weight",
    settings: ["Group jobs sharing a die to cut changeover time", "Never schedule beyond 100% of a work centre without planner confirmation"],
  },

  "subcontract-capacity": {
    name: "Subcontract Capacity", kind: "list", summary: "Capacity we can buy in",
    entity: "Subcontract Slot", ref: "SUB",
    fields: ["vendor|Subcontractor|enum|@suppliers", "process|Process|enum|Polishing;Barrel plating;Rack plating;Deburring;Assembly;Packing;Heat treatment", "capacityPcs|Offered Capacity|int|20000;2400000;pcs", "bookedPcs|Booked|int|0;2400000;pcs", "rate|Rate / 1000 pcs|money|2;180", "leadDays|Lead Time|int|3;45;days", "quality|Quality Rating|pct|58;100", "date|Available From|date|-30;90"],
    statuses: ["Available", "Partially Booked", "Fully Booked", "On Hold", "Blacklisted"],
    measure: "capacityPcs",
  },

  "reschedule-requests": {
    name: "Reschedule Requests", kind: "board", summary: "Changes asked of the plan",
    entity: "Reschedule Request", ref: "RSQ",
    fields: [ORDER, "reason|Reason|enum|Buyer date change;Material shortage;Machine breakdown;Quality hold;Priority order;Tooling not ready;Manpower shortage", "requestedBy|Requested By|person", "shiftDays|Shift By|int|-20;45;days", "impactOrders|Orders Impacted|int|1;18", "valueImpact|Value Impact|money|0;980000", "date|Raised On|date|-120;0"],
    statuses: ["Submitted", "Under Assessment", "Approved", "Rejected", "Implemented"],
    measure: "valueImpact",
  },

  "capacity-booking": {
    name: "Capacity Booking", kind: "form", summary: "Reserve a slot on a resource",
    entity: "Booking", ref: "BKG",
    fields: [WC, ORDER, ITEM, "quantity|Quantity|int|2000;480000;pcs", "hoursRequired|Hours Required|float|0.5;120;hrs;1", SHIFT, "bookedBy|Booked By|person", "date|Slot Date|date|-15;75"],
    statuses: ["Requested", "Provisional", "Confirmed", "Released", "Cancelled"],
    measure: "hoursRequired", rows: 48,
  },

  "downtime-allowance": {
    name: "Downtime Allowance", kind: "settings", summary: "Capacity we deliberately hold back",
    entity: "Allowance", ref: "DWA",
    fields: [WC, "allowanceType|Allowance|enum|Planned maintenance;Setup and changeover;Quality sampling;Operator breaks;Trial runs;Contingency buffer", "allowancePct|Allowance|pct|1;28", "hoursPerWeek|Hours / Week|float|0.5;48;hrs;1", "actualUsed|Actually Used|pct|0;140", PLANNER, "date|Effective From|date|-500;30"],
    statuses: ["Active", "Under Review", "Draft", "Superseded"],
    measure: "hoursPerWeek",
    settings: ["Reserve 8% of every work centre as contingency buffer", "Exclude planned maintenance hours from the utilisation calculation"],
  },

  "plan-vs-actual": {
    name: "Plan vs Actual", kind: "analytics", summary: "Did the schedule hold",
    entity: "Adherence Record", ref: "PVA",
    fields: [WC, ORDER, WEEK, "plannedHrs|Planned Hours|float|1;480;hrs;1", "actualHrs|Actual Hours|float|1;620;hrs;1", "adherence|Schedule Adherence|pct|28;128", "plannedQty|Planned Qty|int|5000;980000;pcs", "actualQty|Actual Qty|int|1000;980000;pcs", "date|Period End|date|-300;0"],
    statuses: ["On Plan", "Ahead", "Behind", "Significantly Behind"],
    measure: "actualHrs", rows: 50,
  },

  "scheduling-settings": {
    name: "Scheduling Configuration", kind: "settings", summary: "Horizon, buffers and freeze rules",
    entity: "Scheduling Rule", ref: "SST",
    fields: ["rule|Rule|enum|Planning horizon;Frozen period;Capacity buffer;Scheduling direction;Overtime ceiling;Minimum lot size", "value|Configured Value|enum|12 weeks;7 days;8%;Backward from due date;24 hours per week;5,000 pcs", PLANNER, "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Freeze the schedule seven days ahead of execution", "Schedule backward from the due date and forward only when late", "Warn when a work centre crosses 95% planned load"],
  },
};
