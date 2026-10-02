import { expect, test } from "@playwright/test";

test.describe("Get2Pro homepage smoke tests @smoke", () => {
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

  test("HOME-001: welcome page loads and main content is visible", async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/Welcome/i);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Welcome to where passion meets precision!",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("HOME-002: main navigation contains Welcome, Products, News & Updates, Contact", async ({
    page,
  }) => {
    const mainMenu = page.getByRole("navigation", { name: "Main Menu" });
    await expect(
      mainMenu.getByRole("link", { name: "Welcome", exact: true }),
    ).toBeVisible();
    await expect(
      mainMenu.getByRole("link", { name: "Products", exact: true }),
    ).toBeVisible();
    await expect(
      mainMenu.getByRole("link", { name: "News & Updates", exact: true }),
    ).toBeVisible();
    await expect(
      mainMenu.getByRole("link", { name: "Contact", exact: true }),
    ).toBeVisible();
  });

  test("HOME-003: Top Products section is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Top Products", level: 2 }),
    ).toBeVisible();
  });

  test("HOME-006: Latest News section is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /Latest from the News & Updates/i,
        level: 2,
      }),
    ).toBeVisible();
  });

  test("HOME-009: Support section is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Support us", level: 2 }),
    ).toBeVisible();
  });
});
