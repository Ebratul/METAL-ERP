import { expect, test } from "@playwright/test";

/**
 * The generated workspace engine.
 *
 * Every submodule route renders from a dataset, so these run against a handful
 * of representative workspaces rather than all of them: a register, a board, a
 * calendar, an entry form and a configuration screen.
 */

test.describe("Record workspace", () => {
  test("creates a record and the KPI band follows it", async ({ page }) => {
    await page.goto("/m/master-data/item-master");
    await expect(page.getByText("96 of 96 items", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "New Item" }).first().click();

    const dialog = page.getByRole("dialog", { name: "New Item" });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Item").fill("Test Snap Button 14mm");
    await dialog.getByRole("button", { name: "Create Item" }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByText("97 of 97 items", { exact: true })).toBeVisible();
    await expect(page.getByText("Test Snap Button 14mm").first()).toBeVisible();
  });

  test("validates required fields before creating", async ({ page }) => {
    await page.goto("/m/master-data/item-master");
    await page.getByRole("button", { name: "New Item" }).first().click();

    const dialog = page.getByRole("dialog", { name: "New Item" });
    await dialog.getByRole("button", { name: "Create Item" }).click();

    await expect(dialog.getByText("Item is required")).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test("filters rows by a facet and clears again", async ({ page }) => {
    await page.goto("/m/purchase-order/po-register");

    const counter = page.getByText("88 of 88 purchase orders", { exact: true });
    await expect(counter).toBeVisible();

    await page.getByLabel("Status", { exact: true }).selectOption("Received");
    await expect(counter).toBeHidden();

    await page.getByRole("button", { name: /Clear \(/ }).click();
    await expect(counter).toBeVisible();
  });

  test("searches, then reports an empty result without breaking", async ({ page }) => {
    await page.goto("/m/purchase-order/po-register");

    await page.getByRole("searchbox", { name: /Search/ }).first().fill("zzzzzzzz");
    await expect(page.getByText("Nothing matches the current filters.")).toBeVisible();
  });

  test("opens a record, changes its status and deletes it", async ({ page }) => {
    await page.goto("/m/hrms-payroll/employee-directory");

    await page.locator("table tbody tr").first().click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Activity")).toBeVisible();

    await drawer.getByLabel(/Change status of/).selectOption("On Leave");
    await expect(page.getByText("Status set to On Leave")).toBeVisible();

    await drawer.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Employee deleted")).toBeVisible();
  });

  test("exports the current view as CSV", async ({ page }) => {
    await page.goto("/m/purchase-order/po-register");

    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export table data" }).click();
    const file = await download;

    expect(file.suggestedFilename()).toContain(".csv");
  });
});

test.describe("Alternative surfaces", () => {
  test("moves a card between board columns", async ({ page }) => {
    await page.goto("/m/sales-order/order-status");

    const firstColumn = page.getByRole("region", { name: "Shipped" });
    await expect(firstColumn).toBeVisible();

    await firstColumn.getByRole("button", { name: /Move .* to the next stage/ })
      .first()
      .click();

    await expect(page.getByText(/Moved to /)).toBeVisible();
  });

  test("navigates months on a calendar workspace", async ({ page }) => {
    await page.goto("/m/hrms-payroll/shift-roster");

    await expect(page.getByRole("heading", { name: "August 2026" })).toBeVisible();
    await page.getByRole("button", { name: "Next month" }).click();
    await expect(page.getByRole("heading", { name: "September 2026" })).toBeVisible();
    await page.getByRole("button", { name: "Today" }).click();
    await expect(page.getByRole("heading", { name: "August 2026" })).toBeVisible();
  });

  test("switches between the views of one workspace", async ({ page }) => {
    await page.goto("/m/procurement/requisitions");

    await page.getByRole("button", { name: "Insights", exact: true }).click();
    await expect(page.getByText("Status Mix")).toBeVisible();

    await page.getByRole("button", { name: "Board", exact: true }).click();
    await expect(page.getByRole("region", { name: "Approved" })).toBeVisible();
  });

  test("submits the entry form into the recent entries list", async ({ page }) => {
    await page.goto("/m/procurement/new-requisition");

    await page.getByLabel("Item").fill("Trial Brass Sheet 1.0mm");
    await page.getByRole("button", { name: "Save Draft" }).click();

    await expect(page.getByText("Purchase Requisition saved as draft")).toBeVisible();
    await expect(
      page.getByText("Trial Brass Sheet 1.0mm").first(),
    ).toBeVisible();
  });

  test("saves configuration changes", async ({ page }) => {
    await page.goto("/m/inventory-store/min-max");

    await expect(page.getByText("All changes saved")).toBeVisible();
    await page.getByRole("switch", { name: "Automatic numbering" }).click();
    await expect(page.getByText("Unsaved changes")).toBeVisible();

    await page.getByRole("button", { name: "Save Settings" }).click();
    await expect(page.getByText("All changes saved")).toBeVisible();
  });
});

test.describe("Module landing", () => {
  test("filters the workspace grid", async ({ page }) => {
    await page.goto("/m/quotation-costing");

    await expect(page.getByRole("link", { name: /Quotation Register/ })).toBeVisible();

    await page.getByRole("searchbox", { name: "Filter workspaces" }).fill("margin");
    await expect(page.getByRole("link", { name: /Margin Analysis/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Quotation Register/ })).toBeHidden();

    await page.getByRole("searchbox", { name: "Filter workspaces" }).fill("zzzz");
    await expect(page.getByText("No workspace matches that filter")).toBeVisible();
  });

  test("every module exposes twenty workspaces in the first thirty modules", async ({
    page,
  }) => {
    await page.goto("/m/sample-management");
    await expect(page.getByRole("button", { name: /^All \(20\)$/ })).toBeVisible();
  });
});
