import type { ModuleSpecs } from "../types";

/** Module 56 — Document Management System (DMS). */

const DOCTYPE = "docType|Document Type|enum|Policy;Procedure;Work instruction;Drawing;Contract;Certificate;Invoice;Report;Form;Manual";
const FOLDER = "folder|Folder|enum|Quality;Production;Commercial;Finance;HR;Compliance;Engineering;Legal";
const OWNER = "owner|Document Owner|person";
const CONFIDENTIALITY = "confidentiality|Confidentiality|enum|Public;Internal;Confidential;Restricted";
const FORMAT = "format|Format|enum|PDF;DOCX;XLSX;DWG;PNG;Scanned image";

export const DMS: ModuleSpecs = {
  repository: {
    name: "Document Repository", kind: "list", summary: "Every controlled document",
    entity: "Document", ref: "DOC",
    fields: [DOCTYPE, FOLDER, "title|Title|enum|Incoming inspection procedure;Plating process control;Buyer contract 2026;Fire safety policy;Press machine manual;Annual audit report;Packing specification", "version|Version|enum|v1.0;v1.1;v2.0;v2.1;v3.0", CONFIDENTIALITY, "sizeMb|Size|float|0.1;42;MB;2", OWNER, "date|Uploaded On|date|-700;0"],
    statuses: ["Released", "Under Review", "Draft", "Superseded", "Archived"],
    measure: "sizeMb", rows: 56,
    insight: "Thirty-one documents have passed their scheduled review date — quality procedures make up two thirds of them.",
  },

  folders: {
    name: "Folder Structure", kind: "list", summary: "The classification tree",
    entity: "Folder", ref: "FLD",
    fields: [FOLDER, "parent|Parent|enum|Root;Quality;Production;Commercial;Finance;Compliance", "documents|Documents|int|1;480", "sizeMb|Total Size|float|1;2400;MB;1", CONFIDENTIALITY, OWNER, "date|Created On|date|-900;0"],
    statuses: ["Active", "Locked", "Archived"],
    measure: "documents",
  },

  versioning: {
    name: "Version Control", kind: "list", summary: "Revision trail per document",
    entity: "Version", ref: "VER",
    fields: ["document|Document|enum|Incoming inspection procedure;Plating process control;Buyer contract 2026;Fire safety policy;Packing specification", "version|Version|enum|v1.0;v1.1;v2.0;v2.1;v3.0", "changeSummary|Change|enum|Initial release;Minor correction;Process change;Regulatory update;Buyer requirement;Annual review", "author|Author|person", "sizeMb|Size|float|0.1;38;MB;2", "date|Revised On|date|-700;0"],
    statuses: ["Current", "Superseded", "Draft", "Withdrawn"],
    measure: "sizeMb",
  },

  approval: {
    name: "Document Approval", kind: "board", summary: "Review and release workflow",
    entity: "Approval Item", ref: "APR",
    fields: [DOCTYPE, FOLDER, "author|Author|person", "reviewer|Reviewer|person", "approver|Approver|person", "ageDays|Pending For|int|0;40;days", "date|Submitted On|date|-120;0"],
    statuses: ["Drafted", "Under Review", "Awaiting Approval", "Released", "Rejected"],
    measure: "ageDays",
  },

  retention: {
    name: "Retention Policy", kind: "settings", summary: "How long each class is kept",
    entity: "Retention Rule", ref: "RET",
    fields: [DOCTYPE, FOLDER, "retentionYears|Retention|int|1;25;yrs", "afterRetention|After Retention|enum|Archive;Purge;Review;Retain permanently", "legalBasis|Basis|enum|Statutory;Buyer requirement;Internal policy;Tax law;Certification", OWNER, "date|Effective From|date|-700;0"],
    statuses: ["Active", "Draft", "Superseded", "Suspended"],
    measure: "retentionYears",
    settings: ["Archive documents automatically at the end of their retention period", "Require legal sign-off before purging any contract"],
  },

  "access-log": {
    name: "Access Log", kind: "list", summary: "Who opened or downloaded what",
    entity: "Access Event", ref: "ACL",
    fields: ["document|Document|enum|Incoming inspection procedure;Buyer contract 2026;Salary structure;Plating process control;Audit report 2025", "userName|User|person", "action|Action|enum|Viewed;Downloaded;Printed;Shared;Edited;Deleted", CONFIDENTIALITY, "device|Device|enum|Desktop;Laptop;Mobile;Shop-floor terminal", "date|Accessed On|date|-120;0", "sizeMb|Document Size|float|0.1;42;MB;2"],
    statuses: ["Normal", "Unusual", "Flagged", "Reviewed"],
  },

  templates: {
    name: "Document Templates", kind: "list", summary: "Standard formats staff start from",
    entity: "Template", ref: "TPL",
    fields: [DOCTYPE, FOLDER, "templateName|Template|enum|Inspection report;Purchase requisition;Meeting minutes;Non-conformance report;Training record;Gate pass;Costing sheet", "usageCount|Times Used|int|1;900", FORMAT, OWNER, "date|Last Updated|date|-500;0"],
    statuses: ["Active", "Under Revision", "Draft", "Retired"],
    measure: "usageCount",
  },

  "e-signature": {
    name: "E-Signature", kind: "list", summary: "Documents signed electronically",
    entity: "Signature Request", ref: "ESG",
    fields: ["document|Document|enum|Buyer contract 2026;Supplier agreement;NDA;Purchase order;Compliance declaration;Offer letter", "signer|Signer|person", "signerRole|Signer Role|enum|Managing Director;Head of Commercial;Buyer representative;Supplier;Employee", "signatureType|Signature Type|enum|Click to sign;Digital certificate;Wet signature scan", "expiryDays|Expires In|int|1;30;days", "date|Requested On|date|-200;0"],
    statuses: ["Sent", "Viewed", "Signed", "Declined", "Expired"],
  },

  search: {
    name: "Full-Text Search", kind: "form", summary: "Find text inside documents",
    entity: "Search Query", ref: "SRC",
    fields: ["query|Search Text|enum|nickel release;packing specification;buyer contract;overtime policy;calibration record;audit finding", FOLDER, DOCTYPE, "fromDate|From|date|-700;-30", "toDate|To|date|-30;0", "results|Results Found|int|0;220", "searcher|Searched By|person"],
    statuses: ["Draft", "Running", "Completed", "No Results"],
    measure: "results",
  },

  "document-requests": {
    name: "Document Requests", kind: "list", summary: "Asks for documents not yet on file",
    entity: "Request", ref: "DRQ",
    fields: [DOCTYPE, FOLDER, "requester|Requested By|person", "purpose|Purpose|enum|Buyer audit;Internal audit;Legal matter;Customer query;Certification;Training", "priority|Priority|enum|Urgent;High;Normal", "ageDays|Open For|int|0;40;days", "date|Requested On|date|-120;0"],
    statuses: ["New", "Under Search", "Provided", "Not Available", "Rejected"],
    measure: "ageDays",
  },

  archive: {
    name: "Archive", kind: "list", summary: "Documents moved out of active use",
    entity: "Archived Document", ref: "ARC",
    fields: [DOCTYPE, FOLDER, "archiveLocation|Location|enum|Cold storage;Off-site vault;Cloud archive;Physical record room", "sizeMb|Size|float|0.1;120;MB;2", "retentionEnds|Retention Ends|date|-100;2000", "archivedBy|Archived By|person"],
    statuses: ["Archived", "Retrieval Requested", "Retrieved", "Due for Purge", "Purged"],
    measure: "sizeMb",
  },

  "scanning-queue": {
    name: "Scanning Queue", kind: "list", summary: "Paper waiting to be digitised",
    entity: "Scan Job", ref: "SCN",
    fields: [DOCTYPE, FOLDER, "pages|Pages|int|1;480", "scanner|Scanner|enum|Scanner-01;Scanner-02;MFD-Admin;Mobile capture", "ocrQuality|OCR Confidence|pct|48;99", "operator|Operator|person", "date|Queued On|date|-120;0"],
    statuses: ["Queued", "Scanning", "OCR Running", "Indexed", "Failed"],
    measure: "pages",
  },

  metadata: {
    name: "Metadata & Indexing", kind: "list", summary: "The fields that make search work",
    entity: "Metadata Field", ref: "MTD",
    fields: [DOCTYPE, "fieldName|Field|enum|Buyer;Order reference;Effective date;Standard;Department;Machine;Supplier", "fieldType|Field Type|enum|Text;Date;Number;Lookup;Multi-select", "mandatory|Mandatory|bool|Yes;No", "populated|Populated|pct|20;100", OWNER, "date|Defined On|date|-600;0"],
    statuses: ["Active", "Draft", "Deprecated"],
    measure: "populated",
  },

  "sharing-links": {
    name: "External Sharing", kind: "list", summary: "Links issued outside the company",
    entity: "Share Link", ref: "SHR",
    fields: ["document|Document|enum|Test certificate;Compliance certificate;Packing list;Commercial invoice;Audit report", "sharedWith|Shared With|enum|@buyers", CONFIDENTIALITY, "accessCount|Accesses|int|0;60", "expiryDays|Expires In|int|1;90;days", "sharedBy|Shared By|person", "date|Shared On|date|-200;0"],
    statuses: ["Active", "Expiring", "Expired", "Revoked"],
    measure: "accessCount",
  },

  "compliance-docs": {
    name: "Compliance Documents", kind: "list", summary: "Evidence held for audits",
    entity: "Compliance Document", ref: "CDC",
    fields: ["standard|Standard|enum|ISO 9001;ISO 14001;BSCI;Sedex SMETA;OEKO-TEX;WRAP;Buyer code", DOCTYPE, "evidenceFor|Evidence For|enum|Certification;Buyer audit;Statutory inspection;Internal audit;Customer query", "validUntil|Valid Until|date|-90;600", OWNER, "date|Uploaded On|date|-500;0", "pages|Pages|int|1;180"],
    statuses: ["Valid", "Expiring", "Expired", "Missing", "Superseded"],
  },

  checkout: {
    name: "Check-out & Locking", kind: "list", summary: "Documents currently being edited",
    entity: "Checkout", ref: "CHK",
    fields: ["document|Document|enum|Incoming inspection procedure;Plating process control;Packing specification;Buyer contract 2026", "checkedOutBy|Checked Out By|person", "reason|Reason|enum|Annual review;Correction;Regulatory update;Buyer requirement;Format change", "durationHrs|Checked Out For|float|0.5;220;hrs;1", "date|Checked Out On|date|-90;0"],
    statuses: ["Checked Out", "Overdue", "Checked In", "Force Released"],
    measure: "durationHrs",
  },

  "storage-analytics": {
    name: "Storage Analytics", kind: "analytics", summary: "Where the space goes",
    entity: "Storage Record", ref: "STG",
    fields: [FOLDER, DOCTYPE, "documents|Documents|int|4;900", "sizeMb|Size|float|1;4800;MB;1", "growth|Growth|pct|0;90", "duplicates|Duplicates|int|0;60", "date|Period End|date|-300;0"],
    statuses: ["Healthy", "Growing Fast", "Cleanup Needed", "Archived"],
    measure: "sizeMb",
  },

  "review-calendar": {
    name: "Review Calendar", kind: "calendar", summary: "Documents due for periodic review",
    entity: "Review Task", ref: "RVW",
    fields: [DOCTYPE, FOLDER, "document|Document|enum|Incoming inspection procedure;Fire safety policy;Plating process control;Packing specification;Code of conduct", "reviewCycle|Cycle|enum|6 months;Annual;2 years;3 years", OWNER, "date|Review Due|date|-90;300", "pages|Pages|int|1;120"],
    statuses: ["Scheduled", "In Review", "Completed", "Overdue", "Deferred"],
  },

  "usage-analytics": {
    name: "Usage Analytics", kind: "analytics", summary: "What people actually open",
    entity: "Usage Metric", ref: "USG",
    fields: [FOLDER, DOCTYPE, "views|Views|int|1;2400", "downloads|Downloads|int|0;900", "uniqueUsers|Unique Users|int|1;180", "avgSecs|Average Time Open|float|10;900;sec;0", "date|Period End|date|-300;0"],
    statuses: ["Highly Used", "Used", "Rarely Used", "Never Opened"],
    measure: "views",
  },

  "dms-settings": {
    name: "DMS Controls", kind: "settings", summary: "Upload, naming and security rules",
    entity: "Control Rule", ref: "DSET",
    fields: ["rule|Rule|enum|Enforce naming convention;Block upload above size limit;Mandatory metadata;Watermark confidential downloads;Auto-version on re-upload", "sizeLimitMb|Size Limit|int|5;200;MB", OWNER, "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Watermark every download marked confidential", "Reject uploads that do not carry the mandatory metadata"],
  },
};
