# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\navigation.spec.ts >> Command palette >> opens with the keyboard and navigates to a workspace
- Location: tests\e2e\navigation.spec.ts:105:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/m\/mes\/shop-floor$/
Received string:  "http://127.0.0.1:3100/m/production-planning"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    2 × locator resolved to <html lang="en" data-theme="dark" class="geist_deef94d5-module__Sms4YG__variable geist_mono_1bf8cbf6-module__FlyLvG__variable h-full antialiased">…</html>
      - unexpected value "http://127.0.0.1:3100/dashboard"
    21 × locator resolved to <html lang="en" data-theme="dark" class="geist_deef94d5-module__Sms4YG__variable geist_mono_1bf8cbf6-module__FlyLvG__variable h-full antialiased">…</html>
       - unexpected value "http://127.0.0.1:3100/m/production-planning"

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
      - listitem:
        - link "Modules":
          - /url: /modules
      - listitem: Production Planning
  - heading "Production Planning (PPC)" [level=1]
  - text: Module 22 LIVE
  - paragraph: Capacity-balanced master schedules, line loading and sequencing to the shop floor.
  - button
  - link:
    - /url: /m/production-planning/ppc-dashboard
  - region "Module indicators":
    - paragraph: Total Records
    - paragraph: 3,707
    - text: +10.7% across this module
    - img "Total Records trend"
    - paragraph: Open Items
    - paragraph: 4,966
    - text: +17.2% awaiting action
    - img "Open Items trend"
    - paragraph: Value at Stake
    - paragraph: $3.31M
    - text: "-2.3% vs last period"
    - img "Value at Stake trend"
    - paragraph: Completion Rate
    - paragraph: 88.0%
    - text: +17.1% target 95%
    - img "Completion Rate trend"
  - region "Module analytics":
    - heading "Twelve-Month Activity" [level=2]
    - paragraph: Volume and completions across production planning
    - group "Twelve-Month Activity view":
      - button "Chart view" [pressed]
      - button "Table view"
    - text: Volume Completed Exceptions
    - application: Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec 0 15K 30K 45K 60K
    - heading "Value by Category" [level=2]
    - paragraph: Where the value sits
    - group "Value by Category view":
      - button "Chart view" [pressed]
      - button "Table view"
    - application
    - text: Total value $5.92M
  - region "Module distribution":
    - heading "Records by Category" [level=2]
    - paragraph: Distribution across the business
    - group "Records by Category view":
      - button "Chart view" [pressed]
      - button "Table view"
    - application: Raw Metal Packing Tooling Services 0 1K 2K 3K 4K
    - heading "Workspace Mix" [level=2]
    - paragraph: How this module's workspaces are composed
    - group "Workspace Mix view":
      - button "Chart view" [pressed]
      - button "Table view"
    - list:
      - listitem: Analytics 7
      - listitem: List 5
      - listitem: Calendar 3
      - listitem: Board 3
      - listitem: Overview 1
      - listitem: Settings 1
  - region "Workspaces":
    - heading "20 Workspaces" [level=2]
    - paragraph: Everything Production Planning covers
    - link "All modules":
      - /url: /modules
    - searchbox "Filter workspaces"
    - group "Filter by workspace type":
      - button "All (20)" [pressed]
      - button "Overview (1)"
      - button "Calendar (3)"
      - button "Register (5)"
      - button "Analytics (7)"
      - button "Board (3)"
      - button "Settings (1)"
    - list:
      - listitem:
        - link "PPC Dashboard Plan health and load Overview":
          - /url: /m/production-planning/ppc-dashboard
          - text: PPC Dashboard
          - paragraph: Plan health and load
          - text: Overview
      - listitem:
        - link "Master Production Schedule MPS by week Calendar":
          - /url: /m/production-planning/master-schedule
          - text: Master Production Schedule
          - paragraph: MPS by week
          - text: Calendar
      - listitem:
        - link "Plan Register Every production plan Register":
          - /url: /m/production-planning/plan-register
          - text: Plan Register
          - paragraph: Every production plan
          - text: Register
      - listitem:
        - link "Capacity Planning Load vs available Analytics":
          - /url: /m/production-planning/capacity-planning
          - text: Capacity Planning
          - paragraph: Load vs available
          - text: Analytics
      - listitem:
        - link "Line Loading Assign orders to lines Board":
          - /url: /m/production-planning/line-loading
          - text: Line Loading
          - paragraph: Assign orders to lines
          - text: Board
      - listitem:
        - link "Job Sequencing Changeover-optimised order Register":
          - /url: /m/production-planning/sequencing
          - text: Job Sequencing
          - paragraph: Changeover-optimised order
          - text: Register
      - listitem:
        - link "Work Order Release Released to the floor Register":
          - /url: /m/production-planning/work-order-release
          - text: Work Order Release
          - paragraph: Released to the floor
          - text: Register
      - listitem:
        - link "Daily Plan Today on each line Calendar":
          - /url: /m/production-planning/daily-plan
          - text: Daily Plan
          - paragraph: Today on each line
          - text: Calendar
      - listitem:
        - link "Shift Planning Manpower per shift Calendar":
          - /url: /m/production-planning/shift-planning
          - text: Shift Planning
          - paragraph: Manpower per shift
          - text: Calendar
      - listitem:
        - link "Machine Allocation Which machine runs what Register":
          - /url: /m/production-planning/machine-allocation
          - text: Machine Allocation
          - paragraph: Which machine runs what
          - text: Register
      - listitem:
        - link "Material Readiness Can we start on time? Analytics":
          - /url: /m/production-planning/material-readiness
          - text: Material Readiness
          - paragraph: Can we start on time?
          - text: Analytics
      - listitem:
        - link "Bottleneck Analysis Constraint work centres Analytics":
          - /url: /m/production-planning/bottleneck
          - text: Bottleneck Analysis
          - paragraph: Constraint work centres
          - text: Analytics
      - listitem:
        - link "Plan vs Actual Adherence tracking Analytics":
          - /url: /m/production-planning/plan-vs-actual
          - text: Plan vs Actual
          - paragraph: Adherence tracking
          - text: Analytics
      - listitem:
        - link "What-If Simulation Scenario planning Analytics":
          - /url: /m/production-planning/what-if
          - text: What-If Simulation
          - paragraph: Scenario planning
          - text: Analytics
      - listitem:
        - link "Rough-Cut Capacity Long-range feasibility Analytics":
          - /url: /m/production-planning/rough-cut
          - text: Rough-Cut Capacity
          - paragraph: Long-range feasibility
          - text: Analytics
      - listitem:
        - link "Reschedule Console Handle disruptions Board":
          - /url: /m/production-planning/reschedule
          - text: Reschedule Console
          - paragraph: Handle disruptions
          - text: Board
      - listitem:
        - link "Subcontract Plan Outsourced volume Register":
          - /url: /m/production-planning/subcontract-plan
          - text: Subcontract Plan
          - paragraph: Outsourced volume
          - text: Register
      - listitem:
        - link "Output Forecast Expected production Analytics":
          - /url: /m/production-planning/output-forecast
          - text: Output Forecast
          - paragraph: Expected production
          - text: Analytics
      - listitem:
        - link "Plan Approvals Sign-off before release Board":
          - /url: /m/production-planning/plan-approvals
          - text: Plan Approvals
          - paragraph: Sign-off before release
          - text: Board
      - listitem:
        - link "Planning Parameters Horizon, buffer, batching Settings":
          - /url: /m/production-planning/planning-parameters
          - text: Planning Parameters
          - paragraph: Horizon, buffer, batching
          - text: Settings
- contentinfo:
  - paragraph: "Metal ERP · Smart Global IT · Director: Mohammad Sayem · +8801711-772407"
  - paragraph: Chittagong South Kulshi, Bangladesh
- alert: Production Planning (PPC)
```

# Test source

```ts
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
> 119 |     await expect(page).toHaveURL(/\/m\/mes\/shop-floor$/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  160 |     await expect(html).toHaveAttribute("data-theme", "light");
  161 |   });
  162 | });
  163 | 
```