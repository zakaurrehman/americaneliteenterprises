# Verification report

Date: 2026-11-04 · Redesign: "Obsidian Orbit" layout in the **light theme** of the Cyber Cyan Remix / Twitter Azure colour scheme · Build: Next.js 16.4.3 production build (`next build` + `next start`) · Browser: Chrome (local install) via Playwright 1.64

## Summary

| Check | Result |
| --- | --- |
| TypeScript (`npm run typecheck`) | ✅ No errors |
| ESLint (`npm run lint`) | ✅ No errors or warnings |
| Production build | ✅ 32 routes, all prerendered |
| Unit tests | Not configured — no isolated logic justified a unit layer; behaviour is covered end to end |
| End-to-end tests (`npm run test:e2e`) | ✅ **75 passed**, 0 failed — **no tests were changed** for the redesign or the light theme |
| Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA) | ✅ 0 violations on all 23 routes |
| Lighthouse Accessibility / Best Practices / SEO | ✅ **100 / 100 / 100** on every audited page, mobile and desktop |
| Lighthouse Performance | ✅ Mobile **95–96** (applied throttling) · Desktop **99–100** · Mobile 78–85 with default simulated throttling — see methodology; confirm with PageSpeed Insights after deploy |
| Core Web Vitals (lab, mobile applied) | ✅ LCP 2.2–2.3 s · CLS 0–0.016 · TBT 60–100 ms |
| Horizontal overflow | ✅ None at 360, 390, 768, 1024, 1440 and 1920px |
| Internal links / legacy redirects | ✅ All internal links resolve; 12 retired WordPress URLs 308-redirect correctly |
| Console errors | ✅ None on any route |

## End-to-end suite

`tests/site.spec.ts` — 75 tests covering: all 23 routes (200, unique title/description, canonical, single `h1`, no `href="#"`, no console errors); sitemap/robots; JSON-LD; 404s; 12 legacy redirects; overflow at 360/768/1024/1920px; mega menu keyboard order and Escape; every company reachable from the mega menu; mobile menu; directory filter and search; external-link safety attributes; contact form validation and the honest "not connected" state; axe on every route; internal link crawl.

The redesign kept every tested behaviour and semantic hook (roles, labels, IDs), so the suite passed **without modification**. Issues it caught were fixed in the code, not the tests: dimmed filter counts (contrast, in both the dark and light themes); the scroll-lit statement's resting opacity; and an intermittent mobile-menu failure, traced to the menu's clip-path opening animation (browsers hit-test against the clipped shape, so a tap during the wipe could miss). The menu now opens with a fast fade, and the test passed 10 of 10 repeated runs.

## Lighthouse — light theme

Lighthouse 12.8.2 against the local production server. Raw lines: `docs/lighthouse/summary.txt`; full HTML reports for the homepage in `docs/lighthouse/`.

| Page | Mobile (applied throttling) | Desktop | Mobile (default simulated) |
| --- | --- | --- | --- |
| `/` | **95** · LCP 2.2 s · TBT 100 ms · CLS 0 | **99** · LCP 0.9 s | 78 · LCP 3.8 s |
| `/companies/` | **96** · LCP 2.2 s · TBT 60 ms · CLS 0.003 | **100** · LCP 0.8 s | 83 · LCP 3.9 s |
| `/industries/healthcare/` | **95** · LCP 2.3 s · TBT 80 ms · CLS 0 | **99** · LCP 0.9 s | 83 · LCP 3.7 s |
| `/dr-daniel-davidson/` | **95** · LCP 2.3 s · TBT 70 ms · CLS 0.016 | **99** · LCP 0.8 s | 85 · LCP 3.7 s |

Accessibility, Best Practices and SEO were 100 in all twelve runs.

**Methodology.** This machine's Lighthouse `benchmarkIndex` is 407 and Lighthouse warns its CPU is slower than its default mobile model assumes. *Applied throttling* (`--throttling-method=devtools`, Slow-4G-class network, CPU slowdown calibrated to 1.6×) actually throttles and measures real timings — the most realistic figure, and it meets the 90+ target on every page. *Default simulated throttling* models a device from a fast localhost trace and charges all JavaScript to the LCP; its LCP (3.7–3.9 s) is above the 2.5 s target and is reported rather than hidden. Mobile results on this machine also vary with background load: during the dark-theme work, identical code measured 97–98 on an idle machine and 80–86 while VS Code and a browser were busy (an A/B with the last change reverted confirmed the drop was environmental). **Re-measure on the deployed site with PageSpeed Insights**, which runs on dedicated hardware, before treating any figure as final. INP needs real-user data (Search Console / CrUX after launch); TBT, its lab proxy, is 60–100 ms.

