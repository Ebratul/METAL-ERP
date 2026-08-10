import { WORKSPACE_SPECS, submodulesOf } from "@/lib/workspaces/catalog";
import type { ErpModule } from "./types";

/**
 * The 75 core modules of Smart Metal Garments Accessories ERP.
 *
 * `id` matches the master module list 1–75. Order in this array is the master
 * order; the sidebar re-groups it via `group`.
 */
export const MODULES: ErpModule[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    slug: "executive-dashboard",
    name: "Executive Dashboard & KPI Management",
    short: "Executive Dashboard",
    icon: "LayoutDashboard",
    group: "intelligence",
    tone: 1,
    live: true,
    description:
      "Real-time command centre for company-wide KPIs, targets and board-level reporting.",
    submodules: [
      { slug: "command-center", name: "CEO Command Center", kind: "overview", dataset: "kpi-metrics", summary: "Live company-wide pulse" },
      { slug: "kpi-library", name: "KPI Library", kind: "list", dataset: "kpi-metrics", summary: "Definitions, formulas and owners" },
      { slug: "scorecards", name: "Balanced Scorecards", kind: "analytics", dataset: "scorecards", summary: "Perspective-wise scoring" },
      { slug: "target-setting", name: "Target Setting", kind: "form", dataset: "targets", summary: "Annual and monthly targets" },
      { slug: "target-tracking", name: "Target Tracking", kind: "list", dataset: "targets", summary: "Attainment against plan" },
      { slug: "department-dashboards", name: "Department Dashboards", kind: "analytics", dataset: "dashboards", summary: "Per-function views" },
      { slug: "board-pack", name: "Board Reporting Pack", kind: "analytics", dataset: "reports", summary: "Monthly board deck" },
      { slug: "alert-rules", name: "KPI Alert Rules", kind: "settings", dataset: "alert-rules", summary: "Threshold-based alerting" },
      { slug: "alert-log", name: "Alert Log", kind: "list", dataset: "alert-rules", summary: "What fired and when" },
      { slug: "benchmarking", name: "Industry Benchmarking", kind: "analytics", dataset: "benchmarks", summary: "Peer comparison" },
      { slug: "drilldown-explorer", name: "Drill-down Explorer", kind: "analytics", dataset: "kpi-metrics", summary: "Slice any metric" },
      { slug: "dashboard-builder", name: "Dashboard Builder", kind: "settings", dataset: "dashboards", summary: "Custom widget layouts" },
      { slug: "executive-calendar", name: "Executive Calendar", kind: "calendar", dataset: "tasks", summary: "Reviews and board dates" },
      { slug: "strategic-initiatives", name: "Strategic Initiatives", kind: "board", dataset: "tasks", summary: "Company-level programmes" },
      { slug: "risk-register", name: "Enterprise Risk Register", kind: "list", dataset: "risks", summary: "Exposure and mitigation" },
      { slug: "revenue-analytics", name: "Revenue Analytics", kind: "analytics", dataset: "invoices", summary: "Billing and collection view" },
      { slug: "cost-analytics", name: "Cost Analytics", kind: "analytics", dataset: "gl-entries", summary: "Where the money goes" },
      { slug: "exception-center", name: "Exception Center", kind: "list", dataset: "approvals", summary: "Escalations awaiting the CEO" },
      { slug: "kpi-approvals", name: "KPI Approvals", kind: "board", dataset: "approvals", summary: "Sign-off on published metrics" },
      { slug: "report-subscriptions", name: "Report Subscriptions", kind: "list", dataset: "reports", summary: "Who receives what" },
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────
  {
    id: 2,
    slug: "hrms-payroll",
    name: "HRMS & Payroll Management",
    short: "HRMS & Payroll",
    icon: "UsersRound",
    group: "workforce",
    tone: 6,
    badge: 13,
    description:
      "The whole employee lifecycle — hiring, attendance, leave, payroll and performance.",
    submodules: [
      { slug: "hr-dashboard", name: "HR Dashboard", kind: "overview", dataset: "employees", summary: "Headcount, absence, cost" },
      { slug: "employee-directory", name: "Employee Directory", kind: "list", dataset: "employees", summary: "Every employee on record" },
      { slug: "recruitment", name: "Recruitment Pipeline", kind: "board", dataset: "candidates", summary: "Requisition to offer" },
      { slug: "candidates", name: "Candidate Register", kind: "list", dataset: "candidates", summary: "Applications received" },
      { slug: "manpower-requisition", name: "Manpower Requisition", kind: "form", dataset: "requisitions-hr", summary: "Raise a hiring request" },
      { slug: "onboarding", name: "Onboarding & Joining", kind: "board", dataset: "tasks", summary: "Joining formalities" },
      { slug: "attendance", name: "Attendance Analytics", kind: "analytics", dataset: "attendance", summary: "Punch data and absence" },
      { slug: "attendance-register", name: "Attendance Register", kind: "list", dataset: "attendance", summary: "Daily punch records" },
      { slug: "leave-management", name: "Leave Management", kind: "list", dataset: "leave-requests", summary: "Applications and balances" },
      { slug: "shift-roster", name: "Shift Roster", kind: "calendar", dataset: "shift-roster", summary: "Who works which shift" },
      { slug: "overtime", name: "Overtime & Bonus", kind: "analytics", dataset: "attendance", summary: "OT hours and cost" },
      { slug: "payroll-run", name: "Payroll Run", kind: "form", dataset: "payroll", summary: "Monthly salary processing" },
      { slug: "payslips", name: "Payslip Register", kind: "list", dataset: "payroll", summary: "Gross, deduction, net" },
      { slug: "salary-structure", name: "Salary Structure", kind: "settings", dataset: "designations", summary: "Grades, allowances, deductions" },
      { slug: "performance", name: "Performance Appraisal", kind: "list", dataset: "appraisals", summary: "Review cycles and ratings" },
      { slug: "training", name: "Training & Development", kind: "list", dataset: "trainings", summary: "Sessions and attendance" },
      { slug: "skill-matrix", name: "Skill Matrix", kind: "analytics", dataset: "skill-matrix", summary: "Competency coverage" },
      { slug: "disciplinary", name: "Disciplinary Records", kind: "list", dataset: "disciplinary", summary: "Warnings and actions" },
      { slug: "separation", name: "Separation & Settlement", kind: "list", dataset: "separations", summary: "Exit to clearance" },
      { slug: "manpower-cost", name: "Manpower Cost", kind: "analytics", dataset: "manpower-cost", summary: "Labour cost per unit" },
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────
  {
    id: 3,
    slug: "organization-management",
    name: "Organization & Company Management",
    short: "Organization",
    icon: "Building2",
    group: "master-data",
    tone: 7,
    description:
      "Legal entities, plants, branches, departments, cost centres and the org hierarchy.",
    submodules: [
      { slug: "company-profile", name: "Company Profile", kind: "form", dataset: "org-units", summary: "Legal identity and registrations" },
      { slug: "legal-entities", name: "Legal Entities", kind: "list", dataset: "org-units", summary: "Multi-company structure" },
      { slug: "plants", name: "Plants & Factories", kind: "list", dataset: "org-units", summary: "Manufacturing sites" },
      { slug: "branches", name: "Branches & Offices", kind: "list", dataset: "org-units", summary: "Sales and liaison offices" },
      { slug: "departments", name: "Departments", kind: "list", dataset: "org-units", summary: "Functional units" },
      { slug: "cost-centers", name: "Cost Centers", kind: "list", dataset: "cost-centers", summary: "Costing hierarchy" },
      { slug: "budget-control", name: "Cost Center Budgets", kind: "analytics", dataset: "cost-centers", summary: "Budget against actual" },
      { slug: "org-chart", name: "Organization Chart", kind: "analytics", dataset: "org-units", summary: "Reporting structure" },
      { slug: "designations", name: "Designations & Grades", kind: "list", dataset: "designations", summary: "Job levels" },
      { slug: "shifts", name: "Shift Definitions", kind: "list", dataset: "shift-roster", summary: "Shift patterns and rosters" },
      { slug: "holiday-calendar", name: "Holiday Calendar", kind: "calendar", dataset: "holidays", summary: "Factory calendar" },
      { slug: "user-roles", name: "Users & Roles", kind: "list", dataset: "users", summary: "Access assignment" },
      { slug: "permissions", name: "Permission Matrix", kind: "settings", dataset: "roles", summary: "Role-based access control" },
      { slug: "role-register", name: "Role Register", kind: "list", dataset: "roles", summary: "Roles and their scope" },
      { slug: "delegation", name: "Authority Delegation", kind: "list", dataset: "approvals", summary: "Stand-in approvers" },
      { slug: "approval-hierarchy", name: "Approval Hierarchy", kind: "board", dataset: "approvals", summary: "Who signs at each level" },
      { slug: "location-master", name: "Location Master", kind: "list", dataset: "warehouse-locations", summary: "Sites, stores and zones" },
      { slug: "statutory-documents", name: "Statutory Documents", kind: "list", dataset: "documents", summary: "Licences and registrations" },
      { slug: "company-policies", name: "Company Policies", kind: "list", dataset: "policies", summary: "Published rule book" },
      { slug: "org-audit-log", name: "Organization Audit Log", kind: "list", dataset: "audit-log", summary: "Structural changes" },
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────
  {
    id: 4,
    slug: "master-data",
    name: "Master Data Management",
    short: "Master Data",
    icon: "Database",
    group: "master-data",
    tone: 3,
    description:
      "The single source of truth for items, customers, suppliers, UoM and all shared code sets.",
    submodules: [
      { slug: "item-master", name: "Item Master", kind: "list", dataset: "items", summary: "All raw, WIP and finished items" },
      { slug: "product-categories", name: "Product Categories", kind: "analytics", dataset: "items", summary: "Category tree and spread" },
      { slug: "customer-master", name: "Customer Master", kind: "list", dataset: "customers", summary: "Buyers and bill-to parties" },
      { slug: "supplier-master", name: "Supplier Master", kind: "list", dataset: "suppliers", summary: "Vendors and subcontractors" },
      { slug: "uom", name: "Units of Measure", kind: "list", dataset: "uom-master", summary: "UoM and conversions" },
      { slug: "currency", name: "Currency & Exchange Rates", kind: "list", dataset: "currency-rates", summary: "Multi-currency setup" },
      { slug: "material-grades", name: "Material Grades", kind: "list", dataset: "items", summary: "Brass, zinc alloy, steel grades" },
      { slug: "color-master", name: "Colour & Finish Master", kind: "list", dataset: "items", summary: "Plating and finish codes" },
      { slug: "size-master", name: "Size Master", kind: "list", dataset: "items", summary: "Size charts per product family" },
      { slug: "warehouse-master", name: "Warehouse & Location Master", kind: "list", dataset: "warehouse-locations", summary: "Bins and zones" },
      { slug: "tax-codes", name: "Tax Codes", kind: "list", dataset: "tax-codes", summary: "VAT / duty codes" },
      { slug: "price-master", name: "Price Master", kind: "list", dataset: "price-lists", summary: "Agreed selling prices" },
      { slug: "bank-master", name: "Bank & Account Master", kind: "list", dataset: "banks", summary: "Company bank accounts" },
      { slug: "numbering-series", name: "Numbering Series", kind: "settings", dataset: "numbering-series", summary: "Document code patterns" },
      { slug: "data-quality", name: "Data Quality Console", kind: "analytics", dataset: "data-quality", summary: "Duplicates and gaps" },
      { slug: "duplicate-check", name: "Duplicate Detection", kind: "list", dataset: "data-quality", summary: "Merge candidates" },
      { slug: "import-export", name: "Bulk Import / Export", kind: "form", dataset: "doc-extractions", summary: "Template-based loading" },
      { slug: "master-approvals", name: "Master Data Approvals", kind: "board", dataset: "approvals", summary: "New code sign-off" },
      { slug: "master-audit", name: "Master Change Log", kind: "list", dataset: "audit-log", summary: "Every field change" },
      { slug: "master-settings", name: "Governance Rules", kind: "settings", dataset: "policies", summary: "Ownership and stewardship" },
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────
  {
    id: 5,
    slug: "ai-center",
    name: "AI Intelligence & Automation Center",
    short: "AI Center",
    icon: "Bot",
    group: "intelligence",
    tone: 7,
    live: true,
    badge: 6,
    description:
      "Forecasting, anomaly detection, copilots and automation agents across every module.",
    submodules: [
      { slug: "insight-feed", name: "AI Insight Feed", kind: "overview", dataset: "ai-insights", summary: "Ranked business insights" },
      { slug: "demand-forecast", name: "Demand Forecasting", kind: "analytics", dataset: "forecasts", summary: "Order and volume projection" },
      { slug: "forecast-accuracy", name: "Forecast Accuracy", kind: "analytics", dataset: "forecasts", summary: "Predicted against actual" },
      { slug: "price-optimizer", name: "Price Optimizer", kind: "analytics", dataset: "quotations", summary: "Margin-aware quoting" },
      { slug: "anomaly-detection", name: "Anomaly Detection", kind: "analytics", dataset: "anomalies", summary: "Outliers across streams" },
      { slug: "anomaly-queue", name: "Anomaly Triage", kind: "board", dataset: "anomalies", summary: "Investigate and close" },
      { slug: "defect-vision", name: "Vision Defect Detection", kind: "analytics", dataset: "inspections", summary: "Camera-based QC" },
      { slug: "predictive-maintenance", name: "Predictive Maintenance", kind: "analytics", dataset: "maintenance-jobs", summary: "Failure risk scoring" },
      { slug: "copilot", name: "ERP Copilot", kind: "overview", dataset: "ai-insights", summary: "Ask anything across modules" },
      { slug: "automation-flows", name: "Automation Flows", kind: "board", dataset: "automations", summary: "Trigger-action agents" },
      { slug: "automation-runs", name: "Automation Run Log", kind: "list", dataset: "automations", summary: "Executions and failures" },
      { slug: "model-registry", name: "Model Registry", kind: "list", dataset: "ai-models", summary: "Deployed models and versions" },
      { slug: "training-jobs", name: "Training Jobs", kind: "list", dataset: "ai-models", summary: "Retraining runs" },
      { slug: "model-monitoring", name: "Model Monitoring", kind: "analytics", dataset: "ai-models", summary: "Drift and accuracy" },
      { slug: "recommendation-log", name: "Recommendation Log", kind: "list", dataset: "ai-insights", summary: "What the AI suggested" },
      { slug: "impact-tracker", name: "Impact Tracker", kind: "analytics", dataset: "ai-insights", summary: "Value delivered" },
      { slug: "data-pipelines", name: "Data Pipelines", kind: "list", dataset: "integrations", summary: "Feeds into the models" },
      { slug: "ai-alerts", name: "AI Alert Rules", kind: "list", dataset: "alert-rules", summary: "When to notify a human" },
      { slug: "ai-governance", name: "AI Governance", kind: "settings", dataset: "policies", summary: "Guardrails and approvals" },
      { slug: "ai-calendar", name: "Model Schedule", kind: "calendar", dataset: "automations", summary: "Runs and retraining dates" },
    ],
  },

  // ── 6 ──────────────────────────────────────────────────────────────────
  {
    id: 6,
    slug: "crm-marketing",
    name: "CRM & Marketing Management",
    short: "CRM & Marketing",
    icon: "Users",
    group: "sales",
    tone: 5,
    description:
      "Accounts, contacts, pipeline, campaigns and buyer relationship health in one place.",
    submodules: [
      { slug: "crm-dashboard", name: "CRM Dashboard", kind: "overview", dataset: "leads", summary: "Pipeline health at a glance" },
      { slug: "accounts", name: "Buyer Accounts", kind: "list", dataset: "customers", summary: "Key accounts and groups" },
      { slug: "contacts", name: "Contacts", kind: "list", dataset: "contacts", summary: "People and roles" },
      { slug: "pipeline", name: "Opportunity Pipeline", kind: "board", dataset: "opportunities", summary: "Stage-wise deals" },
      { slug: "opportunities", name: "Opportunity Register", kind: "list", dataset: "opportunities", summary: "Value and probability" },
      { slug: "activities", name: "Activities & Follow-ups", kind: "calendar", dataset: "crm-activities", summary: "Calls, visits, meetings" },
      { slug: "activity-log", name: "Activity Log", kind: "list", dataset: "crm-activities", summary: "Everything logged" },
      { slug: "campaigns", name: "Marketing Campaigns", kind: "list", dataset: "campaigns", summary: "Multi-channel campaigns" },
      { slug: "marketing-budget", name: "Marketing Budget", kind: "analytics", dataset: "campaigns", summary: "Spend against return" },
      { slug: "segments", name: "Buyer Segmentation", kind: "analytics", dataset: "customers", summary: "Value tiers and mix" },
      { slug: "visit-plans", name: "Visit Plans", kind: "calendar", dataset: "crm-activities", summary: "Field visit scheduling" },
      { slug: "buyer-360", name: "Buyer 360 View", kind: "analytics", dataset: "customers", summary: "Everything about one buyer" },
      { slug: "satisfaction", name: "Satisfaction & Claims", kind: "analytics", dataset: "complaints", summary: "How buyers rate us" },
      { slug: "complaints", name: "Complaint Register", kind: "list", dataset: "complaints", summary: "Issues raised by buyers" },
      { slug: "competitor-tracking", name: "Competitor Tracking", kind: "list", dataset: "opportunities", summary: "Win/loss intelligence" },
      { slug: "win-loss", name: "Win / Loss Analysis", kind: "analytics", dataset: "opportunities", summary: "Why deals close" },
      { slug: "trade-shows", name: "Trade Shows & Events", kind: "calendar", dataset: "campaigns", summary: "Exhibition planning" },
      { slug: "account-plans", name: "Account Plans", kind: "board", dataset: "customers", summary: "Growth plan per buyer" },
      { slug: "crm-reports", name: "CRM Reports", kind: "analytics", dataset: "reports", summary: "Scheduled sales reporting" },
      { slug: "crm-settings", name: "CRM Settings", kind: "settings", dataset: "policies", summary: "Routing and stage rules" },
    ],
  },

  // ── 7 ──────────────────────────────────────────────────────────────────
  {
    id: 7,
    slug: "ai-document-input",
    name: "AI Document Input & Smart Data Processing",
    short: "AI Document Input",
    icon: "FileText",
    group: "master-data",
    tone: 4,
    badge: 12,
    description:
      "Drop a PDF, sheet or email — OCR, extraction and validation turn it into ERP records.",
    submodules: [
      { slug: "processing-dashboard", name: "Processing Dashboard", kind: "overview", dataset: "doc-extractions", summary: "Throughput and accuracy" },
      { slug: "upload-center", name: "Upload Center", kind: "form", dataset: "doc-extractions", summary: "Drop files or forward mail" },
      { slug: "ocr-queue", name: "OCR Processing Queue", kind: "list", dataset: "doc-extractions", summary: "Jobs in flight" },
      { slug: "extraction-templates", name: "Extraction Templates", kind: "list", dataset: "doc-extractions", summary: "Per-document layouts" },
      { slug: "sheet-mapper", name: "Excel Sheet Mapper", kind: "form", dataset: "doc-extractions", summary: "Column-to-field mapping" },
      { slug: "validation-queue", name: "Validation Queue", kind: "board", dataset: "doc-extractions", summary: "Human-in-the-loop review" },
      { slug: "auto-po-capture", name: "Auto PO Capture", kind: "list", dataset: "doc-extractions", summary: "Buyer POs to sales orders" },
      { slug: "email-parser", name: "Email Parser", kind: "list", dataset: "doc-extractions", summary: "Inbox to structured data" },
      { slug: "confidence-report", name: "Confidence Report", kind: "analytics", dataset: "doc-extractions", summary: "Extraction accuracy" },
      { slug: "accuracy-trend", name: "Accuracy Trend", kind: "analytics", dataset: "doc-extractions", summary: "Improvement over time" },
      { slug: "exception-handling", name: "Exception Handling", kind: "board", dataset: "doc-extractions", summary: "Failed extractions" },
      { slug: "document-register", name: "Document Register", kind: "list", dataset: "documents", summary: "Everything captured" },
      { slug: "scan-devices", name: "Scanners & Devices", kind: "list", dataset: "devices", summary: "Capture hardware" },
      { slug: "batch-jobs", name: "Batch Jobs", kind: "list", dataset: "automations", summary: "Scheduled processing" },
      { slug: "duplicate-detection", name: "Duplicate Detection", kind: "analytics", dataset: "data-quality", summary: "Same document twice" },
      { slug: "approval-routing", name: "Approval Routing", kind: "board", dataset: "approvals", summary: "Where captured data goes" },
      { slug: "extraction-models", name: "Extraction Models", kind: "list", dataset: "ai-models", summary: "OCR and parsing models" },
      { slug: "archive", name: "Document Archive", kind: "list", dataset: "documents", summary: "Retention and retrieval" },
      { slug: "processing-rules", name: "Processing Rules", kind: "settings", dataset: "policies", summary: "Routing and thresholds" },
      { slug: "capture-audit", name: "Capture Audit Trail", kind: "list", dataset: "audit-log", summary: "Who corrected what" },
    ],
  },

  // ── 8 ──────────────────────────────────────────────────────────────────
  {
    id: 8,
    slug: "inquiry-lead",
    name: "Inquiry & Lead Management",
    short: "Inquiry & Lead",
    icon: "Inbox",
    group: "sales",
    tone: 1,
    badge: 18,
    description:
      "Capture, qualify and route every buyer inquiry until it becomes a costed opportunity.",
    submodules: [
      { slug: "inquiry-dashboard", name: "Inquiry Dashboard", kind: "overview", dataset: "inquiries", summary: "Volume, value and ageing" },
      { slug: "inquiry-register", name: "Inquiry Register", kind: "list", dataset: "inquiries", summary: "All incoming inquiries" },
      { slug: "new-inquiry", name: "New Inquiry", kind: "form", dataset: "inquiries", summary: "Capture buyer requirement" },
      { slug: "lead-register", name: "Lead Register", kind: "list", dataset: "leads", summary: "Prospects being worked" },
      { slug: "qualification", name: "Lead Qualification", kind: "board", dataset: "leads", summary: "New to qualified" },
      { slug: "lead-scoring", name: "Lead Scoring", kind: "analytics", dataset: "leads", summary: "AI-ranked leads" },
      { slug: "source-tracking", name: "Source Tracking", kind: "analytics", dataset: "leads", summary: "Channel effectiveness" },
      { slug: "assignment", name: "Assignment & Routing", kind: "settings", dataset: "policies", summary: "Merchandiser allocation" },
      { slug: "feasibility", name: "Feasibility Check", kind: "form", dataset: "inquiries", summary: "Can we make it?" },
      { slug: "buyer-requirements", name: "Buyer Requirements", kind: "list", dataset: "inquiries", summary: "Specs behind each inquiry" },
      { slug: "target-price", name: "Target Price Analysis", kind: "analytics", dataset: "inquiries", summary: "Asked against achievable" },
      { slug: "conversion-funnel", name: "Conversion Funnel", kind: "analytics", dataset: "leads", summary: "Inquiry to order" },
      { slug: "response-sla", name: "Response SLA", kind: "analytics", dataset: "inquiries", summary: "Turnaround tracking" },
      { slug: "follow-ups", name: "Follow-up Calendar", kind: "calendar", dataset: "crm-activities", summary: "Next touch per lead" },
      { slug: "sample-linked", name: "Sample-linked Inquiries", kind: "list", dataset: "samples", summary: "Inquiries needing samples" },
      { slug: "lost-analysis", name: "Lost Inquiry Analysis", kind: "analytics", dataset: "inquiries", summary: "Why we lost" },
      { slug: "inquiry-approvals", name: "Inquiry Approvals", kind: "board", dataset: "approvals", summary: "Sign-off before quoting" },
      { slug: "merchandiser-load", name: "Merchandiser Load", kind: "analytics", dataset: "inquiries", summary: "Work spread per owner" },
      { slug: "inquiry-archive", name: "Inquiry Archive", kind: "list", dataset: "inquiries", summary: "Closed and dormant" },
      { slug: "inquiry-settings", name: "Inquiry Settings", kind: "settings", dataset: "policies", summary: "Stages and SLA rules" },
    ],
  },

  // ── 9 ──────────────────────────────────────────────────────────────────
  {
    id: 9,
    slug: "quotation-costing",
    name: "Quotation & Costing Management",
    short: "Quotation & Costing",
    icon: "Calculator",
    group: "sales",
    tone: 2,
    badge: 9,
    description:
      "Build defensible costs from BOM, process and overhead, then quote with confidence.",
    submodules: [
      { slug: "quotation-dashboard", name: "Quotation Dashboard", kind: "overview", dataset: "quotations", summary: "Value, margin and hit rate" },
      { slug: "quotations", name: "Quotation Register", kind: "list", dataset: "quotations", summary: "All quotes and revisions" },
      { slug: "new-quotation", name: "Create Quotation", kind: "form", dataset: "quotations", summary: "Line-wise pricing" },
      { slug: "cost-sheet", name: "Cost Sheet Builder", kind: "form", dataset: "cost-sheets", summary: "Material + process + overhead" },
      { slug: "cost-sheets", name: "Cost Sheet Register", kind: "list", dataset: "cost-sheets", summary: "Costings on file" },
      { slug: "material-cost", name: "Material Costing", kind: "analytics", dataset: "bom-lines", summary: "Metal, plating, packing" },
      { slug: "process-cost", name: "Process Costing", kind: "analytics", dataset: "routings", summary: "Machine and labour rates" },
      { slug: "overhead-allocation", name: "Overhead Allocation", kind: "settings", dataset: "policies", summary: "Absorption rules" },
      { slug: "margin-analysis", name: "Margin Analysis", kind: "analytics", dataset: "quotations", summary: "Quote vs target margin" },
      { slug: "price-list", name: "Price Lists", kind: "list", dataset: "price-lists", summary: "Buyer-wise agreed prices" },
      { slug: "competitor-price", name: "Competitor Pricing", kind: "list", dataset: "price-lists", summary: "Market reference points" },
      { slug: "approval-matrix", name: "Approval Matrix", kind: "settings", dataset: "policies", summary: "Discount authority" },
      { slug: "discount-approvals", name: "Discount Approvals", kind: "board", dataset: "approvals", summary: "Below-floor requests" },
      { slug: "quote-comparison", name: "Quote Comparison", kind: "analytics", dataset: "quotations", summary: "Revision vs revision" },
      { slug: "revisions", name: "Quotation Revisions", kind: "list", dataset: "quotations", summary: "Change history" },
      { slug: "validity-monitor", name: "Validity Monitor", kind: "list", dataset: "quotations", summary: "Expiring quotes" },
      { slug: "win-rate", name: "Win Rate Analytics", kind: "analytics", dataset: "quotations", summary: "Hit rate by buyer" },
      { slug: "currency-impact", name: "Currency Impact", kind: "analytics", dataset: "currency-rates", summary: "FX effect on price" },
      { slug: "costing-templates", name: "Costing Templates", kind: "list", dataset: "cost-sheets", summary: "Reusable structures" },
      { slug: "quotation-reports", name: "Quotation Reports", kind: "analytics", dataset: "reports", summary: "Scheduled pricing reports" },
    ],
  },

  // ── 10 ─────────────────────────────────────────────────────────────────
  {
    id: 10,
    slug: "proforma-invoice",
    name: "Proforma Invoice (PI) Management",
    short: "Proforma Invoice",
    icon: "FileSpreadsheet",
    group: "sales",
    tone: 3,
    badge: 24,
    description:
      "The full proforma invoice desk — AI import and validation, PI entry and register, commercial and shipping terms, approval, revision and amendment control, compliance, reporting and business intelligence.",
    submodules: submodulesOf(WORKSPACE_SPECS["proforma-invoice"]),
  },

  // ── 11 ─────────────────────────────────────────────────────────────────
  {
    id: 11,
    slug: "sales-order",
    name: "Sales Order Management",
    short: "Sales Orders",
    icon: "ClipboardList",
    group: "sales",
    tone: 1,
    badge: 24,
    live: true,
    description:
      "The order book — confirmation, amendments, allocation and delivery commitment tracking.",
    submodules: [
      { slug: "order-book", name: "Order Book", kind: "list", dataset: "sales-orders", summary: "Every live sales order" },
      { slug: "create-order", name: "Create Sales Order", kind: "form", dataset: "sales-orders", summary: "Confirm buyer PO" },
      { slug: "order-status", name: "Order Status Board", kind: "board", dataset: "sales-orders", summary: "Stage-wise progress" },
      { slug: "order-lines", name: "Order Lines", kind: "list", dataset: "order-lines", summary: "Colour and size breakdown" },
      { slug: "amendments", name: "Order Amendments", kind: "list", dataset: "sales-orders", summary: "Qty, price and date changes" },
      { slug: "delivery-schedule", name: "Delivery Schedule", kind: "calendar", dataset: "delivery-schedule", summary: "Shipment commitments" },
      { slug: "order-allocation", name: "Stock Allocation", kind: "list", dataset: "stock-items", summary: "Reserve against orders" },
      { slug: "backlog", name: "Backlog Analysis", kind: "analytics", dataset: "sales-orders", summary: "Overdue and at-risk" },
      { slug: "otif", name: "OTIF Performance", kind: "analytics", dataset: "delivery-schedule", summary: "On-time in-full" },
      { slug: "order-value", name: "Order Value Analytics", kind: "analytics", dataset: "sales-orders", summary: "By buyer, country, product" },
      { slug: "cancellations", name: "Cancellations & Holds", kind: "list", dataset: "sales-orders", summary: "Blocked orders" },
      { slug: "acknowledgement", name: "Order Acknowledgement", kind: "list", dataset: "sales-orders", summary: "Buyer confirmations" },
      { slug: "buyer-po-capture", name: "Buyer PO Capture", kind: "form", dataset: "sales-orders", summary: "Turn a buyer PO into an order" },
      { slug: "production-linkage", name: "Production Linkage", kind: "list", dataset: "production-plans", summary: "Which plan covers the order" },
      { slug: "shipment-readiness", name: "Shipment Readiness", kind: "analytics", dataset: "fg-stock", summary: "Packed and ready" },
      { slug: "order-costing", name: "Order Costing", kind: "analytics", dataset: "cost-sheets", summary: "Planned against actual" },
      { slug: "credit-check", name: "Credit Check", kind: "analytics", dataset: "customers", summary: "Exposure per buyer" },
      { slug: "order-approvals", name: "Order Approvals", kind: "board", dataset: "approvals", summary: "Commercial sign-off" },
      { slug: "order-calendar", name: "Order Calendar", kind: "calendar", dataset: "sales-orders", summary: "Delivery dates in view" },
      { slug: "order-settings", name: "Order Settings", kind: "settings", dataset: "policies", summary: "Tolerance and hold rules" },
    ],
  },

  // ── 12 ─────────────────────────────────────────────────────────────────
  {
    id: 12,
    slug: "product-development",
    name: "Product Development (R&D)",
    short: "Product Development",
    icon: "FlaskConical",
    group: "product",
    tone: 7,
    description:
      "Idea to validated product — concepts, trials, material research and design freeze.",
    submodules: [
      { slug: "dev-dashboard", name: "Development Dashboard", kind: "overview", dataset: "dev-projects", summary: "Portfolio at a glance" },
      { slug: "projects", name: "Development Projects", kind: "list", dataset: "dev-projects", summary: "Active R&D programmes" },
      { slug: "concepts", name: "Concept Library", kind: "list", dataset: "dev-projects", summary: "Idea backlog" },
      { slug: "stage-gate", name: "Stage-Gate Review", kind: "board", dataset: "dev-projects", summary: "Gate approvals" },
      { slug: "trials", name: "Trial Runs", kind: "list", dataset: "die-trials", summary: "Pilot batches" },
      { slug: "material-research", name: "Material Research", kind: "list", dataset: "items", summary: "Alloy and coating studies" },
      { slug: "prototype-log", name: "Prototype Log", kind: "list", dataset: "samples", summary: "Physical prototypes" },
      { slug: "test-results", name: "Test Results", kind: "analytics", dataset: "lab-tests", summary: "Trial performance" },
      { slug: "innovation-pipeline", name: "Innovation Pipeline", kind: "analytics", dataset: "dev-projects", summary: "Portfolio health" },
      { slug: "feasibility-studies", name: "Feasibility Studies", kind: "list", dataset: "dev-projects", summary: "Can it be made at cost?" },
      { slug: "buyer-briefs", name: "Buyer Briefs", kind: "list", dataset: "inquiries", summary: "What buyers asked for" },
      { slug: "design-reviews", name: "Design Reviews", kind: "board", dataset: "approvals", summary: "Cross-function sign-off" },
      { slug: "dev-budget", name: "Development Budget", kind: "analytics", dataset: "dev-projects", summary: "Spend against approval" },
      { slug: "costing-new-product", name: "New Product Costing", kind: "analytics", dataset: "cost-sheets", summary: "First-cut cost" },
      { slug: "supplier-collaboration", name: "Supplier Collaboration", kind: "list", dataset: "suppliers", summary: "Co-development partners" },
      { slug: "dev-calendar", name: "Development Calendar", kind: "calendar", dataset: "dev-projects", summary: "Gates and target dates" },
      { slug: "launch-plan", name: "Launch Plan", kind: "calendar", dataset: "product-versions", summary: "Release runway" },
      { slug: "ip-register", name: "IP & Patent Register", kind: "list", dataset: "documents", summary: "Protected designs" },
      { slug: "lessons-learned", name: "Lessons Learned", kind: "list", dataset: "tasks", summary: "Post-project actions" },
      { slug: "dev-settings", name: "R&D Settings", kind: "settings", dataset: "policies", summary: "Gate criteria and owners" },
    ],
  },

  // ── 13 ─────────────────────────────────────────────────────────────────
  {
    id: 13,
    slug: "plm",
    name: "Product Lifecycle Management (PLM)",
    short: "PLM",
    icon: "Tags",
    group: "product",
    tone: 3,
    description:
      "Versioned product records from launch through revision to end-of-life.",
    submodules: [
      { slug: "plm-dashboard", name: "PLM Dashboard", kind: "overview", dataset: "product-versions", summary: "Portfolio by lifecycle" },
      { slug: "product-catalog", name: "Product Catalog", kind: "list", dataset: "product-versions", summary: "All accessory products" },
      { slug: "revisions", name: "Revision Control", kind: "list", dataset: "product-versions", summary: "Version history" },
      { slug: "change-requests", name: "Engineering Change Requests", kind: "board", dataset: "ecn", summary: "ECR workflow" },
      { slug: "change-orders", name: "Engineering Change Orders", kind: "list", dataset: "ecn", summary: "Approved ECOs" },
      { slug: "change-impact", name: "Change Impact", kind: "analytics", dataset: "ecn", summary: "Cost and schedule effect" },
      { slug: "lifecycle-status", name: "Lifecycle Status", kind: "analytics", dataset: "product-versions", summary: "Launch to EOL" },
      { slug: "variants", name: "Variant Management", kind: "list", dataset: "items", summary: "Size / finish variants" },
      { slug: "specifications", name: "Product Specifications", kind: "list", dataset: "tech-specs", summary: "Technical datasheets" },
      { slug: "bom-versions", name: "BOM Versions", kind: "list", dataset: "bom-headers", summary: "Structure per revision" },
      { slug: "drawing-links", name: "Linked Drawings", kind: "list", dataset: "drawings", summary: "Engineering references" },
      { slug: "approval-workflow", name: "Release Approvals", kind: "board", dataset: "approvals", summary: "Who releases a version" },
      { slug: "phase-out", name: "Phase-out Planning", kind: "calendar", dataset: "product-versions", summary: "EOL runway" },
      { slug: "obsolescence", name: "Obsolescence Watch", kind: "list", dataset: "items", summary: "Items going out of use" },
      { slug: "portfolio-analysis", name: "Portfolio Analysis", kind: "analytics", dataset: "product-versions", summary: "Revenue by lifecycle" },
      { slug: "product-costs", name: "Product Cost Trend", kind: "analytics", dataset: "cost-sheets", summary: "Cost across revisions" },
      { slug: "compliance-status", name: "Compliance Status", kind: "analytics", dataset: "compliance-audits", summary: "Standards per product" },
      { slug: "launch-tracker", name: "Launch Tracker", kind: "calendar", dataset: "product-versions", summary: "Go-live dates" },
      { slug: "documentation", name: "Product Documentation", kind: "list", dataset: "documents", summary: "Datasheets and manuals" },
      { slug: "plm-settings", name: "PLM Settings", kind: "settings", dataset: "policies", summary: "Version and release rules" },
    ],
  },

  // ── 14 ─────────────────────────────────────────────────────────────────
  {
    id: 14,
    slug: "sample-management",
    name: "Sample Management",
    short: "Sample Management",
    icon: "Shirt",
    group: "product",
    tone: 5,
    badge: 15,
    description:
      "Every sample request, development round and buyer approval, tracked to a decision.",
    submodules: [
      { slug: "sample-dashboard", name: "Sample Dashboard", kind: "overview", dataset: "samples", summary: "Pipeline and approval rate" },
      { slug: "sample-requests", name: "Sample Requests", kind: "list", dataset: "samples", summary: "Incoming requests" },
      { slug: "new-request", name: "New Sample Request", kind: "form", dataset: "samples", summary: "Raise a development round" },
      { slug: "development", name: "Sample Development", kind: "board", dataset: "samples", summary: "In-progress rounds" },
      { slug: "approval-tracking", name: "Approval Tracking", kind: "list", dataset: "samples", summary: "Buyer verdicts" },
      { slug: "sample-calendar", name: "Sample Calendar", kind: "calendar", dataset: "samples", summary: "Due dates per round" },
      { slug: "sample-costing", name: "Sample Costing", kind: "analytics", dataset: "cost-sheets", summary: "Cost per sample" },
      { slug: "sample-charges", name: "Sample Charges", kind: "list", dataset: "invoices", summary: "Billed to the buyer" },
      { slug: "dispatch", name: "Sample Dispatch", kind: "list", dataset: "shipments", summary: "Courier and tracking" },
      { slug: "courier-tracking", name: "Courier Tracking", kind: "analytics", dataset: "shipments", summary: "In-transit samples" },
      { slug: "sample-library", name: "Physical Sample Library", kind: "list", dataset: "samples", summary: "Shelf locations" },
      { slug: "sample-inventory", name: "Sample Inventory", kind: "list", dataset: "stock-items", summary: "Stock held for samples" },
      { slug: "sample-artwork", name: "Sample Artwork", kind: "list", dataset: "artworks", summary: "Artwork per round" },
      { slug: "lead-time", name: "Sample Lead Time", kind: "analytics", dataset: "samples", summary: "Request to dispatch" },
      { slug: "hit-rate", name: "Approval Hit Rate", kind: "analytics", dataset: "samples", summary: "First-time-right" },
      { slug: "rejection-reasons", name: "Rejection Reasons", kind: "analytics", dataset: "samples", summary: "Why samples fail" },
      { slug: "buyer-feedback", name: "Buyer Feedback", kind: "list", dataset: "complaints", summary: "Comments to action" },
      { slug: "repeat-samples", name: "Repeat Samples", kind: "list", dataset: "samples", summary: "Second and third rounds" },
      { slug: "sample-approvals", name: "Internal Approvals", kind: "board", dataset: "approvals", summary: "Before it leaves the factory" },
      { slug: "sample-settings", name: "Sample Settings", kind: "settings", dataset: "policies", summary: "Free-issue limits" },
    ],
  },

  // ── 15 ─────────────────────────────────────────────────────────────────
  {
    id: 15,
    slug: "artwork-design",
    name: "Artwork & Design Management",
    short: "Artwork & Design",
    icon: "Palette",
    group: "product",
    tone: 5,
    description:
      "Logos, engravings and print artwork with versioning and buyer sign-off.",
    submodules: [
      { slug: "artwork-dashboard", name: "Artwork Dashboard", kind: "overview", dataset: "artworks", summary: "Where every artwork stands" },
      { slug: "artwork-library", name: "Artwork Library", kind: "list", dataset: "artworks", summary: "All approved artwork" },
      { slug: "design-requests", name: "Design Requests", kind: "list", dataset: "artworks", summary: "New artwork briefs" },
      { slug: "version-control", name: "Artwork Versions", kind: "list", dataset: "artworks", summary: "Revision trail" },
      { slug: "approval-workflow", name: "Approval Workflow", kind: "board", dataset: "artworks", summary: "Internal and buyer sign-off" },
      { slug: "proof-approvals", name: "Proof Approvals", kind: "board", dataset: "approvals", summary: "Final proof sign-off" },
      { slug: "logo-register", name: "Buyer Logo Register", kind: "list", dataset: "artworks", summary: "Brand marks in use" },
      { slug: "brand-guidelines", name: "Brand Guidelines", kind: "list", dataset: "documents", summary: "Buyer artwork rules" },
      { slug: "color-separation", name: "Colour Separation", kind: "form", dataset: "artworks", summary: "Print-ready output" },
      { slug: "color-master", name: "Colour & Finish Master", kind: "list", dataset: "items", summary: "Approved finishes" },
      { slug: "print-specs", name: "Print Specifications", kind: "list", dataset: "tech-specs", summary: "Engraving and print detail" },
      { slug: "die-artwork-link", name: "Die ↔ Artwork Link", kind: "list", dataset: "dies", summary: "Tooling references" },
      { slug: "template-library", name: "Template Library", kind: "list", dataset: "artworks", summary: "Reusable layouts" },
      { slug: "design-calendar", name: "Design Calendar", kind: "calendar", dataset: "artworks", summary: "Submission deadlines" },
      { slug: "designer-workload", name: "Designer Workload", kind: "analytics", dataset: "artworks", summary: "Who is working on what" },
      { slug: "asset-usage", name: "Asset Usage Report", kind: "analytics", dataset: "artworks", summary: "Where artwork is used" },
      { slug: "rejected-artworks", name: "Rejected Artwork", kind: "list", dataset: "artworks", summary: "Sent back for revision" },
      { slug: "artwork-costs", name: "Artwork Costs", kind: "analytics", dataset: "cost-sheets", summary: "Design and plate cost" },
      { slug: "artwork-archive", name: "Artwork Archive", kind: "list", dataset: "documents", summary: "Retired files" },
      { slug: "artwork-settings", name: "Artwork Settings", kind: "settings", dataset: "policies", summary: "Naming and approval rules" },
    ],
  },

  // ── 16 ─────────────────────────────────────────────────────────────────
  {
    id: 16,
    slug: "engineering",
    name: "Engineering Management",
    short: "Engineering",
    icon: "Cog",
    group: "product",
    tone: 1,
    description:
      "Drawings, technical specs, tolerances and manufacturability sign-off.",
    submodules: [
      { slug: "engineering-dashboard", name: "Engineering Dashboard", kind: "overview", dataset: "drawings", summary: "Drawing and change load" },
      { slug: "drawings", name: "Drawing Register", kind: "list", dataset: "drawings", summary: "2D / 3D drawing control" },
      { slug: "cad-library", name: "CAD Library", kind: "list", dataset: "drawings", summary: "Source files by product" },
      { slug: "revision-history", name: "Drawing Revisions", kind: "list", dataset: "drawings", summary: "Who changed what" },
      { slug: "drawing-approvals", name: "Drawing Approvals", kind: "board", dataset: "approvals", summary: "Check and release" },
      { slug: "tech-specs", name: "Technical Specifications", kind: "list", dataset: "tech-specs", summary: "Dimensional standards" },
      { slug: "tolerances", name: "Tolerance Standards", kind: "list", dataset: "tech-specs", summary: "Accepted deviation" },
      { slug: "material-standards", name: "Material Standards", kind: "list", dataset: "items", summary: "Approved grades" },
      { slug: "dfm-review", name: "DFM Review", kind: "board", dataset: "ecn", summary: "Design for manufacturability" },
      { slug: "engineering-changes", name: "Engineering Changes", kind: "list", dataset: "ecn", summary: "Change register" },
      { slug: "change-impact", name: "Change Impact", kind: "analytics", dataset: "ecn", summary: "What a change costs" },
      { slug: "process-sheets", name: "Process Sheets", kind: "list", dataset: "routings", summary: "Operation instructions" },
      { slug: "time-study", name: "Time Study", kind: "analytics", dataset: "routings", summary: "Standard time per operation" },
      { slug: "capacity-study", name: "Capacity Study", kind: "analytics", dataset: "work-centers", summary: "Machine feasibility" },
      { slug: "fixture-design", name: "Fixture & Jig Design", kind: "list", dataset: "tools", summary: "Shop-floor aids" },
      { slug: "validation-tests", name: "Validation Tests", kind: "list", dataset: "lab-tests", summary: "Engineering trials" },
      { slug: "standards-library", name: "Standards Library", kind: "list", dataset: "documents", summary: "ISO / ASTM references" },
      { slug: "engineering-tasks", name: "Engineering Tasks", kind: "calendar", dataset: "tasks", summary: "Assignments and due dates" },
      { slug: "engineer-workload", name: "Engineer Workload", kind: "analytics", dataset: "tasks", summary: "Balance across the team" },
      { slug: "engineering-settings", name: "Engineering Settings", kind: "settings", dataset: "policies", summary: "Numbering and release rules" },
    ],
  },

  // ── 17 ─────────────────────────────────────────────────────────────────
  {
    id: 17,
    slug: "tool-room",
    name: "Tool Room Management",
    short: "Tool Room",
    icon: "Wrench",
    group: "product",
    tone: 4,
    description:
      "Tool inventory, issue-return, sharpening cycles and tool life economics.",
    submodules: [
      { slug: "toolroom-dashboard", name: "Tool Room Dashboard", kind: "overview", dataset: "tools", summary: "Availability and jobs" },
      { slug: "tool-register", name: "Tool Register", kind: "list", dataset: "tools", summary: "Every tool and its state" },
      { slug: "issue-return", name: "Issue & Return", kind: "list", dataset: "tools", summary: "Shop-floor movement" },
      { slug: "tool-jobs", name: "Tool Room Jobs", kind: "board", dataset: "tool-jobs", summary: "New, repair and modification" },
      { slug: "tool-requests", name: "Tool Requests", kind: "list", dataset: "tool-jobs", summary: "New tool demand" },
      { slug: "tool-life", name: "Tool Life Tracking", kind: "analytics", dataset: "tools", summary: "Strokes vs rated life" },
      { slug: "sharpening", name: "Sharpening Schedule", kind: "calendar", dataset: "tool-jobs", summary: "Regrind planning" },
      { slug: "tool-maintenance", name: "Tool Maintenance", kind: "calendar", dataset: "maintenance-jobs", summary: "Preventive servicing" },
      { slug: "calibration", name: "Tool Calibration", kind: "list", dataset: "maintenance-jobs", summary: "Measurement tools" },
      { slug: "tool-store", name: "Tool Store & Crib", kind: "list", dataset: "warehouse-locations", summary: "Where tools live" },
      { slug: "spare-parts", name: "Tool Spare Parts", kind: "list", dataset: "stock-items", summary: "Punches, springs, inserts" },
      { slug: "vendor-tooling", name: "Vendor Tooling", kind: "list", dataset: "suppliers", summary: "Outsourced tools" },
      { slug: "tool-drawings", name: "Tool Drawings", kind: "list", dataset: "drawings", summary: "Tool design references" },
      { slug: "machine-mapping", name: "Machine Mapping", kind: "list", dataset: "work-centers", summary: "Which tool runs where" },
      { slug: "tool-cost", name: "Tool Cost Analysis", kind: "analytics", dataset: "tool-jobs", summary: "Cost per 1000 pcs" },
      { slug: "downtime-impact", name: "Downtime Impact", kind: "analytics", dataset: "maintenance-jobs", summary: "Production lost to tooling" },
      { slug: "tool-scrap", name: "Scrapped Tools", kind: "list", dataset: "scrap-entries", summary: "Retired and written off" },
      { slug: "tool-approvals", name: "Tool Approvals", kind: "board", dataset: "approvals", summary: "New tool sanction" },
      { slug: "toolroom-manpower", name: "Tool Room Manpower", kind: "analytics", dataset: "employees", summary: "Skills and coverage" },
      { slug: "toolroom-settings", name: "Tool Room Settings", kind: "settings", dataset: "policies", summary: "Issue and life rules" },
    ],
  },

  // ── 18 ─────────────────────────────────────────────────────────────────
  {
    id: 18,
    slug: "die-mold",
    name: "Die & Mold Management",
    short: "Die & Mold",
    icon: "Hammer",
    group: "product",
    tone: 2,
    description:
      "Die master, shot counts, maintenance and buyer-owned tooling accountability.",
    submodules: [
      { slug: "die-dashboard", name: "Die Dashboard", kind: "overview", dataset: "dies", summary: "Life, location and status" },
      { slug: "die-master", name: "Die & Mold Master", kind: "list", dataset: "dies", summary: "All dies with location" },
      { slug: "die-development", name: "Die Development", kind: "board", dataset: "tool-jobs", summary: "New die projects" },
      { slug: "shot-count", name: "Shot Count Monitor", kind: "analytics", dataset: "dies", summary: "Usage against life" },
      { slug: "die-maintenance", name: "Die Maintenance", kind: "calendar", dataset: "maintenance-jobs", summary: "Preventive schedule" },
      { slug: "die-repair", name: "Die Repair Jobs", kind: "board", dataset: "tool-jobs", summary: "Breakdown recovery" },
      { slug: "die-trial", name: "Die Trial Records", kind: "list", dataset: "die-trials", summary: "First-article results" },
      { slug: "cavity-performance", name: "Cavity Performance", kind: "analytics", dataset: "die-trials", summary: "Rejection by cavity" },
      { slug: "ownership", name: "Ownership Register", kind: "list", dataset: "dies", summary: "Buyer-owned vs in-house" },
      { slug: "die-issue", name: "Die Issue & Return", kind: "list", dataset: "tools", summary: "Movement to the press" },
      { slug: "storage-map", name: "Die Storage Map", kind: "analytics", dataset: "warehouse-locations", summary: "Rack and bin layout" },
      { slug: "die-drawings", name: "Die Drawings", kind: "list", dataset: "drawings", summary: "Design and layout files" },
      { slug: "die-spares", name: "Die Spares", kind: "list", dataset: "stock-items", summary: "Inserts and punches" },
      { slug: "die-cost", name: "Die Cost & Amortisation", kind: "analytics", dataset: "tool-jobs", summary: "Recovery per order" },
      { slug: "die-vendor", name: "Die Vendors", kind: "list", dataset: "suppliers", summary: "External die makers" },
      { slug: "die-calendar", name: "Die Service Calendar", kind: "calendar", dataset: "maintenance-jobs", summary: "Servicing timeline" },
      { slug: "die-approvals", name: "Die Approvals", kind: "board", dataset: "approvals", summary: "Sanction and release" },
      { slug: "scrapped-dies", name: "Scrapped Dies", kind: "list", dataset: "dies", summary: "Retired tooling" },
      { slug: "die-audit", name: "Die Audit Trail", kind: "list", dataset: "audit-log", summary: "Custody and changes" },
      { slug: "die-settings", name: "Die Settings", kind: "settings", dataset: "policies", summary: "Life and maintenance rules" },
    ],
  },

  // ── 19 ─────────────────────────────────────────────────────────────────
  {
    id: 19,
    slug: "bom",
    name: "Bill of Materials (BOM) Management",
    short: "BOM",
    icon: "ListTree",
    group: "product",
    tone: 3,
    description:
      "Multi-level BOMs with alternates, wastage factors and costed roll-ups.",
    submodules: [
      { slug: "bom-dashboard", name: "BOM Dashboard", kind: "overview", dataset: "bom-headers", summary: "Coverage and cost" },
      { slug: "bom-list", name: "BOM Register", kind: "list", dataset: "bom-headers", summary: "All bills of material" },
      { slug: "bom-builder", name: "BOM Builder", kind: "form", dataset: "bom-headers", summary: "Multi-level structure" },
      { slug: "components", name: "Component Lines", kind: "list", dataset: "bom-lines", summary: "Every material line" },
      { slug: "explosion", name: "BOM Explosion", kind: "analytics", dataset: "bom-lines", summary: "Roll-down requirement" },
      { slug: "where-used", name: "Where-Used Enquiry", kind: "list", dataset: "bom-lines", summary: "Reverse lookup" },
      { slug: "alternates", name: "Alternate Materials", kind: "list", dataset: "bom-lines", summary: "Substitute items" },
      { slug: "material-substitution", name: "Substitution Log", kind: "list", dataset: "bom-lines", summary: "What was swapped" },
      { slug: "wastage", name: "Wastage Factors", kind: "settings", dataset: "policies", summary: "Process loss allowance" },
      { slug: "costed-bom", name: "Costed BOM", kind: "analytics", dataset: "bom-headers", summary: "Rolled-up cost" },
      { slug: "bom-cost-trend", name: "BOM Cost Trend", kind: "analytics", dataset: "bom-headers", summary: "Cost movement over time" },
      { slug: "bom-comparison", name: "BOM Comparison", kind: "analytics", dataset: "bom-headers", summary: "Version diff" },
      { slug: "bom-revisions", name: "BOM Revisions", kind: "list", dataset: "bom-headers", summary: "Version history" },
      { slug: "consumption-standard", name: "Standard Consumption", kind: "analytics", dataset: "bom-lines", summary: "Per 1000 pieces" },
      { slug: "buyer-bom", name: "Buyer-specific BOM", kind: "list", dataset: "bom-headers", summary: "Customised structures" },
      { slug: "bom-templates", name: "BOM Templates", kind: "list", dataset: "bom-headers", summary: "Standard starting points" },
      { slug: "phantom-bom", name: "Phantom & Sub-assembly", kind: "list", dataset: "bom-headers", summary: "Intermediate levels" },
      { slug: "bom-approval", name: "BOM Approval", kind: "board", dataset: "approvals", summary: "Release control" },
      { slug: "bom-audit", name: "BOM Audit Trail", kind: "list", dataset: "audit-log", summary: "Every structural edit" },
      { slug: "bom-settings", name: "BOM Settings", kind: "settings", dataset: "policies", summary: "Levels and rounding" },
    ],
  },

  // ── 20 ─────────────────────────────────────────────────────────────────
  {
    id: 20,
    slug: "routing-process",
    name: "Routing & Process Management",
    short: "Routing & Process",
    icon: "Workflow",
    group: "product",
    tone: 7,
    description:
      "Operation sequences, work centres, cycle times and standard process definitions.",
    submodules: [
      { slug: "routing-dashboard", name: "Routing Dashboard", kind: "overview", dataset: "routings", summary: "Standards and coverage" },
      { slug: "routings", name: "Routing Register", kind: "list", dataset: "routings", summary: "Operation sequences" },
      { slug: "operations", name: "Operation Master", kind: "list", dataset: "routings", summary: "Standard operations" },
      { slug: "work-centers", name: "Work Centers", kind: "list", dataset: "work-centers", summary: "Machines and cells" },
      { slug: "machine-mapping", name: "Machine Mapping", kind: "list", dataset: "work-centers", summary: "Operation to machine" },
      { slug: "cycle-times", name: "Cycle Time Standards", kind: "analytics", dataset: "routings", summary: "Standard minutes per operation" },
      { slug: "setup-times", name: "Setup Time Matrix", kind: "analytics", dataset: "routings", summary: "Changeover costs" },
      { slug: "changeover-matrix", name: "Changeover Matrix", kind: "analytics", dataset: "work-centers", summary: "Sequence-dependent setup" },
      { slug: "alternate-routing", name: "Alternate Routings", kind: "list", dataset: "routings", summary: "Fallback paths" },
      { slug: "routing-versions", name: "Routing Versions", kind: "list", dataset: "routings", summary: "Revision history" },
      { slug: "process-parameters", name: "Process Parameters", kind: "list", dataset: "tech-specs", summary: "Bath, pressure, temperature" },
      { slug: "capacity-profile", name: "Capacity Profile", kind: "analytics", dataset: "capacity-load", summary: "Load per work centre" },
      { slug: "bottleneck-map", name: "Bottleneck Map", kind: "analytics", dataset: "capacity-load", summary: "Where the constraint sits" },
      { slug: "process-flow", name: "Process Flow Map", kind: "analytics", dataset: "routings", summary: "Visual routing" },
      { slug: "labour-standards", name: "Labour Standards", kind: "analytics", dataset: "manpower-cost", summary: "Manning per operation" },
      { slug: "routing-cost", name: "Routing Cost", kind: "analytics", dataset: "routings", summary: "Cost per operation" },
      { slug: "subcontract-routing", name: "Subcontract Steps", kind: "list", dataset: "subcontract-jobs", summary: "Outsourced operations" },
      { slug: "process-audit", name: "Process Audits", kind: "list", dataset: "compliance-audits", summary: "Adherence checks" },
      { slug: "routing-approval", name: "Routing Approval", kind: "board", dataset: "approvals", summary: "Release to production" },
      { slug: "routing-settings", name: "Routing Settings", kind: "settings", dataset: "policies", summary: "Standards and rounding" },
    ],
  },

  // ── 21 ─────────────────────────────────────────────────────────────────
  {
    id: 21,
    slug: "time-action",
    name: "Time & Action (T&A) Management",
    short: "Time & Action",
    icon: "CalendarClock",
    group: "planning",
    tone: 2,
    badge: 31,
    description:
      "Critical-path calendars per order with automatic escalation on slippage.",
    submodules: [
      { slug: "tna-dashboard", name: "T&A Dashboard", kind: "overview", dataset: "tna-plans", summary: "Adherence across orders" },
      { slug: "tna-calendar", name: "T&A Calendar", kind: "calendar", dataset: "tna-plans", summary: "Order-wise milestones" },
      { slug: "order-tna", name: "Order T&A Plans", kind: "list", dataset: "tna-plans", summary: "Plan per sales order" },
      { slug: "templates", name: "T&A Templates", kind: "list", dataset: "tna-plans", summary: "Reusable plans" },
      { slug: "milestones", name: "Milestone Tracking", kind: "list", dataset: "tna-plans", summary: "Planned vs actual" },
      { slug: "tna-board", name: "Activity Board", kind: "board", dataset: "tna-plans", summary: "Stage-wise activities" },
      { slug: "critical-path", name: "Critical Path View", kind: "analytics", dataset: "tna-plans", summary: "Longest chain" },
      { slug: "dependency-map", name: "Dependency Map", kind: "analytics", dataset: "tna-plans", summary: "What blocks what" },
      { slug: "delay-alerts", name: "Delay Alerts", kind: "list", dataset: "tna-plans", summary: "Slipping activities" },
      { slug: "recovery-plan", name: "Recovery Actions", kind: "list", dataset: "tasks", summary: "Catch-up plan" },
      { slug: "escalation", name: "Escalation Matrix", kind: "settings", dataset: "policies", summary: "Who gets told when" },
      { slug: "lead-time-analysis", name: "Lead Time Analysis", kind: "analytics", dataset: "tna-plans", summary: "Stage durations" },
      { slug: "gantt", name: "Order Gantt", kind: "calendar", dataset: "tna-plans", summary: "Timeline overview" },
      { slug: "activity-owners", name: "Activity Ownership", kind: "analytics", dataset: "tna-plans", summary: "Load per responsible" },
      { slug: "buyer-deadlines", name: "Buyer Deadlines", kind: "calendar", dataset: "sales-orders", summary: "Committed dates" },
      { slug: "sample-tna", name: "Sample T&A", kind: "list", dataset: "samples", summary: "Development timelines" },
      { slug: "shipment-tna", name: "Shipment T&A", kind: "calendar", dataset: "delivery-schedule", summary: "Ex-factory to on-board" },
      { slug: "tna-approvals", name: "Plan Approvals", kind: "board", dataset: "approvals", summary: "Plan and revision sign-off" },
      { slug: "tna-audit", name: "T&A Audit Trail", kind: "list", dataset: "audit-log", summary: "Date change history" },
      { slug: "tna-settings", name: "T&A Settings", kind: "settings", dataset: "policies", summary: "Buffers and alert timing" },
    ],
  },

  // ── 22 ─────────────────────────────────────────────────────────────────
  {
    id: 22,
    slug: "production-planning",
    name: "Production Planning (PPC)",
    short: "Production Planning",
    icon: "CalendarRange",
    group: "planning",
    tone: 1,
    live: true,
    description:
      "Capacity-balanced master schedules, line loading and sequencing to the shop floor.",
    submodules: [
      { slug: "ppc-dashboard", name: "PPC Dashboard", kind: "overview", dataset: "production-plans", summary: "Plan health and load" },
      { slug: "master-schedule", name: "Master Production Schedule", kind: "calendar", dataset: "production-plans", summary: "MPS by week" },
      { slug: "plan-register", name: "Plan Register", kind: "list", dataset: "production-plans", summary: "Every production plan" },
      { slug: "capacity-planning", name: "Capacity Planning", kind: "analytics", dataset: "capacity-load", summary: "Load vs available" },
      { slug: "line-loading", name: "Line Loading", kind: "board", dataset: "production-plans", summary: "Assign orders to lines" },
      { slug: "sequencing", name: "Job Sequencing", kind: "list", dataset: "work-orders", summary: "Changeover-optimised order" },
      { slug: "work-order-release", name: "Work Order Release", kind: "list", dataset: "work-orders", summary: "Released to the floor" },
      { slug: "daily-plan", name: "Daily Plan", kind: "calendar", dataset: "work-orders", summary: "Today on each line" },
      { slug: "shift-planning", name: "Shift Planning", kind: "calendar", dataset: "shift-roster", summary: "Manpower per shift" },
      { slug: "machine-allocation", name: "Machine Allocation", kind: "list", dataset: "work-centers", summary: "Which machine runs what" },
      { slug: "material-readiness", name: "Material Readiness", kind: "analytics", dataset: "mrp-requirements", summary: "Can we start on time?" },
      { slug: "bottleneck", name: "Bottleneck Analysis", kind: "analytics", dataset: "capacity-load", summary: "Constraint work centres" },
      { slug: "plan-vs-actual", name: "Plan vs Actual", kind: "analytics", dataset: "production-plans", summary: "Adherence tracking" },
      { slug: "what-if", name: "What-If Simulation", kind: "analytics", dataset: "capacity-load", summary: "Scenario planning" },
      { slug: "rough-cut", name: "Rough-Cut Capacity", kind: "analytics", dataset: "capacity-load", summary: "Long-range feasibility" },
      { slug: "reschedule", name: "Reschedule Console", kind: "board", dataset: "production-plans", summary: "Handle disruptions" },
      { slug: "subcontract-plan", name: "Subcontract Plan", kind: "list", dataset: "subcontract-jobs", summary: "Outsourced volume" },
      { slug: "output-forecast", name: "Output Forecast", kind: "analytics", dataset: "forecasts", summary: "Expected production" },
      { slug: "plan-approvals", name: "Plan Approvals", kind: "board", dataset: "approvals", summary: "Sign-off before release" },
      { slug: "planning-parameters", name: "Planning Parameters", kind: "settings", dataset: "policies", summary: "Horizon, buffer, batching" },
    ],
  },

  // ── 23 ─────────────────────────────────────────────────────────────────
  {
    id: 23,
    slug: "mrp",
    name: "Material Requirement Planning (MRP)",
    short: "MRP",
    icon: "PackageSearch",
    group: "planning",
    tone: 3,
    description:
      "Net requirements, coverage and purchase suggestions driven by demand and stock.",
    submodules: [
      { slug: "mrp-dashboard", name: "MRP Dashboard", kind: "overview", dataset: "mrp-requirements", summary: "Coverage and shortage" },
      { slug: "mrp-run", name: "MRP Run", kind: "form", dataset: "mrp-requirements", summary: "Execute planning run" },
      { slug: "requirements", name: "Net Requirements", kind: "list", dataset: "mrp-requirements", summary: "What to buy or make" },
      { slug: "coverage", name: "Coverage Analysis", kind: "analytics", dataset: "mrp-requirements", summary: "Days of supply" },
      { slug: "shortage", name: "Shortage Report", kind: "list", dataset: "shortages", summary: "Materials at risk" },
      { slug: "purchase-suggestions", name: "Purchase Suggestions", kind: "list", dataset: "planned-orders", summary: "Auto-generated demand" },
      { slug: "planned-orders", name: "Planned Orders", kind: "list", dataset: "planned-orders", summary: "Buy, make and transfer" },
      { slug: "conversion-board", name: "Conversion Board", kind: "board", dataset: "planned-orders", summary: "Suggested to firmed" },
      { slug: "buy-vs-make", name: "Buy vs Make", kind: "analytics", dataset: "planned-orders", summary: "Sourcing decision" },
      { slug: "demand-input", name: "Demand Input", kind: "list", dataset: "forecasts", summary: "Orders and forecast" },
      { slug: "stock-projection", name: "Stock Projection", kind: "analytics", dataset: "stock-items", summary: "Projected on-hand" },
      { slug: "reorder-points", name: "Reorder Points", kind: "list", dataset: "stock-items", summary: "Trigger levels" },
      { slug: "safety-stock", name: "Safety Stock Policy", kind: "settings", dataset: "policies", summary: "Buffer rules" },
      { slug: "lead-time-master", name: "Lead Time Master", kind: "list", dataset: "suppliers", summary: "Supplier lead times" },
      { slug: "pegging", name: "Pegging View", kind: "analytics", dataset: "mrp-requirements", summary: "Demand-to-supply trace" },
      { slug: "exception-messages", name: "Exception Messages", kind: "list", dataset: "mrp-requirements", summary: "Expedite / defer" },
      { slug: "material-calendar", name: "Material Calendar", kind: "calendar", dataset: "planned-orders", summary: "When materials land" },
      { slug: "mrp-parameters", name: "MRP Parameters", kind: "settings", dataset: "policies", summary: "Lot sizing and horizon" },
      { slug: "mrp-audit", name: "MRP Run Log", kind: "list", dataset: "audit-log", summary: "Run history" },
      { slug: "mrp-reports", name: "MRP Reports", kind: "analytics", dataset: "reports", summary: "Scheduled planning reports" },
    ],
  },

  // ── 24 ─────────────────────────────────────────────────────────────────
  {
    id: 24,
    slug: "procurement",
    name: "Procurement Management",
    short: "Procurement",
    icon: "ShoppingCart",
    group: "planning",
    tone: 2,
    badge: 27,
    description:
      "Requisition to award — RFQ, comparison, negotiation and sourcing strategy.",
    submodules: [
      { slug: "procurement-dashboard", name: "Procurement Dashboard", kind: "overview", dataset: "requisitions", summary: "Demand and spend" },
      { slug: "requisitions", name: "Purchase Requisitions", kind: "list", dataset: "requisitions", summary: "Internal demand" },
      { slug: "new-requisition", name: "Raise Requisition", kind: "form", dataset: "requisitions", summary: "Ask for material" },
      { slug: "rfq", name: "RFQ Management", kind: "list", dataset: "rfqs", summary: "Requests to suppliers" },
      { slug: "vendor-quotes", name: "Vendor Quotes", kind: "list", dataset: "vendor-quotes", summary: "Responses received" },
      { slug: "quote-comparison", name: "Quote Comparison", kind: "analytics", dataset: "vendor-quotes", summary: "Side-by-side bids" },
      { slug: "negotiation", name: "Negotiation Log", kind: "list", dataset: "vendor-quotes", summary: "Rounds and outcomes" },
      { slug: "award-board", name: "Award Board", kind: "board", dataset: "rfqs", summary: "From open to awarded" },
      { slug: "sourcing-strategy", name: "Sourcing Strategy", kind: "analytics", dataset: "suppliers", summary: "Single vs multi-source" },
      { slug: "category-management", name: "Category Management", kind: "list", dataset: "suppliers", summary: "Buying categories" },
      { slug: "contracts", name: "Purchase Contracts", kind: "list", dataset: "contracts", summary: "Rate agreements" },
      { slug: "approval-workflow", name: "Approval Workflow", kind: "board", dataset: "approvals", summary: "Requisition sign-off" },
      { slug: "spend-analysis", name: "Spend Analysis", kind: "analytics", dataset: "purchase-orders", summary: "Category and supplier spend" },
      { slug: "savings-tracker", name: "Savings Tracker", kind: "analytics", dataset: "vendor-quotes", summary: "Negotiated savings" },
      { slug: "emergency-purchase", name: "Emergency Purchases", kind: "list", dataset: "requisitions", summary: "Off-cycle buying" },
      { slug: "requisition-calendar", name: "Requisition Calendar", kind: "calendar", dataset: "requisitions", summary: "Required-by dates" },
      { slug: "buyer-workload", name: "Buyer Workload", kind: "analytics", dataset: "requisitions", summary: "Load per buyer" },
      { slug: "procurement-policies", name: "Procurement Policies", kind: "settings", dataset: "policies", summary: "Thresholds and rules" },
      { slug: "procurement-audit", name: "Procurement Audit", kind: "list", dataset: "audit-log", summary: "Decisions on record" },
      { slug: "procurement-reports", name: "Procurement Reports", kind: "analytics", dataset: "reports", summary: "Scheduled buying reports" },
    ],
  },

  // ── 25 ─────────────────────────────────────────────────────────────────
  {
    id: 25,
    slug: "srm",
    name: "Supplier Relationship Management (SRM)",
    short: "Supplier Relations",
    icon: "Handshake",
    group: "planning",
    tone: 5,
    description:
      "Supplier onboarding, scorecards, audits, risk and development programmes.",
    submodules: [
      { slug: "srm-dashboard", name: "SRM Dashboard", kind: "overview", dataset: "suppliers", summary: "Base health and risk" },
      { slug: "supplier-directory", name: "Supplier Directory", kind: "list", dataset: "suppliers", summary: "Approved vendor list" },
      { slug: "onboarding", name: "Supplier Onboarding", kind: "board", dataset: "suppliers", summary: "Registration to approval" },
      { slug: "scorecards", name: "Supplier Scorecards", kind: "analytics", dataset: "supplier-evaluations", summary: "Quality, delivery, price" },
      { slug: "evaluations", name: "Evaluation Register", kind: "list", dataset: "supplier-evaluations", summary: "Period-wise ratings" },
      { slug: "audits", name: "Supplier Audits", kind: "list", dataset: "supplier-audits", summary: "On-site assessments" },
      { slug: "risk-assessment", name: "Risk Assessment", kind: "analytics", dataset: "risks", summary: "Dependency and exposure" },
      { slug: "development", name: "Supplier Development", kind: "list", dataset: "tasks", summary: "Improvement plans" },
      { slug: "performance-trend", name: "Performance Trend", kind: "analytics", dataset: "supplier-evaluations", summary: "Rolling ratings" },
      { slug: "delivery-performance", name: "Delivery Performance", kind: "analytics", dataset: "grn", summary: "On-time receipts" },
      { slug: "quality-performance", name: "Quality Performance", kind: "analytics", dataset: "inspections", summary: "Incoming rejection rate" },
      { slug: "supplier-contracts", name: "Supplier Contracts", kind: "list", dataset: "contracts", summary: "Agreements in force" },
      { slug: "supplier-quotes", name: "Supplier Quotes", kind: "list", dataset: "vendor-quotes", summary: "Price history" },
      { slug: "compliance-docs", name: "Compliance Documents", kind: "list", dataset: "documents", summary: "Certificates on file" },
      { slug: "supplier-visits", name: "Supplier Visits", kind: "calendar", dataset: "crm-activities", summary: "Visit planning" },
      { slug: "payment-status", name: "Payment Status", kind: "analytics", dataset: "payments", summary: "What we owe" },
      { slug: "capacity-assessment", name: "Capacity Assessment", kind: "analytics", dataset: "suppliers", summary: "Can they scale?" },
      { slug: "supplier-approvals", name: "Supplier Approvals", kind: "board", dataset: "approvals", summary: "New vendor sanction" },
      { slug: "blacklist", name: "Blocked Suppliers", kind: "list", dataset: "suppliers", summary: "Suspended vendors" },
      { slug: "srm-settings", name: "SRM Settings", kind: "settings", dataset: "policies", summary: "Rating weights and rules" },
    ],
  },

  // ── 26 ─────────────────────────────────────────────────────────────────
  {
    id: 26,
    slug: "purchase-order",
    name: "Purchase Order (PO) Management",
    short: "Purchase Orders",
    icon: "FileCheck2",
    group: "planning",
    tone: 1,
    badge: 14,
    description:
      "Issue, amend, follow up and close purchase orders with full receipt visibility.",
    submodules: [
      { slug: "po-dashboard", name: "PO Dashboard", kind: "overview", dataset: "purchase-orders", summary: "Open value and ageing" },
      { slug: "po-register", name: "PO Register", kind: "list", dataset: "purchase-orders", summary: "All purchase orders" },
      { slug: "create-po", name: "Create PO", kind: "form", dataset: "purchase-orders", summary: "From requisition or MRP" },
      { slug: "amendments", name: "PO Amendments", kind: "list", dataset: "purchase-orders", summary: "Change history" },
      { slug: "po-approvals", name: "PO Approvals", kind: "board", dataset: "approvals", summary: "Release authority" },
      { slug: "follow-up", name: "PO Follow-up", kind: "list", dataset: "purchase-orders", summary: "Chasing deliveries" },
      { slug: "supplier-confirmation", name: "Supplier Confirmation", kind: "list", dataset: "purchase-orders", summary: "Acknowledged orders" },
      { slug: "delivery-calendar", name: "Delivery Calendar", kind: "calendar", dataset: "purchase-orders", summary: "Promised dates" },
      { slug: "grn-status", name: "GRN Status", kind: "list", dataset: "grn", summary: "Received against ordered" },
      { slug: "pending-po", name: "Pending POs", kind: "analytics", dataset: "purchase-orders", summary: "Open commitment" },
      { slug: "po-aging", name: "PO Aging", kind: "analytics", dataset: "purchase-orders", summary: "Overdue orders" },
      { slug: "price-variance", name: "Price Variance", kind: "analytics", dataset: "vendor-quotes", summary: "PO price vs quote" },
      { slug: "po-invoices", name: "Supplier Invoices", kind: "list", dataset: "invoices", summary: "Three-way match" },
      { slug: "blanket-po", name: "Blanket Orders", kind: "list", dataset: "contracts", summary: "Call-off agreements" },
      { slug: "subcontract-po", name: "Subcontract POs", kind: "list", dataset: "subcontract-jobs", summary: "Job-work orders" },
      { slug: "closure", name: "PO Closure", kind: "list", dataset: "purchase-orders", summary: "Short-close and cancel" },
      { slug: "commitment", name: "Commitment Report", kind: "analytics", dataset: "purchase-orders", summary: "Financial exposure" },
      { slug: "po-documents", name: "PO Documents", kind: "list", dataset: "documents", summary: "Signed copies" },
      { slug: "po-audit", name: "PO Audit Trail", kind: "list", dataset: "audit-log", summary: "Every change logged" },
      { slug: "po-settings", name: "PO Settings", kind: "settings", dataset: "policies", summary: "Tolerance and terms" },
    ],
  },

  // ── 27 ─────────────────────────────────────────────────────────────────
  {
    id: 27,
    slug: "import-commercial",
    name: "Import Commercial Management",
    short: "Import Commercial",
    icon: "Globe2",
    group: "planning",
    tone: 7,
    badge: 31,
    description:
      "The full import commercial desk — planning and indenting, supplier and contract control, proforma invoices, the whole LC instrument family, landed cost build-up, tariff, bond and customs compliance, shipment and container tracking, duty, payment and settlement, the report pack and the AI layer on top.",
    submodules: submodulesOf(WORKSPACE_SPECS["import-commercial"]),
  },

  // ── 28 ─────────────────────────────────────────────────────────────────
  {
    id: 28,
    slug: "raw-material-warehouse",
    name: "Raw Material Warehouse Management",
    short: "RM Warehouse",
    icon: "Warehouse",
    group: "inventory",
    tone: 4,
    description:
      "Receipt, inspection, put-away and issue of metal, chemicals and packaging inputs.",
    submodules: [
      { slug: "rm-dashboard", name: "RM Dashboard", kind: "overview", dataset: "stock-items", summary: "Holding, value and cover" },
      { slug: "grn", name: "Goods Receipt (GRN)", kind: "list", dataset: "grn", summary: "Inbound receipts" },
      { slug: "gate-entry", name: "Gate Entry", kind: "list", dataset: "scan-events", summary: "Vehicle in and out" },
      { slug: "inspection", name: "Incoming Inspection", kind: "list", dataset: "inspections", summary: "Quality gate" },
      { slug: "put-away", name: "Put-away", kind: "list", dataset: "stock-transfers", summary: "Bin assignment" },
      { slug: "material-issue", name: "Material Issue", kind: "list", dataset: "material-issues", summary: "Issue to production" },
      { slug: "returns", name: "Returns to Supplier", kind: "list", dataset: "stock-adjustments", summary: "Rejected material out" },
      { slug: "supplier-returns", name: "Return Approvals", kind: "board", dataset: "stock-adjustments", summary: "Debit note workflow" },
      { slug: "stock-position", name: "RM Stock Position", kind: "analytics", dataset: "stock-items", summary: "Current holdings" },
      { slug: "bin-management", name: "Bin Management", kind: "list", dataset: "warehouse-locations", summary: "Location control" },
      { slug: "batch-tracking", name: "Batch & Heat Tracking", kind: "list", dataset: "traceability", summary: "Metal batch trace" },
      { slug: "chemical-store", name: "Chemical Store", kind: "list", dataset: "chemicals-stock", summary: "Hazard-classed stock" },
      { slug: "consumption", name: "Consumption Analysis", kind: "analytics", dataset: "material-issues", summary: "Usage vs standard" },
      { slug: "rm-transfers", name: "Store Transfers", kind: "list", dataset: "stock-transfers", summary: "Between RM stores" },
      { slug: "rm-adjustments", name: "Stock Adjustments", kind: "list", dataset: "stock-adjustments", summary: "Write-on / write-off" },
      { slug: "cycle-count", name: "Cycle Counting", kind: "calendar", dataset: "cycle-counts", summary: "Rolling physical count" },
      { slug: "reorder", name: "Reorder Alerts", kind: "list", dataset: "stock-items", summary: "Below minimum" },
      { slug: "rm-valuation", name: "RM Valuation", kind: "analytics", dataset: "stock-items", summary: "Value by store" },
      { slug: "store-audit", name: "Store Audit Log", kind: "list", dataset: "audit-log", summary: "Movement history" },
      { slug: "rm-settings", name: "Warehouse Settings", kind: "settings", dataset: "policies", summary: "Put-away and issue rules" },
    ],
  },

  // ── 29 ─────────────────────────────────────────────────────────────────
  {
    id: 29,
    slug: "inventory-store",
    name: "Inventory & Store Management",
    short: "Inventory & Store",
    icon: "Boxes",
    group: "inventory",
    tone: 3,
    live: true,
    badge: 41,
    description:
      "Company-wide stock ledger, valuation, cycle counting and ageing control.",
    submodules: [
      { slug: "stock-summary", name: "Stock Summary", kind: "analytics", dataset: "stock-items", summary: "Value and quantity" },
      { slug: "stock-ledger", name: "Stock Ledger", kind: "list", dataset: "stock-items", summary: "Every movement" },
      { slug: "stock-board", name: "Stock Health Board", kind: "board", dataset: "stock-items", summary: "By stock condition" },
      { slug: "transfers", name: "Stock Transfers", kind: "list", dataset: "stock-transfers", summary: "Inter-store movement" },
      { slug: "adjustments", name: "Stock Adjustments", kind: "list", dataset: "stock-adjustments", summary: "Write-on / write-off" },
      { slug: "cycle-count", name: "Cycle Counting", kind: "calendar", dataset: "cycle-counts", summary: "Rolling physical count" },
      { slug: "physical-inventory", name: "Physical Inventory", kind: "list", dataset: "cycle-counts", summary: "Full stock take" },
      { slug: "valuation", name: "Inventory Valuation", kind: "analytics", dataset: "stock-items", summary: "FIFO / weighted average" },
      { slug: "aging", name: "Stock Aging", kind: "analytics", dataset: "stock-items", summary: "Slow and dead stock" },
      { slug: "abc-analysis", name: "ABC / XYZ Analysis", kind: "analytics", dataset: "stock-items", summary: "Classification" },
      { slug: "turnover", name: "Inventory Turnover", kind: "analytics", dataset: "stock-items", summary: "Turns per year" },
      { slug: "reservations", name: "Stock Reservations", kind: "list", dataset: "stock-items", summary: "Committed quantities" },
      { slug: "fg-stock", name: "Finished Goods Stock", kind: "list", dataset: "fg-stock", summary: "Ready for shipment" },
      { slug: "wip-stock", name: "WIP Stock", kind: "list", dataset: "work-orders", summary: "Held on the floor" },
      { slug: "store-issues", name: "Store Issues", kind: "list", dataset: "material-issues", summary: "Issued to departments" },
      { slug: "scrap-stock", name: "Scrap Stock", kind: "list", dataset: "scrap-entries", summary: "Recoverable material" },
      { slug: "min-max", name: "Min-Max Levels", kind: "settings", dataset: "policies", summary: "Replenishment policy" },
      { slug: "stock-approvals", name: "Stock Approvals", kind: "board", dataset: "approvals", summary: "Adjustment sign-off" },
      { slug: "stock-audit", name: "Stock Audit Trail", kind: "list", dataset: "audit-log", summary: "Who moved what" },
      { slug: "inventory-settings", name: "Inventory Settings", kind: "settings", dataset: "policies", summary: "Valuation and rounding" },
    ],
  },

  // ── 30 ─────────────────────────────────────────────────────────────────
  {
    id: 30,
    slug: "barcode-rfid",
    name: "Barcode & RFID Traceability Management",
    short: "Barcode & RFID",
    icon: "ScanBarcode",
    group: "inventory",
    tone: 7,
    live: true,
    description:
      "Label design, scanning stations and end-to-end genealogy from heat lot to carton.",
    submodules: [
      { slug: "trace-dashboard", name: "Traceability Dashboard", kind: "overview", dataset: "traceability", summary: "Coverage and gaps" },
      { slug: "label-designer", name: "Label Designer", kind: "form", dataset: "barcode-labels", summary: "Barcode / QR templates" },
      { slug: "print-queue", name: "Print Queue", kind: "list", dataset: "barcode-labels", summary: "Label jobs" },
      { slug: "label-templates", name: "Label Templates", kind: "list", dataset: "barcode-labels", summary: "Reusable layouts" },
      { slug: "carton-labels", name: "Carton & Pallet Labels", kind: "list", dataset: "barcode-labels", summary: "Shipping marks" },
      { slug: "scan-stations", name: "Scan Stations", kind: "list", dataset: "devices", summary: "Reader devices" },
      { slug: "device-health", name: "Device Health", kind: "analytics", dataset: "devices", summary: "Battery and connectivity" },
      { slug: "rfid-tags", name: "RFID Tag Register", kind: "list", dataset: "rfid-tags", summary: "Tag allocation" },
      { slug: "tag-allocation", name: "Tag Allocation", kind: "list", dataset: "rfid-tags", summary: "Assigned and free tags" },
      { slug: "pallet-tracking", name: "Pallet Tracking", kind: "list", dataset: "rfid-tags", summary: "Where each pallet is" },
      { slug: "scan-log", name: "Scan Event Log", kind: "list", dataset: "scan-events", summary: "Every scan captured" },
      { slug: "gate-scans", name: "Gate Scans", kind: "list", dataset: "scan-events", summary: "In and out movements" },
      { slug: "scan-exceptions", name: "Scan Exceptions", kind: "board", dataset: "scan-events", summary: "Duplicates and errors" },
      { slug: "scan-productivity", name: "Scan Productivity", kind: "analytics", dataset: "scan-events", summary: "Throughput per station" },
      { slug: "traceability", name: "Traceability Explorer", kind: "analytics", dataset: "traceability", summary: "Forward and backward trace" },
      { slug: "genealogy", name: "Batch Genealogy", kind: "analytics", dataset: "traceability", summary: "Lot family tree" },
      { slug: "recall-simulation", name: "Recall Simulation", kind: "analytics", dataset: "traceability", summary: "Impact if we recall" },
      { slug: "trace-calendar", name: "Scan Calendar", kind: "calendar", dataset: "scan-events", summary: "Activity by day" },
      { slug: "serialization", name: "Serialisation Rules", kind: "settings", dataset: "policies", summary: "Serial number policy" },
      { slug: "trace-audit", name: "Traceability Audit", kind: "list", dataset: "audit-log", summary: "Chain-of-custody log" },
    ],
  },

  // ── 31 ─────────────────────────────────────────────────────────────────
  {
    id: 31,
    slug: "production-management",
    name: "Production Management",
    short: "Production Management",
    icon: "Factory",
    group: "manufacturing",
    tone: 1,
    live: true,
    badge: 7,
    description:
      "Complete production planning and control — orders, routing, work centres, machines, operators, the material chain and the shop-floor transaction flow.",
    submodules: submodulesOf(WORKSPACE_SPECS["production-management"]),
  },

  // ── 32 ─────────────────────────────────────────────────────────────────
  {
    id: 32,
    slug: "product-manufacturing",
    name: "Product Manufacturing Management",
    short: "Manufacturing",
    icon: "Settings2",
    group: "manufacturing",
    tone: 2,
    live: true,
    description:
      "The manufacturing of every metal accessory — button, snap, rivet, zipper and slider lines, the forming, plating and finishing processes, then assembly, quality, packing and transfer.",
    submodules: submodulesOf(WORKSPACE_SPECS["product-manufacturing"]),
  },

  // ── 33 ─────────────────────────────────────────────────────────────────
  {
    id: 33,
    slug: "production-tracking",
    name: "Product Production Tracking & Traceability Management",
    short: "Tracking",
    icon: "Loader",
    group: "manufacturing",
    tone: 4,
    live: true,
    description:
      "Real-time tracking from PI to customer delivery — barcode and batch traceability, WIP and progress, then delivery order, gate pass, loading, dispatch and delivery confirmation.",
    submodules: submodulesOf(WORKSPACE_SPECS["production-tracking"]),
  },

  // ── 34 ─────────────────────────────────────────────────────────────────
  {
    id: 34,
    slug: "chemical-management",
    name: "Chemical Management",
    short: "Chemical",
    icon: "TestTube",
    group: "manufacturing",
    tone: 3,
    description:
      "Bath chemistry, consumption, MSDS, restricted substances and safe storage.",
    submodules: submodulesOf(WORKSPACE_SPECS["chemical-management"]),
  },

  // ── 35 ─────────────────────────────────────────────────────────────────
  {
    id: 35,
    slug: "plating-finishing",
    name: "Plating & Surface Finishing Management",
    short: "Plating & Finishing",
    icon: "Sparkles",
    group: "manufacturing",
    tone: 5,
    live: true,
    description:
      "Plating lines, bath parameters, thickness control and finish quality outcomes.",
    submodules: submodulesOf(WORKSPACE_SPECS["plating-finishing"]),
  },

  // ── 36 ─────────────────────────────────────────────────────────────────
  {
    id: 36,
    slug: "laboratory-testing",
    name: "Laboratory & Testing Management",
    short: "Lab & Testing",
    icon: "Microscope",
    group: "quality",
    tone: 7,
    description:
      "In-house and third-party testing, sample logging, results and certificate issuance.",
    submodules: submodulesOf(WORKSPACE_SPECS["laboratory-testing"]),
  },

  // ── 37 ─────────────────────────────────────────────────────────────────
  {
    id: 37,
    slug: "qms",
    name: "Quality Management System (QMS)",
    short: "QMS",
    icon: "BadgeCheck",
    group: "quality",
    tone: 3,
    badge: 11,
    description:
      "Inspection plans, NCRs, CAPA, audits and the quality documentation backbone.",
    submodules: submodulesOf(WORKSPACE_SPECS.qms),
  },

  // ── 38 ─────────────────────────────────────────────────────────────────
  {
    id: 38,
    slug: "rework-rejection",
    name: "Rework & Rejection Management",
    short: "Rework & Rejection",
    icon: "RefreshCcw",
    group: "quality",
    tone: 2,
    description:
      "Everything that failed first pass — disposition, rework routing and cost of poor quality.",
    submodules: submodulesOf(WORKSPACE_SPECS["rework-rejection"]),
  },

  // ── 39 ─────────────────────────────────────────────────────────────────
  {
    id: 39,
    slug: "scrap-waste",
    name: "Scrap & Waste Management",
    short: "Scrap & Waste",
    icon: "Recycle",
    group: "quality",
    tone: 4,
    description:
      "Metal scrap recovery, waste streams, disposal compliance and resale value.",
    submodules: submodulesOf(WORKSPACE_SPECS["scrap-waste"]),
  },

  // ── 40 ─────────────────────────────────────────────────────────────────
  {
    id: 40,
    slug: "fg-warehouse",
    name: "Finished Goods Warehouse Management",
    short: "FG Warehouse",
    icon: "PackageCheck",
    group: "inventory",
    tone: 1,
    description:
      "Finished stock receipt, storage, picking and readiness against shipment plans.",
    submodules: submodulesOf(WORKSPACE_SPECS["fg-warehouse"]),
  },

  // ── 41 ─────────────────────────────────────────────────────────────────
  {
    id: 41,
    slug: "packaging",
    name: "Packaging Management",
    short: "Packaging",
    icon: "Package",
    group: "logistics",
    tone: 4,
    description:
      "Packing specifications, carton planning, packing lists and packaging consumption.",
    submodules: submodulesOf(WORKSPACE_SPECS.packaging),
  },

  // ── 42 ─────────────────────────────────────────────────────────────────
  {
    id: 42,
    slug: "dispatch-logistics",
    name: "Dispatch & Logistics Management",
    short: "Dispatch & Logistics",
    icon: "Truck",
    group: "logistics",
    tone: 2,
    live: true,
    badge: 8,
    description:
      "Gate-out to delivery — vehicle planning, freight cost and in-transit visibility.",
    submodules: submodulesOf(WORKSPACE_SPECS["dispatch-logistics"]),
  },

  // ── 43 ─────────────────────────────────────────────────────────────────
  {
    id: 43,
    slug: "export-commercial",
    name: "Export Commercial Management",
    short: "Export Commercial",
    icon: "Ship",
    group: "logistics",
    tone: 1,
    description:
      "The whole export commercial desk — planning and scheduling, the buyer and contract book, the full LC family, invoicing, certificates, booking and containers, customs, tracking, banking and realisation, incentives, profitability, compliance, reporting and the AI document layer.",
    submodules: submodulesOf(WORKSPACE_SPECS["export-commercial"]),
  },

  // ── 44 ─────────────────────────────────────────────────────────────────
  {
    id: 44,
    slug: "buyer-portal",
    name: "Customer & Buyer Portal Management",
    short: "Buyer Portal",
    icon: "Globe",
    group: "sales",
    tone: 7,
    description:
      "The outside-facing window — buyers see orders, samples, shipments and documents.",
    submodules: submodulesOf(WORKSPACE_SPECS["buyer-portal"]),
  },

  // ── 45 ─────────────────────────────────────────────────────────────────
  {
    id: 45,
    slug: "finance-accounts",
    name: "Finance & Accounts Management",
    short: "Finance & Accounts",
    icon: "Wallet",
    group: "finance",
    tone: 3,
    badge: 19,
    description:
      "General ledger, receivables, payables and statutory financial reporting.",
    submodules: submodulesOf(WORKSPACE_SPECS["finance-accounts"]),
  },

  // ── 46 ─────────────────────────────────────────────────────────────────
  {
    id: 46,
    slug: "cost-budget",
    name: "Cost Control & Budget Management",
    short: "Cost & Budget",
    icon: "TrendingUp",
    group: "finance",
    tone: 2,
    description:
      "Standard vs actual costing, variance analysis and budget-to-actual discipline.",
    submodules: submodulesOf(WORKSPACE_SPECS["cost-budget"]),
  },

  // ── 47 ─────────────────────────────────────────────────────────────────
  {
    id: 47,
    slug: "treasury-cash",
    name: "Treasury & Cash Management",
    short: "Treasury & Cash",
    icon: "Banknote",
    group: "finance",
    tone: 6,
    description:
      "Bank positions, cash flow forecasting, FX exposure and liquidity planning.",
    submodules: submodulesOf(WORKSPACE_SPECS["treasury-cash"]),
  },

  // ── 48 ─────────────────────────────────────────────────────────────────
  {
    id: 48,
    slug: "lc-banking",
    name: "LC & Banking Management",
    short: "LC & Banking",
    icon: "Landmark",
    group: "finance",
    tone: 1,
    description:
      "Letters of credit, back-to-back structures, bank charges and limit utilisation.",
    submodules: submodulesOf(WORKSPACE_SPECS["lc-banking"]),
  },

  // ── 49 ─────────────────────────────────────────────────────────────────
  {
    id: 49,
    slug: "tax-vat",
    name: "Tax & VAT Management",
    short: "Tax & VAT",
    icon: "ReceiptText",
    group: "finance",
    tone: 4,
    description:
      "VAT registers, returns, withholding tax and statutory filing calendars.",
    submodules: submodulesOf(WORKSPACE_SPECS["tax-vat"]),
  },

  // ── 50 ─────────────────────────────────────────────────────────────────
  {
    id: 50,
    slug: "asset-management",
    name: "Asset Management",
    short: "Asset Management",
    icon: "HardDrive",
    group: "assets",
    tone: 7,
    description:
      "Fixed asset register, depreciation, transfers, insurance and disposal.",
    submodules: submodulesOf(WORKSPACE_SPECS["asset-management"]),
  },

  // ── 51 ─────────────────────────────────────────────────────────────────
  {
    id: 51,
    slug: "maintenance",
    name: "Maintenance Management",
    short: "Maintenance",
    icon: "Wrench",
    group: "assets",
    tone: 2,
    badge: 16,
    description:
      "Preventive schedules, breakdown response, spares and maintenance effectiveness.",
    submodules: submodulesOf(WORKSPACE_SPECS.maintenance),
  },

  // ── 52 ─────────────────────────────────────────────────────────────────
  {
    id: 52,
    slug: "iot-monitoring",
    name: "IoT Machine Monitoring Management",
    short: "IoT Monitoring",
    icon: "Radio",
    group: "assets",
    tone: 1,
    live: true,
    description:
      "Sensor telemetry from every machine — live parameters, thresholds and alarms.",
    submodules: submodulesOf(WORKSPACE_SPECS["iot-monitoring"]),
  },

  // ── 53 ─────────────────────────────────────────────────────────────────
  {
    id: 53,
    slug: "energy",
    name: "Energy Management",
    short: "Energy",
    icon: "Zap",
    group: "assets",
    tone: 4,
    description:
      "Electricity, gas and water consumption, energy intensity and cost per unit produced.",
    submodules: submodulesOf(WORKSPACE_SPECS.energy),
  },

  // ── 54 ─────────────────────────────────────────────────────────────────
  {
    id: 54,
    slug: "compliance",
    name: "Compliance Management",
    short: "Compliance",
    icon: "ShieldCheck",
    group: "quality",
    tone: 6,
    badge: 5,
    description:
      "Social, environmental and buyer compliance — certificates, audits and CAP closure.",
    submodules: submodulesOf(WORKSPACE_SPECS.compliance),
  },

  // ── 55 ─────────────────────────────────────────────────────────────────
  {
    id: 55,
    slug: "security-gatepass",
    name: "Security & Gate Pass Management",
    short: "Security & Gate Pass",
    icon: "DoorOpen",
    group: "governance",
    tone: 8,
    description:
      "Gate movements, visitor control, material passes and site security incidents.",
    submodules: submodulesOf(WORKSPACE_SPECS["security-gatepass"]),
  },

  // ── 56 ─────────────────────────────────────────────────────────────────
  {
    id: 56,
    slug: "dms",
    name: "Document Management System (DMS)",
    short: "Documents",
    icon: "FolderOpen",
    group: "master-data",
    tone: 1,
    description:
      "Central repository with versioning, retention policy and controlled distribution.",
    submodules: submodulesOf(WORKSPACE_SPECS.dms),
  },

  // ── 57 ─────────────────────────────────────────────────────────────────
  {
    id: 57,
    slug: "workflow-approval",
    name: "Workflow & Approval Management",
    short: "Workflow & Approval",
    icon: "GitBranch",
    group: "governance",
    tone: 7,
    badge: 23,
    description:
      "Configurable approval chains, delegation and a single inbox for every pending decision.",
    submodules: submodulesOf(WORKSPACE_SPECS["workflow-approval"]),
  },

  // ── 58 ─────────────────────────────────────────────────────────────────
  {
    id: 58,
    slug: "bi-analytics",
    name: "Business Intelligence (BI) & Analytics",
    short: "BI & Analytics",
    icon: "BarChart3",
    group: "intelligence",
    tone: 3,
    description:
      "Self-service reporting, cross-module analysis and scheduled distribution.",
    submodules: submodulesOf(WORKSPACE_SPECS["bi-analytics"]),
  },

  // ── 59 ─────────────────────────────────────────────────────────────────
  {
    id: 59,
    slug: "mobile-app",
    name: "Mobile App Management",
    short: "Mobile App",
    icon: "Smartphone",
    group: "governance",
    tone: 5,
    description:
      "Companion app configuration, device enrolment, offline sync and push messaging.",
    submodules: submodulesOf(WORKSPACE_SPECS["mobile-app"]),
  },

  // ── 60 ─────────────────────────────────────────────────────────────────
  {
    id: 60,
    slug: "api-integration",
    name: "API & Third Party Integration",
    short: "API & Integration",
    icon: "Plug",
    group: "governance",
    tone: 4,
    description:
      "Connectors, webhooks, API keys and the health of every outbound integration.",
    submodules: submodulesOf(WORKSPACE_SPECS["api-integration"]),
  },

  // ── 61 ─────────────────────────────────────────────────────────────────
  {
    id: 61,
    slug: "sustainability-risk-audit",
    name: "Sustainability, Risk & Audit Management",
    short: "Sustainability & Risk",
    icon: "Leaf",
    group: "governance",
    tone: 6,
    description:
      "ESG reporting, carbon accounting, enterprise risk register and internal audit.",
    submodules: submodulesOf(WORKSPACE_SPECS["sustainability-risk-audit"]),
  },

  // ── 62 ─────────────────────────────────────────────────────────────────
  {
    id: 62,
    slug: "factory-plant",
    name: "Factory & Plant Management",
    short: "Factory & Plant",
    icon: "Factory",
    group: "master-data",
    tone: 2,
    description:
      "Each manufacturing site as its own entity — capacity, utilities, licences and output.",
    submodules: submodulesOf(WORKSPACE_SPECS["factory-plant"]),
  },

  // ── 63 ─────────────────────────────────────────────────────────────────
  {
    id: 63,
    slug: "branch-location",
    name: "Branch & Location Management",
    short: "Branch & Location",
    icon: "MapPinned",
    group: "master-data",
    tone: 5,
    description:
      "Offices, showrooms and geographic hierarchy with territory and performance mapping.",
    submodules: submodulesOf(WORKSPACE_SPECS["branch-location"]),
  },

  // ── 64 ─────────────────────────────────────────────────────────────────
  {
    id: 64,
    slug: "buyer-master",
    name: "Buyer Master Management",
    short: "Buyer Master",
    icon: "BookUser",
    group: "master-data",
    tone: 1,
    description:
      "One authoritative record per buyer — brands, terms, requirements and credit standing.",
    submodules: submodulesOf(WORKSPACE_SPECS["buyer-master"]),
  },

  // ── 65 ─────────────────────────────────────────────────────────────────
  {
    id: 65,
    slug: "sales-business-development",
    name: "Sales & Business Development Management",
    short: "Sales & BD",
    icon: "Target",
    group: "sales",
    tone: 2,
    description:
      "Targets, territories and growth initiatives that turn the pipeline into a plan.",
    submodules: submodulesOf(WORKSPACE_SPECS["sales-business-development"]),
  },

  // ── 66 ─────────────────────────────────────────────────────────────────
  {
    id: 66,
    slug: "customer-service",
    name: "Customer Service & Complaint Management",
    short: "Customer Service",
    icon: "Headset",
    group: "sales",
    tone: 4,
    badge: 9,
    description:
      "Every buyer complaint from intake to closure, with root cause and SLA discipline.",
    submodules: submodulesOf(WORKSPACE_SPECS["customer-service"]),
  },

  // ── 67 ─────────────────────────────────────────────────────────────────
  {
    id: 67,
    slug: "fleet-transport",
    name: "Fleet & Transport Management",
    short: "Fleet & Transport",
    icon: "Bus",
    group: "logistics",
    tone: 7,
    description:
      "Owned and hired vehicles — trips, fuel, documents, maintenance and cost per kilometre.",
    submodules: submodulesOf(WORKSPACE_SPECS["fleet-transport"]),
  },

  // ── 68 ─────────────────────────────────────────────────────────────────
  {
    id: 68,
    slug: "contract-management",
    name: "Contract Management",
    short: "Contracts",
    icon: "Signature",
    group: "governance",
    tone: 3,
    description:
      "Drafting, approval and obligation tracking for every buyer, supplier and service contract.",
    submodules: submodulesOf(WORKSPACE_SPECS["contract-management"]),
  },

  // ── 69 ─────────────────────────────────────────────────────────────────
  {
    id: 69,
    slug: "iam",
    name: "Identity & Access Management (IAM)",
    short: "Identity & Access",
    icon: "ShieldUser",
    group: "governance",
    tone: 8,
    description:
      "Who exists, what they may touch and the evidence that access stays appropriate.",
    submodules: submodulesOf(WORKSPACE_SPECS.iam),
  },

  // ── 70 ─────────────────────────────────────────────────────────────────
  {
    id: 70,
    slug: "notification-center",
    name: "Notification & Communication Center",
    short: "Notifications",
    icon: "BellRing",
    group: "governance",
    tone: 5,
    badge: 34,
    description:
      "One place where every alert, announcement and outbound message is defined and traced.",
    submodules: submodulesOf(WORKSPACE_SPECS["notification-center"]),
  },

  // ── 71 ─────────────────────────────────────────────────────────────────
  {
    id: 71,
    slug: "knowledge-sop",
    name: "Knowledge Base & SOP Management",
    short: "Knowledge & SOP",
    icon: "BookOpen",
    group: "governance",
    tone: 6,
    description:
      "Controlled SOPs, work instructions and how-to knowledge with read acknowledgement.",
    submodules: submodulesOf(WORKSPACE_SPECS["knowledge-sop"]),
  },

  // ── 72 ─────────────────────────────────────────────────────────────────
  {
    id: 72,
    slug: "capacity-scheduling",
    name: "Capacity Planning & Scheduling",
    short: "Capacity & Scheduling",
    icon: "Gauge",
    group: "planning",
    tone: 4,
    description:
      "Finite scheduling against real machine and manpower availability, with what-if runs.",
    submodules: submodulesOf(WORKSPACE_SPECS["capacity-scheduling"]),
  },

  // ── 73 ─────────────────────────────────────────────────────────────────
  {
    id: 73,
    slug: "multi-currency-forex",
    name: "Multi-Currency & Forex Management",
    short: "Currency & Forex",
    icon: "Coins",
    group: "finance",
    tone: 7,
    description:
      "Rates, revaluation, exposure and hedging for a business that earns and spends in many currencies.",
    submodules: submodulesOf(WORKSPACE_SPECS["multi-currency-forex"]),
  },

  // ── 74 ─────────────────────────────────────────────────────────────────
  {
    id: 74,
    slug: "demand-forecasting",
    name: "Demand Forecasting & Sales Forecasting",
    short: "Forecasting",
    icon: "ChartSpline",
    group: "planning",
    tone: 2,
    description:
      "A single agreed number for what we expect to sell and make — with accuracy measured.",
    submodules: submodulesOf(WORKSPACE_SPECS["demand-forecasting"]),
  },

  // ── 75 ─────────────────────────────────────────────────────────────────
  {
    id: 75,
    slug: "rma-claims",
    name: "Return (RMA) & Claims Management",
    short: "RMA & Claims",
    icon: "Undo2",
    group: "sales",
    tone: 8,
    badge: 6,
    description:
      "Authorised returns, buyer claims and the recovery of what those failures cost us.",
    submodules: submodulesOf(WORKSPACE_SPECS["rma-claims"]),
  },
];
