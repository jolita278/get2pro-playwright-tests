import { expect, test } from "@playwright/test";
import { acceptCookies } from "../helpers/cookies";

test.describe("Get2Pro Instagram embed", () => {
  test("QA17-001: Instagram Reel embed is displayed and loads its content", async ({
    page,
  }) => {
    await page.goto("/product/compound-bow-cam-holder/");

    await acceptCookies(page);

    const instagramEmbed = page.locator("#instagram-embed-0");

    await expect(instagramEmbed).toBeVisible();

    const instagramFrame = instagramEmbed.contentFrame();

    await expect(
      instagramFrame.getByRole("button", { name: "Control" }),
    ).toBeVisible();
  });
});
