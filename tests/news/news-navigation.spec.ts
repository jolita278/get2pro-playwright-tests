import { expect, test } from "@playwright/test";

test.describe("Get2Pro News navigation", () => {
  test("QA16-001: open a News article from the News & Updates page", async ({
    page,
  }) => {
    await page.goto("/news-and-updates/");

    const acceptCookies = page.getByRole("button", {
      name: "Accept",
      exact: true,
    });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }

    await expect(
      page.getByRole("heading", { name: "News & Updates", level: 1 }),
    ).toBeVisible();

    const articleTitle =
      "What is Get2Pro and how is it connected to “Kelias link profesionalo”?";

    const articleLink = page.getByText("What is Get2Pro and how is it");

    await expect(articleLink).toBeVisible();
    await articleLink.click();

    await expect(page).not.toHaveURL(/\/news-and-updates\/?$/);

    await expect(
      page.getByRole("heading", {
        name: articleTitle,
        level: 1,
      }),
    ).toBeVisible();
  });
});
