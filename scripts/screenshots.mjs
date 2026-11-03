// Captures full-page screenshots of key routes at several viewports.
// Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [route,route...]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "docs/screenshots";
const routes = (process.argv[4] ?? "/").split(",");
const viewports = (process.env.VIEWPORTS ?? "desktop:1440x900,mobile:390x844")
  .split(",")
  .map((v) => {
    const [name, size] = v.split(":");
    const [width, height] = size.split("x").map(Number);
    return { name, width, height };
  });
const fullPage = process.env.FULL !== "0";

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: process.env.REDUCED === "1" ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    if (fullPage) {
      // Full-page captures include regions far outside the viewport, which
      // content-visibility:auto (.cv-auto) would otherwise leave unrendered.
      await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}" });
      // Scroll through so scroll reveals and lazy images resolve.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(1200);
    }
    const name = (route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-|-$/g, "")) + `-${vp.name}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${vp.name} ${route} -> ${name}${overflow > 0 ? ` OVERFLOW ${overflow}px` : ""}`);
  }
  if (errors.length) console.log(`console errors (${vp.name}):\n  ` + [...new Set(errors)].join("\n  "));
  await context.close();
}
await browser.close();
