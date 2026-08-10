# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\dashboard.spec.ts >> Flagship workspaces >> shop floor shows machine states
- Location: tests\e2e\dashboard.spec.ts:170:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('region', { name: 'Machine status' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('region', { name: 'Machine status' })

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
  131 |       ).toBeVisible();
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
> 173 |     await expect(region).toBeVisible();
      |                          ^ Error: expect(locator).toBeVisible() failed
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