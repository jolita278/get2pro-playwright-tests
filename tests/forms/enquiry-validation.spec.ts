import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";

const productUrl = "/product/compound-bow-cam-holder/";
const requiredMessage = "This field is required.";

async function openEnquiryForm(page: import("@playwright/test").Page) {
  await page.goto(productUrl);

  await acceptCookies(page);

  const descriptionPanel = page.getByRole("tabpanel", {
    name: "Description",
  });
  await descriptionPanel
    .getByText("SEND AN ENQUIRY →", { exact: true })
    .click();
  return page.locator("form.wpforms-form");
}

test.describe("Get2Pro enquiry validation", () => {
  test("QA15-001: empty enquiry form shows required-field validation", async ({
    page,
  }) => {
    const form = await openEnquiryForm(page);
    const productField = form
      .getByRole("group", { name: "Products of interest" })
      .locator("..");
    const productChoice = form.getByRole("checkbox", {
      name: "Compound Bow Cam Holder - 1 loop",
      exact: true,
    });
    const deliveryCountry = form.getByRole("textbox", {
      name: "Delivery country",
    });
    const firstName = form.getByRole("textbox", { name: "First" });
    const lastName = form.getByRole("textbox", { name: "Last" });
    const email = form.getByRole("textbox", { name: "Email" });

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

    await form.getByRole("button", { name: "Submit", exact: true }).click();
    await expect
      .poll(async () => {
        return form.locator(".wpforms-error, [role='alert']").count();
      })
      .toBeGreaterThan(0);

    await expect(productChoice).toHaveAttribute("aria-describedby", /-error$/);

    const productErrorId = await productChoice.getAttribute("aria-describedby");
    expect(productErrorId).not.toBeNull();

    const productError = productField.locator(`[id="${productErrorId}"]`);

    await expect(productError).toBeVisible();
    await expect(productError).toHaveAttribute("role", "alert");
    await expect(productError).toHaveText(requiredMessage);

    await expect(deliveryCountry).toHaveClass(/wpforms-error/);
    await expect(
      form.locator(
        `#${await deliveryCountry.getAttribute("aria-errormessage")}`,
      ),
    ).toHaveText(requiredMessage);
    await expect(firstName).toHaveClass(/wpforms-error/);
    await expect(
      form.locator(`#${await firstName.getAttribute("aria-errormessage")}`),
    ).toHaveText(requiredMessage);
    await expect(lastName).toHaveClass(/wpforms-error/);
    await expect(
      form.locator(`#${await lastName.getAttribute("aria-errormessage")}`),
    ).toHaveText(requiredMessage);
    await expect(email).toHaveClass(/wpforms-error/);
    await expect(
      form.locator(`#${await email.getAttribute("aria-errormessage")}`),
    ).toHaveText(requiredMessage);

    await expect(page).toHaveURL(/\/product\/compound-bow-cam-holder\/$/);
    expect(submissionPosts).toEqual([]);
  });

  test("QA15-002: invalid email is rejected client-side", async ({ page }) => {
    const form = await openEnquiryForm(page);
    await form
      .getByRole("checkbox", {
        name: "Compound Bow Cam Holder - 1 loop",
        exact: true,
      })
      .check();
    await form
      .getByRole("textbox", { name: "Delivery country" })
      .fill("Lithuania");
    await form.getByRole("textbox", { name: "First" }).fill("QA");
    await form.getByRole("textbox", { name: "Last" }).fill("Test");
    const email = form.getByRole("textbox", { name: "Email" });
    await email.fill("not-an-email");

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

    await form.getByRole("button", { name: "Submit", exact: true }).click();

    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(
      form.locator(`#${await email.getAttribute("aria-errormessage")}`),
    ).toHaveText("Please enter a valid email address.");
    await expect(
      form.getByRole("alert").filter({ hasText: "This field is required." }),
    ).toHaveCount(0);
    await expect(page).toHaveURL(/\/product\/compound-bow-cam-holder\/$/);
    expect(submissionPosts).toEqual([]);
  });
});
