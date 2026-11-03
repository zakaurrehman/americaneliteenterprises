# Component selection — 21st.dev

## How 21st.dev was used

- **21st.dev MCP / CLI: not connected.** No 21st.dev tools were available in the session, and installing components requires an API key. The client chose to **build without it**: 21st.dev was used for research and inspiration only, and every component on the site was written for this project. No 21st.dev component code was copied, so no component licence obligations apply.
- **Colour scheme: from 21st.dev themes.** At the client's request the palette comes from two 21st.dev community themes. Their token values were read from the public theme previews (rendered in a real browser, since the pages are client-side):
  - **Cyber Cyan Remix** — `21st.dev/community/themes/cyber-cyan-remix-1782588483453`, published under the account *trendgo.az*. **Light-mode** tokens used for background, card, popover, muted, border, input, foreground, muted-foreground (darkened for AA), primary (blue), secondary (teal) and accent (cyan tint). (The dark-mode tokens were used before the client asked for a light theme; they're recorded in design-system.md.)
  - **Twitter Azure** — `@serafimcloud/themes/twitter-azure`. Its primary (azure) is used decoratively, with a darker text-safe variant.
  - Neither theme page states a licence. Colour values themselves are generally not protectable, but if the client wants certainty, confirm the themes' terms with 21st.dev or the authors.

## Ideas researched and how they were used

From the earlier review of 21st.dev's component library (hero, background, card, grid, marquee, footer, navigation, text and gallery categories):

| Idea (21st.dev examples) | Used? | How it appears here |
| --- | --- | --- |
| Scroll Morph Hero — many elements forming one structure | **Inspiration** | The Orbit: 45 company particles forming nine sector orbits around the logo (own canvas implementation) |
| Spotlight Card — cursor-following highlight | **Adapted** | `spotlight` + `edge-light` utilities driven by one delegated pointer listener |
| Feature bento grids | **Adapted** | Industries page bento; homepage core-entity grid |
| Text reveal family | **Adapted** | Masked headline rise (CSS) and the scroll-lit statement |
| Motion navigation menu — sliding active indicator | **Adapted** | Header active pill and explorer tab pill via Motion `layoutId` |
| Aurora / gradient backgrounds | **Reduced** | Two slowly drifting radial light sources (cyan + azure); no blur filters |
| Glassmorphism buttons/cards | **Adapted carefully** | Glass via translucent fill + hairline (no blur on cards, for performance) |
| Animated Shader Hero, Shader Dithering, Spline Scene (WebGL/3D) | **Rejected** | Mobile performance target (Lighthouse 90+) |
| Container Scroll Animation, Scroll media expansion | **Rejected** | Scroll-jacking feel; product-demo patterns |
| Parallax Scrolling, Motion Footer (GSAP, Lenis) | **Rejected** | Would add a second animation engine and smooth-scroll hijacking |
| Interactive Image Accordion | **Rejected** | No licence; the sector explorer covers this need accessibly |

## Dependencies

| Package | Why |
| --- | --- |
| `motion` | Header and explorer indicators, menu transitions, directory layout animations, timeline scroll progress. Loaded through `LazyMotion` so its features download after hydration. |
| `@playwright/test`, `@axe-core/playwright` (dev) | End-to-end and accessibility tests |

No new packages were added in the redesign. No GSAP, Lenis, three.js or icon library; the Orbit is a plain canvas.
