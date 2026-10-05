import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";

test.use({
  viewport: {
    width: 390,
    height: 844,
  },
});

test.describe("Get2Pro mobile coverage", () => {
  test("QA21-001: homepage displays key content on mobile", async ({
    page,
  }) => {
    await page.goto("/");
    await acceptCookies(page);

    await expect(page.getByRole("main")).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Top Products",
      }),
    ).toBeVisible();
  });

  test("QA21-002: Products page displays products on mobile", async ({
    page,
  }) => {
    await page.goto("/products/");
    await acceptCookies(page);

    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Cam Holder",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Stabilizer Holder",
      }),
    ).toBeVisible();
  });

  test("QA21-003: Contact form is accessible on mobile", async ({ page }) => {
    await page.goto("/contact/");
    await acceptCookies(page);

    await expect(
      page.getByRole("heading", {
        name: "Send us a message",
        level: 2,
      }),
    ).toBeVisible();

    await expect(page.getByRole("textbox", { name: "Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();

    await expect(
      page.getByRole("textbox", {
        name: "Comment or Message",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Send Message",
        exact: true,
      }),
    ).toBeVisible();
  });
});
