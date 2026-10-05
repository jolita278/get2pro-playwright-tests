import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";
import jsQR from "jsqr";

test.describe("Get2Pro Support QR codes", () => {
  test("QA12-001: verify Support QR codes match their payment links", async ({
    page,
  }) => {
    await page.goto("/");

    await acceptCookies(page);

    const supportSection = page.locator("section").filter({
      has: page.getByRole("heading", {
        name: "Support us",
        level: 2,
      }),
    });

    await expect(supportSection).toBeVisible();

    const donationWidgets = supportSection
      .locator(".elementor-widget-text-editor")
      .filter({ has: page.locator("img") })
      .filter({
        has: page.getByRole("link").filter({ hasText: "pi.swedbank.com/pr" }),
      });

    await expect(donationWidgets).toHaveCount(2);

    const decodedValues: string[] = [];
    for (const widget of await donationWidgets.all()) {
      const image = widget.locator("img");
      await expect(image).toHaveCount(1);
      const paymentLink = widget.getByRole("link").filter({
        hasText: "pi.swedbank.com/pr",
      });
      await expect(paymentLink).toHaveCount(1);

      const qrImage = await image.screenshot();

      const decoded = await page.evaluate(
        async ({ imageBytes }) => {
          const blob = new Blob([new Uint8Array(imageBytes)]);
          const bitmap = await createImageBitmap(blob);

          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;

          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Could not create canvas context");
          }

          context.drawImage(bitmap, 0, 0);
          bitmap.close();

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );

          return {
            data: Array.from(imageData.data),
            width: imageData.width,
            height: imageData.height,
          };
        },
        { imageBytes: [...qrImage] },
      );

      const qrCode = jsQR(
        new Uint8ClampedArray(decoded.data),
        decoded.width,
        decoded.height,
      );

      expect(qrCode).not.toBeNull();

      const decodedValue = qrCode!.data;

      const decodedUrl = new URL(decodedValue);
      expect(decodedUrl.hostname).toBe("pi.swedbank.com");
      expect(decodedUrl.pathname).toBe("/pr");

      await expect(paymentLink).toHaveAttribute("href", decodedValue);

      decodedValues.push(decodedValue);
    }

    expect(new Set(decodedValues).size).toBe(2);
  });
});
