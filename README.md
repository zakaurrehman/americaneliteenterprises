# American Elite Enterprises — website

The redesigned official website of **American Elite Enterprises**, a private group of businesses headquartered in Los Angeles with roots dating back to 1991. It replaces the previous WordPress/Elementor site at americaneliteenterprises.com while keeping every existing URL.

![Homepage](docs/screenshots/after-home-w1920.jpg)

## What's here

- **Homepage** — futuristic light design: the "Orbit" hero (45 businesses orbiting 9 sectors around the lion logo), a scroll-lit introduction, an interactive sector explorer, core entities, timeline, leadership, philosophy and contact. Colour scheme from the 21st.dev "Cyber Cyan Remix" and "Twitter Azure" themes.
- **About** (`/about/`), **Our Companies** directory (`/companies/`), **Industries** (`/industries/` + nine sector pages), **Leadership** (`/dr-daniel-davidson/`), **Contact** (`/contact/`).
- **Eight entity profiles** at their original WordPress URLs (e.g. `/american-elite-foundation/`).
- Sitemap, robots.txt, structured data, generated share image, and redirects for every retired WordPress route.

All 45 businesses (49 websites) from the original site are listed, each linking to its real website. Nothing was invented — see [docs/verification-report.md](docs/verification-report.md) for sources and caveats.

## Run it locally

Requires Node.js 20.9+ (developed on Node 24).

```bash
npm install
npm run dev            # http://localhost:3000
```

Production build:

```bash
npm run build
npm start              # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm run test:e2e` | Playwright suite (routes, SEO, redirects, navigation, directory, form, axe accessibility, internal links). Uses the locally installed Chrome; run `npm run build` first. |
| `npm run check:links` | Checks every external company URL |
| `npm run screenshots -- <baseUrl> <outDir> <routes>` | Full-page screenshots at desktop and mobile widths |

## Contact form

The form validates on the server and has spam protection (honeypot, minimum fill time, per-IP rate limit). To deliver messages by email, copy `.env.example` to `.env.local` and set:

```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=Info@americaneliteconsultants.com
CONTACT_FROM_EMAIL="American Elite <website@americaneliteenterprises.com>"
```

Without these, the form never claims a message was sent: it tells the visitor that online messaging is not connected and shows the phone number and email instead.

## Deployment

The site is a Next.js 16 app. All pages are prerendered, but the contact form uses a Server Action, so it needs a **Node.js host** — for example Vercel, or a Node.js app on Hostinger (the current host). The current WordPress site runs on Hostinger's PHP hosting, which can't run this app as is.

1. Deploy to a staging URL first and review it.
2. Set the three contact environment variables.
3. Point `americaneliteenterprises.com` at the new deployment. The redirects in `next.config.ts` take care of retired WordPress URLs.
4. Submit `https://americaneliteenterprises.com/sitemap.xml` in Google Search Console.

Nothing has been deployed. The live WordPress site has not been changed.

## Documentation

- [Design direction](docs/design-direction.md) — the three concepts and why one was chosen
- [Design system](docs/design-system.md) — colour, type, spacing, components, motion
- [Component selection](docs/component-selection.md) — 21st.dev research, what was used and rejected
- [Architecture](docs/architecture.md) — structure, rendering, content model
- [SEO audit](docs/seo-audit.md) — before and after
- [Verification report](docs/verification-report.md) — test results, Lighthouse, link check, open issues
