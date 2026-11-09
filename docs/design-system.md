# Design system

All tokens live in [`src/app/globals.css`](../src/app/globals.css) as a Tailwind v4 `@theme`, so each is available as a utility (`bg-page`, `text-accent`, `border-line`, `font-display`, …). Components use only these semantic tokens, so changing a token changes the whole site.

## Colour

**"American heritage" light theme.** Navy, ivory and gold, with flag red as a rare accent: the colours of the group's crest and the American flag. It was chosen after Dr. Daniel Davidson asked that the site keep American Elite's American identity, luxury branding and traditional look (November 2026). It replaced the earlier blue scheme based on 21st.dev's Cyber Cyan Remix and Twitter Azure themes.

| Token | Hex | Use |
| --- | --- | --- |
| `page` | `#fbf8f2` | Page background (ivory) |
| `page-alt` | `#f4eee2` | Alternate sections (parchment) |
| `surface` / `surface-raised` | `#ffffff` | Cards, menus, inputs |
| `tint` / `tint-strong` | `#f3ecdd` / `#ece2cc` | Hover fills |
| `line` / `line-strong` | `#e6dcc8` / `#d3c4a6` | Borders, dividers |
| `fg` | `#0e1a36` | Primary text (navy ink) |
| `fg-muted` | `#4a5165` | Secondary text |
| `fg-subtle` | `#5b6274` | Labels, metadata |
| `accent` | `#1c3570` | Royal navy: buttons, links, highlights |
| `accent-deep` | `#11234d` | Hover states |
| `accent-soft` | `#8aa0d0` | Gradients and glows only |
| `on-accent` | `#fbf8f2` | Text on navy |
| `navy-deep` | `#0b1630` | Dark bands (crest section), photo overlays |
| `gold` / `gold-soft` | `#c9a24a` / `#e6cf94` | Decoration on light; text and buttons on navy |
| `gold-text` | `#7a5a14` | Gold for text on light surfaces |
| `crimson` / `crimson-text` | `#b22234` / `#9b1d2e` | Flag red: decoration / text-safe |
| `danger` | `#a3231b` | Form errors |

### Contrast (WCAG 2.2 AA)

| Pair | Ratio |
| --- | --- |
| `fg` on `page` / `surface` | 16.24 / 17.22 ✓ |
| `fg-muted` on `tint` (its hardest case) | 6.72 ✓ |
| `fg-subtle` on `tint` (the hardest text case) | 5.18 ✓ |
| `accent` on `page`; `on-accent` on `accent` (buttons) | 11.05 ✓ |
| `gold-text` on `page` / `tint` | 6.00 / 5.41 ✓ |
| `crimson-text` on `page` | 7.59 ✓ |
| `danger` on `surface` | 7.46 ✓ |
| `gold` / `gold-soft` on `navy-deep` | 7.47 / 11.71 ✓ |
| `navy-deep` text on the gold button | 7.47 ✓ |
| Ivory at 75% on `navy-deep` | 9.84 ✓ |

`gold` and `crimson` are not text-safe on light surfaces, so they are used there only as decoration. Headline gradients run royal navy → antique gold (`#8a6417`, 5.06:1 on `page`), so every stop passes. The scroll-lit statement rests at 72% opacity (6.72:1). It was 60% (4.48:1), which failed at phone text size. The hero's text sits on a navy wash of 80–94% over the photos, so it stays legible on every slide. axe reports no contrast violations on any page.

The flag stripe (`flag-rule`) and gold hairline (`gold-rule`) utilities are used as dividers: below the hero and at the top of the footer. The faint field of small gold stars (`tech-grid`, a historical name) sits behind page heroes and the crest section.

## Typography

| Role | Font | Notes |
| --- | --- | --- |
| Display | **Playfair Display** (variable, roman and italic) | Classical high-contrast serif; 600, tracking −0.01 to −0.015em. Italic gold for emphasis (for example "One *crown.*") |
| Labels, eyebrows, group name | **Cinzel** (variable) | Roman capitals like the crest's lettering; `label-mono` (the name is historical), 0.16em tracking |
| Body / UI | **Inter** (variable) | 16–18px, line-height 1.6–1.75 |
| URLs, counters | **JetBrains Mono** (variable) | Small amounts only |

All are self-hosted via `next/font`.

Scale utilities: `display-hero` (clamp 2.4→4.75rem), `display-lg` (1.9→3.25rem), `display-md` (1.5→2rem), statement paragraphs (1.4→2.25rem), `label-mono` (0.75rem small capitals).

## Surfaces

| Utility | What | Where |
| --- | --- | --- |
| `glass` | Near-white frosted fill, `line` border, soft shadow. **No blur.** | Cards, chips, panels |
| `glass-blur` | 85% white + 18px backdrop blur + soft shadow | The floating header (when scrolled) |
| `tech-grid` | Faint 72px grid, radially masked | Behind heroes and the CTA |
| `spotlight` | Cursor-following accent glow inside a card | Cards |
| `edge-light` | Accent light that follows the cursor along the card border | Cards |
| `cv-auto` | `content-visibility: auto` | Below-the-fold homepage sections |

Radius scale: `rounded-xl` (buttons, inputs), `rounded-2xl` (cards, header, menu), `rounded-3xl`/`2rem` (feature panels, hero frames).

## Motion

| Token | Value |
| --- | --- |
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` — entrances, reveals, menus |
| `--ease-soft` | `cubic-bezier(0.33, 1, 0.68, 1)` — fades |
| Durations | ~0.3s hover · 0.35–0.5s menus · 0.9–1.1s reveals |
| Stagger | 80ms per item |

| Where | What | How |
| --- | --- | --- |
| Hero | Headline lines rise in masks; copy, buttons and stats fade up; two light sources drift | CSS only — works before hydration |
| Hero | The Orbit: sectors light up in turn; pointer lights the nearest orbit and tilts the plane | Canvas 2D; starts after load + idle; 30fps and 1.5× resolution on phones; pauses off-screen |
| Introduction | Statement words light up as you scroll | One CSS variable per frame |
| Sector explorer | Active tab pill slides; panel and photo crossfade | Motion (`layoutId`, `AnimatePresence`) |
| Directory | Filter pill slides; cards animate in and out | Motion layout animations |
| Timeline | Accent line draws with scroll | Motion `useScroll` |
| Everywhere | Fade-and-rise reveals; card lift, spotlight and edge light; magnetic primary buttons; route entrance | CSS + one delegated `Effects` module |

`prefers-reduced-motion: reduce` disables all of it: content shows immediately, the Orbit draws a single still frame, the statement is fully lit. If the client bundle doesn't start within four seconds, hidden reveal targets are shown anyway.

## Responsive

Mobile-first, verified with no horizontal overflow at 360, 390, 768, 1024, 1280, 1440 and 1920px. On phones the orbit moves below the call to action, the explorer's sector tabs become a horizontal scroller above the panel, the mega menu becomes a full-screen dialog with expandable sectors, and card grids collapse to one column.
