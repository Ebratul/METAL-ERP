import { expect, test } from "@playwright/test";

test.describe("Shell and navigation", () => {
  test("root redirects to the command centre", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: "CEO Command Center", level: 1 }),
    ).toBeVisible();
  });

  test("sidebar lists every module group", async ({ page }) => {
    await page.goto("/dashboard");

    const nav = page.getByRole("navigation", { name: "Module navigation" });
    await expect(nav).toBeVisible();

    for (const caption of [
      "OVERVIEW",
      "PEOPLE & HR",
      "SALES & MERCHANDISING",
      "MANUFACTURING",
      "FINANCE & ACCOUNTS",
      "GOVERNANCE & PLATFORM",
    ]) {
      await expect(nav.getByText(caption, { exact: true })).toBeVisible();
    }
  });

  // The sidebar's own filter box was removed — module search is the ⌘K
  // command palette, covered under "Command palette" below.

  test("expanding a module reveals its submodules and navigates", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const nav = page.getByRole("navigation", { name: "Module navigation" });
    await nav
      .getByRole("button", { name: /Expand Sales Orders submodules/ })
      .click();

    const orderBook = nav.getByRole("link", { name: "Order Book", exact: true });
    await expect(orderBook).toBeVisible();
    await orderBook.click();

    await expect(page).toHaveURL(/\/m\/sales-order\/order-book$/);
    await expect(
      page.getByRole("heading", { name: "Order Book", level: 1 }),
    ).toBeVisible();
  });

  test("module directory lists all 75 modules", async ({ page }) => {
    await page.goto("/modules");

    await expect(
      page.getByRole("heading", { name: "All Modules", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(/75 core modules · 1,?500 workspaces/)).toBeVisible();
  });

  test("breadcrumbs walk back up the hierarchy", async ({ page }) => {
    await page.goto("/m/qms/capa");

    const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(crumbs).toBeVisible();
    await crumbs.getByRole("link", { name: "QMS" }).click();

    await expect(page).toHaveURL(/\/m\/qms$/);
    await expect(
      page.getByRole("heading", {
        name: "Quality Management System (QMS)",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("unknown module slug renders the not-found page", async ({ page }) => {
    const response = await page.goto("/m/this-module-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Workspace not found" }),
    ).toBeVisible();
  });

  test("unknown submodule slug renders the not-found page", async ({ page }) => {
    const response = await page.goto("/m/qms/not-a-real-workspace");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Workspace not found" }),
    ).toBeVisible();
  });

  test("skip link is reachable and targets main content", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main-content");
  });
});

test.describe("Command palette", () => {
  test("opens with the keyboard and navigates to a workspace", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("ControlOrMeta+k");

    const dialog = page.getByRole("dialog", {
      name: "Search modules and workspaces",
    });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("textbox", { name: "Search" }).fill("shop floor");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/m\/mes\/shop-floor$/);
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("ControlOrMeta+k");

    const dialog = page.getByRole("dialog", {
      name: "Search modules and workspaces",
    });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("reports no matches without crashing", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("ControlOrMeta+k");

    const dialog = page.getByRole("dialog", {
      name: "Search modules and workspaces",
    });
    await dialog.getByRole("textbox", { name: "Search" }).fill("qqqqqqqqqq");
    await expect(
      dialog.getByText("No workspace matches that search."),
    ).toBeVisible();
  });
});

test.describe("Theme", () => {
  test("toggles between dark and light and persists", async ({ page }) => {
    await page.goto("/dashboard");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: /Switch to light theme/ }).click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
  });
});
