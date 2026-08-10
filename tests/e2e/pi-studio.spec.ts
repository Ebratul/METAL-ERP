import { expect, test } from "@playwright/test";

/**
 * The PI studio at /m/proforma-invoice/print-preview-export.
 *
 * The document is assembled entirely in the browser, so these cover the three
 * things that can silently break it: the preview tracking what is typed, the
 * arithmetic re-deriving itself, and the print overlay opening on the same
 * customised sheet the preview shows.
 */

const STUDIO = "/m/proforma-invoice/print-preview-export";

test.describe("PI studio", () => {
  test("types into the document and the preview follows", async ({ page }) => {
    await page.goto(STUDIO);

    const sheet = page.getByLabel("Live preview of the printed sheet");
    await expect(sheet).toContainText("PI-2026-000125");

    await page.getByLabel("PI No.").fill("PI-2026-000999");
    await page.getByLabel("Sub-title").fill("(SAMPLE ORDER)");

    await expect(sheet).toContainText("PI-2026-000999");
    await expect(sheet).toContainText("(SAMPLE ORDER)");
  });

  test("re-derives the totals when a size row changes", async ({ page }) => {
    await page.goto(STUDIO);

    const sheet = page.getByLabel("Live preview of the printed sheet");
    await expect(sheet).toContainText("344 Pcs");
    await expect(sheet).toContainText("234.52");

    await page.getByRole("tab", { name: /Goods/ }).click();
    await page.getByLabel("Qty").first().fill("150");

    // 150 + 112 + 96 + 63 + 23 = 444 pieces at 0.58, plus 35.00 of charges.
    await expect(sheet).toContainText("444 Pcs");
    await expect(sheet).toContainText("292.52");
    await expect(sheet).toContainText(
      "US Dollar Two Hundred Ninety Two and Fifty Two Cents Only.",
    );
  });

  test("a template restyles the sheet and drops its blocks", async ({ page }) => {
    await page.goto(STUDIO);

    const sheet = page.getByLabel("Live preview of the printed sheet");
    await expect(sheet).toContainText("BANK INFORMATION");

    await page.getByRole("tab", { name: "Design" }).click();
    await page.getByRole("button", { name: /Buyer Branded/ }).click();

    await expect(sheet).toContainText("BUYER COPY");
    await expect(sheet).not.toContainText("BANK INFORMATION");
    await expect(sheet).not.toContainText("TERMS & CONDITIONS");
  });

  test("prints the customised sheet, not the stock one", async ({ page }) => {
    await page.goto(STUDIO);

    await page.getByLabel("PI No.").fill("PI-2026-000777");
    await page.getByRole("tab", { name: "Design" }).click();
    await page.getByRole("button", { name: "DRAFT", exact: true }).click();

    await page.getByRole("button", { name: "Print / Save as PDF" }).click();

    const dialog = page.getByRole("dialog", { name: /PI-2026-000777/ });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("DRAFT");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("saves a draft and restores it over a blank sheet", async ({ page }) => {
    await page.goto(STUDIO);

    await page.getByLabel("PI No.").fill("PI-2026-000555");
    await page.getByRole("button", { name: "Save draft" }).click();

    await page.getByRole("button", { name: "Blank PI" }).click();
    await expect(page.getByLabel("PI No.")).toHaveValue("");

    await page.getByRole("button", { name: "Restore" }).click();
    await expect(page.getByLabel("PI No.")).toHaveValue("PI-2026-000555");
  });
});
