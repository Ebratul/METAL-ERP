import type { ModuleSpecs } from "../types";

/** Module 71 — Knowledge Base & SOP Management. */

const DEPT = "department|Department|enum|Production;Plating;Quality;Warehouse;Maintenance;Procurement;Finance;HR;Safety;IT;Logistics";
const AUTHOR = "author|Author|person";
const APPROVER = "approver|Approver|person";
const CATEGORY = "category|Category|enum|Process;Safety;Quality;Machine operation;Compliance;System how-to;Policy;Emergency";
const AUDIENCE = "audience|Audience|enum|All employees;Operators;Supervisors;Engineers;Managers;New joiners;Contractors";

export const KNOWLEDGE_SOP: ModuleSpecs = {
  "knowledge-base": {
    name: "Knowledge Base", kind: "list", summary: "Articles and how-to guidance",
    entity: "Article", ref: "KBA",
    fields: ["article|Article|enum|How to raise a purchase requisition;Reading a plating bath report;Interpreting the OEE dashboard;Booking a gate pass;Claiming travel expenses;Escalating a quality hold;Setting up a new item code", CATEGORY, DEPT, "views|Views (90d)|int|0;2400", "helpful|Rated Helpful|pct|24;100", "readMin|Read Time|int|1;28;min", AUTHOR, "date|Published On|date|-900;0"],
    statuses: ["Published", "Draft", "Needs Review", "Archived"],
    measure: "views", rows: 52,
    insight: "Eleven SOPs have passed their two-year review date and three of those cover plating chemistry — the highest-risk process on the floor.",
  },

  "sop-library": {
    name: "SOP Library", kind: "list", summary: "Controlled standard operating procedures",
    entity: "SOP", ref: "SOP",
    fields: ["sop|SOP|enum|Barrel plating operation;Rack plating operation;Press setup and changeover;Incoming material inspection;Final QC sampling;Chemical handling and storage;ETP operation;Machine lockout-tagout;Finished goods packing", DEPT, "documentNo|Document No.|enum|SOP-PRD-001;SOP-PLT-004;SOP-QUA-011;SOP-WHS-006;SOP-MNT-009;SOP-SAF-002", "version|Version|enum|Rev 1;Rev 2;Rev 3;Rev 4;Rev 5", "pages|Pages|int|2;48", "reviewDue|Review Due|date|-120;700", APPROVER, "date|Effective From|date|-1400;0"],
    statuses: ["Released", "In Review", "Draft", "Review Overdue", "Superseded"],
    measure: "pages", rows: 48,
  },

  "work-instructions": {
    name: "Work Instructions", kind: "list", summary: "Step-by-step guides at the station",
    entity: "Work Instruction", ref: "WIN",
    fields: ["instruction|Work Instruction|enum|Loading the barrel;Setting press stroke depth;Deburring a brass snap;Colour matching against the standard;Carton labelling;Metal detector check;Sample retention", "workCenter|Work Center|enum|Press-01;Press-02;Polish-01;Plating-A;Plating-B;Assembly-1;Packing-1", "steps|Steps|int|3;28", "hasImages|Illustrated|bool|Yes;No", "stationViews|Station Views (30d)|int|0;2400", "version|Version|enum|Rev A;Rev B;Rev C;Rev D", AUTHOR, "date|Effective From|date|-700;30"],
    statuses: ["Released", "Draft", "In Review", "Superseded", "Withdrawn"],
    measure: "stationViews",
  },

  authoring: {
    name: "Authoring", kind: "form", summary: "Write and structure new content",
    entity: "Draft", ref: "DFT",
    fields: ["title|Title|enum|Plating bath top-up procedure;New item code request guide;Handling a buyer audit;Forklift daily check;Monthly stock take steps;Overtime approval flow", "contentType|Content Type|enum|Article;SOP;Work instruction;Policy;FAQ;Checklist;Troubleshooting guide", CATEGORY, DEPT, "words|Word Count|int|120;6800", "attachments|Attachments|int|0;12", AUTHOR, "date|Started On|date|-200;0"],
    statuses: ["Draft", "Ready for Review", "In Review", "Approved", "Abandoned"],
    measure: "words",
  },

  "review-approval": {
    name: "Review & Approval", kind: "board", summary: "Release control before publication",
    entity: "Review", ref: "RVW",
    fields: ["document|Document|enum|SOP-PLT-004 Rev 3;SOP-QUA-011 Rev 2;WI Press setup Rev C;Chemical handling policy;New joiner induction guide;ETP operation SOP", DEPT, "reviewer|Reviewer|person", APPROVER, "comments|Comments Raised|int|0;24", "ageDays|In Review For|int|0;90;days", "date|Submitted On|date|-200;0"],
    statuses: ["Submitted", "Technical Review", "Quality Review", "Approved", "Returned"],
    measure: "comments",
  },

  "version-history": {
    name: "Version History", kind: "list", summary: "Every revision on record",
    entity: "Revision", ref: "VER",
    fields: ["document|Document|enum|SOP-PRD-001;SOP-PLT-004;SOP-QUA-011;SOP-WHS-006;SOP-MNT-009;SOP-SAF-002", "version|Version|enum|Rev 1;Rev 2;Rev 3;Rev 4;Rev 5", "changeType|Change Type|enum|Editorial;Process change;Regulatory update;Buyer requirement;Corrective action;Periodic review", "changeSummary|Change|enum|Added metal detection step;Updated bath temperature range;Clarified sampling plan;New PPE requirement;Removed obsolete step", "sectionsChanged|Sections Changed|int|1;18", AUTHOR, APPROVER, "date|Effective From|date|-1800;0"],
    statuses: ["Current", "Superseded", "Withdrawn", "Draft"],
    measure: "sectionsChanged",
  },

  acknowledgement: {
    name: "Read Acknowledgement", kind: "analytics", summary: "Who has accepted what",
    entity: "Acknowledgement", ref: "ACK",
    fields: ["document|Document|enum|SOP-PLT-004 Rev 3;Chemical handling policy;Fire evacuation plan;Code of conduct;Overtime policy;Machine lockout-tagout", DEPT, AUDIENCE, "assigned|Assigned|int|4;480", "acknowledged|Acknowledged|int|0;480", "completion|Completion|pct|0;100", "due|Due By|date|-60;120", "date|Assigned On|date|-300;0"],
    statuses: ["Complete", "In Progress", "Overdue", "Not Started"],
    measure: "assigned", rows: 48,
  },

  "training-links": {
    name: "Training Links", kind: "list", summary: "SOP mapped to training modules",
    entity: "Training Link", ref: "TLK",
    fields: ["document|Document|enum|SOP-PLT-004;SOP-QUA-011;SOP-SAF-002;WI Press setup;Chemical handling policy", "course|Training Course|enum|Plating process basics;QC sampling method;Fire and safety induction;Press operation certification;Chemical safety awareness;Forklift operation", AUDIENCE, "trained|Trained|int|0;320", "pending|Pending|int|0;180", "passRate|Pass Rate|pct|38;100", "trainer|Trainer|person", "date|Last Session|date|-400;60"],
    statuses: ["Active", "Scheduled", "Overdue", "Retired"],
    measure: "trained",
  },

  "knowledge-search": {
    name: "Knowledge Search", kind: "form", summary: "Full-text lookup across everything",
    entity: "Search Query", ref: "SRC",
    fields: ["query|Query|enum|plating bath temperature;gate pass;overtime claim;nickel release;stock adjustment;lockout tagout;carton label spec", "scope|Scope|enum|All content;SOPs only;Work instructions;Articles;Policies;FAQ", DEPT, "results|Results Returned|int|0;180", "clicked|Result Opened|bool|Yes;No", "searcher|Searched By|person", "date|Searched On|date|-90;0"],
    statuses: ["Answered", "Partially Answered", "No Result", "Refined"],
    measure: "results", rows: 54,
  },

  "usage-analytics": {
    name: "Usage Analytics", kind: "analytics", summary: "What people actually read",
    entity: "Usage Record", ref: "USG",
    fields: [CATEGORY, DEPT, "views|Views|int|0;4800", "uniqueReaders|Unique Readers|int|0;980", "avgTimeMin|Average Time|float|0.2;24;min;1", "helpful|Rated Helpful|pct|18;100", "searchHits|Reached via Search|pct|4;98", "date|Period End|date|-330;0"],
    statuses: ["Highly Used", "Moderately Used", "Rarely Used", "Unused"],
    measure: "views", rows: 46,
  },

  categories: {
    name: "Content Taxonomy", kind: "list", summary: "How the library is organised",
    entity: "Category", ref: "CAT",
    fields: [CATEGORY, "parent|Parent Category|enum|Root;Operations;Governance;People;Technical", "articles|Articles|int|0;180", "owner|Category Owner|person", "reviewCycle|Review Cycle|enum|Annual;Every 2 years;Every 6 months;On change only", "lastAudit|Last Audited|date|-700;0", "date|Created On|date|-1400;0"],
    statuses: ["Active", "Draft", "Merged", "Retired"],
    measure: "articles",
  },

  faq: {
    name: "FAQ", kind: "list", summary: "The questions people keep asking",
    entity: "FAQ Entry", ref: "FAQ",
    fields: ["question|Question|enum|How do I reset my ERP access?;Where do I find my payslip?;How is overtime calculated?;What is the reorder level policy?;Who approves a gate pass?;How do I report a machine fault?", CATEGORY, DEPT, "views|Views (90d)|int|0;1800", "helpful|Rated Helpful|pct|20;100", "linkedArticle|Linked Article|enum|Access request guide;Payroll self-service;Overtime policy;Inventory policy;Gate pass procedure;Maintenance request flow", AUTHOR, "date|Last Updated|date|-600;0"],
    statuses: ["Published", "Draft", "Needs Update", "Retired"],
    measure: "views",
  },

  troubleshooting: {
    name: "Troubleshooting Guides", kind: "list", summary: "Symptom to remedy",
    entity: "Guide", ref: "TSG",
    fields: ["symptom|Symptom|enum|Plating stain on finished parts;Press producing burrs;Barrel not rotating;Colour drifting between lots;Metal detector false rejects;Label printer misfeed;Scanner not reading barcode", "likelyCause|Likely Cause|enum|Bath contamination;Worn die;Drive belt slack;Chemistry drift;Sensitivity setting;Roller wear;Print contrast", DEPT, "resolutionMin|Typical Resolution|int|5;480;min", "uses|Times Used|int|0;480", "successRate|Success Rate|pct|30;100", AUTHOR, "date|Last Verified|date|-500;0"],
    statuses: ["Verified", "Draft", "Needs Verification", "Superseded"],
    measure: "uses",
  },

  policies: {
    name: "Policy Documents", kind: "list", summary: "The rules everyone signs up to",
    entity: "Policy", ref: "POL",
    fields: ["policy|Policy|enum|Code of conduct;Attendance and leave;Overtime;Chemical safety;Information security;Anti-bribery;Environmental;Grievance;Travel and expense", DEPT, AUDIENCE, "version|Version|enum|v1.0;v1.2;v2.0;v2.1;v3.0", "acknowledgement|Acknowledgement|pct|12;100", APPROVER, "reviewDue|Review Due|date|-90;700", "date|Effective From|date|-1400;0"],
    statuses: ["Published", "Under Review", "Draft", "Review Overdue", "Superseded"],
    measure: "acknowledgement",
  },

  forms: {
    name: "Forms & Templates", kind: "list", summary: "Downloadable working papers",
    entity: "Form", ref: "FRM",
    fields: ["form|Form|enum|Material requisition;Gate pass request;Leave application;Maintenance request;Deviation report;Sample submission;Overtime authorisation;Stock adjustment note", DEPT, "formNo|Form No.|enum|F-PRD-01;F-WHS-02;F-HR-03;F-MNT-04;F-QUA-05;F-FIN-06", "downloads|Downloads (90d)|int|0;980", "version|Version|enum|Rev 1;Rev 2;Rev 3;Rev 4", "owner|Form Owner|person", "date|Effective From|date|-1200;0"],
    statuses: ["Current", "Draft", "Superseded", "Withdrawn"],
    measure: "downloads",
  },

  "review-schedule": {
    name: "Periodic Review Schedule", kind: "calendar", summary: "What falls due for review",
    entity: "Scheduled Review", ref: "PRV",
    fields: ["document|Document|enum|SOP-PRD-001;SOP-PLT-004;SOP-QUA-011;Chemical safety policy;Fire evacuation plan;Code of conduct", DEPT, "cycle|Review Cycle|enum|Annual;Every 2 years;Every 6 months;On regulatory change", "reviewer|Assigned Reviewer|person", "lastReviewed|Last Reviewed|date|-1200;0", "effortHrs|Estimated Effort|float|0.5;24;hrs;1", "date|Review Due|date|-90;400"],
    statuses: ["Scheduled", "In Review", "Completed", "Overdue", "Deferred"],
    measure: "effortHrs",
  },

  contributors: {
    name: "Contributors", kind: "analytics", summary: "Who keeps the library alive",
    entity: "Contributor", ref: "CTB",
    fields: [AUTHOR, DEPT, "authored|Documents Authored|int|0;68", "reviewed|Documents Reviewed|int|0;120", "updates|Updates (12m)|int|0;180", "avgHelpful|Average Helpful Score|pct|24;100", "views|Total Views|int|0;9800", "date|Last Contribution|date|-300;0"],
    statuses: ["Active", "Occasional", "Inactive", "Retired"],
    measure: "authored",
  },

  feedback: {
    name: "Content Feedback", kind: "list", summary: "What readers tell us is wrong",
    entity: "Feedback", ref: "FBK",
    fields: ["document|Document|enum|SOP-PLT-004;SOP-QUA-011;WI Press setup;Gate pass procedure;Overtime policy;Forklift daily check", "feedbackType|Feedback|enum|Out of date;Unclear step;Missing information;Wrong reference;Broken link;Suggestion;Praise", "reportedBy|Reported By|person", "severity|Severity|enum|Blocking;Major;Minor;Cosmetic", "ageDays|Open For|int|0;220;days", "date|Reported On|date|-300;0"],
    statuses: ["New", "Accepted", "In Update", "Resolved", "Declined"],
    measure: "ageDays",
  },

  glossary: {
    name: "Glossary", kind: "list", summary: "Terms everyone should read the same way",
    entity: "Term", ref: "GLS",
    fields: ["term|Term|enum|OEE;WIP;CAPA;MOQ;Lead time;Nickel release;Barrel plating;Rack plating;Deburring;Heat lot;Shade band;GRN", "domain|Domain|enum|Manufacturing;Quality;Commercial;Finance;Logistics;Compliance", "definition|Definition Length|enum|Short;Standard;Detailed", "usage|Referenced In|int|0;68", AUTHOR, "date|Last Updated|date|-900;0"],
    statuses: ["Approved", "Draft", "Under Review", "Deprecated"],
    measure: "usage",
  },

  "knowledge-settings": {
    name: "Knowledge Configuration", kind: "settings", summary: "Control and retention rules",
    entity: "Knowledge Rule", ref: "KST",
    fields: ["rule|Rule|enum|Default review cycle;Mandatory approval levels;Acknowledgement deadline;Archive after supersession;Search result ranking;Draft retention", "value|Configured Value|enum|2 years;Two approvers;14 days;Keep 7 years;Most viewed first;90 days", "owner|Rule Owner|person", "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Block a released SOP from being edited without a new revision", "Notify every assigned reader when a document they acknowledged is revised", "Flag any document that passes its review date as review overdue"],
  },
};
