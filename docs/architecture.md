# Architecture

## Starting point

The project folder was empty, and the previous site is WordPress 6 + Elementor on Hostinger (PHP 8.3, LiteSpeed). There was no existing codebase to preserve, so this is a new Next.js application. The WordPress site has not been modified.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), React 19 |
| Rendering | Cache Components + Partial Prefetching (scaffold defaults). Every page is prerendered at build time. |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, tokens in `src/app/globals.css` |
| Animation | CSS for entrances and reveals; Motion (`LazyMotion`) for interactive pieces |
| Fonts | `next/font` (Sora, Inter, JetBrains Mono — variable), self-hosted |
| Images | `next/image`, local WebP sources, AVIF/WebP output |
| Tests | Playwright + axe-core against the production build |

## Folder structure

```
src/
  app/
    layout.tsx               fonts, header, footer, Organization JSON-LD, boot script
    template.tsx             route entrance animation
    page.tsx                 homepage
    about/  companies/  contact/  dr-daniel-davidson/
    industries/  industries/[slug]/
    american-elite-*/        8 entity pages (original WordPress URLs)
    contact/actions.ts       contact Server Action
    sitemap.ts  robots.ts  opengraph-image.tsx  not-found.tsx  icon.png  apple-icon.png
  components/
    layout/      SiteHeader, MegaMenu, MobileMenu, SiteFooter, Wordmark
    home/        Hero, Orbit, Introduction, Statement, Ecosystem, SectorExplorer, Directory, Story, Timeline, Leadership, Philosophy
    companies/   CompanyDirectory, CompanyCard
    industries/  IndustryCard
    entities/    EntityPage
    contact/     ContactForm
    sections/    PageHero, Breadcrumbs, ContactCta
    motion/      Effects, MotionProvider
    seo/         JsonLd
    ui/          Button, SectionHeading, icons
  content/       site.ts, portfolio.ts, entities.ts, story.ts, contact.ts — the single source of truth
  lib/seo.ts     metadata + structured-data helpers
tests/           Playwright suite
scripts/         screenshots, external link check
```

## Content model

All copy and data live in `src/content/` as typed TypeScript. Pages never hard-code company data.

- `portfolio.ts` — 9 `sectors` and 45 `companies` (each with one or more `sites`, an optional `description` and, for core entities, an internal `profile` URL). Adding a company is one object.
- `entities.ts` — the eight core entities with their page copy.
- `story.ts` — the timeline milestones (marked `group` or `founder`) and the founder biography.
- `site.ts` — verified contact details and main navigation.

## Server vs client components

Everything is a Server Component except the parts that need the browser:

| Client component | Why |
| --- | --- |
| `SiteHeader`, `MegaMenu`, `MobileMenu` | Menu state, scroll state, focus management |
| `Orbit` | Hero canvas: sector orbits and company particles (starts after load + idle) |
| `SectorExplorer` | Accessible tabs: choose a sector, see every company |
| `LitStatement` | Scroll-lit introduction statement (sets one CSS variable) |
| `CompanyDirectory` | Filtering, search, layout animation (on `/companies/` only) |
| `Timeline` | Scroll-linked line |
| `ContactForm` | `useActionState`, validation feedback |
| `Effects` | One delegated module for scroll reveals, spotlight and magnetic effects, so sections can stay server-rendered |
| `MotionProvider` | `LazyMotion` wrapper — animation features load after hydration |

Reveal and entrance animations are plain CSS. Content is hidden for a reveal only when `<html class="js">` is set by an inline boot script, and that class is removed if the client bundle hasn't started within four seconds, so content never stays invisible.

## Contact form

`src/app/contact/actions.ts` is a Server Action that:

1. normalises and validates every field on the server;
2. rejects bots (hidden honeypot field, minimum 3-second fill time) and rate-limits each IP to 5 submissions per 10 minutes (in memory, per instance);
3. sends via the Resend REST API when `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set (HTML-escaped content, `reply_to` set to the visitor);
4. otherwise returns an `unconfigured` state, which the UI shows as "not sent" with direct contact details. It never pretends delivery happened.

## Routing and redirects

`trailingSlash: true` keeps the WordPress URL format exactly (`/dr-daniel-davidson/`). Retired WordPress URLs redirect permanently (308) in `next.config.ts`:

| Old URL | New destination | Why |
| --- | --- | --- |
| `/home/` | `/` | duplicate of homepage |
| `/leadership/` | `/dr-daniel-davidson/` | nav alias |
| `/login/`, `/login-page/`, `/register/` | `/contact/` | broken membership plugin pages (raw shortcodes) |
| `/membership-plans/` | `/american-elite-club/` | broken plugin page; closest real page |
| `/testing/`, `/blog-post-title/` | `/` | placeholder pages |
| `/business-engineering-vs-business-development/` | `/american-elite-global-solutions/` | empty post; closest topic |
| `/feed/`, `/comments/feed/`, `/category/*` | `/` | WordPress system URLs |
| `/author/*` | `/about/` | WordPress author archive |
| `/wp-sitemap.xml`, `/wp-sitemap-*.xml` | `/sitemap.xml` | old sitemaps |

Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) are set for every route, and the `X-Powered-By` header is disabled.
