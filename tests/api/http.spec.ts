import { expect, test } from "@playwright/test";

test.use({
  extraHTTPHeaders: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
  },
});

const publicPages = [
  "/",
  "/products/",
  "/product/compound-bow-cam-holder/",
  "/product/compound-bow-stabilizer-holder/",
  "/news-and-updates/",
  "/contact/",
];

test.describe("Get2Pro HTTP checks", () => {
  test("QA20-001: public pages return successful HTML responses", async ({
    request,
  }) => {
    for (const url of publicPages) {
      const response = await request.get(url);

      expect(response.status(), `${url} should return HTTP 200`).toBe(200);

      expect(
        response.headers()["content-type"],
        `${url} should return HTML`,
      ).toContain("text/html");
    }
  });

  test("QA20-002: unknown page returns HTTP 404", async ({ request }) => {
    const response = await request.get("/this-page-does-not-exist/");

    expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).toContain("text/html");
  });
});
