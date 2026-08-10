# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\dashboard.spec.ts >> Flagship workspaces >> Shop Floor Control renders its bespoke surface
- Location: tests\e2e\dashboard.spec.ts:127:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Shop Floor Control', level: 1 })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Shop Floor Control', level: 1 })

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
  - heading "Workspace not found" [level=1]
  - paragraph: That module or workspace does not exist in this ERP. It may have been renamed, or the address may be mistyped.
  - link "Command Center":
    - /url: /dashboard
  - link "Browse all 75 modules":
    - /url: /modules
- contentinfo:
  - paragraph: "Metal ERP · Smart Global IT · Director: Mohammad Sayem · +8801711-772407"
  - paragraph: Chittagong South Kulshi, Bangladesh
- alert
```

# Test source

```ts
  31  |       "Market performance",
  32  |       "Order pipeline",
  33  |       "Manufacturing performance",
  34  |       "Quality performance",
  35  |       "Inventory and supply",
  36  |       "Margin, energy and logistics",
  37  |       "Insights and governance",
  38  |       "Cost structure",
  39  |     ]) {
  40  |       await expect(page.getByRole("region", { name })).toBeVisible();
  41  |     }
  42  |   });
  43  | 
  44  |   test("charts actually draw marks", async ({ page }) => {
  45  |     // Recharts renders into an <svg class="recharts-surface">. If the chart
  46  |     // layer failed, the cards would still be present but empty.
  47  |     const surfaces = page.locator("svg.recharts-surface");
  48  |     await expect(surfaces.first()).toBeVisible();
  49  |     expect(await surfaces.count()).toBeGreaterThan(8);
  50  |   });
  51  | 
  52  |   test("every multi-series chart ships a legend", async ({ page }) => {
  53  |     // Identity must never be carried by colour alone.
  54  |     const performance = page
  55  |       .getByRole("region", { name: "Financial performance" })
  56  |       .first();
  57  |     for (const label of ["Revenue", "Profit", "Expenses"]) {
  58  |       await expect(performance.getByText(label, { exact: true }).first()).toBeVisible();
  59  |     }
  60  |   });
  61  | 
  62  |   test("chart cards expose a table view twin", async ({ page }) => {
  63  |     const tableToggle = page.getByRole("button", { name: "Table view" }).first();
  64  |     await tableToggle.click();
  65  | 
  66  |     // The table view must carry the same numbers the plot showed.
  67  |     const table = page.getByRole("table").first();
  68  |     await expect(table).toBeVisible();
  69  |     await expect(table.locator("tbody tr").first()).toBeVisible();
  70  |   });
  71  | 
  72  |   test("period filter re-scopes the surface", async ({ page }) => {
  73  |     const group = page.getByRole("group", { name: "Reporting period" });
  74  |     await expect(group).toBeVisible();
  75  | 
  76  |     await group.getByRole("button", { name: "Quarter" }).click();
  77  |     await expect(group.getByRole("button", { name: "Quarter" })).toHaveAttribute(
  78  |       "aria-pressed",
  79  |       "true",
  80  |     );
  81  |   });
  82  | 
  83  |   test("live alerts link into their module", async ({ page }) => {
  84  |     const alerts = page.getByRole("link", { name: /Low Stock Alert/ });
  85  |     await expect(alerts.first()).toBeVisible();
  86  |     await alerts.first().click();
  87  |     await expect(page).toHaveURL(/\/m\/inventory-store\/min-max$/);
  88  |   });
  89  | 
  90  |   test("the page body never scrolls horizontally", async ({ page }) => {
  91  |     const overflow = await page.evaluate(() => {
  92  |       const el = document.getElementById("main-content");
  93  |       if (!el) return { scrollWidth: 0, clientWidth: 1 };
  94  |       return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
  95  |     });
  96  |     // Wide tables scroll inside their own container, not the page.
  97  |     expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  98  |   });
  99  | 
  100 |   test("renders without console errors", async ({ page }) => {
  101 |     const errors: string[] = [];
  102 |     page.on("console", (message) => {
  103 |       if (message.type() === "error") errors.push(message.text());
  104 |     });
  105 |     page.on("pageerror", (error) => errors.push(error.message));
  106 | 
  107 |     await page.reload();
  108 |     await page.waitForLoadState("networkidle");
  109 | 
  110 |     expect(errors).toEqual([]);
  111 |   });
  112 | });
  113 | 
  114 | test.describe("Flagship workspaces", () => {
  115 |   const FLAGSHIPS = [
  116 |     { path: "/m/sales-order/order-book", heading: "Order Book" },
  117 |     { path: "/m/mes/shop-floor", heading: "Shop Floor Control" },
  118 |     { path: "/m/inventory-store/stock-summary", heading: "Stock Summary" },
  119 |     { path: "/m/qms/quality-dashboard", heading: "Quality Dashboard" },
  120 |     {
  121 |       path: "/m/finance-accounts/financial-overview",
  122 |       heading: "Financial Overview",
  123 |     },
  124 |   ];
  125 | 
  126 |   for (const flagship of FLAGSHIPS) {
  127 |     test(`${flagship.heading} renders its bespoke surface`, async ({ page }) => {
  128 |       await page.goto(flagship.path);
  129 |       await expect(
  130 |         page.getByRole("heading", { name: flagship.heading, level: 1 }),
> 131 |       ).toBeVisible();
      |         ^ Error: expect(locator).toBeVisible() failed
  132 | 
  133 |       const surfaces = page.locator("svg.recharts-surface");
  134 |       await expect(surfaces.first()).toBeVisible();
  135 |       expect(await surfaces.count()).toBeGreaterThan(2);
  136 |     });
  137 |   }
  138 | 
  139 |   test("order book filters and sorts", async ({ page }) => {
  140 |     await page.goto("/m/sales-order/order-book");
  141 | 
  142 |     const filter = page.getByRole("group", { name: "Order filter" });
  143 |     await filter.getByRole("button", { name: "At Risk" }).click();
  144 |     await expect(filter.getByRole("button", { name: "At Risk" })).toHaveAttribute(
  145 |       "aria-pressed",
  146 |       "true",
  147 |     );
  148 | 
  149 |     const table = page.getByRole("table", { name: /Sales order book/ });
  150 |     await expect(table).toBeVisible();
  151 | 
  152 |     await table.getByRole("button", { name: /Order Value/ }).click();
  153 |     await expect(table.locator("tbody tr").first()).toBeVisible();
  154 |   });
  155 | 
  156 |   test("data table search narrows rows", async ({ page }) => {
  157 |     await page.goto("/m/sales-order/order-book");
  158 | 
  159 |     const search = page.getByRole("searchbox", {
  160 |       name: /Search Sales order book/,
  161 |     });
  162 |     await search.fill("Levi");
  163 | 
  164 |     const table = page.getByRole("table", { name: /Sales order book/ });
  165 |     const rows = table.locator("tbody tr");
  166 |     expect(await rows.count()).toBeGreaterThan(0);
  167 |     await expect(rows.first()).toContainText("Levi");
  168 |   });
  169 | 
  170 |   test("shop floor shows machine states", async ({ page }) => {
  171 |     await page.goto("/m/mes/shop-floor");
  172 |     const region = page.getByRole("region", { name: "Machine status" });
  173 |     await expect(region).toBeVisible();
  174 |     await expect(region.getByText(/Running \(/)).toBeVisible();
  175 |   });
  176 | });
  177 | 
  178 | test.describe("Generated workspaces", () => {
  179 |   const SAMPLES = [
  180 |     { path: "/m/master-data/item-master", heading: "Item Master" },
  181 |     { path: "/m/plm/change-requests", heading: "Engineering Change Requests" },
  182 |     { path: "/m/time-action/tna-calendar", heading: "T&A Calendar" },
  183 |     { path: "/m/purchase-order/create-po", heading: "Create PO" },
  184 |     { path: "/m/dms/retention", heading: "Retention Policy" },
  185 |     { path: "/m/bi-analytics/sales-analytics", heading: "Sales Analytics" },
  186 |   ];
  187 | 
  188 |   for (const sample of SAMPLES) {
  189 |     test(`${sample.heading} renders`, async ({ page }) => {
  190 |       await page.goto(sample.path);
  191 |       await expect(
  192 |         page.getByRole("heading", { name: sample.heading, level: 1 }),
  193 |       ).toBeVisible();
  194 |       await expect(
  195 |         page.getByRole("region", { name: "Key indicators" }),
  196 |       ).toBeVisible();
  197 |     });
  198 |   }
  199 | 
  200 |   test("board workspace renders kanban columns", async ({ page }) => {
  201 |     await page.goto("/m/plm/change-requests");
  202 |     await expect(page.getByRole("region", { name: "Raised" })).toBeVisible();
  203 |     await expect(page.getByRole("region", { name: "Approved" })).toBeVisible();
  204 |   });
  205 | 
  206 |   test("calendar workspace renders a month grid", async ({ page }) => {
  207 |     await page.goto("/m/time-action/tna-calendar");
  208 |     await expect(page.getByRole("heading", { name: "August 2026" })).toBeVisible();
  209 |     await expect(page.getByRole("heading", { name: "Upcoming" })).toBeVisible();
  210 |   });
  211 | 
  212 |   test("form workspace does not navigate on submit", async ({ page }) => {
  213 |     await page.goto("/m/purchase-order/create-po");
  214 |     await page.getByRole("button", { name: "Save Draft" }).click();
  215 |     await expect(page).toHaveURL(/\/m\/purchase-order\/create-po$/);
  216 |   });
  217 | 
  218 |   test("settings workspace renders switches", async ({ page }) => {
  219 |     await page.goto("/m/dms/retention");
  220 |     const switches = page.getByRole("switch");
  221 |     expect(await switches.count()).toBeGreaterThan(3);
  222 |   });
  223 | });
  224 | 
```