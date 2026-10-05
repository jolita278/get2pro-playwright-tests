import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";

test.describe("Get2Pro 404 handling", () => {
  test("QA22-001: unknown URL displays 404 page and allows navigation", async ({
    page,
  }) => {
    await page.goto("/this-page-does-not-exist/");

    await acceptCookies(page);

    await expect(
      page.getByRole("heading", {
        name: "Oops! That page can’t be found.",
      }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Products", exact: true }).click();

    await expect(page).toHaveURL("/products/");
  });
});