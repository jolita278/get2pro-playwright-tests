import { test, expect } from "@playwright/test";
import { denyCookies, acceptCookies } from "./helpers/cookies";

test.describe("Cookie consent", () => {
  test("QA28-001: Deny keeps analytics consent disabled", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    const cookiesBeforeDeny = await context.cookies();

    console.log(
      "GA cookies BEFORE Deny:",
      cookiesBeforeDeny
        .filter((cookie) => cookie.name.startsWith("_ga"))
        .map((cookie) => cookie.name),
    );

    await denyCookies(page);

    const cookiesAfterDeny = await context.cookies();

    console.log(
      "GA cookies AFTER Deny:",
      cookiesAfterDeny
        .filter((cookie) => cookie.name.startsWith("_ga"))
        .map((cookie) => cookie.name),
    );

    const cookies = await context.cookies();

    const statisticsConsent = cookies.find(
      (cookie) => cookie.name === "cmplz_statistics",
    );
    const wpStatisticsConsent = cookies.find(
      (cookie) => cookie.name === "wp_consent_statistics",
    );
    const googleAnalyticsCookies = cookies.filter(
      (cookie) => cookie.name === "_ga" || cookie.name.startsWith("_ga_"),
    );

    expect(statisticsConsent?.value).toBe("deny");
    expect(wpStatisticsConsent?.value).toBe("deny");
    expect(googleAnalyticsCookies).toHaveLength(0);
  });

  test("QA28-002: Accept enables analytics consent", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    await acceptCookies(page);

    await expect
      .poll(async () => {
        const cookies = await context.cookies();

        return {
          statistics: cookies.find(
            (cookie) => cookie.name === "cmplz_statistics",
          )?.value,
          wpStatistics: cookies.find(
            (cookie) => cookie.name === "wp_consent_statistics",
          )?.value,
          hasGoogleAnalytics: cookies.some(
            (cookie) => cookie.name === "_ga" || cookie.name.startsWith("_ga_"),
          ),
        };
      })
      .toEqual({
        statistics: "allow",
        wpStatistics: "allow",
        hasGoogleAnalytics: true,
      });
  });

  test("QA28-003: Custom preferences keep analytics disabled", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "View preferences" }).click();

    await page.getByRole("checkbox", { name: "Preferences" }).check();

    await page.getByRole("button", { name: "Save preferences" }).click();

    const cookies = await context.cookies();

    expect(
      cookies.find((cookie) => cookie.name === "cmplz_preferences")?.value,
    ).toBe("allow");

    expect(
      cookies.find((cookie) => cookie.name === "cmplz_statistics")?.value,
    ).toBe("deny");

    expect(
      cookies.find((cookie) => cookie.name === "wp_consent_preferences")?.value,
    ).toBe("allow");

    expect(
      cookies.find((cookie) => cookie.name === "wp_consent_statistics")?.value,
    ).toBe("deny");

    const googleAnalyticsCookies = cookies.filter(
      (cookie) => cookie.name === "_ga" || cookie.name.startsWith("_ga_"),
    );

    expect(googleAnalyticsCookies).toHaveLength(0);
  });

  test("QA28-004: User can withdraw analytics consent", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "View preferences" }).click();

    await page.getByRole("checkbox", { name: "Statistics" }).check();
    await page.getByRole("button", { name: "Save preferences" }).click();

    await expect
      .poll(async () => {
        const cookies = await context.cookies();

        return cookies.find((cookie) => cookie.name === "cmplz_statistics")
          ?.value;
      })
      .toBe("allow");

    const manageConsent = page.getByRole("button", {
      name: "Manage consent",
    });

    await expect(manageConsent).toBeVisible();

    await manageConsent.click();
    await manageConsent.click();

    const statisticsCheckbox = page.getByRole("checkbox", {
      name: "Statistics",
    });

    await expect(statisticsCheckbox).toBeVisible();
    await expect(statisticsCheckbox).toBeChecked();

    await statisticsCheckbox.uncheck();

    await page.getByRole("button", { name: "Save preferences" }).click();

    await expect
      .poll(async () => {
        const cookies = await context.cookies();

        return {
          statistics: cookies.find(
            (cookie) => cookie.name === "cmplz_statistics",
          )?.value,
          wpStatistics: cookies.find(
            (cookie) => cookie.name === "wp_consent_statistics",
          )?.value,
        };
      })
      .toEqual({
        statistics: "deny",
        wpStatistics: "deny",
      });
  });
});
