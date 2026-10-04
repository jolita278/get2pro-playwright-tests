import { expect, test } from "@playwright/test";

test.describe("Get2Pro donation payment links", () => {
  test("QA11-001: validate current €5 and €10 Swedbank payment links", async ({
    page,
  }) => {
    await page.goto("/");

    const acceptCookies = page.getByRole("button", {
      name: "Accept",
      exact: true,
    });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }

    const supportSection = page
      .getByRole("heading", { name: "Support us", level: 2 })
      .locator("..")
      .locator("..")
      .locator("..");
    await expect(supportSection).toBeVisible();

    const supportLinks = await supportSection.getByRole("link").all();
    const paymentUrls = (
      await Promise.all(supportLinks.map((link) => link.getAttribute("href")))
    ).filter((href): href is string => {
      if (!href) {
        return false;
      }

      try {
        const url = new URL(href);
        return url.hostname === "pi.swedbank.com" && url.pathname === "/pr";
      } catch {
        return false;
      }
    });

    expect(paymentUrls).toHaveLength(2);

    const verifiedAmounts: number[] = [];

    for (const paymentUrl of paymentUrls) {
      const paymentPage = await page.context().newPage();
      try {
        const response = await paymentPage.goto(paymentUrl);
        expect(response?.ok()).toBe(true);
        await expect(
          paymentPage.getByRole("heading", {
            name: "Pervedimo nuoroda",
            level: 2,
          }),
        ).toBeVisible();

        const amountStatus = paymentPage.getByRole("status", {
          name: "Suma",
        });
        const amount = Number.parseFloat(
          (await amountStatus.innerText()).replace(",", "."),
        );
        expect([5, 10]).toContain(amount);
        const amountRow = paymentPage
          .getByRole("listitem")
          .filter({ has: amountStatus });
        await expect(amountRow).toContainText("EUR");

        await expect(
          paymentPage.getByRole("status", {
            name: "Gavėjo pavadinimas",
          }),
        ).toHaveText("VŠĮ KELIAS LINK PROFESIONALO");
        await expect(
          paymentPage.getByRole("status", {
            name: "Gavėjo sąskaita",
          }),
        ).toHaveText("LT417300010197729356");
        await expect(
          paymentPage.getByRole("status", {
            name: "Mokėjimo paskirtis",
          }),
        ).toHaveText("PARAMA");

        verifiedAmounts.push(amount);
      } finally {
        await paymentPage.close();
      }
    }

    expect(verifiedAmounts.sort((left, right) => left - right)).toEqual([
      5, 10,
    ]);
  });
});
