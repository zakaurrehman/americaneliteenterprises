// Checks every external URL in the portfolio content.
// Usage: node scripts/check-links.mjs
// Note: some sites block automated requests or are intermittently down, so a
// failure here means "verify manually", not necessarily "broken".
import { readFileSync } from "node:fs";

const sources = ["src/content/portfolio.ts", "src/content/entities.ts", "src/content/site.ts"];
const urls = new Set();
for (const file of sources) {
  for (const match of readFileSync(file, "utf8").matchAll(/"(https?:\/\/[^"]+)"/g)) {
    if (!match[1].includes("americaneliteenterprises.com")) urls.add(match[1]);
  }
}

async function check(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "User-Agent": "Mozilla/5.0 (link check; americaneliteenterprises.com)" },
    });
    return { url, status: res.status, final: res.url };
  } catch (error) {
    return { url, status: 0, final: error.cause?.code ?? error.name };
  }
}

const results = [];
const queue = [...urls];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) results.push(await check(queue.shift()));
  }),
);

results.sort((a, b) => a.status - b.status || a.url.localeCompare(b.url));
for (const r of results) {
  const flag = r.status >= 200 && r.status < 400 ? "OK  " : "WARN";
  const redirected = r.final && r.final !== r.url && r.status ? ` → ${r.final}` : r.status ? "" : ` (${r.final})`;
  console.log(`${flag} ${String(r.status).padStart(3)} ${r.url}${redirected}`);
}
const bad = results.filter((r) => !(r.status >= 200 && r.status < 400));
console.log(`\n${results.length - bad.length}/${results.length} reachable, ${bad.length} to verify manually.`);
