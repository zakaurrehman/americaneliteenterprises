# Design system

All tokens live in [`src/app/globals.css`](../src/app/globals.css) as a Tailwind v4 `@theme`, so each is available as a utility (`bg-page`, `text-accent`, `border-line`, `font-display`, …). Components use only these semantic tokens, so changing a token changes the whole site.

## Colour

**Light theme.** Source: the **light mode** of 21st.dev **Cyber Cyan Remix** (surfaces, text, blue primary, teal secondary, cyan tint) plus the azure primary of 21st.dev **Twitter Azure**. Values are the themes' own oklch tokens; only the two grey text tokens were darkened slightly so they pass WCAG AA on every surface.

| Token | oklch | ≈ hex | Theme source | Use |
| --- | --- | --- | --- | --- |
| `page` | 0.984 0.003 247.9 | `#f8fafc` | background | Page background |
| `page-alt` | 0.968 0.007 247.9 | `#f1f5f9` | muted | Alternate sections |
| `surface` / `surface-raised` | 1 0 0 | `#ffffff` | card / popover | Cards, menus, inputs |
| `tint` / `tint-strong` | 0.968 0.007 247.9 / 0.945 0.012 250 | `#f1f5f9` / `#e8eef5` | muted | Hover fills |
| `line` / `line-strong` | 0.929 0.013 255.5 / 0.871 0.005 286.3 | `#e2e8f0` / `#d4d4d8` | border / input | Borders, dividers |
| `fg` | 0.206 0.039 265.5 | `#0f1729` | foreground | Primary text |
| `fg-muted` | 0.47 0.04 257 | `#4b5a70` | muted-foreground, darkened | Secondary text |
| `fg-subtle` | 0.52 0.04 257 | `#5a6a80` | muted-foreground, darkened | Labels, metadata |
| `accent` | 0.545 0.215 262.7 | `#2463ea` | primary (blue) | Buttons, links, highlights |
| `accent-deep` | 0.39 0.163 262.7 | `#0e3b9a` | accent-foreground | Hover states, gradient start |
| `accent-soft` | 0.70 0.15 255 | `#59a0f9` | (tint of primary) | Gradients and glows only |
| `on-accent` | 0.984 0.003 247.9 | `#f8fafc` | primary-foreground | Text on accent and dark fills |
| `azure` / `azure-text` | 0.672 0.161 245 / 0.55 0.16 245 | `#1d9df1` / `#0077c7` | Twitter Azure primary | Decoration / text-safe azure |
| `teal` / `teal-text` | 0.673 0.133 166.3 / 0.50 0.11 185 | `#1eaf84` / `#00776b` | Cyber Cyan secondary | Decoration / text-safe teal |
| `cyan-tint` | 0.974 0.021 176 | `#e9fbf6` | accent | Reserved accent surface |
| `danger` | 0.52 0.19 27 | `#be2323` | destructive, darkened for text | Form errors |

### Contrast (WCAG 2.2 AA) — computed from the oklch values

| Pair | Ratio |
| --- | --- |
| `fg` on `page` / `surface` | 17.11 / 17.92 ✓ |
| `fg-subtle` on `page-alt` (the hardest case) | 5.02 ✓ |
| `accent` on `page` / `surface` | 4.96 / 5.19 ✓ |
| `on-accent` on `accent` (buttons) | 4.96 ✓ |
| `accent-deep` on `page` | 9.53 ✓ |
| `azure-text` / `teal-text` on `page` | 4.51 / 5.24 ✓ |
| `danger` on `surface` | 6.08 ✓ |

Not text-safe, so used only decoratively: `azure` (2.81), `teal` (2.66) and `accent-soft`. The theme's original muted grey (`#64748b`) is 4.33:1 on `page-alt`, which is why it was darkened. Headline gradients run deep blue → blue → text-safe azure, so every stop passes. The scroll-lit statement rests at 60% opacity (4.63:1). axe reports no contrast violations on any page.

### Dark mode (not active)

The site was first built in the themes' dark mode. If a dark mode is wanted later, these are the values used then (Cyber Cyan Remix dark + Twitter Azure); because every component uses semantic tokens, it is a token-only change plus a toggle:

| Token | Dark value |
| --- | --- |
| `page` / `page-alt` / `surface` / `surface-raised` | oklch(0.131 0.025 249.2) / (0.143 0.02 258) / (0.156 0.015 272.2) / (0.206 0.039 265.5) |
| `fg` / `fg-muted` / `fg-subtle` | oklch(0.959 0.027 208.3) / (0.711 0.035 256.8) / (0.64 0.035 256) |
| `accent` / `on-accent` | oklch(0.861 0.136 193.8) cyan / oklch(0.131 0.025 249.2) |
| `azure` | oklch(0.669 0.161 245) |
| `line` / `tint` | white at 8–10% / white at 3–6% |

## Typography

| Role | Font | Notes |
| --- | --- | --- |
| Display | **Sora** (variable) | 600, tracking −0.03 to −0.045em, leading ~1.0 |
| Body / UI | **Inter** (variable) | 16–18px, line-height 1.6–1.75 |
| Labels / data | **JetBrains Mono** (variable) | Uppercase, 0.14em tracking, for eyebrows, counts, metadata |

Self-hosted via `next/font`; one variable file per family (three font files in total).

Scale utilities: `display-hero` (clamp 2.4→4.75rem), `display-lg` (1.9→3.25rem), `display-md` (1.5→2rem), statement paragraphs (1.4→2.25rem), `label-mono` (0.75rem mono caps). Accent emphasis in headlines uses `text-accent-gradient` (soft cyan → cyan → azure).

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
