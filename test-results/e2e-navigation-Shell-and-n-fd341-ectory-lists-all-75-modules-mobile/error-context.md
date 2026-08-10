# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\navigation.spec.ts >> Shell and navigation >> module directory lists all 75 modules
- Location: tests\e2e\navigation.spec.ts:53:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/75 core modules · 1,?500 workspaces/)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/75 core modules · 1,?500 workspaces/)

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- banner:
  - button "Open navigation"
  - button "Search modules…"
  - button "Switch to light theme"
  - button "Notifications, 6 unread": "6"
  - button "Account menu"
- main:
  - navigation "Breadcrumb":
    - list:
      - listitem:
        - link "Home":
          - /url: /dashboard
      - listitem: Modules
  - heading "All Modules" [level=1]
  - text: LIVE
  - paragraph: 75 core modules · 1808 workspaces across the enterprise
  - group "Directory view":
    - button "Grid" [pressed]
    - button "List"
  - heading "Module Coverage by Domain" [level=2]
  - paragraph: How the 75 modules and their workspaces distribute across the business
  - group "Module Coverage by Domain view":
    - button "Chart view" [pressed]
    - button "Table view"
  - text: Modules Workspaces
  - application: 0 80 160 240 320 Command &Intelligence People & HR Setup &Master Data Sales & Customer Product &Engineering Planning &Procurement Inventory &Warehouse Production Quality &Compliance Logistics & Export Finance &Accounts Assets &Maintenance Governance &Platform
  - searchbox "Search modules"
  - region "Command & Intelligence":
    - heading "Command & Intelligence" [level=2]
    - paragraph: 3 modules · 60 workspaces
    - list:
      - listitem:
        - link "Executive Dashboard Module 1 LIVE Real-time command centre for company-wide KPIs, targets and board-level reporting. 20 workspaces":
          - /url: /m/executive-dashboard
          - paragraph: Executive Dashboard
          - paragraph: Module 1
          - text: LIVE
          - paragraph: Real-time command centre for company-wide KPIs, targets and board-level reporting.
          - text: 20 workspaces
      - listitem:
        - link "AI Center Module 5 LIVE Forecasting, anomaly detection, copilots and automation agents across every module. 20 workspaces 6":
          - /url: /m/ai-center
          - paragraph: AI Center
          - paragraph: Module 5
          - text: LIVE
          - paragraph: Forecasting, anomaly detection, copilots and automation agents across every module.
          - text: 20 workspaces 6
      - listitem:
        - link "BI & Analytics Module 58 Self-service reporting, cross-module analysis and scheduled distribution. 20 workspaces":
          - /url: /m/bi-analytics
          - paragraph: BI & Analytics
          - paragraph: Module 58
          - paragraph: Self-service reporting, cross-module analysis and scheduled distribution.
          - text: 20 workspaces
  - region "People & HR":
    - heading "People & HR" [level=2]
    - paragraph: 1 modules · 20 workspaces
    - list:
      - listitem:
        - link "HRMS & Payroll Module 2 The whole employee lifecycle — hiring, attendance, leave, payroll and performance. 20 workspaces 13":
          - /url: /m/hrms-payroll
          - paragraph: HRMS & Payroll
          - paragraph: Module 2
          - paragraph: The whole employee lifecycle — hiring, attendance, leave, payroll and performance.
          - text: 20 workspaces 13
  - region "Setup & Master Data":
    - heading "Setup & Master Data" [level=2]
    - paragraph: 7 modules · 140 workspaces
    - list:
      - listitem:
        - link "Organization Module 3 Legal entities, plants, branches, departments, cost centres and the org hierarchy. 20 workspaces":
          - /url: /m/organization-management
          - paragraph: Organization
          - paragraph: Module 3
          - paragraph: Legal entities, plants, branches, departments, cost centres and the org hierarchy.
          - text: 20 workspaces
      - listitem:
        - link "Master Data Module 4 The single source of truth for items, customers, suppliers, UoM and all shared code sets. 20 workspaces":
          - /url: /m/master-data
          - paragraph: Master Data
          - paragraph: Module 4
          - paragraph: The single source of truth for items, customers, suppliers, UoM and all shared code sets.
          - text: 20 workspaces
      - listitem:
        - link "AI Document Input Module 7 Drop a PDF, sheet or email — OCR, extraction and validation turn it into ERP records. 20 workspaces 12":
          - /url: /m/ai-document-input
          - paragraph: AI Document Input
          - paragraph: Module 7
          - paragraph: Drop a PDF, sheet or email — OCR, extraction and validation turn it into ERP records.
          - text: 20 workspaces 12
      - listitem:
        - link "Documents Module 56 Central repository with versioning, retention policy and controlled distribution. 20 workspaces":
          - /url: /m/dms
          - paragraph: Documents
          - paragraph: Module 56
          - paragraph: Central repository with versioning, retention policy and controlled distribution.
          - text: 20 workspaces
      - listitem:
        - link "Factory & Plant Module 62 Each manufacturing site as its own entity — capacity, utilities, licences and output. 20 workspaces":
          - /url: /m/factory-plant
          - paragraph: Factory & Plant
          - paragraph: Module 62
          - paragraph: Each manufacturing site as its own entity — capacity, utilities, licences and output.
          - text: 20 workspaces
      - listitem:
        - link "Branch & Location Module 63 Offices, showrooms and geographic hierarchy with territory and performance mapping. 20 workspaces":
          - /url: /m/branch-location
          - paragraph: Branch & Location
          - paragraph: Module 63
          - paragraph: Offices, showrooms and geographic hierarchy with territory and performance mapping.
          - text: 20 workspaces
      - listitem:
        - link "Buyer Master Module 64 One authoritative record per buyer — brands, terms, requirements and credit standing. 20 workspaces":
          - /url: /m/buyer-master
          - paragraph: Buyer Master
          - paragraph: Module 64
          - paragraph: One authoritative record per buyer — brands, terms, requirements and credit standing.
          - text: 20 workspaces
  - region "Sales & Customer":
    - heading "Sales & Customer" [level=2]
    - paragraph: 9 modules · 210 workspaces
    - list:
      - listitem:
        - link "CRM & Marketing Module 6 Accounts, contacts, pipeline, campaigns and buyer relationship health in one place. 20 workspaces":
          - /url: /m/crm-marketing
          - paragraph: CRM & Marketing
          - paragraph: Module 6
          - paragraph: Accounts, contacts, pipeline, campaigns and buyer relationship health in one place.
          - text: 20 workspaces
      - listitem:
        - link "Inquiry & Lead Module 8 Capture, qualify and route every buyer inquiry until it becomes a costed opportunity. 20 workspaces 18":
          - /url: /m/inquiry-lead
          - paragraph: Inquiry & Lead
          - paragraph: Module 8
          - paragraph: Capture, qualify and route every buyer inquiry until it becomes a costed opportunity.
          - text: 20 workspaces 18
      - listitem:
        - link "Quotation & Costing Module 9 Build defensible costs from BOM, process and overhead, then quote with confidence. 20 workspaces 9":
          - /url: /m/quotation-costing
          - paragraph: Quotation & Costing
          - paragraph: Module 9
          - paragraph: Build defensible costs from BOM, process and overhead, then quote with confidence.
          - text: 20 workspaces 9
      - listitem:
        - link "Proforma Invoice Module 10 The full proforma invoice desk — AI import and validation, PI entry and register, commercial and shipping terms, approval, revision and amendment control, compliance, reporting and business intelligence. 50 workspaces 24":
          - /url: /m/proforma-invoice
          - paragraph: Proforma Invoice
          - paragraph: Module 10
          - paragraph: The full proforma invoice desk — AI import and validation, PI entry and register, commercial and shipping terms, approval, revision and amendment control, compliance, reporting and business intelligence.
          - text: 50 workspaces 24
      - listitem:
        - link "Sales Orders Module 11 LIVE The order book — confirmation, amendments, allocation and delivery commitment tracking. 20 workspaces 24":
          - /url: /m/sales-order
          - paragraph: Sales Orders
          - paragraph: Module 11
          - text: LIVE
          - paragraph: The order book — confirmation, amendments, allocation and delivery commitment tracking.
          - text: 20 workspaces 24
      - listitem:
        - link "Buyer Portal Module 44 The outside-facing window — buyers see orders, samples, shipments and documents. 20 workspaces":
          - /url: /m/buyer-portal
          - paragraph: Buyer Portal
          - paragraph: Module 44
          - paragraph: The outside-facing window — buyers see orders, samples, shipments and documents.
          - text: 20 workspaces
      - listitem:
        - link "Sales & BD Module 65 Targets, territories and growth initiatives that turn the pipeline into a plan. 20 workspaces":
          - /url: /m/sales-business-development
          - paragraph: Sales & BD
          - paragraph: Module 65
          - paragraph: Targets, territories and growth initiatives that turn the pipeline into a plan.
          - text: 20 workspaces
      - listitem:
        - link "Customer Service Module 66 Every buyer complaint from intake to closure, with root cause and SLA discipline. 20 workspaces 9":
          - /url: /m/customer-service
          - paragraph: Customer Service
          - paragraph: Module 66
          - paragraph: Every buyer complaint from intake to closure, with root cause and SLA discipline.
          - text: 20 workspaces 9
      - listitem:
        - link "RMA & Claims Module 75 Authorised returns, buyer claims and the recovery of what those failures cost us. 20 workspaces 6":
          - /url: /m/rma-claims
          - paragraph: RMA & Claims
          - paragraph: Module 75
          - paragraph: Authorised returns, buyer claims and the recovery of what those failures cost us.
          - text: 20 workspaces 6
  - region "Product & Engineering":
    - heading "Product & Engineering" [level=2]
    - paragraph: 9 modules · 180 workspaces
    - list:
      - listitem:
        - link "Product Development Module 12 Idea to validated product — concepts, trials, material research and design freeze. 20 workspaces":
          - /url: /m/product-development
          - paragraph: Product Development
          - paragraph: Module 12
          - paragraph: Idea to validated product — concepts, trials, material research and design freeze.
          - text: 20 workspaces
      - listitem:
        - link "PLM Module 13 Versioned product records from launch through revision to end-of-life. 20 workspaces":
          - /url: /m/plm
          - paragraph: PLM
          - paragraph: Module 13
          - paragraph: Versioned product records from launch through revision to end-of-life.
          - text: 20 workspaces
      - listitem:
        - link "Sample Management Module 14 Every sample request, development round and buyer approval, tracked to a decision. 20 workspaces 15":
          - /url: /m/sample-management
          - paragraph: Sample Management
          - paragraph: Module 14
          - paragraph: Every sample request, development round and buyer approval, tracked to a decision.
          - text: 20 workspaces 15
      - listitem:
        - link "Artwork & Design Module 15 Logos, engravings and print artwork with versioning and buyer sign-off. 20 workspaces":
          - /url: /m/artwork-design
          - paragraph: Artwork & Design
          - paragraph: Module 15
          - paragraph: Logos, engravings and print artwork with versioning and buyer sign-off.
          - text: 20 workspaces
      - listitem:
        - link "Engineering Module 16 Drawings, technical specs, tolerances and manufacturability sign-off. 20 workspaces":
          - /url: /m/engineering
          - paragraph: Engineering
          - paragraph: Module 16
          - paragraph: Drawings, technical specs, tolerances and manufacturability sign-off.
          - text: 20 workspaces
      - listitem:
        - link "Tool Room Module 17 Tool inventory, issue-return, sharpening cycles and tool life economics. 20 workspaces":
          - /url: /m/tool-room
          - paragraph: Tool Room
          - paragraph: Module 17
          - paragraph: Tool inventory, issue-return, sharpening cycles and tool life economics.
          - text: 20 workspaces
      - listitem:
        - link "Die & Mold Module 18 Die master, shot counts, maintenance and buyer-owned tooling accountability. 20 workspaces":
          - /url: /m/die-mold
          - paragraph: Die & Mold
          - paragraph: Module 18
          - paragraph: Die master, shot counts, maintenance and buyer-owned tooling accountability.
          - text: 20 workspaces
      - listitem:
        - link "BOM Module 19 Multi-level BOMs with alternates, wastage factors and costed roll-ups. 20 workspaces":
          - /url: /m/bom
          - paragraph: BOM
          - paragraph: Module 19
          - paragraph: Multi-level BOMs with alternates, wastage factors and costed roll-ups.
          - text: 20 workspaces
      - listitem:
        - link "Routing & Process Module 20 Operation sequences, work centres, cycle times and standard process definitions. 20 workspaces":
          - /url: /m/routing-process
          - paragraph: Routing & Process
          - paragraph: Module 20
          - paragraph: Operation sequences, work centres, cycle times and standard process definitions.
          - text: 20 workspaces
  - region "Planning & Procurement":
    - heading "Planning & Procurement" [level=2]
    - paragraph: 9 modules · 317 workspaces
    - list:
      - listitem:
        - link "Time & Action Module 21 Critical-path calendars per order with automatic escalation on slippage. 20 workspaces 31":
          - /url: /m/time-action
          - paragraph: Time & Action
          - paragraph: Module 21
          - paragraph: Critical-path calendars per order with automatic escalation on slippage.
          - text: 20 workspaces 31
      - listitem:
        - link "Production Planning Module 22 LIVE Capacity-balanced master schedules, line loading and sequencing to the shop floor. 20 workspaces":
          - /url: /m/production-planning
          - paragraph: Production Planning
          - paragraph: Module 22
          - text: LIVE
          - paragraph: Capacity-balanced master schedules, line loading and sequencing to the shop floor.
          - text: 20 workspaces
      - listitem:
        - link "MRP Module 23 Net requirements, coverage and purchase suggestions driven by demand and stock. 20 workspaces":
          - /url: /m/mrp
          - paragraph: MRP
          - paragraph: Module 23
          - paragraph: Net requirements, coverage and purchase suggestions driven by demand and stock.
          - text: 20 workspaces
      - listitem:
        - link "Procurement Module 24 Requisition to award — RFQ, comparison, negotiation and sourcing strategy. 20 workspaces 27":
          - /url: /m/procurement
          - paragraph: Procurement
          - paragraph: Module 24
          - paragraph: Requisition to award — RFQ, comparison, negotiation and sourcing strategy.
          - text: 20 workspaces 27
      - listitem:
        - link "Supplier Relations Module 25 Supplier onboarding, scorecards, audits, risk and development programmes. 20 workspaces":
          - /url: /m/srm
          - paragraph: Supplier Relations
          - paragraph: Module 25
          - paragraph: Supplier onboarding, scorecards, audits, risk and development programmes.
          - text: 20 workspaces
      - listitem:
        - link "Purchase Orders Module 26 Issue, amend, follow up and close purchase orders with full receipt visibility. 20 workspaces 14":
          - /url: /m/purchase-order
          - paragraph: Purchase Orders
          - paragraph: Module 26
          - paragraph: Issue, amend, follow up and close purchase orders with full receipt visibility.
          - text: 20 workspaces 14
      - listitem:
        - link "Import Commercial Module 27 The full import commercial desk — planning and indenting, supplier and contract control, proforma invoices, the whole LC instrument family, landed cost build-up, tariff, bond and customs compliance, shipment and container tracking, duty, payment and settlement, the report pack and the AI layer on top. 157 workspaces 31":
          - /url: /m/import-commercial
          - paragraph: Import Commercial
          - paragraph: Module 27
          - paragraph: The full import commercial desk — planning and indenting, supplier and contract control, proforma invoices, the whole LC instrument family, landed cost build-up, tariff, bond and customs compliance, shipment and container tracking, duty, payment and settlement, the report pack and the AI layer on top.
          - text: 157 workspaces 31
      - listitem:
        - link "Capacity & Scheduling Module 72 Finite scheduling against real machine and manpower availability, with what-if runs. 20 workspaces":
          - /url: /m/capacity-scheduling
          - paragraph: Capacity & Scheduling
          - paragraph: Module 72
          - paragraph: Finite scheduling against real machine and manpower availability, with what-if runs.
          - text: 20 workspaces
      - listitem:
        - link "Forecasting Module 74 A single agreed number for what we expect to sell and make — with accuracy measured. 20 workspaces":
          - /url: /m/demand-forecasting
          - paragraph: Forecasting
          - paragraph: Module 74
          - paragraph: A single agreed number for what we expect to sell and make — with accuracy measured.
          - text: 20 workspaces
  - region "Inventory & Warehouse":
    - heading "Inventory & Warehouse" [level=2]
    - paragraph: 4 modules · 80 workspaces
    - list:
      - listitem:
        - link "RM Warehouse Module 28 Receipt, inspection, put-away and issue of metal, chemicals and packaging inputs. 20 workspaces":
          - /url: /m/raw-material-warehouse
          - paragraph: RM Warehouse
          - paragraph: Module 28
          - paragraph: Receipt, inspection, put-away and issue of metal, chemicals and packaging inputs.
          - text: 20 workspaces
      - listitem:
        - link "Inventory & Store Module 29 LIVE Company-wide stock ledger, valuation, cycle counting and ageing control. 20 workspaces 41":
          - /url: /m/inventory-store
          - paragraph: Inventory & Store
          - paragraph: Module 29
          - text: LIVE
          - paragraph: Company-wide stock ledger, valuation, cycle counting and ageing control.
          - text: 20 workspaces 41
      - listitem:
        - link "Barcode & RFID Module 30 LIVE Label design, scanning stations and end-to-end genealogy from heat lot to carton. 20 workspaces":
          - /url: /m/barcode-rfid
          - paragraph: Barcode & RFID
          - paragraph: Module 30
          - text: LIVE
          - paragraph: Label design, scanning stations and end-to-end genealogy from heat lot to carton.
          - text: 20 workspaces
      - listitem:
        - link "FG Warehouse Module 40 Finished stock receipt, storage, picking and readiness against shipment plans. 20 workspaces":
          - /url: /m/fg-warehouse
          - paragraph: FG Warehouse
          - paragraph: Module 40
          - paragraph: Finished stock receipt, storage, picking and readiness against shipment plans.
          - text: 20 workspaces
  - region "Production":
    - heading "Production" [level=2]
    - paragraph: 5 modules · 145 workspaces
    - list:
      - listitem:
        - link "Production Management Module 31 LIVE Complete production planning and control — orders, routing, work centres, machines, operators, the material chain and the shop-floor transaction flow. 35 workspaces 7":
          - /url: /m/production-management
          - paragraph: Production Management
          - paragraph: Module 31
          - text: LIVE
          - paragraph: Complete production planning and control — orders, routing, work centres, machines, operators, the material chain and the shop-floor transaction flow.
          - text: 35 workspaces 7
      - listitem:
        - link "Manufacturing Module 32 LIVE The manufacturing of every metal accessory — button, snap, rivet, zipper and slider lines, the forming, plating and finishing processes, then assembly, quality, packing and transfer. 35 workspaces":
          - /url: /m/product-manufacturing
          - paragraph: Manufacturing
          - paragraph: Module 32
          - text: LIVE
          - paragraph: The manufacturing of every metal accessory — button, snap, rivet, zipper and slider lines, the forming, plating and finishing processes, then assembly, quality, packing and transfer.
          - text: 35 workspaces
      - listitem:
        - link "Tracking Module 33 LIVE Real-time tracking from PI to customer delivery — barcode and batch traceability, WIP and progress, then delivery order, gate pass, loading, dispatch and delivery confirmation. 35 workspaces":
          - /url: /m/production-tracking
          - paragraph: Tracking
          - paragraph: Module 33
          - text: LIVE
          - paragraph: Real-time tracking from PI to customer delivery — barcode and batch traceability, WIP and progress, then delivery order, gate pass, loading, dispatch and delivery confirmation.
          - text: 35 workspaces
      - listitem:
        - link "Chemical Module 34 Bath chemistry, consumption, MSDS, restricted substances and safe storage. 20 workspaces":
          - /url: /m/chemical-management
          - paragraph: Chemical
          - paragraph: Module 34
          - paragraph: Bath chemistry, consumption, MSDS, restricted substances and safe storage.
          - text: 20 workspaces
      - listitem:
        - link "Plating & Finishing Module 35 LIVE Plating lines, bath parameters, thickness control and finish quality outcomes. 20 workspaces":
          - /url: /m/plating-finishing
          - paragraph: Plating & Finishing
          - paragraph: Module 35
          - text: LIVE
          - paragraph: Plating lines, bath parameters, thickness control and finish quality outcomes.
          - text: 20 workspaces
  - region "Quality & Compliance":
    - heading "Quality & Compliance" [level=2]
    - paragraph: 5 modules · 100 workspaces
    - list:
      - listitem:
        - link "Lab & Testing Module 36 In-house and third-party testing, sample logging, results and certificate issuance. 20 workspaces":
          - /url: /m/laboratory-testing
          - paragraph: Lab & Testing
          - paragraph: Module 36
          - paragraph: In-house and third-party testing, sample logging, results and certificate issuance.
          - text: 20 workspaces
      - listitem:
        - link "QMS Module 37 Inspection plans, NCRs, CAPA, audits and the quality documentation backbone. 20 workspaces 11":
          - /url: /m/qms
          - paragraph: QMS
          - paragraph: Module 37
          - paragraph: Inspection plans, NCRs, CAPA, audits and the quality documentation backbone.
          - text: 20 workspaces 11
      - listitem:
        - link "Rework & Rejection Module 38 Everything that failed first pass — disposition, rework routing and cost of poor quality. 20 workspaces":
          - /url: /m/rework-rejection
          - paragraph: Rework & Rejection
          - paragraph: Module 38
          - paragraph: Everything that failed first pass — disposition, rework routing and cost of poor quality.
          - text: 20 workspaces
      - listitem:
        - link "Scrap & Waste Module 39 Metal scrap recovery, waste streams, disposal compliance and resale value. 20 workspaces":
          - /url: /m/scrap-waste
          - paragraph: Scrap & Waste
          - paragraph: Module 39
          - paragraph: Metal scrap recovery, waste streams, disposal compliance and resale value.
          - text: 20 workspaces
      - listitem:
        - link "Compliance Module 54 Social, environmental and buyer compliance — certificates, audits and CAP closure. 20 workspaces 5":
          - /url: /m/compliance
          - paragraph: Compliance
          - paragraph: Module 54
          - paragraph: Social, environmental and buyer compliance — certificates, audits and CAP closure.
          - text: 20 workspaces 5
  - region "Logistics & Export":
    - heading "Logistics & Export" [level=2]
    - paragraph: 4 modules · 176 workspaces
    - list:
      - listitem:
        - link "Packaging Module 41 Packing specifications, carton planning, packing lists and packaging consumption. 20 workspaces":
          - /url: /m/packaging
          - paragraph: Packaging
          - paragraph: Module 41
          - paragraph: Packing specifications, carton planning, packing lists and packaging consumption.
          - text: 20 workspaces
      - listitem:
        - link "Dispatch & Logistics Module 42 LIVE Gate-out to delivery — vehicle planning, freight cost and in-transit visibility. 20 workspaces 8":
          - /url: /m/dispatch-logistics
          - paragraph: Dispatch & Logistics
          - paragraph: Module 42
          - text: LIVE
          - paragraph: Gate-out to delivery — vehicle planning, freight cost and in-transit visibility.
          - text: 20 workspaces 8
      - listitem:
        - link "Export Commercial Module 43 The whole export commercial desk — planning and scheduling, the buyer and contract book, the full LC family, invoicing, certificates, booking and containers, customs, tracking, banking and realisation, incentives, profitability, compliance, reporting and the AI document layer. 116 workspaces":
          - /url: /m/export-commercial
          - paragraph: Export Commercial
          - paragraph: Module 43
          - paragraph: The whole export commercial desk — planning and scheduling, the buyer and contract book, the full LC family, invoicing, certificates, booking and containers, customs, tracking, banking and realisation, incentives, profitability, compliance, reporting and the AI document layer.
          - text: 116 workspaces
      - listitem:
        - link "Fleet & Transport Module 67 Owned and hired vehicles — trips, fuel, documents, maintenance and cost per kilometre. 20 workspaces":
          - /url: /m/fleet-transport
          - paragraph: Fleet & Transport
          - paragraph: Module 67
          - paragraph: Owned and hired vehicles — trips, fuel, documents, maintenance and cost per kilometre.
          - text: 20 workspaces
  - region "Finance & Accounts":
    - heading "Finance & Accounts" [level=2]
    - paragraph: 6 modules · 120 workspaces
    - list:
      - listitem:
        - link "Finance & Accounts Module 45 General ledger, receivables, payables and statutory financial reporting. 20 workspaces 19":
          - /url: /m/finance-accounts
          - paragraph: Finance & Accounts
          - paragraph: Module 45
          - paragraph: General ledger, receivables, payables and statutory financial reporting.
          - text: 20 workspaces 19
      - listitem:
        - link "Cost & Budget Module 46 Standard vs actual costing, variance analysis and budget-to-actual discipline. 20 workspaces":
          - /url: /m/cost-budget
          - paragraph: Cost & Budget
          - paragraph: Module 46
          - paragraph: Standard vs actual costing, variance analysis and budget-to-actual discipline.
          - text: 20 workspaces
      - listitem:
        - link "Treasury & Cash Module 47 Bank positions, cash flow forecasting, FX exposure and liquidity planning. 20 workspaces":
          - /url: /m/treasury-cash
          - paragraph: Treasury & Cash
          - paragraph: Module 47
          - paragraph: Bank positions, cash flow forecasting, FX exposure and liquidity planning.
          - text: 20 workspaces
      - listitem:
        - link "LC & Banking Module 48 Letters of credit, back-to-back structures, bank charges and limit utilisation. 20 workspaces":
          - /url: /m/lc-banking
          - paragraph: LC & Banking
          - paragraph: Module 48
          - paragraph: Letters of credit, back-to-back structures, bank charges and limit utilisation.
          - text: 20 workspaces
      - listitem:
        - link "Tax & VAT Module 49 VAT registers, returns, withholding tax and statutory filing calendars. 20 workspaces":
          - /url: /m/tax-vat
          - paragraph: Tax & VAT
          - paragraph: Module 49
          - paragraph: VAT registers, returns, withholding tax and statutory filing calendars.
          - text: 20 workspaces
      - listitem:
        - link "Currency & Forex Module 73 Rates, revaluation, exposure and hedging for a business that earns and spends in many currencies. 20 workspaces":
          - /url: /m/multi-currency-forex
          - paragraph: Currency & Forex
          - paragraph: Module 73
          - paragraph: Rates, revaluation, exposure and hedging for a business that earns and spends in many currencies.
          - text: 20 workspaces
  - region "Assets & Maintenance":
    - heading "Assets & Maintenance" [level=2]
    - paragraph: 4 modules · 80 workspaces
    - list:
      - listitem:
        - link "Asset Management Module 50 Fixed asset register, depreciation, transfers, insurance and disposal. 20 workspaces":
          - /url: /m/asset-management
          - paragraph: Asset Management
          - paragraph: Module 50
          - paragraph: Fixed asset register, depreciation, transfers, insurance and disposal.
          - text: 20 workspaces
      - listitem:
        - link "Maintenance Module 51 Preventive schedules, breakdown response, spares and maintenance effectiveness. 20 workspaces 16":
          - /url: /m/maintenance
          - paragraph: Maintenance
          - paragraph: Module 51
          - paragraph: Preventive schedules, breakdown response, spares and maintenance effectiveness.
          - text: 20 workspaces 16
      - listitem:
        - link "IoT Monitoring Module 52 LIVE Sensor telemetry from every machine — live parameters, thresholds and alarms. 20 workspaces":
          - /url: /m/iot-monitoring
          - paragraph: IoT Monitoring
          - paragraph: Module 52
          - text: LIVE
          - paragraph: Sensor telemetry from every machine — live parameters, thresholds and alarms.
          - text: 20 workspaces
      - listitem:
        - link "Energy Module 53 Electricity, gas and water consumption, energy intensity and cost per unit produced. 20 workspaces":
          - /url: /m/energy
          - paragraph: Energy
          - paragraph: Module 53
          - paragraph: Electricity, gas and water consumption, energy intensity and cost per unit produced.
          - text: 20 workspaces
  - region "Governance & Platform":
    - heading "Governance & Platform" [level=2]
    - paragraph: 9 modules · 180 workspaces
    - list:
      - listitem:
        - link "Security & Gate Pass Module 55 Gate movements, visitor control, material passes and site security incidents. 20 workspaces":
          - /url: /m/security-gatepass
          - paragraph: Security & Gate Pass
          - paragraph: Module 55
          - paragraph: Gate movements, visitor control, material passes and site security incidents.
          - text: 20 workspaces
      - listitem:
        - link "Workflow & Approval Module 57 Configurable approval chains, delegation and a single inbox for every pending decision. 20 workspaces 23":
          - /url: /m/workflow-approval
          - paragraph: Workflow & Approval
          - paragraph: Module 57
          - paragraph: Configurable approval chains, delegation and a single inbox for every pending decision.
          - text: 20 workspaces 23
      - listitem:
        - link "Mobile App Module 59 Companion app configuration, device enrolment, offline sync and push messaging. 20 workspaces":
          - /url: /m/mobile-app
          - paragraph: Mobile App
          - paragraph: Module 59
          - paragraph: Companion app configuration, device enrolment, offline sync and push messaging.
          - text: 20 workspaces
      - listitem:
        - link "API & Integration Module 60 Connectors, webhooks, API keys and the health of every outbound integration. 20 workspaces":
          - /url: /m/api-integration
          - paragraph: API & Integration
          - paragraph: Module 60
          - paragraph: Connectors, webhooks, API keys and the health of every outbound integration.
          - text: 20 workspaces
      - listitem:
        - link "Sustainability & Risk Module 61 ESG reporting, carbon accounting, enterprise risk register and internal audit. 20 workspaces":
          - /url: /m/sustainability-risk-audit
          - paragraph: Sustainability & Risk
          - paragraph: Module 61
          - paragraph: ESG reporting, carbon accounting, enterprise risk register and internal audit.
          - text: 20 workspaces
      - listitem:
        - link "Contracts Module 68 Drafting, approval and obligation tracking for every buyer, supplier and service contract. 20 workspaces":
          - /url: /m/contract-management
          - paragraph: Contracts
          - paragraph: Module 68
          - paragraph: Drafting, approval and obligation tracking for every buyer, supplier and service contract.
          - text: 20 workspaces
      - listitem:
        - link "Identity & Access Module 69 Who exists, what they may touch and the evidence that access stays appropriate. 20 workspaces":
          - /url: /m/iam
          - paragraph: Identity & Access
          - paragraph: Module 69
          - paragraph: Who exists, what they may touch and the evidence that access stays appropriate.
          - text: 20 workspaces
      - listitem:
        - link "Notifications Module 70 One place where every alert, announcement and outbound message is defined and traced. 20 workspaces 34":
          - /url: /m/notification-center
          - paragraph: Notifications
          - paragraph: Module 70
          - paragraph: One place where every alert, announcement and outbound message is defined and traced.
          - text: 20 workspaces 34
      - listitem:
        - link "Knowledge & SOP Module 71 Controlled SOPs, work instructions and how-to knowledge with read acknowledgement. 20 workspaces":
          - /url: /m/knowledge-sop
          - paragraph: Knowledge & SOP
          - paragraph: Module 71
          - paragraph: Controlled SOPs, work instructions and how-to knowledge with read acknowledgement.
          - text: 20 workspaces
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
  26  |       await expect(nav.getByText(caption, { exact: true })).toBeVisible();
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
> 59  |     await expect(page.getByText(/75 core modules · 1,?500 workspaces/)).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
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
  127 |       name: "Search modules and workspaces",
  128 |     });
  129 |     await expect(dialog).toBeVisible();
  130 | 
  131 |     await page.keyboard.press("Escape");
  132 |     await expect(dialog).toBeHidden();
  133 |   });
  134 | 
  135 |   test("reports no matches without crashing", async ({ page }) => {
  136 |     await page.goto("/dashboard");
  137 |     await page.keyboard.press("ControlOrMeta+k");
  138 | 
  139 |     const dialog = page.getByRole("dialog", {
  140 |       name: "Search modules and workspaces",
  141 |     });
  142 |     await dialog.getByRole("textbox", { name: "Search" }).fill("qqqqqqqqqq");
  143 |     await expect(
  144 |       dialog.getByText("No workspace matches that search."),
  145 |     ).toBeVisible();
  146 |   });
  147 | });
  148 | 
  149 | test.describe("Theme", () => {
  150 |   test("toggles between dark and light and persists", async ({ page }) => {
  151 |     await page.goto("/dashboard");
  152 | 
  153 |     const html = page.locator("html");
  154 |     await expect(html).toHaveAttribute("data-theme", "dark");
  155 | 
  156 |     await page.getByRole("button", { name: /Switch to light theme/ }).click();
  157 |     await expect(html).toHaveAttribute("data-theme", "light");
  158 | 
  159 |     await page.reload();
```