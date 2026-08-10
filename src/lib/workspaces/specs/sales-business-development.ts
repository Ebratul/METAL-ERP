import type { ModuleSpecs } from "../types";

/** Module 65 — Sales & Business Development Management. */

const BUYER = "buyer|Buyer|enum|@buyers";
const REP = "rep|Sales Owner|person";
const REGION = "region|Region|enum|Europe;North America;East Asia;South Asia;Middle East;Oceania";
const PERIOD = "period|Period|enum|Q1 FY26;Q2 FY26;Q3 FY26;Q4 FY26;FY 2026";
const FAMILY = "family|Product Family|enum|Snap fasteners;Jeans buttons;Zipper sliders;Rivets;Eyelets;Buckles;Metal labels;Shank buttons";

export const SALES_BUSINESS_DEVELOPMENT: ModuleSpecs = {
  "sales-overview": {
    name: "Sales Overview", kind: "overview", summary: "Live commercial pulse",
    entity: "Sales Record", ref: "SOV",
    fields: [BUYER, REGION, FAMILY, "value|Order Value|money|8000;1800000", "quantity|Quantity|int|20000;9800000;pcs", "margin|Margin|pct|4;42", REP, "date|Booked On|date|-330;0"],
    statuses: ["Confirmed", "In Negotiation", "Quoted", "Lost", "Cancelled"],
    measure: "value", rows: 52,
    insight: "Confirmed value is 8% ahead of the quarter plan, but two-thirds of it lands in the last six weeks — the plating line will be the constraint, not demand.",
  },

  "sales-targets": {
    name: "Sales Targets", kind: "form", summary: "By team, buyer and region",
    entity: "Sales Target", ref: "STG",
    fields: [REP, REGION, BUYER, PERIOD, "target|Target Value|money|48000;4800000", "quantityTarget|Target Quantity|int|100000;24000000;pcs", "newBuyers|New Buyer Target|int|0;12", "date|Set On|date|-330;30"],
    statuses: ["Draft", "Submitted", "Approved", "Revised", "Locked"],
    measure: "target",
  },

  achievement: {
    name: "Target vs Achievement", kind: "analytics", summary: "Attainment against plan",
    entity: "Attainment Record", ref: "ACH",
    fields: [REP, REGION, PERIOD, "target|Target|money|48000;4800000", "achieved|Achieved|money|8000;5200000", "attainment|Attainment|pct|18;142", "gap|Gap|money|0;1800000", "date|Period End|date|-330;0"],
    statuses: ["Achieved", "On Track", "At Risk", "Missed"],
    measure: "achieved", rows: 48,
  },

  "sales-team": {
    name: "Sales Team", kind: "list", summary: "Reps and their coverage",
    entity: "Team Member", ref: "STM",
    fields: [REP, "designation|Designation|enum|Head of Sales;Senior Merchandiser;Merchandiser;Sales Executive;BD Executive;Key Account Manager", REGION, "buyersHandled|Buyers Handled|int|1;24", "revenue|Revenue Handled|money|48000;4800000", "attainment|Attainment|pct|24;138", "experience|Experience|float|0.5;22;yrs;1", "date|Joined On|date|-4200;-30"],
    statuses: ["Active", "On Probation", "On Leave", "Under Review", "Left"],
    measure: "revenue",
  },

  "territory-plan": {
    name: "Territory Plans", kind: "list", summary: "Who owns which market",
    entity: "Territory Plan", ref: "TPL",
    fields: ["territory|Territory|enum|Northern Europe;Southern Europe;UK & Ireland;US East;US West;Japan & Korea;Greater China;Middle East;ANZ", REP, "buyers|Buyers in Territory|int|1;28", "potential|Market Potential|money|98000;9800000", "captured|Captured|money|12000;5800000", "penetration|Penetration|pct|2;68", PERIOD, "date|Plan Date|date|-330;60"],
    statuses: ["Active", "Draft", "Under Review", "Reassigned"],
    measure: "potential",
  },

  "key-accounts": {
    name: "Key Account Plans", kind: "list", summary: "Strategic buyer plans",
    entity: "Account Plan", ref: "KAP",
    fields: [BUYER, REP, "objective|Objective|enum|Grow share of wallet;Enter a new brand;Convert to nominated supplier;Improve margin;Reduce lead time;Add a product family", "currentValue|Current Value|money|48000;4800000", "targetValue|Target Value|money|98000;9800000", "shareOfWallet|Share of Wallet|pct|2;62", "progress|Plan Progress|pct|0;100", "date|Review Date|date|-120;180"],
    statuses: ["Active", "On Track", "At Risk", "Achieved", "Closed"],
    measure: "targetValue",
  },

  "new-market": {
    name: "New Market Development", kind: "list", summary: "Market entry initiatives",
    entity: "Market Initiative", ref: "NMD",
    fields: ["market|Market|enum|Vietnam sourcing hubs;Turkey denim cluster;Ethiopia industrial parks;Mexico nearshoring;Poland assembly;India domestic brands;Indonesia sportswear", REGION, "initiative|Initiative|enum|Agent appointment;Trade fair presence;Sample seeding;Local warehouse;Buyer roadshow;Partnership with mill", "investment|Investment|money|4000;480000", "potential|Annual Potential|money|48000;4800000", "owner|Owner|person", "date|Target Entry|date|-90;540"],
    statuses: ["Exploring", "Approved", "In Execution", "Live", "Dropped"],
    measure: "potential",
  },

  "product-push": {
    name: "Product Push Plans", kind: "list", summary: "Focus product campaigns",
    entity: "Push Plan", ref: "PPP",
    fields: [FAMILY, "item|Focus Item|enum|@items", "reason|Push Reason|enum|New capability;Excess capacity;High margin;Buyer trend;Sustainability story;Competitive win-back", "targetQty|Target Quantity|int|50000;9800000;pcs", "achievedQty|Achieved|int|0;9800000;pcs", "attainment|Attainment|pct|0;132", REP, "date|Campaign End|date|-60;220"],
    statuses: ["Planned", "Running", "Achieved", "Underperforming", "Closed"],
    measure: "targetQty",
  },

  "incentive-plan": {
    name: "Incentive & Commission", kind: "settings", summary: "How payout is calculated",
    entity: "Incentive Scheme", ref: "INS",
    fields: ["scheme|Scheme|enum|Quarterly volume bonus;New buyer bonus;Margin protection bonus;Collection incentive;Annual attainment award", "appliesTo|Applies To|enum|All sales staff;Key account managers;BD executives;Regional heads", "basis|Basis|enum|% of order value;% of collected value;Fixed per new buyer;Slab on attainment", "rate|Rate|pct|0.2;12", "cap|Payout Cap|money|1000;98000", "owner|Scheme Owner|person", "date|Effective From|date|-400;60"],
    statuses: ["Active", "Draft", "Under Approval", "Expired"],
    measure: "cap",
    settings: ["Pay commission only after the invoice is collected", "Cap total quarterly payout at 3% of the region's gross margin"],
  },

  "commission-payout": {
    name: "Commission Payout", kind: "list", summary: "What each rep has earned",
    entity: "Payout", ref: "CPO",
    fields: [REP, "scheme|Scheme|enum|Quarterly volume bonus;New buyer bonus;Margin protection bonus;Collection incentive;Annual attainment award", PERIOD, "basisValue|Basis Value|money|8000;4800000", "rate|Rate|pct|0.2;12", "payout|Payout|money|100;98000", "date|Payout Date|date|-330;60"],
    statuses: ["Calculated", "Approved", "Paid", "On Hold", "Disputed"],
    measure: "payout", rows: 48,
  },

  "growth-analysis": {
    name: "Growth Analysis", kind: "analytics", summary: "Year on year and share of wallet",
    entity: "Growth Record", ref: "GRW",
    fields: [BUYER, REGION, FAMILY, "lastYear|Last Year|money|18000;4800000", "thisYear|This Year|money|8000;5800000", "growth|Growth|pct|0;98", "shareOfWallet|Share of Wallet|pct|1;62", "contribution|Contribution to Growth|pct|0;38", "date|Period End|date|-330;0"],
    statuses: ["Growing", "Flat", "Declining", "New Business", "Lost"],
    measure: "thisYear", rows: 48,
  },

  "pipeline-review": {
    name: "Pipeline Review", kind: "board", summary: "Weekly deal review",
    entity: "Pipeline Deal", ref: "PIP",
    fields: [BUYER, FAMILY, "value|Deal Value|money|8000;2400000", "probability|Win Probability|pct|5;95", "weighted|Weighted Value|money|1000;1800000", REP, "closeDate|Expected Close|date|-30;220", "date|Last Reviewed|date|-60;0"],
    statuses: ["Qualified", "Sampling", "Quoted", "Negotiating", "Won", "Lost"],
    measure: "value", rows: 46,
  },

  "lead-generation": {
    name: "Lead Generation", kind: "list", summary: "Where new business comes from",
    entity: "Lead", ref: "LED",
    fields: ["company|Company|enum|Nordic Apparel Group;Atlas Denim Works;Verde Sportswear;Kanto Fashion Co.;Southbank Outfitters;Meridian Kids;Cascade Workwear", "source|Source|enum|Trade fair;Buyer referral;Website enquiry;Cold outreach;Agent;LinkedIn;Existing buyer's new brand", REGION, "potential|Estimated Potential|money|12000;2400000", "score|Lead Score|int|10;100", REP, "date|Captured On|date|-260;0"],
    statuses: ["New", "Contacted", "Qualified", "Converted", "Disqualified"],
    measure: "potential", rows: 50,
  },

  "quotation-tracker": {
    name: "Quotation Tracker", kind: "list", summary: "Every price we have put out",
    entity: "Quotation", ref: "QTN",
    fields: [BUYER, "item|Item|enum|@items", "quantity|Quantity|int|10000;4800000;pcs", "unitPrice|Quoted Price|float|0.02;3.8;USD;3", "value|Quote Value|money|2000;2400000", "margin|Quoted Margin|pct|2;42", REP, "validTo|Valid Until|date|-30;120", "date|Quoted On|date|-260;0"],
    statuses: ["Sent", "Under Buyer Review", "Revised", "Accepted", "Declined", "Expired"],
    measure: "value", rows: 52,
  },

  "win-loss": {
    name: "Win / Loss Analysis", kind: "analytics", summary: "Why deals close or slip away",
    entity: "Outcome", ref: "WLS",
    fields: [BUYER, FAMILY, "value|Deal Value|money|8000;2400000", "outcome|Outcome|enum|Won;Lost;No decision", "reason|Primary Reason|enum|Price;Lead time;Quality reputation;Capacity;Existing relationship;Compliance certification;Payment terms", "competitor|Competitor|enum|YKK;SBS Zipper;Coats;Local supplier;Chinese trader;Not known", REP, "date|Decided On|date|-330;0"],
    statuses: ["Won", "Lost", "Postponed", "Under Analysis"],
    measure: "value", rows: 48,
  },

  "buyer-visits": {
    name: "Buyer Visits", kind: "calendar", summary: "Meetings, factory tours and reviews",
    entity: "Visit", ref: "BVT",
    fields: [BUYER, "purpose|Purpose|enum|Factory tour;Range presentation;Price negotiation;Quality review;Relationship visit;Issue resolution", "location|Location|enum|Factory;Buyer office;Dhaka office;Trade fair;Video call", REP, "durationDays|Duration|int|1;5;days", "outcomeValue|Business Discussed|money|0;2400000", "date|Visit Date|date|-180;150"],
    statuses: ["Planned", "Confirmed", "Completed", "Rescheduled", "Cancelled"],
    measure: "outcomeValue",
  },

  "trade-shows": {
    name: "Trade Shows & Events", kind: "list", summary: "Where we show up",
    entity: "Event", ref: "TSH",
    fields: ["event|Event|enum|Interfilière Paris;Bangladesh Denim Expo;Intertextile Shanghai;Texprocess Frankfurt;Apparel Sourcing Paris;Kingpins Amsterdam;Première Vision", "city|City|enum|Paris;Dhaka;Shanghai;Frankfurt;Amsterdam;New York;Hong Kong", "cost|Participation Cost|money|4000;280000", "leads|Leads Generated|int|0;140", "meetings|Meetings Held|int|0;90", "pipelineValue|Pipeline Generated|money|0;2400000", "owner|Owner|person", "date|Event Date|date|-330;300"],
    statuses: ["Planned", "Registered", "Attended", "Reviewed", "Skipped"],
    measure: "pipelineValue",
  },

  "competitor-tracking": {
    name: "Competitor Tracking", kind: "list", summary: "Who we are up against",
    entity: "Competitor Note", ref: "CMP",
    fields: ["competitor|Competitor|enum|YKK;SBS Zipper;Coats;Morito;Prym;Local trader;Chinese OEM;Indian supplier", BUYER, FAMILY, "priceIndex|Their Price Index|pct|62;140", "leadDays|Their Lead Time|int|14;120;days", "threat|Threat Level|enum|Critical;High;Moderate;Low", REP, "date|Noted On|date|-330;0"],
    statuses: ["Active Threat", "Monitoring", "Displaced Us", "We Displaced Them", "Not Relevant"],
    measure: "priceIndex",
  },

  "forecast-input": {
    name: "Sales Forecast Input", kind: "form", summary: "What the field expects to land",
    entity: "Forecast Entry", ref: "SFI",
    fields: [BUYER, FAMILY, PERIOD, "quantity|Forecast Quantity|int|20000;9800000;pcs", "value|Forecast Value|money|8000;4800000", "confidence|Confidence|pct|20;98", REP, "date|Submitted On|date|-200;30"],
    statuses: ["Draft", "Submitted", "Reviewed", "Locked", "Revised"],
    measure: "value", rows: 48,
  },

  "sales-settings": {
    name: "Sales Configuration", kind: "settings", summary: "Approval limits and policy",
    entity: "Sales Rule", ref: "SST",
    fields: ["rule|Rule|enum|Minimum acceptable margin;Discount approval threshold;Quotation validity;Sample cost recovery;Credit check before confirmation;Territory overlap policy", "value|Configured Value|enum|12%;5% and above;30 days;Recover above 50 pcs;Mandatory;Owner takes precedence", "owner|Rule Owner|person", "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Require commercial head approval when quoted margin falls below 12%", "Expire quotations automatically 30 days after issue", "Run a credit check before any order can be confirmed"],
  },
};
