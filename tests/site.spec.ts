import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { companies } from "../src/content/portfolio";
import { legacyRedirects, routes } from "./routes";

test.describe("routes & SEO", () => {
  test("titles and descriptions are unique across routes", async ({ page }) => {
    test.setTimeout(120_000);
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();
    for (const route of routes) {
      await page.goto(route);
      const title = await page.title();
      const description = (await page.locator('meta[name="description"]').getAttribute("content"))!;
      expect(titles.get(title), `${route} duplicates title of ${titles.get(title)}`).toBeUndefined();
      expect(descriptions.get(description), `${route} duplicates description`).toBeUndefined();
      titles.set(title, route);
      descriptions.set(description, route);
    }
  });

  for (const route of routes) {
    test(`${route} renders with unique metadata`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

      const res = await page.goto(route);
      expect(res?.status()).toBe(200);

      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(title.length).toBeGreaterThan(10);
      expect(description?.length ?? 0).toBeGreaterThan(50);
      expect(canonical).toBe(`https://americaneliteenterprises.com${route}`);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('a[href="#"]')).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }

  test("sitemap lists every route and robots points to it", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const route of routes) {
      expect(sitemap).toContain(`<loc>https://americaneliteenterprises.com${route}</loc>`);
    }
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Sitemap: https://americaneliteenterprises.com/sitemap.xml");
  });

  test("structured data is valid JSON with an Organization", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = blocks.map((b) => JSON.parse(b));
    expect(JSON.stringify(parsed)).toContain('"@type":"Organization"');
  });

  test("unknown routes return 404", async ({ request }) => {
    expect((await request.get("/this-page-does-not-exist/")).status()).toBe(404);
  });
});

test.describe("legacy WordPress URLs", () => {
  for (const [from, to] of legacyRedirects) {
    test(`${from} → ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 308]).toContain(res.status());
      const location = res.headers()["location"];
      expect(new URL(location, "http://x").pathname).toBe(to);
    });
  }
});

test.describe("responsive layout", () => {
  for (const width of [360, 768, 1024, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${route} overflows at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("navigation", () => {
  test("mega menu opens, is keyboard navigable and closes with Escape", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Our Companies" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#mega-menu");
    await expect(menu).toBeVisible();

    // Tab reaches the first sector, then its companies.
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAttribute("href", "/industries/healthcare/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText(/Hospitals Without Walls/);

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("every company is reachable from the mega menu", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Our Companies" }).click();
    for (const sector of ["healthcare", "legal", "inventions"]) {
      await page.locator(`#mega-menu a[href="/industries/${sector}/"]`).first().hover();
      const visibleLinks = await page.locator("#mega-menu ul a:visible").count();
      expect(visibleLinks).toBe(companies.filter((c) => c.sector === sector).length);
    }
  });

  test("mobile menu opens, expands a sector and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Our Companies" }).click();
    await dialog.getByRole("button", { name: /^Legal/ }).click();
    await expect(dialog.getByRole("link", { name: /Axident Lawyers/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("mobile menu links navigate and close the menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("company directory", () => {
  test("filters by sector and searches by name", async ({ page }) => {
    await page.goto("/companies/");
    const cards = page.locator("main ul > li article");
    await expect(cards).toHaveCount(companies.length);

    await page.getByRole("button", { name: /^Legal/ }).click();
    await expect(cards).toHaveCount(companies.filter((c) => c.sector === "legal").length);

    await page.getByRole("button", { name: /^All/ }).click();
    await page.getByLabel("Search companies").fill("foundation");
    await expect(cards).toHaveCount(2);
  });

  test("external company links open safely in a new tab", async ({ page }) => {
    await page.goto("/companies/");
    const external = page.locator('main a[href^="http"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(40);
    for (let i = 0; i < count; i++) {
      await expect(external.nth(i)).toHaveAttribute("target", "_blank");
      await expect(external.nth(i)).toHaveAttribute("rel", /noopener/);
    }
  });
});

test.describe("contact form", () => {
  test("shows validation errors for an empty submission", async ({ page }) => {
    await page.goto("/contact/");
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please check the highlighted fields.")).toBeVisible();
    await expect(page.getByLabel(/Full name/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  });

  test("never claims delivery when email is not configured", async ({ page }) => {
    test.skip(Boolean(process.env.RESEND_API_KEY), "delivery is configured");
    await page.goto("/contact/");
    await page.getByLabel(/Full name/).fill("Test Visitor");
    await page.getByLabel(/Email address/).fill("visitor@example.com");
    await page.getByLabel(/Inquiry type/).selectOption("General inquiry");
    await page.getByLabel(/Message/).fill("Hello, this is an automated test message.");
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Online messaging is not connected yet/)).toBeVisible();
    await expect(page.getByText(/has been sent/)).toHaveCount(0);
    // Values are preserved so the visitor doesn't lose their message.
    await expect(page.getByLabel(/Full name/)).toHaveValue("Test Visitor");
  });
});

test.describe("accessibility", () => {
  for (const route of routes) {
    test(`${route} has no axe violations (WCAG 2.2 AA)`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id}: ${v.nodes.length} node(s) — ${v.nodes[0]?.target.join(" ")}`,
      );
      expect(summary).toEqual([]);
    });
  }
});

test("internal links resolve", async ({ page, request }) => {
  test.setTimeout(180_000);
  const seen = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((as) =>
      as.map((a) => a.getAttribute("href")!),
    );
    hrefs.forEach((h) => seen.add(h.split("#")[0]));
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});
