import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";

const contactUrl = "/contact/";

async function openContactPage(page: import("@playwright/test").Page) {
  await page.goto(contactUrl);

  await acceptCookies(page);
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
        const postData = request.postData() ?? "";
        const params = new URLSearchParams(postData);

        if (params.get("action") !== "wpforms_get_token") {
          submissionPosts.push(request.url());
        }
      }
    });
    await form
      .getByRole("button", {
        name: "Send Message",
        exact: true,
      })
      .click();

    await expect(form.getByRole("alert")).toHaveCount(3);

    await expect(form.getByRole("textbox", { name: "Name" })).toHaveClass(
      /wpforms-error/,
    );

    await expect(form.getByRole("textbox", { name: "Email" })).toHaveClass(
      /wpforms-error/,
    );

    await expect(
      form.getByRole("textbox", { name: "Comment or Message" }),
    ).toHaveClass(/wpforms-error/);

    await expect(page).toHaveURL(contactUrl);
    expect(submissionPosts).toHaveLength(0);
  });

  test("QA18-003: Contact form validates invalid email", async ({ page }) => {
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
        const postData = request.postData() ?? "";
        const params = new URLSearchParams(postData);

        if (params.get("action") !== "wpforms_get_token") {
          submissionPosts.push(request.url());
        }
      }
    });

    await form.getByRole("textbox", { name: "Name" }).fill("QA Test");
    await form.getByRole("textbox", { name: "Email" }).fill("not-an-email");
    await form
      .getByRole("textbox", { name: "Comment or Message" })
      .fill("Test message");

    await form
      .getByRole("button", {
        name: "Send Message",
        exact: true,
      })
      .click();

    const email = form.getByRole("textbox", { name: "Email" });

    await expect(email).toHaveAttribute("aria-invalid", "true");
    const errorId = await email.getAttribute("aria-errormessage");
    expect(errorId).not.toBeNull();

    await expect(page.locator(`#${errorId}`)).toHaveText(
      "Please enter a valid email address.",
    );
    await expect(page).toHaveURL(contactUrl);
    expect(submissionPosts).toHaveLength(0);
  });
});
