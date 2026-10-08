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

export async function getAnalyticsConsentRegions(
  page: Page,
): Promise<string[]> {
  return page.evaluate(() => {
    const scripts = Array.from(
      document.querySelectorAll<HTMLScriptElement>(
        'script[id*="consent-mode"]',
      ),
    );

    for (const script of scripts) {
      const match = script.textContent?.match(
        /window\._googlesitekitConsents\s*=\s*(\{[^;]+\})/,
      );

      if (match) {
        const config = JSON.parse(match[1]);
        return config.region ?? [];
      }
    }

    throw new Error("Site Kit Consent Mode configuration not found");
  });
}
