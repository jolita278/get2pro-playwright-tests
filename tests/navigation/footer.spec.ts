import { expect, test } from "@playwright/test";

test.describe("Get2Pro footer navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const acceptCookies = page.getByRole("button", {
      name: "Accept",
      exact: true,
    });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
  });

  test("QA6-001: open Ordering & Returns from the footer", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await footer
      .getByRole("link", { name: "Ordering & Returns", exact: true })
      .click();

    await expect(page).toHaveURL(/\/ordering-returns\/$/);
    await expect(
      page.getByRole("heading", { name: "Ordering & Returns", level: 1 }),
    ).toBeVisible();
  });

  test("QA6-002: open Privacy Policy from the footer", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await footer
      .getByRole("link", { name: "Privacy Policy", exact: true })
      .click();

    await expect(page).toHaveURL(/\/privacy-policy\/$/);
    await expect(
      page.getByRole("heading", { name: "Privacy Policy", level: 1 }),
    ).toBeVisible();
  });

  test("QA6-003: open Contact from the footer", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await footer.getByRole("link", { name: /^Contact/ }).click();

    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(
      page.getByRole("heading", { name: "Send us a message", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
  });
});
