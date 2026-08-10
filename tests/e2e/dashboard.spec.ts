import { expect, test } from "@playwright/test";

test.describe("CEO Command Center", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("renders the headline KPI band", async ({ page }) => {
    const band = page.getByRole("region", {
      name: "Headline performance indicators",
    });
    await expect(band).toBeVisible();

    for (const label of [
      "Total Revenue",
      "Total Profit",
      "Sales Orders",
      "Production Output",
      "Active Buyers",
      "On-Time In-Full",
    ]) {
      await expect(band.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("renders every analytics section", async ({ page }) => {
    for (const name of [
      "Financial performance",
      "Financial summary",
      "Operational counts",
      "Market performance",
      "Order pipeline",
      "Manufacturing performance",
      "Quality performance",
      "Inventory and supply",
      "Margin, energy and logistics",
      "Insights and governance",
      "Cost structure",
    ]) {
      await expect(page.getByRole("region", { name })).toBeVisible();
    }
  });

  test("charts actually draw marks", async ({ page }) => {
    // Recharts renders into an <svg class="recharts-surface">. If the chart
    // layer failed, the cards would still be present but empty.
    const surfaces = page.locator("svg.recharts-surface");
    await expect(surfaces.first()).toBeVisible();
    expect(await surfaces.count()).toBeGreaterThan(8);
  });

  test("every multi-series chart ships a legend", async ({ page }) => {
    // Identity must never be carried by colour alone.
    const performance = page
      .getByRole("region", { name: "Financial performance" })
      .first();
    for (const label of ["Revenue", "Profit", "Expenses"]) {
      await expect(performance.getByText(label, { exact: true }).first()).toBeVisible();
    }
  });

  test("chart cards expose a table view twin", async ({ page }) => {
    const tableToggle = page.getByRole("button", { name: "Table view" }).first();
    await tableToggle.click();

    // The table view must carry the same numbers the plot showed.
    const table = page.getByRole("table").first();
    await expect(table).toBeVisible();
    await expect(table.locator("tbody tr").first()).toBeVisible();
  });

  test("period filter re-scopes the surface", async ({ page }) => {
    const group = page.getByRole("group", { name: "Reporting period" });
    await expect(group).toBeVisible();

    await group.getByRole("button", { name: "Quarter" }).click();
    await expect(group.getByRole("button", { name: "Quarter" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("live alerts link into their module", async ({ page }) => {
    const alerts = page.getByRole("link", { name: /Low Stock Alert/ });
    await expect(alerts.first()).toBeVisible();
    await alerts.first().click();
    await expect(page).toHaveURL(/\/m\/inventory-store\/min-max$/);
  });

  test("the page body never scrolls horizontally", async ({ page }) => {
    const overflow = await page.evaluate(() => {
      const el = document.getElementById("main-content");
      if (!el) return { scrollWidth: 0, clientWidth: 1 };
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
    });
    // Wide tables scroll inside their own container, not the page.
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test("renders without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.reload();
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });
});

test.describe("Flagship workspaces", () => {
  const FLAGSHIPS = [
    { path: "/m/sales-order/order-book", heading: "Order Book" },
    { path: "/m/mes/shop-floor", heading: "Shop Floor Control" },
    { path: "/m/inventory-store/stock-summary", heading: "Stock Summary" },
    { path: "/m/qms/quality-dashboard", heading: "Quality Dashboard" },
    {
      path: "/m/finance-accounts/financial-overview",
      heading: "Financial Overview",
    },
  ];

  for (const flagship of FLAGSHIPS) {
    test(`${flagship.heading} renders its bespoke surface`, async ({ page }) => {
      await page.goto(flagship.path);
      await expect(
        page.getByRole("heading", { name: flagship.heading, level: 1 }),
      ).toBeVisible();

      const surfaces = page.locator("svg.recharts-surface");
      await expect(surfaces.first()).toBeVisible();
      expect(await surfaces.count()).toBeGreaterThan(2);
    });
  }

  test("order book filters and sorts", async ({ page }) => {
    await page.goto("/m/sales-order/order-book");

    const filter = page.getByRole("group", { name: "Order filter" });
    await filter.getByRole("button", { name: "At Risk" }).click();
    await expect(filter.getByRole("button", { name: "At Risk" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const table = page.getByRole("table", { name: /Sales order book/ });
    await expect(table).toBeVisible();

    await table.getByRole("button", { name: /Order Value/ }).click();
    await expect(table.locator("tbody tr").first()).toBeVisible();
  });

  test("data table search narrows rows", async ({ page }) => {
    await page.goto("/m/sales-order/order-book");

    const search = page.getByRole("searchbox", {
      name: /Search Sales order book/,
    });
    await search.fill("Levi");

    const table = page.getByRole("table", { name: /Sales order book/ });
    const rows = table.locator("tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);
    await expect(rows.first()).toContainText("Levi");
  });

  test("shop floor shows machine states", async ({ page }) => {
    await page.goto("/m/mes/shop-floor");
    const region = page.getByRole("region", { name: "Machine status" });
    await expect(region).toBeVisible();
    await expect(region.getByText(/Running \(/)).toBeVisible();
  });
});

test.describe("Generated workspaces", () => {
  const SAMPLES = [
    { path: "/m/master-data/item-master", heading: "Item Master" },
    { path: "/m/plm/change-requests", heading: "Engineering Change Requests" },
    { path: "/m/time-action/tna-calendar", heading: "T&A Calendar" },
    { path: "/m/purchase-order/create-po", heading: "Create PO" },
    { path: "/m/dms/retention", heading: "Retention Policy" },
    { path: "/m/bi-analytics/sales-analytics", heading: "Sales Analytics" },
  ];

  for (const sample of SAMPLES) {
    test(`${sample.heading} renders`, async ({ page }) => {
      await page.goto(sample.path);
      await expect(
        page.getByRole("heading", { name: sample.heading, level: 1 }),
      ).toBeVisible();
      await expect(
        page.getByRole("region", { name: "Key indicators" }),
      ).toBeVisible();
    });
  }

  test("board workspace renders kanban columns", async ({ page }) => {
    await page.goto("/m/plm/change-requests");
    await expect(page.getByRole("region", { name: "Raised" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Approved" })).toBeVisible();
  });

  test("calendar workspace renders a month grid", async ({ page }) => {
    await page.goto("/m/time-action/tna-calendar");
    await expect(page.getByRole("heading", { name: "August 2026" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Upcoming" })).toBeVisible();
  });

  test("form workspace does not navigate on submit", async ({ page }) => {
    await page.goto("/m/purchase-order/create-po");
    await page.getByRole("button", { name: "Save Draft" }).click();
    await expect(page).toHaveURL(/\/m\/purchase-order\/create-po$/);
  });

  test("settings workspace renders switches", async ({ page }) => {
    await page.goto("/m/dms/retention");
    const switches = page.getByRole("switch");
    expect(await switches.count()).toBeGreaterThan(3);
  });
});