### Performance work done during the redesign

The first build of the new design scored **54** on mobile (CLS 0.775, TBT 0.5–1.8 s). Each fix below was measured:

| Problem found | Fix |
| --- | --- |
| CLS 0.775 from a decorative hero glow positioned with % of the hero's height — it "moved" when the web font swapped | Anchored every glow with viewport/fixed units; removed a bottom-anchored fade |
| Orbit canvas animating from first paint | Static first frame; animation starts after `load` + idle; 30fps and 1.5× resolution on phones; pre-rendered halo; pauses off-screen / hidden tab |
| Backdrop blur over the animating canvas (re-blurred every frame) | Solid translucent label instead |
| Seven font files (static weights of variable fonts) — each swap re-laid out the page | One variable file per family (three files) |
| Heavy hydration + layout of a long page | `content-visibility: auto` on below-the-fold sections; homepage directory preview made server-rendered (full interactive directory stays on `/companies/`) |
| Scroll-lit words at 20% opacity failed contrast | Resting opacity 45% (large text, ≥ 3:1) |

Result: mobile **98** (applied), TBT 40–60 ms, CLS 0.

## Logo switch — metallic logo

The flat lion logo was replaced by the metallic logo (`brand/logo-metallic/`):
- the horizontal lockup in the header, mobile menu and footer;
- the emblem on the About page, at the centre of the orbit and in the Open Graph image;
- the stacked logo in the Organization structured data;
- emblem favicons and apple icon.

The header and footer images go through `next/image`, which serves resized WebP (the header logo is 12 KB on mobile). The orbit loads a 288px WebP (49 KB). The alt text and the link's accessible name are unchanged ("American Elite Enterprises").

Checks after the switch:
- typecheck and lint: clean;
- build: 32 routes;
- Playwright: **75 passed**, with no tests changed;
- screenshots: no console errors, no horizontal overflow.

On the first Playwright run, 5 tests timed out while the machine was busy. A full re-run passed 75 of 75, and a targeted re-run with the image cache cleared passed all 29 affected tests.

Lighthouse after the switch (machine under background load, see `docs/lighthouse/summary.txt`):

| Page | Mobile, applied | Desktop |
| --- | --- | --- |
| `/` | 73–81 | 93 |
| `/about/` | 83 | 99 |

Accessibility, Best Practices and SEO stayed at 100.

To check whether the logo caused the lower mobile scores, alternating runs were made with the two logo images blocked. Blocked, the homepage scored 75 and 69; loaded, 84 and 73. Blocking the logo did not help, so the drop is the machine's load, as in the earlier dark-theme A/B, not the logo. The 95–96 figures above were measured on an idle machine. **Re-measure with PageSpeed Insights after deploy.**

## Visual review

`docs/screenshots/`:
- `before-*` — the previous navy/ivory design (home, companies, healthcare, contact; desktop + mobile)
- `after-*` — this redesign in the **light theme** with the metallic logo (`before-logo-hero-desktop.jpg` shows the header with the previous flat logo): hero, home at 360 / 390 / 768 / 1440 / 1920px, About, Companies, Industries, Healthcare, Dr. Daniel Davidson, Contact, American Elite Foundation (desktop + mobile), plus the mega menu, sector explorer and mobile menu in use
- `v2-dark-*` — the same redesign in the dark Cyber Cyan theme, before the switch to light
- `v1-navy-*` — the full set from the previous design; `wordpress-*` — the original WordPress site

Issues found by reviewing screenshots and fixed: headline wrapping to five lines beside the orbit (tightened to "45 businesses. 9 sectors. One group."); flat orbit plane; nav legibility over bright industry photos (top scrim restored); contact email breaking mid-word; old crest still on About (replaced with the new emblem); see-through mega-menu panel (now fully opaque — on the light page even 97% let the hero headline ghost through); dark-ground logo artwork that would vanish on a light page (swapped for the light-ground variants).

