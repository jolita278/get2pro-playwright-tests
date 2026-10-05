import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";

test.describe("Get2Pro language switching @smoke", () => {
  test("QA7-001: switch the Welcome page from English to Lithuanian and back", async ({
    page,
  }) => {
    await page.goto("/");

    await acceptCookies(page);

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Welcome to where passion meets precision!",
        level: 1,
      }),
    ).toBeVisible();

    const englishSwitcher = page.getByRole("navigation", {
      name: "Website language selector",
    });
    await englishSwitcher.hover();
    const lithuanianLink = englishSwitcher.getByRole("link", {
      name: "LT",
      exact: true,
    });
    await expect(lithuanianLink).toBeVisible();
    await lithuanianLink.click();

    await expect(page).toHaveURL(/\/lt\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Sveiki atvykę ten, kur aistra susitinka su tikslumu!",
        level: 1,
      }),
    ).toBeVisible();

    const lithuanianSwitcher = page.getByRole("navigation", {
      name: "Svetainės kalbos pasirinkiklis",
    });
    await lithuanianSwitcher.hover();
    const englishLink = lithuanianSwitcher.getByRole("link", {
      name: "EN",
      exact: true,
    });
    await expect(englishLink).toBeVisible();
    await englishLink.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Welcome to where passion meets precision!",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("QA7-002: switch the Compound Bow Cam Holder page to Lithuanian and back", async ({
    page,
  }) => {
    await page.goto("/product/compound-bow-cam-holder/");

    await acceptCookies(page);

    await expect(page).toHaveURL(/\/product\/compound-bow-cam-holder\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Cam Holder",
        level: 1,
      }),
    ).toBeVisible();

    const englishSwitcher = page.getByRole("navigation", {
      name: "Website language selector",
    });
    await englishSwitcher.hover();
    const lithuanianLink = englishSwitcher.getByRole("link", {
      name: "LT",
      exact: true,
    });
    await expect(lithuanianLink).toBeVisible();
    await lithuanianLink.click();

    await expect(page).toHaveURL(/\/lt\/produktas\/compound-bow-cam-holder\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Skriemulinio lanko skriemulio laikiklis",
        level: 1,
      }),
    ).toBeVisible();

    const lithuanianSwitcher = page.getByRole("navigation", {
      name: "Svetainės kalbos pasirinkiklis",
    });
    await lithuanianSwitcher.hover();
    const englishLink = lithuanianSwitcher.getByRole("link", {
      name: "EN",
      exact: true,
    });
    await expect(englishLink).toBeVisible();
    await englishLink.click();

    await expect(page).toHaveURL(/\/product\/compound-bow-cam-holder\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Cam Holder",
        level: 1,
      }),
    ).toBeVisible();
  });
});
