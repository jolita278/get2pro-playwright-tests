import type { Page } from "@playwright/test";

export async function acceptCookies(page: Page) {
  const acceptButton = page.getByRole("button", {
    name: "Accept",
    exact: true,
  });

  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }
}

export async function denyCookies(page: Page) {
  const denyButton = page.getByRole("button", {
    name: "Deny",
    exact: true,
  });

  if (await denyButton.isVisible()) {
    await denyButton.click();
  }
}
