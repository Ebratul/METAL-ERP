import type { ModuleSpecs } from "../types";

/** Module 36 — Laboratory & Testing Management. */

const ITEM = "item|Item|enum|@items";
const BUYER = "buyer|Buyer|enum|@buyers";
const TEST = "test|Test|enum|Nickel release (EN 1811);Pull test;Salt spray;Torsion test;Colour fastness;Cadmium content;Lead content;Adhesion tape test;Corrosion resistance;Sharp point test";
const ANALYST = "analyst|Analyst|person";
const LAB = "lab|Lab|enum|In-house Chemical Lab;In-house Physical Lab;SGS;Intertek;Bureau Veritas;TÜV";

export const LABORATORY_TESTING: ModuleSpecs = {
  "test-requests": {
    name: "Test Requests", kind: "list", summary: "Incoming jobs for the lab",
    entity: "Test Request", ref: "TRQ",
    fields: [ITEM, BUYER, TEST, "priority|Priority|enum|Urgent;High;Normal", "specimens|Specimens|int|2;24;pcs", "requester|Requested By|person", "due|Required By|date|-8;25"],
    statuses: ["Received", "In Queue", "Testing", "Reported", "Cancelled"],
    measure: "specimens", rows: 46,
    insight: "Nickel release is 41% of all lab demand and carries the longest queue — a second test rig would cut turnaround by half.",
  },

  "test-methods": {
    name: "Test Methods", kind: "list", summary: "Standard operating procedures",
    entity: "Test Method", ref: "TMD",
    fields: [TEST, "standard|Standard|enum|EN 1811;EN 12472;ASTM B117;ISO 9227;ISO 2409;CPSIA;16 CFR 1500.48", "equipment|Equipment|enum|AAS Spectrometer;Universal Tester;Salt Spray Chamber;Colour Spectrophotometer;XRF Analyser", "durationHrs|Duration|float|0.5;96;hrs;1", "cost|Cost per Test|money|8;220", "owner|Method Owner|person", "date|Revised On|date|-600;0"],
    statuses: ["Active", "Under Revision", "Superseded", "Withdrawn"],
  },

  "sample-log": {
    name: "Lab Sample Log", kind: "list", summary: "Specimens received and stored",
    entity: "Lab Sample", ref: "LSM",
    fields: [ITEM, BUYER, "source|Source|enum|Incoming QC;In-process QC;Final QC;R&D;Buyer submission;Complaint", "qty|Specimens|int|1;30;pcs", "location|Shelf Location|enum|Rack A-1;Rack A-2;Rack B-1;Rack B-2;Cold Store", ANALYST, "date|Received On|date|-120;0"],
    statuses: ["Logged", "Under Test", "Tested", "Retained", "Discarded"],
    measure: "qty",
  },

  results: {
    name: "Test Results", kind: "list", summary: "Values recorded against limits",
    entity: "Test Result", ref: "TRS",
    fields: [ITEM, TEST, "value|Measured Value|float|0.01;480;units;2", "limit|Specified Limit|float|0.1;500;units;2", "margin|Margin to Limit|pct|10;180", LAB, ANALYST, "date|Tested On|date|-140;0"],
    statuses: ["Pass", "Marginal Pass", "Fail", "Retest Required"],
    measure: "value",
  },

  "nickel-release": {
    name: "Nickel Release Test", kind: "analytics", summary: "EN 1811 compliance tracking",
    entity: "Nickel Test", ref: "NKL",
    fields: [ITEM, BUYER, "release|Release Rate|float|0.01;1.2;µg/cm²/wk;3", "limit|Limit|float|0.2;0.88;µg/cm²/wk;2", "finish|Finish|enum|Nickel Free;Antique Brass;Shiny Gold;Matte Black;Gunmetal", "sealed|Sealed Coating|bool|Yes;No", ANALYST, "date|Tested On|date|-200;0"],
    statuses: ["Compliant", "Borderline", "Non-Compliant", "Retest"],
    measure: "release",
  },

  "pull-test": {
    name: "Pull & Strength Test", kind: "analytics", summary: "Attachment strength in newtons",
    entity: "Pull Test", ref: "PUL",
    fields: [ITEM, "component|Component|enum|Snap button;Jeans button;Rivet;Eyelet;Hook and bar;Zipper puller", "force|Break Force|float|20;420;N;1", "required|Required Force|int|50;250;N", "fabric|Fabric|enum|Denim 12oz;Denim 14oz;Twill;Canvas;Poplin", ANALYST, "date|Tested On|date|-160;0"],
    statuses: ["Pass", "Marginal Pass", "Fail", "Retest"],
    measure: "force",
  },

  "third-party": {
    name: "Third-Party Testing", kind: "list", summary: "External laboratory reports",
    entity: "External Test", ref: "TPT",
    fields: [ITEM, BUYER, LAB, TEST, "cost|Test Fee|money|60;2400", "reportNo|Report No|enum|RPT-77121;RPT-77188;RPT-77244;RPT-77301;RPT-77366", "date|Report Date|date|-240;20"],
    statuses: ["Sent", "In Progress", "Report Received", "Passed", "Failed"],
  },

  certificates: {
    name: "Test Certificates", kind: "list", summary: "Certificates issued to buyers",
    entity: "Certificate", ref: "TCT",
    fields: [ITEM, BUYER, TEST, "certNo|Certificate No|enum|CERT-4411;CERT-4429;CERT-4437;CERT-4452;CERT-4468", "validMonths|Valid For|int|6;24;months", "issuer|Issued By|person", "date|Issued On|date|-400;0"],
    statuses: ["Issued", "Valid", "Expiring", "Expired", "Revoked"],
  },

  "equipment-calibration": {
    name: "Equipment Calibration", kind: "calendar", summary: "Instrument due dates",
    entity: "Calibration", ref: "CAL",
    fields: ["equipment|Equipment|enum|AAS Spectrometer;Universal Tester;Salt Spray Chamber;Colour Spectrophotometer;XRF Analyser;Digital Micrometer;Analytical Balance", "agency|Calibration Agency|enum|BSTI;SGS;Intertek;In-house;OEM Service", "cost|Calibration Cost|money|40;1800", "intervalMonths|Interval|int|3;24;months", "owner|Custodian|person", "date|Due Date|date|-40;220"],
    statuses: ["Calibrated", "Due Soon", "Overdue", "Out of Service"],
  },

  "failure-analysis": {
    name: "Failure Analysis", kind: "analytics", summary: "Why the specimen failed",
    entity: "Failure Case", ref: "FAN",
    fields: [ITEM, TEST, "mode|Failure Mode|enum|Coating porosity;Base metal impurity;Insufficient thickness;Weak crimp;Improper sealing;Design weakness", "cause|Root Cause|enum|Process parameter;Material grade;Tooling wear;Operator error;Supplier issue", "impactedQty|Impacted Qty|int|500;180000;pcs", "cost|Cost Impact|money|400;68000", "date|Analysed On|date|-200;0"],
    statuses: ["Open", "Analysis Complete", "Action Assigned", "Closed"],
    measure: "cost",
  },

  "lab-schedule": {
    name: "Lab Schedule", kind: "calendar", summary: "Bench and equipment booking",
    entity: "Lab Booking", ref: "LSC",
    fields: [TEST, "equipment|Equipment|enum|AAS Spectrometer;Universal Tester;Salt Spray Chamber;Colour Spectrophotometer;XRF Analyser", ANALYST, "durationHrs|Duration|float|0.5;72;hrs;1", "samples|Samples|int|1;24;pcs", "date|Booked For|date|-10;30"],
    statuses: ["Booked", "In Progress", "Completed", "Released", "Cancelled"],
    measure: "durationHrs",
  },

  reagents: {
    name: "Reagent Inventory", kind: "list", summary: "Consumables held in the lab",
    entity: "Reagent", ref: "RGT",
    fields: ["reagent|Reagent|enum|Artificial sweat solution;Nitric acid AR;Sodium chloride;Buffer pH 4;Buffer pH 7;Standard nickel solution", "stock|Stock|float|0.2;40;L;2", "reorder|Reorder Level|float|0.5;10;L;1", "value|Stock Value|money|20;2400", "supplier|Supplier|enum|@suppliers", "date|Expiry Date|date|-30;540"],
    statuses: ["In Stock", "Low Stock", "Expiring", "Expired", "On Order"],
  },

  "test-costs": {
    name: "Testing Cost Analysis", kind: "analytics", summary: "In-house against outsourced spend",
    entity: "Cost Record", ref: "TCS",
    fields: [TEST, LAB, "tests|Tests Run|int|4;220", "spend|Spend|money|200;28000", "unitCost|Cost per Test|float|4;280;USD;2", "recovered|Recovered from Buyer|money|0;18000", "date|Period End|date|-240;0"],
    statuses: ["Within Budget", "Over Budget", "Under Review", "Optimised"],
    measure: "spend",
  },

  "retest-queue": {
    name: "Retest Queue", kind: "board", summary: "Specimens awaiting a second run",
    entity: "Retest", ref: "RTQ",
    fields: [ITEM, TEST, "reason|Retest Reason|enum|Failed first test;Instrument drift;Sample damaged;Buyer dispute;Method change", "specimens|Specimens|int|1;18;pcs", "priority|Priority|enum|Urgent;High;Normal", ANALYST, "date|Raised On|date|-30;0"],
    statuses: ["Requested", "Approved", "Testing", "Reported", "Withdrawn"],
    measure: "specimens",
  },

  "lab-capacity": {
    name: "Lab Capacity", kind: "analytics", summary: "Load against available bench hours",
    entity: "Capacity Record", ref: "LCP",
    fields: ["equipment|Equipment|enum|AAS Spectrometer;Universal Tester;Salt Spray Chamber;Colour Spectrophotometer;XRF Analyser", "available|Available Hours|float|40;600;hrs;1", "booked|Booked Hours|float|10;620;hrs;1", "utilisation|Utilisation|pct|20;110", "queue|Queue Length|int|0;40", "date|Week Ending|date|-120;14"],
    statuses: ["Overloaded", "Optimal", "Underloaded", "Idle"],
    measure: "booked",
  },

  proficiency: {
    name: "Proficiency Testing", kind: "list", summary: "Inter-lab comparison results",
    entity: "Proficiency Round", ref: "PFT",
    fields: [TEST, "scheme|Scheme|enum|ILAC round robin;Buyer cross-check;Supplier comparison;Internal duplicate", "zScore|Z-Score|float|0.05;3.6;;2", "assigned|Assigned Value|float|0.1;120;units;2", "obtained|Our Value|float|0.1;130;units;2", ANALYST, "date|Round Date|date|-400;0"],
    statuses: ["Satisfactory", "Questionable", "Unsatisfactory", "Pending"],
    measure: "zScore",
  },

  "sample-retention": {
    name: "Sample Retention", kind: "list", summary: "Specimens kept for reference",
    entity: "Retained Sample", ref: "RET",
    fields: [ITEM, BUYER, "reason|Retention Reason|enum|Buyer requirement;Regulatory;Dispute reference;Shade standard;Internal reference", "location|Location|enum|Rack A-1;Rack A-2;Rack B-1;Rack B-2;Cold Store", "retainMonths|Retention Period|int|6;60;months", "custodian|Custodian|person", "date|Retain Until|date|-60;900"],
    statuses: ["Retained", "Due for Disposal", "Disposed", "Missing"],
  },

  "buyer-protocols": {
    name: "Buyer Test Protocols", kind: "list", summary: "What each buyer demands",
    entity: "Protocol", ref: "BTP",
    fields: [BUYER, TEST, "frequency|Frequency|enum|Every shipment;Every order;Quarterly;Annually;On change", "limitValue|Buyer Limit|float|0.1;400;units;2", "acceptedLab|Accepted Lab|enum|In-house;SGS;Intertek;Bureau Veritas;Buyer nominated", "owner|Owner|person", "date|Updated On|date|-500;0"],
    statuses: ["Active", "Under Update", "Superseded", "Withdrawn"],
  },

  turnaround: {
    name: "Turnaround Performance", kind: "analytics", summary: "Request to report duration",
    entity: "Turnaround Record", ref: "TAT",
    fields: [TEST, LAB, "targetHrs|Target|float|4;120;hrs;1", "actualHrs|Actual|float|2;180;hrs;1", "onTime|On Time|bool|Yes;No", "volume|Tests|int|2;140", "date|Period End|date|-200;0"],
    statuses: ["Within SLA", "Marginal", "Breached", "Under Review"],
    measure: "actualHrs",
  },

  "lab-settings": {
    name: "Laboratory Controls", kind: "settings", summary: "Method, approval and retention rules",
    entity: "Control Rule", ref: "LSET",
    fields: ["rule|Rule|enum|Require analyst sign-off;Block reporting on expired calibration;Auto-raise retest on fail;Mandatory sample retention;Restrict method edits", "scope|Scope|enum|All tests;Chemical tests;Physical tests;Third-party only", "owner|Rule Owner|person", "date|Effective From|date|-300;0", "testsCovered|Tests Covered|int|1;40"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Block result entry when the instrument calibration has lapsed", "Automatically raise a retest when a specimen fails"],
  },
};
