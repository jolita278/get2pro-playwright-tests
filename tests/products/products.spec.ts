import { expect, test } from "@playwright/test";

test.describe("Get2Pro product pages", () => {
  test("QA9-001: browse the Products archive and open a product", async ({
    page,
  }) => {
    await page.goto("/products/");

    const camHolder = page.getByRole("listitem").filter({
      has: page.getByRole("heading", {
        name: "Compound Bow Cam Holder",
        level: 2,
      }),
    });
    const stabilizerHolder = page.getByRole("listitem").filter({
      has: page.getByRole("heading", {
        name: "Compound Bow Stabilizer Holder",
        level: 2,
      }),
    });

    await expect(camHolder).toBeVisible();
    await expect(stabilizerHolder).toBeVisible();
    await expect(camHolder.getByText("30.00€", { exact: true })).toBeVisible();
    await expect(
      stabilizerHolder.getByText("30.00€", { exact: true }),
    ).toBeVisible();
    await expect(
      camHolder.getByRole("link", {
        name: "AVAILABLE SOON AT GOODARCHER.COM",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      stabilizerHolder.getByRole("link", {
        name: "AVAILABLE SOON AT GOODARCHER.COM",
        exact: true,
      }),
    ).toBeVisible();

    await stabilizerHolder
      .getByRole("heading", {
        name: "Compound Bow Stabilizer Holder",
        level: 2,
      })
      .getByRole("link", {
        name: "Compound Bow Stabilizer Holder",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(
      /\/product\/compound-bow-stabilizer-holder\/$/,
    );
    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Stabilizer Holder",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("QA9-002: verify Compound Bow Cam Holder product details", async ({
    page,
  }) => {
    await page.goto("/product/compound-bow-cam-holder/");

    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Cam Holder",
        level: 1,
      }),
    ).toBeVisible();
    const productSummary = page
      .getByRole("heading", {
        name: "Compound Bow Cam Holder",
        level: 1,
      })
      .locator("..");
    await expect(
      productSummary.getByText("30.00€", { exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("main")
        .getByRole("img", {
          name: "Compound Bow Cam Holder",
        })
        .first(),
    ).toBeVisible();

    const additionalInformation = page.getByRole("tabpanel", {
      name: "Additional information",
    });
    await page.getByRole("tab", { name: "Additional information" }).click();
    for (const variant of ["1-Loop", "2-Loop", "3-Loop"]) {
      await expect(additionalInformation.getByText(variant)).toBeVisible();
    }

    const descriptionTab = page.getByRole("tab", { name: "Description" });
    await descriptionTab.click();
    await expect(descriptionTab).toHaveAttribute("aria-selected", "true");
    const descriptionPanel = page.getByRole("tabpanel", {
      name: "Description",
    });
    await expect(descriptionPanel).toBeVisible();

    const goodArcherCta = page.getByRole("button", {
      name: "AVAILABLE SOON AT GOODARCHER.COM",
    });
    await expect(goodArcherCta).toBeVisible();
    await expect(goodArcherCta).toHaveAttribute("type", "submit");
    await expect(goodArcherCta.locator("..").locator("..")).toHaveAttribute(
      "action",
      "https://goodarcher.com/",
    );

    await descriptionPanel
      .getByText("SEND AN ENQUIRY →", { exact: true })
      .click();
    const enquiry = descriptionPanel.getByRole("group", {
      name: "Products of interest",
    });
    await expect(enquiry).toBeVisible();
    for (const variant of [
      "Compound Bow Cam Holder - 1 loop",
      "Compound Bow Cam Holder - 2 loop",
      "Compound Bow Cam Holder - 3 loop",
    ]) {
      await expect(enquiry.getByLabel(variant)).toBeVisible();
    }
  });

  test("QA9-003: verify Compound Bow Stabilizer Holder product details", async ({
    page,
  }) => {
    await page.goto("/product/compound-bow-stabilizer-holder/");

    await expect(
      page.getByRole("heading", {
        name: "Compound Bow Stabilizer Holder",
        level: 1,
      }),
    ).toBeVisible();
    const productSummary = page
      .getByRole("heading", {
        name: "Compound Bow Stabilizer Holder",
        level: 1,
      })
      .locator("..");
    await expect(
      productSummary.getByText("30.00€", { exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("main")
        .getByRole("img", {
          name: "Compound Bow Stabilizer Holder",
        })
        .first(),
    ).toBeVisible();

    const additionalInformation = page.getByRole("tabpanel", {
      name: "Additional information",
    });
    await page.getByRole("tab", { name: "Additional information" }).click();
    await expect(additionalInformation.getByText("1-Loop")).toBeVisible();

    const descriptionTab = page.getByRole("tab", { name: "Description" });
    await descriptionTab.click();
    await expect(descriptionTab).toHaveAttribute("aria-selected", "true");
    const descriptionPanel = page.getByRole("tabpanel", {
      name: "Description",
    });
    await expect(descriptionPanel).toBeVisible();

    const goodArcherCta = page.getByRole("button", {
      name: "AVAILABLE SOON AT GOODARCHER.COM",
    });
    await expect(goodArcherCta).toBeVisible();
    await expect(goodArcherCta).toHaveAttribute("type", "submit");
    await expect(goodArcherCta.locator("..").locator("..")).toHaveAttribute(
      "action",
      "https://goodarcher.com/",
    );

    await descriptionPanel
      .getByText("SEND AN ENQUIRY →", { exact: true })
      .click();
    const enquiry = descriptionPanel.getByRole("group", {
      name: "Products of interest",
    });
    await expect(enquiry).toBeVisible();
    await expect(
      enquiry.getByLabel("Compound Bow Stabilizer Holder"),
    ).toBeVisible();
  });
});
