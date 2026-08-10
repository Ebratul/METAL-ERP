# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\navigation.spec.ts >> Shell and navigation >> sidebar lists every module group
- Location: tests\e2e\navigation.spec.ts:12:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('navigation', { name: 'Module navigation' }).getByText('MANUFACTURING', { exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('navigation', { name: 'Module navigation' }).getByText('MANUFACTURING', { exact: true })

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- complementary:
  - navigation "Module navigation":
    - link "Smart Global IT METAL ERP":
      - /url: /dashboard
    - paragraph: OVERVIEW
    - list:
      - listitem:
        - link "Executive Dashboard Live data 20":
          - /url: /m/executive-dashboard
          - text: Executive Dashboard 20
        - button "Expand Executive Dashboard submodules"
      - listitem:
        - link "AI Center Live data 6":
          - /url: /m/ai-center
          - text: AI Center 6
        - button "Expand AI Center submodules"
      - listitem:
        - link "BI & Analytics 20":
          - /url: /m/bi-analytics
        - button "Expand BI & Analytics submodules"
    - paragraph: PEOPLE & HR
    - list:
      - listitem:
        - link "HRMS & Payroll 13":
          - /url: /m/hrms-payroll
        - button "Expand HRMS & Payroll submodules"
    - paragraph: SETUP & MASTER DATA
    - list:
      - listitem:
        - link "Organization 20":
          - /url: /m/organization-management
        - button "Expand Organization submodules"
      - listitem:
        - link "Master Data 20":
          - /url: /m/master-data
        - button "Expand Master Data submodules"
      - listitem:
        - link "AI Document Input 12":
          - /url: /m/ai-document-input
        - button "Expand AI Document Input submodules"
      - listitem:
        - link "Documents 20":
          - /url: /m/dms
        - button "Expand Documents submodules"
      - listitem:
        - link "Factory & Plant 20":
          - /url: /m/factory-plant
        - button "Expand Factory & Plant submodules"
      - listitem:
        - link "Branch & Location 20":
          - /url: /m/branch-location
        - button "Expand Branch & Location submodules"
      - listitem:
        - link "Buyer Master 20":
          - /url: /m/buyer-master
        - button "Expand Buyer Master submodules"
    - paragraph: SALES & MERCHANDISING
    - list:
      - listitem:
        - link "CRM & Marketing 20":
          - /url: /m/crm-marketing
        - button "Expand CRM & Marketing submodules"
      - listitem:
        - link "Inquiry & Lead 18":
          - /url: /m/inquiry-lead
        - button "Expand Inquiry & Lead submodules"
      - listitem:
        - link "Quotation & Costing 9":
          - /url: /m/quotation-costing
        - button "Expand Quotation & Costing submodules"
      - listitem:
        - link "Proforma Invoice 24":
          - /url: /m/proforma-invoice
        - button "Expand Proforma Invoice submodules"
      - listitem:
        - link "Sales Orders Live data 24":
          - /url: /m/sales-order
          - text: Sales Orders 24
        - button "Expand Sales Orders submodules"
      - listitem:
        - link "Buyer Portal 20":
          - /url: /m/buyer-portal
        - button "Expand Buyer Portal submodules"
      - listitem:
        - link "Sales & BD 20":
          - /url: /m/sales-business-development
        - button "Expand Sales & BD submodules"
      - listitem:
        - link "Customer Service 9":
          - /url: /m/customer-service
        - button "Expand Customer Service submodules"
      - listitem:
        - link "RMA & Claims 6":
          - /url: /m/rma-claims
        - button "Expand RMA & Claims submodules"
    - paragraph: PRODUCT & ENGINEERING
    - list:
      - listitem:
        - link "Product Development 20":
          - /url: /m/product-development
        - button "Expand Product Development submodules"
      - listitem:
        - link "PLM 20":
          - /url: /m/plm
        - button "Expand PLM submodules"
      - listitem:
        - link "Sample Management 15":
          - /url: /m/sample-management
        - button "Expand Sample Management submodules"
      - listitem:
        - link "Artwork & Design 20":
          - /url: /m/artwork-design
        - button "Expand Artwork & Design submodules"
      - listitem:
        - link "Engineering 20":
          - /url: /m/engineering
        - button "Expand Engineering submodules"
      - listitem:
        - link "Tool Room 20":
          - /url: /m/tool-room
        - button "Expand Tool Room submodules"
      - listitem:
        - link "Die & Mold 20":
          - /url: /m/die-mold
        - button "Expand Die & Mold submodules"
      - listitem:
        - link "BOM 20":
          - /url: /m/bom
        - button "Expand BOM submodules"
      - listitem:
        - link "Routing & Process 20":
          - /url: /m/routing-process
        - button "Expand Routing & Process submodules"
    - paragraph: PLANNING & PROCUREMENT
    - list:
      - listitem:
        - link "Time & Action 31":
          - /url: /m/time-action
        - button "Expand Time & Action submodules"
      - listitem:
        - link "Production Planning Live data 20":
          - /url: /m/production-planning
          - text: Production Planning 20
        - button "Expand Production Planning submodules"
      - listitem:
        - link "MRP 20":
          - /url: /m/mrp
        - button "Expand MRP submodules"
      - listitem:
        - link "Procurement 27":
          - /url: /m/procurement
        - button "Expand Procurement submodules"
      - listitem:
        - link "Supplier Relations 20":
          - /url: /m/srm
        - button "Expand Supplier Relations submodules"
      - listitem:
        - link "Purchase Orders 14":
          - /url: /m/purchase-order
        - button "Expand Purchase Orders submodules"
      - listitem:
        - link "Import Commercial 31":
          - /url: /m/import-commercial
        - button "Expand Import Commercial submodules"
      - listitem:
        - link "Capacity & Scheduling 20":
          - /url: /m/capacity-scheduling
        - button "Expand Capacity & Scheduling submodules"
      - listitem:
        - link "Forecasting 20":
          - /url: /m/demand-forecasting
        - button "Expand Forecasting submodules"
    - paragraph: INVENTORY & WAREHOUSE
    - list:
      - listitem:
        - link "RM Warehouse 20":
          - /url: /m/raw-material-warehouse
        - button "Expand RM Warehouse submodules"
      - listitem:
        - link "Inventory & Store Live data 41":
          - /url: /m/inventory-store
          - text: Inventory & Store 41
        - button "Expand Inventory & Store submodules"
      - listitem:
        - link "Barcode & RFID Live data 20":
          - /url: /m/barcode-rfid
          - text: Barcode & RFID 20
        - button "Expand Barcode & RFID submodules"
      - listitem:
        - link "FG Warehouse 20":
          - /url: /m/fg-warehouse
        - button "Expand FG Warehouse submodules"
    - paragraph: PRODUCTION
    - list:
      - listitem:
        - link "Production Management Live data 7":
          - /url: /m/production-management
          - text: Production Management 7
        - button "Expand Production Management submodules"
      - listitem:
        - link "Manufacturing Live data 35":
          - /url: /m/product-manufacturing
          - text: Manufacturing 35
        - button "Expand Manufacturing submodules"
      - listitem:
        - link "Tracking Live data 35":
          - /url: /m/production-tracking
          - text: Tracking 35
        - button "Expand Tracking submodules"
      - listitem:
        - link "Chemical 20":
          - /url: /m/chemical-management
        - button "Expand Chemical submodules"
      - listitem:
        - link "Plating & Finishing Live data 20":
          - /url: /m/plating-finishing
          - text: Plating & Finishing 20
        - button "Expand Plating & Finishing submodules"
    - paragraph: QUALITY & COMPLIANCE
    - list:
      - listitem:
        - link "Lab & Testing 20":
          - /url: /m/laboratory-testing
        - button "Expand Lab & Testing submodules"
      - listitem:
        - link "QMS 11":
          - /url: /m/qms
        - button "Expand QMS submodules"
      - listitem:
        - link "Rework & Rejection 20":
          - /url: /m/rework-rejection
        - button "Expand Rework & Rejection submodules"
      - listitem:
        - link "Scrap & Waste 20":
          - /url: /m/scrap-waste
        - button "Expand Scrap & Waste submodules"
      - listitem:
        - link "Compliance 5":
          - /url: /m/compliance
        - button "Expand Compliance submodules"
    - paragraph: LOGISTICS & EXPORT
    - list:
      - listitem:
        - link "Packaging 20":
          - /url: /m/packaging
        - button "Expand Packaging submodules"
      - listitem:
        - link "Dispatch & Logistics Live data 8":
          - /url: /m/dispatch-logistics
          - text: Dispatch & Logistics 8
        - button "Expand Dispatch & Logistics submodules"
      - listitem:
        - link "Export Commercial 116":
          - /url: /m/export-commercial
        - button "Expand Export Commercial submodules"
      - listitem:
        - link "Fleet & Transport 20":
          - /url: /m/fleet-transport
        - button "Expand Fleet & Transport submodules"
    - paragraph: FINANCE & ACCOUNTS
    - list:
      - listitem:
        - link "Finance & Accounts 19":
          - /url: /m/finance-accounts
        - button "Expand Finance & Accounts submodules"
      - listitem:
        - link "Cost & Budget 20":
          - /url: /m/cost-budget
        - button "Expand Cost & Budget submodules"
      - listitem:
        - link "Treasury & Cash 20":
          - /url: /m/treasury-cash
        - button "Expand Treasury & Cash submodules"
      - listitem:
        - link "LC & Banking 20":
          - /url: /m/lc-banking
        - button "Expand LC & Banking submodules"
      - listitem:
        - link "Tax & VAT 20":
          - /url: /m/tax-vat
        - button "Expand Tax & VAT submodules"
      - listitem:
        - link "Currency & Forex 20":
          - /url: /m/multi-currency-forex
        - button "Expand Currency & Forex submodules"
    - paragraph: ASSETS & MAINTENANCE
    - list:
      - listitem:
        - link "Asset Management 20":
          - /url: /m/asset-management
        - button "Expand Asset Management submodules"
      - listitem:
        - link "Maintenance 16":
          - /url: /m/maintenance
        - button "Expand Maintenance submodules"
      - listitem:
        - link "IoT Monitoring Live data 20":
          - /url: /m/iot-monitoring
          - text: IoT Monitoring 20
        - button "Expand IoT Monitoring submodules"
      - listitem:
        - link "Energy 20":
          - /url: /m/energy
        - button "Expand Energy submodules"
    - paragraph: GOVERNANCE & PLATFORM
    - list:
      - listitem:
        - link "Security & Gate Pass 20":
          - /url: /m/security-gatepass
        - button "Expand Security & Gate Pass submodules"
      - listitem:
        - link "Workflow & Approval 23":
          - /url: /m/workflow-approval
        - button "Expand Workflow & Approval submodules"
      - listitem:
        - link "Mobile App 20":
          - /url: /m/mobile-app
        - button "Expand Mobile App submodules"
      - listitem:
        - link "API & Integration 20":
          - /url: /m/api-integration
        - button "Expand API & Integration submodules"
      - listitem:
        - link "Sustainability & Risk 20":
          - /url: /m/sustainability-risk-audit
        - button "Expand Sustainability & Risk submodules"
      - listitem:
        - link "Contracts 20":
          - /url: /m/contract-management
        - button "Expand Contracts submodules"
      - listitem:
        - link "Identity & Access 20":
          - /url: /m/iam
        - button "Expand Identity & Access submodules"
      - listitem:
        - link "Notifications 34":
          - /url: /m/notification-center
        - button "Expand Notifications submodules"
      - listitem:
        - link "Knowledge & SOP 20":
          - /url: /m/knowledge-sop
        - button "Expand Knowledge & SOP submodules"
    - text: System Status LIVE
    - paragraph: All systems operational
    - paragraph: 75 modules · 1808 workspaces
- banner:
  - button "Collapse sidebar"
  - text: CEO Command Center DASHBOARD
  - button "Search modules… K"
  - text: Smart Global IT
  - button "Switch to light theme"
  - button "Language"
  - link "Messages, 5 unread":
    - /url: /m/crm-marketing/activities
    - text: "5"
  - button "Notifications, 6 unread": "6"
  - button "Account menu": Mohammad Sayem Super-Admin
- main:
  - navigation "Breadcrumb":
    - list:
      - listitem:
        - link "Home":
          - /url: /dashboard
      - listitem: CEO Command Center
  - heading "CEO Command Center" [level=1]
  - text: LIVE
  - paragraph: Real-time overview of your entire business
  - group "Reporting period":
    - button "Month"
    - button "Quarter"
    - button "Year" [pressed]
  - button "Export"
  - link "All 75 Modules":
    - /url: /modules
  - region "Headline performance indicators":
    - paragraph: Total Revenue
    - paragraph: $24.57M
    - text: +12.5% vs last year
    - img "Total Revenue trend"
    - paragraph: Total Profit
    - paragraph: $6.42M
    - text: +18.7% 26.1% margin
    - img "Total Profit trend"
    - paragraph: Sales Orders
    - paragraph: 25,846
    - text: +9.2% 1,284 open
    - img "Sales Orders trend"
    - paragraph: Production Output
    - paragraph: 182.4M pcs
    - text: +7.8% this fiscal year
    - img "Production Output trend"
    - paragraph: Active Buyers
    - paragraph: "568"
    - text: +4.6% 42 new this quarter
    - img "Active Buyers trend"
    - paragraph: On-Time In-Full
    - paragraph: 94.2%
    - text: +2.1% target 95%
    - img "On-Time In-Full trend"
  - region "Financial performance":
    - heading "Business Performance" [level=2]
    - paragraph: Revenue, profit and expenses on one scale
    - group "Business Performance view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: Revenue Profit Expenses
    - application: Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec $0 $6.5M $13M $19.5M $26M
    - text: All three measures share one currency axis — a second y-scale would invent a correlation that isn't in the data.
    - heading "Revenue Composition" [level=2]
    - paragraph: Where the $24.57M comes from
    - group "Revenue Composition view":
      - button "Chart view" [pressed]
      - button "Table view"
    - application
    - text: Total Revenue $24.57M FY 2025–26
    - list:
      - listitem:
        - text: Export Sales $18.92M
        - progressbar "Export Sales share"
        - text: 77.0%
      - listitem:
        - text: Local Sales $2.45M
        - progressbar "Local Sales share"
        - text: 10.0%
      - listitem:
        - text: Subcontract Service $1.85M
        - progressbar "Subcontract Service share"
        - text: 7.5%
      - listitem:
        - text: Tooling & Die Recovery $890K
        - progressbar "Tooling & Die Recovery share"
        - text: 3.6%
      - listitem:
        - text: Scrap & Recovery $460K
        - progressbar "Scrap & Recovery share"
        - text: 1.9%
  - region "Financial summary":
    - heading "Cash Position" [level=2]
    - paragraph: As of today
    - list:
      - listitem: Cash in Hand $2.45M
      - listitem: Bank Balance $8.92M
      - listitem: Accounts Receivable $5.32M
      - listitem: Accounts Payable -$3.15M
    - text: Net Cash Flow -$8.1M 13-week rolling +9.4%
    - heading "Cash Flow Forecast" [level=2]
    - paragraph: 13-week rolling inflow against outflow
    - group "Cash Flow Forecast view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: Inflow Outflow
    - application: W1 W2 W3 W4 W5 W6 W7 W8 W9 W10 W11 W12 W13 $0 $700K $1.4M $2.1M $2.8M
  - region "Operational counts":
    - paragraph: Total Products
    - text: 18,742 +4.3%
    - paragraph: Inventory Value
    - text: $12.78M +6.7%
    - paragraph: Low Stock Items
    - text: 236 -2.1%
    - paragraph: Active Suppliers
    - text: 1,245 +3.2%
    - paragraph: Shipments in Transit
    - text: 156 +8.4%
    - paragraph: Warehouses
    - text: 45 +1.6%
    - paragraph: Plants & Branches
    - text: 32 +2.0%
    - paragraph: Export Countries
    - text: 42 +5.0%
  - region "Market performance":
    - heading "Sales by Country" [level=2]
    - paragraph: Revenue share across export markets
    - group "Sales by Country view":
      - button "Chart view" [pressed]
      - button "Table view"
    - list:
      - listitem: Bangladesh $5.45M +15.2%
      - listitem: China $4.12M +11.3%
      - listitem: Vietnam $3.28M +18.4%
      - listitem: India $2.85M +9.8%
      - listitem: Turkey $2.24M +7.6%
      - listitem: Indonesia $1.68M +12.1%
      - listitem: Cambodia $1.42M +6.3%
      - listitem: Others $3.53M +5.4%
    - heading "Product Family Mix" [level=2]
    - paragraph: Revenue by accessory family
    - group "Product Family Mix view":
      - button "Chart view" [pressed]
      - button "Table view"
    - application
    - text: Families 7 $24.57M total
    - list:
      - listitem: Metal Buttons
      - listitem: Zippers & Sliders
      - listitem: Rivets & Burrs
      - listitem: Snap Fasteners
      - listitem: Metal Labels & Tags
      - listitem: Buckles & Hooks
    - heading "Live Alerts" [level=2]
    - text: LIVE
    - list:
      - listitem:
        - link "Low Stock Alert 236 items are low in stock 5 min ago":
          - /url: /m/inventory-store/min-max
      - listitem:
        - link "Payment Received $285,000 received from H&M Global 18 min ago":
          - /url: /m/treasury-cash/receipts
      - listitem:
        - 'link "New Order Received Order #SO-25246 received 26 min ago"':
          - /url: /m/sales-order/order-book
      - listitem:
        - link "Approval Required 23 requests are pending 34 min ago":
          - /url: /m/workflow-approval/my-approvals
      - listitem:
        - 'link "High Value Order Order #SO-25246 — $845,000 41 min ago"':
          - /url: /m/sales-order/order-value
      - listitem:
        - link "Die Life Threshold Die DM-0412 at 94% of rated shots 1 hr ago":
          - /url: /m/die-mold/shot-count
  - region "Order pipeline":
    - heading "Order Pipeline" [level=2]
    - paragraph: Inquiry to shipment conversion
    - group "Order Pipeline view":
      - button "Chart view" [pressed]
      - button "Table view"
    - list:
      - listitem: Inquiries 1,842 100%
      - listitem: Quotations 1,284 69.7%
      - listitem: Proforma Invoices 892 69.5%
      - listitem: Confirmed Orders 648 72.6%
      - listitem: In Production 512 79.0%
      - listitem: Shipped 468 91.4%
    - text: Stages are ordered, so they take a single-hue ordinal ramp rather than eight categorical colours.
    - heading "Top Performing Buyers" [level=2]
    - paragraph: By revenue this fiscal year
    - link "All buyers":
      - /url: /m/crm-marketing/accounts
    - table "Top performing buyers by revenue, orders, margin and growth":
      - caption: Top performing buyers by revenue, orders, margin and growth
      - rowgroup:
        - row "Buyer Country Revenue Orders Margin Growth":
          - columnheader "Buyer"
          - columnheader "Country"
          - columnheader "Revenue"
          - columnheader "Orders"
          - columnheader "Margin"
          - columnheader "Growth"
      - rowgroup:
        - row "H&M Global Sourcing Active Sweden $3.42M 412 27.4% +14.2%":
          - rowheader "H&M Global Sourcing Active"
          - cell "Sweden"
          - cell "$3.42M"
          - cell "412"
          - cell "27.4%"
          - cell "+14.2%"
        - row "Inditex / Zara Active Spain $2.98M 368 29.1% +18.6%":
          - rowheader "Inditex / Zara Active"
          - cell "Spain"
          - cell "$2.98M"
          - cell "368"
          - cell "29.1%"
          - cell "+18.6%"
        - row "Levi Strauss & Co. Active USA $2.64M 296 31.2% +9.4%":
          - rowheader "Levi Strauss & Co. Active"
          - cell "USA"
          - cell "$2.64M"
          - cell "296"
          - cell "31.2%"
          - cell "+9.4%"
        - row "Primark Sourcing At Risk Ireland $2.18M 344 22.8% -3.2%":
          - rowheader "Primark Sourcing At Risk"
          - cell "Ireland"
          - cell "$2.18M"
          - cell "344"
          - cell "22.8%"
          - cell "-3.2%"
        - row "Uniqlo / Fast Retailing Active Japan $1.92M 254 28.6% +21.5%":
          - rowheader "Uniqlo / Fast Retailing Active"
          - cell "Japan"
          - cell "$1.92M"
          - cell "254"
          - cell "28.6%"
          - cell "+21.5%"
        - row "Decathlon Sourcing Active France $1.64M 218 25.3% +12.8%":
          - rowheader "Decathlon Sourcing Active"
          - cell "France"
          - cell "$1.64M"
          - cell "218"
          - cell "25.3%"
          - cell "+12.8%"
        - row "C&A Buying Active Germany $1.38M 186 24.1% +4.6%":
          - rowheader "C&A Buying Active"
          - cell "Germany"
          - cell "$1.38M"
          - cell "186"
          - cell "24.1%"
          - cell "+4.6%"
        - row "Bestseller A/S New Denmark $1.12M 164 26.7% +32.4%":
          - rowheader "Bestseller A/S New"
          - cell "Denmark"
          - cell "$1.12M"
          - cell "164"
          - cell "26.7%"
          - cell "+32.4%"
  - region "Manufacturing performance":
    - heading "Line OEE" [level=2]
    - paragraph: Availability × performance × quality
    - group "Line OEE view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: "Availability Performance Quality 85.5% Plant OEE World-class benchmark: 85%"
    - list:
      - listitem:
        - text: Stamping A
        - progressbar "Stamping A OEE"
        - text: 87.4%
      - listitem:
        - text: Stamping B
        - progressbar "Stamping B OEE"
        - text: 82.1%
      - listitem:
        - text: Plating 1
        - progressbar "Plating 1 OEE"
        - text: 91.2%
      - listitem:
        - text: Plating 2
        - progressbar "Plating 2 OEE"
        - text: 94.6%
      - listitem:
        - text: Plating 3
        - progressbar "Plating 3 OEE"
        - text: 68.4%
      - listitem:
        - text: Assembly 1
        - progressbar "Assembly 1 OEE"
        - text: 89.7%
      - listitem:
        - text: Assembly 2
        - progressbar "Assembly 2 OEE"
        - text: 85.3%
    - heading "Machine Capacity Utilisation" [level=2]
    - paragraph: Percent of available hours used, by line and weekday
    - group "Machine Capacity Utilisation view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: Mon Tue Wed Thu Fri Sat Sun Stamping A
    - 'button "Stamping A, Mon: 64%"'
    - 'button "Stamping A, Tue: 80%"'
    - 'button "Stamping A, Wed: 63%"'
    - 'button "Stamping A, Thu: 87%"'
    - 'button "Stamping A, Fri: 79%"'
    - 'button "Stamping A, Sat: 80%"'
    - 'button "Stamping A, Sun: 35%"'
    - text: Stamping B
    - 'button "Stamping B, Mon: 89%"'
    - 'button "Stamping B, Tue: 89%"'
    - 'button "Stamping B, Wed: 71%"'
    - 'button "Stamping B, Thu: 71%"'
    - 'button "Stamping B, Fri: 94%"'
    - 'button "Stamping B, Sat: 66%"'
    - 'button "Stamping B, Sun: 20%"'
    - text: Plating 1
    - 'button "Plating 1, Mon: 68%"'
    - 'button "Plating 1, Tue: 84%"'
    - 'button "Plating 1, Wed: 95%"'
    - 'button "Plating 1, Thu: 99%"'
    - 'button "Plating 1, Fri: 70%"'
    - 'button "Plating 1, Sat: 62%"'
    - 'button "Plating 1, Sun: 37%"'
    - text: Plating 2
    - 'button "Plating 2, Mon: 70%"'
    - 'button "Plating 2, Tue: 90%"'
    - 'button "Plating 2, Wed: 87%"'
    - 'button "Plating 2, Thu: 92%"'
    - 'button "Plating 2, Fri: 99%"'
    - 'button "Plating 2, Sat: 68%"'
    - 'button "Plating 2, Sun: 28%"'
    - text: Plating 3
    - 'button "Plating 3, Mon: 65%"'
    - 'button "Plating 3, Tue: 75%"'
    - 'button "Plating 3, Wed: 78%"'
    - 'button "Plating 3, Thu: 82%"'
    - 'button "Plating 3, Fri: 87%"'
    - 'button "Plating 3, Sat: 80%"'
    - 'button "Plating 3, Sun: 41%"'
    - text: Assembly 1
    - 'button "Assembly 1, Mon: 96%"'
    - 'button "Assembly 1, Tue: 78%"'
    - 'button "Assembly 1, Wed: 63%"'
    - 'button "Assembly 1, Thu: 75%"'
    - 'button "Assembly 1, Fri: 94%"'
    - 'button "Assembly 1, Sat: 71%"'
    - 'button "Assembly 1, Sun: 44%"'
    - text: Assembly 2
    - 'button "Assembly 2, Mon: 63%"'
    - 'button "Assembly 2, Tue: 99%"'
    - 'button "Assembly 2, Wed: 98%"'
    - 'button "Assembly 2, Thu: 78%"'
    - 'button "Assembly 2, Fri: 77%"'
    - 'button "Assembly 2, Sat: 87%"'
    - 'button "Assembly 2, Sun: 53%"'
    - text: 0% 99%
    - paragraph
    - heading "Production Flow" [level=2]
    - paragraph: Pieces cleared per stage
    - group "Production Flow view":
      - button "Chart view" [pressed]
      - button "Table view"
    - list:
      - listitem: Casting / Stamping 42.8M 100%
      - listitem: Polishing 38.4M 89.7%
      - listitem: Plating 34.1M 88.8%
      - listitem: Assembly 29.6M 86.8%
      - listitem: Inspection 27.9M 94.3%
      - listitem: Packing 26.4M 94.6%
  - region "Quality performance":
    - heading "Quality Trend" [level=2]
    - paragraph: Rejection, rework and first-pass yield — all in percent
    - group "Quality Trend view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: First Pass Yield Rejection Rate Rework Rate
    - application: Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec 0% 25% 50% 75% 100% FPY target 95%
    - heading "Defect Pareto" [level=2]
    - paragraph: Top defect drivers this quarter
    - group "Defect Pareto view":
      - button "Chart view" [pressed]
      - button "Table view"
    - list:
      - listitem: Plating Peel-off 428
      - listitem: Dimension Out of Tol. 316
      - listitem: Colour Mismatch 274
      - listitem: Surface Scratch 208
      - listitem: Burr / Sharp Edge 164
      - listitem: Weak Attachment 112
      - listitem: Rust Spot 68
    - text: One measure, nominal categories — every bar takes the same hue. Colouring by value would re-encode bar length.
  - region "Inventory and supply":
    - heading "Inventory Composition" [level=2]
    - paragraph: $12.78M held across stock types
    - group "Inventory Composition view":
      - button "Chart view" [pressed]
      - button "Table view"
    - application
    - text: Inventory Value $12.78M
    - list:
      - listitem: Raw Material $5.24M
      - listitem: Work in Progress $3.18M
      - listitem: Finished Goods $2.94M
      - listitem: Packing Material $860K
      - listitem: Consumables & Chemicals $560K
    - heading "Stock Aging" [level=2]
    - paragraph: Value held by age bucket
    - group "Stock Aging view":
      - button "Chart view" [pressed]
      - button "Table view"
    - application: 0–30 d 31–60 d 91–180 d 180+ d $0 $2M $4M $6M $8M
    - text: Age buckets are ordered, so the reader should see the order — but with one series, slot 1 plus the axis order carries it.
    - heading "Supplier Capability" [level=2]
    - paragraph: Top supplier against the supplier-base average
    - group "Supplier Capability view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: Top Supplier Base Average
    - application: Quality Delivery Price Responsiveness Compliance Capacity 0 25 50 75 100
  - region "Margin, energy and logistics":
    - heading "Order Value vs Margin" [level=2]
    - paragraph: Each bubble is one order; size is quantity
    - group "Order Value vs Margin view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: Metal Buttons Zippers & Sliders Rivets & Burrs
    - application: $0 $150K $300K $450K $600K Order value (USD) 0% 9% 18% 27% 36%
    - text: "Scatter is an all-pairs form: any two marks can touch, so it carries a three-series cap rather than the usual eight."
    - heading "Energy Consumption" [level=2]
    - paragraph: Purchased and self-generated, in kWh equivalent
    - group "Energy Consumption view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: Grid Electricity Natural Gas Solar Generation
    - application: Feb Apr Jun Aug Oct Dec 0 350K 700K 1.05M 1.4M
    - heading "Shipment Status" [level=2]
    - paragraph: 1,536 shipments this quarter
    - text: Delivered 1,284
    - progressbar "Delivered share"
    - text: 83.6% In Transit 156
    - progressbar "In Transit share"
    - text: 10.2% At Port 72
    - progressbar "At Port share"
    - text: 4.7% Delayed 24
    - progressbar "Delayed share"
    - text: 1.6% Workforce present 2,255 / 2,453
    - progressbar "Attendance rate"
    - text: 91.9%
  - region "Insights and governance":
    - heading "AI Business Insights" [level=2]
    - paragraph: Ranked by revenue impact
    - link "View all":
      - /url: /m/ai-center/insight-feed
    - list:
      - listitem:
        - link "Sales are up 12.5% this month Metal buttons and rivets are driving the gain across EU buyers.":
          - /url: /m/bi-analytics/sales-analytics
      - listitem:
        - link "236 products are running low in stock Reorder now to avoid stockouts on 14 confirmed orders.":
          - /url: /m/mrp/shortage
      - listitem:
        - link "Plating line 2 shows the best yield Consider shifting antique-finish volume from line 4 to line 2.":
          - /url: /m/plating-finishing/line-efficiency
      - listitem:
        - link "Profit margin improved by 2.3% Zinc alloy price negotiation is holding through this quarter.":
          - /url: /m/cost-budget/variance-analysis
      - listitem:
        - link "Order SO-25188 is at delivery risk Plating stage is 4 days behind the T&A critical path.":
          - /url: /m/time-action/delay-alerts
    - heading "Waiting on You" [level=2]
    - paragraph: 88 approvals pending
    - link "Open queue":
      - /url: /m/workflow-approval/my-approvals
    - list:
      - listitem:
        - link "Purchase Requisitions 27":
          - /url: /m/procurement/requisitions
      - listitem:
        - link "Quotation Discounts 9":
          - /url: /m/quotation-costing/approval-matrix
      - listitem:
        - link "Sample Approvals 15":
          - /url: /m/sample-management/approval-tracking
      - listitem:
        - link "Payment Releases 19":
          - /url: /m/finance-accounts/accounts-payable
      - listitem:
        - link "Engineering Changes 6":
          - /url: /m/plm/change-requests
      - listitem:
        - link "Overtime Sanctions 12":
          - /url: /m/organization-management/shifts
    - heading "System Status" [level=2]
    - paragraph: 1 service degraded
    - text: LIVE
    - list:
      - listitem: Application Server 99.99% operational
      - listitem: Database Cluster 99.98% operational
      - listitem: Backup & Replication 100% operational
      - listitem: Security Gateway 99.97% operational
      - listitem: API Services 99.42% degraded
      - listitem: Payment Gateway 99.95% operational
      - listitem: IoT Ingest Pipeline 99.91% operational
    - heading "Quick Actions" [level=2]
    - link "New Sales Order":
      - /url: /m/sales-order/create-order
    - link "Create Quotation":
      - /url: /m/quotation-costing/new-quotation
    - link "Raise Purchase Order":
      - /url: /m/purchase-order/create-po
    - link "Log Production":
      - /url: /m/production/output-entry
    - link "Sample Request":
      - /url: /m/sample-management/sample-requests
    - link "Stock Transfer":
      - /url: /m/inventory-store/transfers
  - region "Cost structure":
    - heading "Revenue, Profit and Expense by Month" [level=2]
    - paragraph: Bars are revenue and expenses; the line is profit — one shared currency scale
    - group "Revenue, Profit and Expense by Month view":
      - button "Chart view" [pressed]
      - button "Table view"
    - paragraph: Total Revenue
    - paragraph: $224.41M
    - paragraph: Total Expenses
    - paragraph: $160.71M
    - paragraph: Net Profit
    - paragraph: $63.7M
    - paragraph: Profit Margin
    - paragraph: 28.4%
    - text: Revenue Expenses Profit
    - application: Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec $0 $6.5M $13M $19.5M $26M
  - text: Smart Metal Garments Accessories ERP · AI Powered World Class Enterprise Edition Demo data — no backend connected
- contentinfo:
  - paragraph: "Metal ERP · Smart Global IT · Director: Mohammad Sayem · +8801711-772407"
  - paragraph: Chittagong South Kulshi, Bangladesh
- alert
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | test.describe("Shell and navigation", () => {
  4   |   test("root redirects to the command centre", async ({ page }) => {
  5   |     await page.goto("/");
  6   |     await expect(page).toHaveURL(/\/dashboard$/);
  7   |     await expect(
  8   |       page.getByRole("heading", { name: "CEO Command Center", level: 1 }),
  9   |     ).toBeVisible();
  10  |   });
  11  | 
  12  |   test("sidebar lists every module group", async ({ page }) => {
  13  |     await page.goto("/dashboard");
  14  | 
  15  |     const nav = page.getByRole("navigation", { name: "Module navigation" });
  16  |     await expect(nav).toBeVisible();
  17  | 
  18  |     for (const caption of [
  19  |       "OVERVIEW",
  20  |       "PEOPLE & HR",
  21  |       "SALES & MERCHANDISING",
  22  |       "MANUFACTURING",
  23  |       "FINANCE & ACCOUNTS",
  24  |       "GOVERNANCE & PLATFORM",
  25  |     ]) {
> 26  |       await expect(nav.getByText(caption, { exact: true })).toBeVisible();
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  27  |     }
  28  |   });
  29  | 
  30  |   // The sidebar's own filter box was removed — module search is the ⌘K
  31  |   // command palette, covered under "Command palette" below.
  32  | 
  33  |   test("expanding a module reveals its submodules and navigates", async ({
  34  |     page,
  35  |   }) => {
  36  |     await page.goto("/dashboard");
  37  | 
  38  |     const nav = page.getByRole("navigation", { name: "Module navigation" });
  39  |     await nav
  40  |       .getByRole("button", { name: /Expand Sales Orders submodules/ })
  41  |       .click();
  42  | 
  43  |     const orderBook = nav.getByRole("link", { name: "Order Book", exact: true });
  44  |     await expect(orderBook).toBeVisible();
  45  |     await orderBook.click();
  46  | 
  47  |     await expect(page).toHaveURL(/\/m\/sales-order\/order-book$/);
  48  |     await expect(
  49  |       page.getByRole("heading", { name: "Order Book", level: 1 }),
  50  |     ).toBeVisible();
  51  |   });
  52  | 
  53  |   test("module directory lists all 75 modules", async ({ page }) => {
  54  |     await page.goto("/modules");
  55  | 
  56  |     await expect(
  57  |       page.getByRole("heading", { name: "All Modules", level: 1 }),
  58  |     ).toBeVisible();
  59  |     await expect(page.getByText(/75 core modules · 1,?500 workspaces/)).toBeVisible();
  60  |   });
  61  | 
  62  |   test("breadcrumbs walk back up the hierarchy", async ({ page }) => {
  63  |     await page.goto("/m/qms/capa");
  64  | 
  65  |     const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
  66  |     await expect(crumbs).toBeVisible();
  67  |     await crumbs.getByRole("link", { name: "QMS" }).click();
  68  | 
  69  |     await expect(page).toHaveURL(/\/m\/qms$/);
  70  |     await expect(
  71  |       page.getByRole("heading", {
  72  |         name: "Quality Management System (QMS)",
  73  |         level: 1,
  74  |       }),
  75  |     ).toBeVisible();
  76  |   });
  77  | 
  78  |   test("unknown module slug renders the not-found page", async ({ page }) => {
  79  |     const response = await page.goto("/m/this-module-does-not-exist");
  80  |     expect(response?.status()).toBe(404);
  81  |     await expect(
  82  |       page.getByRole("heading", { name: "Workspace not found" }),
  83  |     ).toBeVisible();
  84  |   });
  85  | 
  86  |   test("unknown submodule slug renders the not-found page", async ({ page }) => {
  87  |     const response = await page.goto("/m/qms/not-a-real-workspace");
  88  |     expect(response?.status()).toBe(404);
  89  |     await expect(
  90  |       page.getByRole("heading", { name: "Workspace not found" }),
  91  |     ).toBeVisible();
  92  |   });
  93  | 
  94  |   test("skip link is reachable and targets main content", async ({ page }) => {
  95  |     await page.goto("/dashboard");
  96  |     await page.keyboard.press("Tab");
  97  | 
  98  |     const skip = page.getByRole("link", { name: "Skip to main content" });
  99  |     await expect(skip).toBeFocused();
  100 |     await expect(skip).toHaveAttribute("href", "#main-content");
  101 |   });
  102 | });
  103 | 
  104 | test.describe("Command palette", () => {
  105 |   test("opens with the keyboard and navigates to a workspace", async ({
  106 |     page,
  107 |   }) => {
  108 |     await page.goto("/dashboard");
  109 |     await page.keyboard.press("ControlOrMeta+k");
  110 | 
  111 |     const dialog = page.getByRole("dialog", {
  112 |       name: "Search modules and workspaces",
  113 |     });
  114 |     await expect(dialog).toBeVisible();
  115 | 
  116 |     await dialog.getByRole("textbox", { name: "Search" }).fill("shop floor");
  117 |     await page.keyboard.press("Enter");
  118 | 
  119 |     await expect(page).toHaveURL(/\/m\/mes\/shop-floor$/);
  120 |   });
  121 | 
  122 |   test("closes on Escape", async ({ page }) => {
  123 |     await page.goto("/dashboard");
  124 |     await page.keyboard.press("ControlOrMeta+k");
  125 | 
  126 |     const dialog = page.getByRole("dialog", {
```