Note: the hero's orbit canvas can appear empty in automated full-page captures taken mid-redraw; in a real browser it renders (verified by reading the canvas pixels), and `after-hero-desktop.jpg` shows it.

Note for anyone taking full-page screenshots: below-the-fold sections use `content-visibility: auto`, so tools that capture far outside the viewport will show them blank unless that is overridden — `scripts/screenshots.mjs` does this for captures.

## External link check (`npm run check:links`)

Unchanged from the previous audit: 39 of 50 URLs respond normally. To verify manually (some sites block automated requests or were down at test time):

| URL | Result |
| --- | --- |
| americaneliteglobalsolutions.com | 404 on the homepage (its `/expert-professional-consulting/` page works) |
| americaneliteexecutives.com · americanelitelenders.com · businessstarmakers.com · serviceanimal.us | 500 (WordPress error page) |
| hospitalswithoutwalls.app | 500 |
| underbedstorage.com | expired TLS certificate |
| americaneliteecom.com · globalbusinesssolution.in · goodneighborclinics.net | domain does not resolve |
| fflatprooff.com | DNS lookup failed at test time (loaded earlier — likely intermittent) |

## Content sources and integrity

- **Every company, URL and contact detail** comes from the original site. Nothing was invented — no companies, statistics, testimonials, awards or social links.
- **Counts** shown on the site are computed from the content data: **45 businesses**, **9 sectors**, **49 websites** (45 companies plus the extra domains of Hospitals Without Walls and Good Neighbor Clinics). *Correction:* earlier documentation said "52 websites", which wrongly counted founder and duplicate links; 49 is correct.
- **Descriptions** come from each company's own site or the original entity pages; 17 companies have none because none could be verified.
- **Founder milestones** (1991, 1997, 2004, 2006, 2012) come from the original site and are labelled as founder milestones; qualifications are as stated on the original site.
- **Logo**: the metallic logo from `brand/logo-metallic/`. It is the American Elite Digital artwork with "ENTERPRISES" in place of "DIGITAL", made at the client's request (see `brand/README.md`). Before that, the site used the flat lion logo from `brand/logo/`.
- **Photography**: Unsplash (Unsplash License). IDs: hero-towers `1486406146926-c627a92ad1ab`, los-angeles `1534190760961-74e8c1c5c3da`, healthcare `1532938911079-1b06ac7ceec7`, business `1511818966892-d7d671e672a2`, technology `1518770660439-4636190af475`, charities `1469571486292-0ba58a3f068b`, legal `1589829545856-d10d557cf95f`, consulting `1454165804606-c3d57bc86b40`, ecommerce `1607082348824-0a96f2a4b9da`, education `1505664194779-8beaceb93744`, inventions `1503387762-592deb58ef4e`, architecture-curve `1493397212122-2b85dda8106b`, architecture-white `1487958449943-2429e8be8625`, handshake `1521791136064-7986c2920216`. The founder portrait is the one published on the original site.
- **Colour scheme**: 21st.dev "Cyber Cyan Remix" and "Twitter Azure" theme tokens (see component-selection.md for licence notes).

## Open issues and items for the company

1. **Security — urgent:** the live WordPress site contains injected pharmaceutical spam links on four pages and is likely compromised. An automated keyword scan also flagged possible spam on: 18002thelaw.com, americanelitebilling.com, americaneliteexpertwitnesses.com, americaneliteinstitute.com, americanelitelawyers.com, goodneighborclinics.com, homehealthcollaborativealliance.com, hospitalswithoutwalls.com, mobilecaringdocs.com, mobilewounddocs.com, perfectvisions.info.
2. **Contact delivery is not connected** — set the Resend variables (README). Until then the form says plainly that messages are not sent.
3. **Privacy policy** — none existed; one should be added before launch because the form collects personal data.
4. **21st.dev theme terms** — neither theme page states a licence; confirm if certainty is needed.
5. **Unreachable company sites** — review the 11 links above.
6. **Logo** — confirm the company may reuse the American Elite Digital artwork, and ask its designer for a vector version with "ENTERPRISES" for print (the current files are web quality only).
7. **Hosting** — a Node.js host is required. Nothing has been committed, pushed or deployed.
