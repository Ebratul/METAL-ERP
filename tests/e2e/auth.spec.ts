import { expect, test } from "@playwright/test";

/**
 * The rest of the suite runs with the session cookie pre-seeded (see
 * `playwright.config.ts`). These tests start signed out on purpose.
 */
test.describe("Login gate", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("an unauthenticated visitor is sent to the login page", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
  });

  test("the root path is gated too", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("the form arrives pre-filled with the demo account", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByLabel("Email Address")).toHaveValue(
      "admin@smartglobalit.net",
    );
    await expect(page.getByLabel("Password", { exact: true })).toHaveValue(
      "admin123",
    );
  });

  test("signing in lands on the requested page", async ({ page }) => {
    await page.goto("/modules");
    await expect(page).toHaveURL(/\/login\?next=%2Fmodules$/);

    await page.getByRole("button", { name: /Continue/ }).click();

    await expect(page).toHaveURL(/\/modules$/);
  });

  test("wrong credentials are rejected and stay on the page", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Password", { exact: true }).fill("not-the-password");
    await page.getByRole("button", { name: /Continue/ }).click();

    // Filtered by text — Next's route announcer is also role="alert".
    await expect(
      page.locator('[role="alert"]', { hasText: /don't match the demo account/ }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("signing out returns to the login page and re-arms the gate", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Continue/ }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("button", { name: "Sign Out" }).click();

    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  });
});

test.describe("Footer", () => {
  test("carries the company block on every page", async ({ page }) => {
    await page.goto("/dashboard");

    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText("Metal ERP");
    await expect(footer).toContainText("Smart Global IT");
    await expect(footer).toContainText("Mohammad Sayem");
    await expect(footer).toContainText("+8801711-772407");
    await expect(footer).toContainText("Chittagong South Kulshi, Bangladesh");
  });
});
