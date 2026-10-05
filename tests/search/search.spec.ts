import { expect, test } from "@playwright/test";

test.describe("Get2Pro search", () => {
  test("QA8-001: search in English and open a product result", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    await page.getByRole("button", { name: "Search", exact: true }).click();
    const searchModal = page.getByRole("dialog", { name: "Search modal" });
    const searchInput = searchModal.getByPlaceholder("Start typing to search");

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();

    await searchInput.pressSequentially("Compound Bow Cam Holder");
    await expect(searchInput).toHaveValue("Compound Bow Cam Holder");

    await searchModal.getByRole("button", { name: "Search button" }).click();

    await expect(page).toHaveURL(
      /\/\?s=Compound\+Bow\+Cam\+Holder&ct_post_type=post%3Apage%3Aproduct/,
    );
    const productResult = page.getByRole("heading", {
      name: "Compound Bow Cam Holder",
      level: 2,
    });
    await expect(productResult).toBeVisible();
    await productResult
      .getByRole("link", { name: "Compound Bow Cam Holder", exact: true })
      .click();

    await expect(page).toHaveURL(/\/product\/compound-bow-cam-holder\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Cam Holder",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("QA8-002: search in Lithuanian and open a product result", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/lt/");

    await page.getByRole("button", { name: "Paieška", exact: true }).click();

    const searchModal = page.getByRole("dialog", { name: "Search modal" });

    const searchInput = searchModal.getByPlaceholder(
      "Pradėkite rašyti norėdami ieškoti",
    );

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();

    await searchInput.pressSequentially(
      "Skriemulinio lanko skriemulio laikiklis",
    );
    await expect(searchInput).toHaveValue(
      "Skriemulinio lanko skriemulio laikiklis",
    );

    await searchModal.getByRole("button", { name: "Search button" }).click();

    await expect(page).toHaveURL(
      /\/lt\/\?s=Skriemulinio\+lanko\+skriemulio\+laikiklis&ct_post_type=post%3Apage%3Aproduct&trp-form-language=lt/,
    );
    const productResult = page.getByRole("heading", {
      name: "Skriemulinio lanko skriemulio laikiklis",
      level: 2,
    });
    await expect(productResult).toBeVisible();
    await productResult
      .getByRole("link", {
        name: "Skriemulinio lanko skriemulio laikiklis",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(/\/lt\/produktas\/compound-bow-cam-holder\/$/);
    await expect(
      page.getByRole("heading", {
        name: "Skriemulinio lanko skriemulio laikiklis",
        level: 1,
      }),
    ).toBeVisible();
  });
});
