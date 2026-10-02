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

  test("HOME-004: open a product from Top Products", async ({ page }) => {
    const productName = "Compound Bow Cam Holder";
    await page
      .getByRole("heading", { name: productName, level: 2 })
      .getByRole("link", { name: productName, exact: true })
      .click();

    await expect(page).toHaveURL(/\/product\/compound-bow-cam-holder\//);
    await expect(
      page.getByRole("heading", { name: productName, level: 1 }),
    ).toBeVisible();
  });

  test("HOME-005: open the Products page from the homepage", async ({
    page,
  }) => {
    const topProductsSection = page
      .getByRole("heading", { name: "Top Products", level: 2 })
      .locator("..")
      .locator("..");
    await topProductsSection
      .getByRole("link", { name: "View All", exact: true })
      .click();

    await expect(page).toHaveURL(/\/products\//);
    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Cam Holder",
        level: 2,
      }),
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

  test("HOME-007: open a news item from the homepage News section", async ({
    page,
  }) => {
    const storyTitle =
      "What is Get2Pro and how is it connected to “Kelias link profesionalo”?";
    await page
      .getByRole("heading", { name: storyTitle, level: 2 })
      .getByRole("link", { name: storyTitle, exact: true })
      .click();

    await expect(page).toHaveURL(
      /\/what-is-get2pro-and-how-is-it-connected-to-kelias-link-profesionalo\//,
    );
    await expect(
      page.getByRole("heading", { name: storyTitle, level: 1 }),
    ).toBeVisible();
  });

  test("HOME-008: open the News & Updates page from the homepage", async ({
    page,
  }) => {
    const newsSection = page
      .getByRole("heading", {
        name: "Latest from the News & Updates",
        level: 2,
      })
      .locator("..")
      .locator("..");
    await newsSection
      .getByRole("link", { name: "View All", exact: true })
      .click();

    await expect(page).toHaveURL(/\/news-and-updates\//);
    await expect(
      page.getByRole("heading", { name: "News & Updates", level: 1 }),
    ).toBeVisible();
  });

  test("HOME-009: Support section is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Support us", level: 2 }),
    ).toBeVisible();
  });
});
