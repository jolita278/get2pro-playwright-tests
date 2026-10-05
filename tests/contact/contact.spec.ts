import { expect, test } from "@playwright/test";

const contactUrl = "/contact/";

async function openContactPage(page: import("@playwright/test").Page) {
  await page.goto(contactUrl);

  const acceptCookies = page.getByRole("button", {
    name: "Accept",
    exact: true,
  });

  if (await acceptCookies.isVisible()) {
    await acceptCookies.click();
  }
}

test.describe("Get2Pro Contact page", () => {
  test("QA18-001: Contact page displays the contact form", async ({ page }) => {
    await openContactPage(page);

    await expect(
      page.getByRole("heading", {
        name: "Send us a message",
        level: 2,
      }),
    ).toBeVisible();

    await expect(page.getByRole("textbox", { name: "Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Subject" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Comment or Message" }),
    ).toBeVisible();
  });

  test("QA18-002: Contact form validates required fields", async ({ page }) => {
    await openContactPage(page);

    const form = page.locator("form.wpforms-form");

    const submissionPosts: string[] = [];

    page.on("request", (request) => {
      const requestUrl = new URL(request.url());

      if (
        request.method() === "POST" &&
        requestUrl.origin === new URL(page.url()).origin &&
        requestUrl.pathname === "/wp-admin/admin-ajax.php"
      ) {
        submissionPosts.push(request.url());
      }
    });

    await form
      .getByRole("button", {
        name: "Send Message",
        exact: true,
      })
      .click();

    await expect(form.getByRole("alert")).toHaveCount(3);

    await expect(page).toHaveURL(contactUrl);
    expect(submissionPosts).toHaveLength(0);
  });
});
