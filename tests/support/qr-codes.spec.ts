import { expect, test } from "@playwright/test";

interface LocalBarcodeResult {
  rawValue: string;
}

interface LocalBarcodeDetector {
  detect(source: ImageBitmap): Promise<LocalBarcodeResult[]>;
}

declare const BarcodeDetector: {
  new (options?: { formats?: "qr_code"[] }): LocalBarcodeDetector;
  getSupportedFormats(): Promise<string[]>;
};

test.describe("Get2Pro Support QR codes", () => {
  test("QA12-001: verify Support QR codes match their payment links", async ({
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
    const paymentArea = supportSection.locator(".elementor-element-b1fac6e");
    const donationWidgets = paymentArea
      .locator(".elementor-widget-text-editor")
      .filter({ has: page.locator("img") })
      .filter({
        has: page.getByRole("link").filter({ hasText: "pi.swedbank.com/pr" }),
      });

    await expect(donationWidgets).toHaveCount(2);

    const decodingSupport = await page.evaluate(async () => {
      const available = typeof BarcodeDetector !== "undefined";
      const supportsQr = available
        ? (await BarcodeDetector.getSupportedFormats()).includes("qr_code")
        : false;
      return { available, supportsQr };
    });
    expect(decodingSupport.available).toBe(true);
    expect(decodingSupport.supportsQr).toBe(true);

    const decodedValues: string[] = [];
    for (const widget of await donationWidgets.all()) {
      const image = widget.locator("img");
      await expect(image).toHaveCount(1);
      const paymentLink = widget.getByRole("link").filter({
        hasText: "pi.swedbank.com/pr",
      });
      await expect(paymentLink).toHaveCount(1);

      const decoded = await image.evaluate(async (img) => {
        if (!(img instanceof HTMLImageElement)) {
          throw new TypeError("Expected the QR code image element");
        }
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        const bitmap = await createImageBitmap(img);
        try {
          return (await detector.detect(bitmap)).map((code) => code.rawValue);
        } finally {
          bitmap.close();
        }
      });
      expect(decoded).toHaveLength(1);

      const decodedUrl = new URL(decoded[0]);
      expect(decodedUrl.hostname).toBe("pi.swedbank.com");
      expect(decodedUrl.pathname).toBe("/pr");
      await expect(paymentLink).toHaveAttribute("href", decoded[0]);
      decodedValues.push(decoded[0]);
    }

    expect(new Set(decodedValues).size).toBe(2);
  });
});
