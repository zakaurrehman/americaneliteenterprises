# Design direction

## American heritage — current direction (November 2026)

After reviewing the site, Dr. Daniel Davidson asked for it to stay modern without losing American Elite's identity. He named five things to keep:
- **The crown:** the head of the entire business ecosystem.
- **American identity:** the flag, the stars, gold and patriotic elements.
- **Lion Pride Leadership:** the lion stands for strength, leadership and excellence.
- **His personal story:** from immigrating to America as a teenager to becoming a doctor and choosing service over money.
- **The original website:** it tells his story through photographs and cinematic slideshows, and must not be lost.

The layout, performance work, accessibility and every route stayed. What changed, in phase 1:
- **Look:** navy, ivory and gold, with flag red as a rare accent, instead of the blue tech scheme. Playfair Display headlines, Cinzel capitals for labels and the group name, faint gold star fields, and flag-stripe and gold-hairline dividers. See [design-system.md](design-system.md).
- **Hero:** the original website's homepage slideshow is back, using its six largest photos in its original order. They cross-fade slowly with a gentle zoom under a navy wash, with the original crest beside the headline "45 businesses. 9 sectors. One *crown.*" A pause button meets WCAG 2.2.2. With reduced motion the first photo is shown still, and the other photos load only after the page has loaded.
- **"The American Elite crest" section:** a deep-navy band directly after the hero. The orbit now sits here, showing the crown at the head of all 45 businesses, beside the three symbols in Dr. Davidson's own meanings: the crown, the lion, and the flag and stars.
- **Logos:** the original crest for the group, and each company's own logo (see [company-logos.md](company-logos.md)).

Still to do:
- **Phase 2**, which needs his story text and photos: a chapter-by-chapter founder story page and a Lion Pride Leadership values section.
- **Phase 3**, which needs hosting access: clean up the original WordPress site and keep it live at its own address.

## Brief

A futuristic, premium, dark-mode-first website that makes a client or reviewer say "impressive" within five seconds — award-level quality, not a template — while keeping the brand logo, the real content, every route and every redirect, and inventing nothing.

## Grounding (ui-ux-pro-max)

The ui-ux-pro-max skill's data was queried directly (its Python search script could not run: Python is not installed on this machine, so its CSV data was read with a small Node query instead). For the closest product category, *B2B Service*, it recommends:

- **Must have:** credibility first; a "feature showcase + trust" structure; bento grids and micro-interactions.
- **Avoid:** playful design, hidden credentials and **purple/pink "AI" gradients**.
- **Dark premium styles:** *Modern Dark (Cinema)* — near-black layers, ambient light, glass, expo easing (performance: moderate); *Gradient Mesh / Aurora* — low performance cost but flagged as risky for conservative brands.
- **Futuristic, high-tech type:** a geometric display face (e.g. Space Grotesk) with Inter for body and a monospace face for labels and data.

## The two proposed directions

| | A — Obsidian Orbit (**chosen**) | B — Electric Royal |
| --- | --- | --- |
| Mood | Luxury tech: private bank meets Apple | Bold American tech: Linear/Stripe energy |
| Palette (as proposed) | Near-black glass + liquid-gold accent, royal-blue ambient light | Deep indigo-black + electric blue, sparing signal red |
| Type | Sora · Inter · JetBrains Mono | Unbounded · Inter · JetBrains Mono |
| Hero | 45 company particles orbiting 9 sector rings around the logo | Flowing aurora mesh behind kinetic headline + tilting glass sector deck |
| Explorer | Glass bento / tabbed sector explorer | Tabs + live preview panel |

## Colour scheme — changed during the build

After the build started, the colour scheme was switched at the client's request to two 21st.dev community themes:

- **[Cyber Cyan Remix](https://21st.dev/community/themes/cyber-cyan-remix-1782588483453)** (by trendgo.az) — its tokens (dark mode at first, light mode in the final version) define the backgrounds, surfaces, text and the **cyan primary accent**.
- **[Twitter Azure](https://21st.dev/community/themes?preview=%2F%40serafimcloud%2Fthemes%2Ftwitter-azure)** (by serafimcloud) — its **azure** primary is used as the secondary accent (gradient end, ambient light).

The tokens were read from the themes' live previews (light and dark) and applied as their exact oklch values; see [design-system.md](design-system.md). The themes' fonts ("General Sans") and radii were not adopted — the request was for the colour scheme — so Sora/Inter/JetBrains Mono and the existing radius scale remain.

## Light theme (superseded by the heritage direction above)

The original brief asked for "dark-mode-first", so the site was first built in the themes' dark mode. The client then asked for a **light theme**, and the site now uses the themes' **light mode**: near-white page and white surfaces, deep-navy text, Cyber Cyan's **blue primary** (`#2463ea`) with its teal secondary, and Twitter Azure's azure in gradients and glows. In light mode the hues that are too pale for text (azure, teal) are decorative only, with darker text-safe versions provided. The gold crest is the one warm note on the page.

To make the switch clean, every component was moved to semantic tokens (`page`, `surface`, `line`, `tint`, `fg`, `accent`, `on-accent` …), so a future dark mode would be a token-only change.

## Signature: the Orbit (now in the crest section)

At first the hero centrepiece, now the visual of the crest section on navy (gold orbits, ivory businesses), it is a lightweight 2D canvas: nine tilted elliptical orbits — one per sector — around the crest, with each of the 45 businesses as a particle on its sector's orbit (inner orbits faster; the eight core entities highlighted). When idle it lights each sector in turn and names it; on desktop the nearest orbit lights up under the pointer and the plane tilts slightly. It expresses the group in one image — many businesses, one centre — and uses only real counts.

It is decorative (`aria-hidden`); the **sector explorer** below is the accessible way to explore the same data.

## Other key decisions

- **Headline:** "45 businesses. 9 sectors. One group." — real counts, three beats, short enough to stay on three lines beside the orbit. The `<h1>` also carries "American Elite Enterprises" for screen readers and search.
- **Homepage directory → core entities.** The homepage shows the eight core group entities (server-rendered); the full filterable directory of all 45 lives on `/companies/`. This removed duplicated interactivity (the sector explorer already lists every company) and was the single biggest mobile-performance win.
- **Glass without cost:** cards use translucent fills and hairline borders (no blur). Real backdrop blur is reserved for the floating header.
- **Logos:** American Elite Enterprises keeps its original, traditional crest (header, footer, About, orbit, Open Graph, favicons), with the name in Cinzel capitals. Every business shows its **own logo**, so each keeps its identity and legacy (client request, 4 November 2026). The redesigned flat and metallic logos were set aside.
