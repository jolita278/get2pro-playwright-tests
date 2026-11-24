import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";

test.describe("Get2Pro donation payment links", () => {
  test("QA11-001: validate current €5 and €10 Swedbank payment links", async ({
    page,
  }) => {
    await page.goto("/support-us/");

    await acceptCookies(page);

    const supportSection = page.locator("section").filter({
      has: page.getByRole("heading", {
        name: "Support us",
        level: 2,
      }),
    });
    await expect(supportSection).toBeVisible();

    for (const amount of [5, 10]) {
      await test.step(`Verify €${amount} Swedbank donation`, async () => {
        const donateLink = supportSection.getByRole("link", {
          name: `Donate €${amount} via Swedbank ↗`,
          exact: true,
        });
        await expect(donateLink).toHaveAttribute(
          "href",
          /^https:\/\/pi\.swedbank\.com\/pr\?/,
        );
        const paymentUrl = new URL((await donateLink.getAttribute("href"))!);
        expect(paymentUrl.searchParams.get("linkId")).toBeTruthy();
        expect(paymentUrl.searchParams.get("lang")).toBe("lt");
        await expect(donateLink).toHaveAttribute("target", "_blank");

        const [paymentPage] = await Promise.all([
          page.waitForEvent("popup"),
          donateLink.click(),
        ]);

        try {
          await expect(paymentPage).toHaveURL(paymentUrl.href);
          await expect(
            paymentPage.getByRole("heading", {
              name: "Pervedimo nuoroda",
              level: 2,
            }),
            `Swedbank payment details should load for the €${amount} donation`,
          ).toBeVisible();

          const expectedDetails = [
            { label: "Suma", value: `${amount},00 EUR` },
            {
              label: "Gavėjo pavadinimas",
              value: "VŠĮ KELIAS LINK PROFESIONALO",
            },
            { label: "Gavėjo sąskaita", value: "LT417300010197729356" },
            { label: "Mokėjimo paskirtis", value: "PARAMA" },
          ];

          for (const { label, value } of expectedDetails) {
            const row = paymentPage.locator(
              `ui-definition-list-item[label="${label}"]`,
            );
            await expect(row.getByRole("definition")).toHaveText(value, {
              useInnerText: true,
            });
          }
        } finally {
          await paymentPage.close();
        }
      });
    }
  });
});
