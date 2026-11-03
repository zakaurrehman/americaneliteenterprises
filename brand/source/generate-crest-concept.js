// American Elite Enterprises — logo generator.
// Builds every lockup as pure vector SVG (type converted to outlines) and
// renders presentation PNGs. Usage: node logo.js <outDir>
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");
const sharp = require("sharp");

const OUT = process.argv[2] || "out";
const FONTS = path.join(__dirname, "node_modules/@fontsource");
const serif = opentype.loadSync(`${FONTS}/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff`);
const sans = opentype.loadSync(`${FONTS}/manrope/files/manrope-latin-600-normal.woff`);

// ---------------------------------------------------------------------------
// Palette — every hue comes from the original crest (see README)
// ---------------------------------------------------------------------------
const P = {
  navy: "#141B4D", //   from ribbon blue  #0807B2, deepened
  navyDeep: "#0D1236", // background tint of the same navy
  gold: "#C9A13F", //   from frame gold   #F1C23B, desaturated
  goldLight: "#E0BF6A", // same hue, lighter for dark grounds
  goldDeep: "#8C6A22", // same hue, darker for type on ivory
  crimson: "#8E1A22", // from field red    #870001
  ivory: "#F7F3EA", //  from field white  #F5F5F5, warmed
};

const f = (n) => +n.toFixed(2);

// ---------------------------------------------------------------------------
// Type → outlines with manual tracking + kerning
// ---------------------------------------------------------------------------
function textPath(font, text, size, tracking /* em */) {
  const glyphs = font.stringToGlyphs(text);
  const scale = size / font.unitsPerEm;
  let x = 0;
  const parts = [];
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(x, 0, size).toPathData(2));
    if (i < glyphs.length - 1) {
      const kern = font.getKerningValue(g, glyphs[i + 1]);
      x += (g.advanceWidth + kern) * scale + tracking * size;
    } else {
      x += g.advanceWidth * scale;
    }
  });
  // Cap height for vertical alignment
  const capH = (font.tables.os2.sCapHeight || font.unitsPerEm * 0.7) * scale;
  return { d: parts.join(""), width: x, capH };
}

// ---------------------------------------------------------------------------
// Emblem geometry (viewBox 0 0 240 276)
// role(name) → colour; lets the same drawing render in colour or as a mask
// ---------------------------------------------------------------------------
const SHIELD = "M62 78H178V166C178 199 153 219 120 234C87 219 62 199 62 166Z";
const SHIELD_INNER = "M70 86H170V165C170 193 149 210 120 223C91 210 70 193 70 165Z";

// Lion head in profile facing left, drawn on a 100-unit grid: a long straight
// nose line and squared muzzle (from the original's faceted lion) with a mane
// of swept, blade-shaped locks. Inner details are evenodd cut-outs.
const LION_GRID =
  // face: skull → brow → nose → muzzle → jaw
  "M50 14C42 14 36 17 32 23L22.5 35.5L17.5 41.5Q15 44.5 15.2 48L16 52.5Q16.6 54.6 19.6 54.8L25 55Q24.6 58.6 28.2 60.4L32.5 61L28.8 63.6Q28.2 70.4 34.4 72Q41.5 73.6 45.5 79" +
  // mane locks, sweeping back clockwise from the throat to the crown
  "Q50 89 58 96Q58 86 62 80" +
  "Q70 91 81 94Q74 84 76 76" +
  "Q88 81 97 80Q87 71 86.5 65" +
  "Q96 61 100.5 53Q90 53 88.5 47" +
  "Q96 40 96.5 31Q88 35 84.5 31" +
  "Q89 22 85 13Q78 19 74 17" +
  "Q72 7 65 1Q62 10 58 12Z" +
  // eye
  "M29 32Q33 28.4 37.4 28.6Q35.4 32.8 29 32Z" +
  // mane parting that frames the face (kept clear of the field's centre line)
  "M55.5 16Q66 45 49.5 77Q60.5 46 52.5 16.6Z" +
  // inner mane strands echoing the outer locks
  "M61 23Q75 30 79 47Q72 34 61 23Z" +
  "M62 52Q74 57 78 70Q69 61 62 52Z";
const LION_TRANSFORM = "translate(71 94) scale(0.98)"; // grid x=50 sits on the shield's centre line

function star(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.42 : r;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return "M" + pts.map((p) => p.map(f).join(" ")).join("L") + "Z";
}

function leaf(bx, by, len, w, angle) {
  // Pointed leaf whose base sits at (bx,by), pointing along `angle` (rad).
  const c = Math.cos(angle), s = Math.sin(angle);
  const pt = (u, v) => [bx + u * c - v * s, by + u * s + v * c].map(f).join(" ");
  return `M${pt(0, 0)}Q${pt(len * 0.45, -w)} ${pt(len, 0)}Q${pt(len * 0.45, w)} ${pt(0, 0)}Z`;
}

// Left laurel branch; the right one is its mirror image. It rises from behind
// the ribbon and curves around the shield, with paired leaves growing upward.
function laurelLeft() {
  const cx = 120, cy = 150, r = 84;
  const deg = Math.PI / 180;
  const a0 = 96 * deg, a1 = 221 * deg;
  const at = (t) => {
    const a = a0 + (a1 - a0) * t;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), dir: a + Math.PI / 2 };
  };
  const s0 = at(0), s1 = at(1);
  const stem = `M${f(s0.x)} ${f(s0.y)}A${r} ${r} 0 0 1 ${f(s1.x)} ${f(s1.y)}`;
  const N = 9, spread = 34 * deg;
  let leaves = "";
  for (let i = 0; i < N; i++) {
    const t = 0.1 + (i / (N - 1)) * 0.84;
    const p = at(t);
    const len = 17.5 - i * 0.55, w = 4.6 - i * 0.1;
    leaves += leaf(p.x, p.y, len, w, p.dir - spread); // outer side
    leaves += leaf(p.x, p.y, len * 0.86, w * 0.92, p.dir + spread); // inner side
  }
  leaves += leaf(s1.x, s1.y, 15.5, 4, s1.dir); // terminal leaf
  return { stem, leaves };
}

const RIBBON_BAND = "M66 233Q120 252 174 233L178 257Q120 276 62 257Z";
const RIBBON_TAIL_L = "M66 243L40 248L50 258L42 270L70 266Z";
const RIBBON_TAIL_R = "M174 243L200 248L190 258L198 270L170 266Z";

function emblem(role, { compact = false } = {}) {
  const g = [];
  if (!compact) {
    const l = laurelLeft();
    const branch = `<path d="${l.stem}" fill="none" stroke="${role("gold")}" stroke-width="2.2" stroke-linecap="round"/><path d="${l.leaves}" fill="${role("gold")}"/>`;
    g.push(branch, `<g transform="translate(240 0) scale(-1 1)">${branch}</g>`);
  }
  // Crown
  g.push(`<path d="M84 56L79 31L99 44L120 21L141 44L161 31L156 56Z" fill="${role("gold")}"/>`);
  g.push(`<circle cx="79" cy="29" r="4.2" fill="${role("gold")}"/><circle cx="161" cy="29" r="4.2" fill="${role("gold")}"/>`);
  // Fleur finial, echoing the original crown's central ornament
  const fleur = "M120 2Q127 11 120 23Q113 11 120 2Z" + leaf(120, 21.5, 11, 3.4, (-152 * Math.PI) / 180) + leaf(120, 21.5, 11, 3.4, (-28 * Math.PI) / 180);
  g.push(`<path d="${fleur}" fill="${role("gold")}"/>`);
  g.push(`<rect x="82" y="58" width="76" height="12" rx="1.5" fill="${role("gold")}"/>`);
  g.push(`<circle cx="120" cy="64" r="3.4" fill="${role("crimson")}"/>`);
  if (!compact) g.push(`<circle cx="100" cy="64" r="2.4" fill="${role("navy")}"/><circle cx="140" cy="64" r="2.4" fill="${role("navy")}"/>`);
  // Shield field, split per pale
  g.push(`<clipPath id="cpShield"><path d="${SHIELD}"/></clipPath>`);
  g.push(`<clipPath id="cpL"><rect x="0" y="0" width="120" height="276"/></clipPath><clipPath id="cpR"><rect x="120" y="0" width="120" height="276"/></clipPath>`);
  g.push(`<g clip-path="url(#cpShield)"><rect x="0" y="70" width="120" height="180" fill="${role("ivory")}"/><rect x="120" y="70" width="120" height="180" fill="${role("crimson")}"/></g>`);
  // Lion, counterchanged
  g.push(`<g clip-path="url(#cpL)"><path d="${LION_GRID}" transform="${LION_TRANSFORM}" fill-rule="evenodd" fill="${role("crimson")}"/></g>`);
  g.push(`<g clip-path="url(#cpR)"><path d="${LION_GRID}" transform="${LION_TRANSFORM}" fill-rule="evenodd" fill="${role("ivory")}"/></g>`);
  // Shield border
  g.push(`<path d="${SHIELD}" fill="none" stroke="${role("gold")}" stroke-width="${compact ? 9 : 6}" stroke-linejoin="round"/>`);
  if (!compact) g.push(`<path d="${SHIELD_INNER}" fill="none" stroke="${role("gold")}" stroke-width="1.6" stroke-linejoin="round"/>`);
  if (!compact) {
    // Ribbon: tails, band, gold edge, three stars
    g.push(`<path d="${RIBBON_TAIL_L}" fill="${role("navy")}" stroke="${role("gold")}" stroke-width="1.6" stroke-linejoin="round"/>`);
    g.push(`<path d="${RIBBON_TAIL_R}" fill="${role("navy")}" stroke="${role("gold")}" stroke-width="1.6" stroke-linejoin="round"/>`);
    g.push(`<path d="${RIBBON_BAND}" fill="${role("navy")}" stroke="${role("gold")}" stroke-width="1.6" stroke-linejoin="round"/>`);
    g.push(`<path d="${star(102, 251.5, 5)}${star(120, 254.5, 5.6)}${star(138, 251.5, 5)}" fill="${role("star")}"/>`);
  }
  return g.join("");
}

// ---------------------------------------------------------------------------
// Colour schemes. "mono" schemes build a mask so knock-outs are transparent.
// ---------------------------------------------------------------------------
const schemes = {
  light: { bg: P.ivory, roles: { gold: P.gold, crimson: P.crimson, ivory: P.ivory, navy: P.navy, star: P.gold }, word: P.navy, sub: P.goldDeep, rule: P.gold },
  dark: { bg: P.navyDeep, roles: { gold: P.goldLight, crimson: P.crimson, ivory: P.ivory, navy: P.navy, star: P.goldLight }, word: P.ivory, sub: P.goldLight, rule: P.goldLight },
  mono: { bg: "#FFFFFF", mono: P.navy },
  "mono-reverse": { bg: P.navyDeep, mono: P.ivory },
};
// In one colour: ink = solid, knock = transparent.
const MONO_ROLES = { gold: "#fff", crimson: "#fff", navy: "#fff", ivory: "#000", star: "#000" };

let uid = 0;
function emblemMarkup(scheme, opts) {
  if (!scheme.mono) return emblem((r) => scheme.roles[r], opts);
  const id = `m${uid++}`;
  const inner = emblem((r) => MONO_ROLES[r], opts).replace(/cp(Shield|L|R)/g, (m) => `${m}${id}`);
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="276"><rect width="240" height="276" fill="#000"/>${inner}</mask><rect width="240" height="276" fill="${scheme.mono}" mask="url(#${id})"/>`;
}

function scopeIds(markup, prefix) {
  return markup.replace(/id="(cp[A-Za-z]+)"/g, `id="$1${prefix}"`).replace(/url\(#(cp[A-Za-z]+)\)/g, `url(#$1${prefix})`);
}

// ---------------------------------------------------------------------------
// Wordmark
// ---------------------------------------------------------------------------
const MAIN = textPath(serif, "AMERICAN ELITE", 100, 0.1);
const SUB = textPath(sans, "ENTERPRISES", 30, 0.62);

function wordmark(scheme, align /* "left" | "center" */) {
  const ink = scheme.mono || scheme.word;
  const sub = scheme.mono || scheme.sub;
  const rule = scheme.mono || scheme.rule;
  const W = MAIN.width;
  const capY = MAIN.capH; // baseline of main line
  const subY = capY + 30 + SUB.capH + 10;
  const subX = align === "center" ? (W - SUB.width) / 2 : (W - SUB.width) / 2;
  const ruleY = subY - SUB.capH / 2;
  const gap = 22;
  const ruleW = (W - SUB.width) / 2 - gap;
  const g = [
    `<path d="${MAIN.d}" transform="translate(0 ${f(capY)})" fill="${ink}"/>`,
    `<path d="${SUB.d}" transform="translate(${f(subX)} ${f(subY)})" fill="${sub}"/>`,
    `<rect x="0" y="${f(ruleY - 0.9)}" width="${f(ruleW)}" height="1.8" fill="${rule}"/>`,
    `<rect x="${f(W - ruleW)}" y="${f(ruleY - 0.9)}" width="${f(ruleW)}" height="1.8" fill="${rule}"/>`,
  ];
  return { markup: g.join(""), width: W, height: subY + 4 };
}

// ---------------------------------------------------------------------------
// Lockups
// ---------------------------------------------------------------------------
function svg(w, h, body, bg) {
  const bgRect = bg ? `<rect width="${f(w)}" height="${f(h)}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(w)} ${f(h)}" width="${f(w)}" height="${f(h)}">${bgRect}${body}</svg>`;
}

function lockups(name, scheme) {
  const out = {};
  const id = name.replace(/-/g, "");
  // Emblem
  out.emblem = svg(240, 276, scopeIds(emblemMarkup(scheme), `E${id}`));
  // Compact mark (≤ 64px): crown + shield + lion, square canvas
  out.mark = svg(240, 240, `<g transform="translate(0 -6)">${scopeIds(emblemMarkup(scheme, { compact: true }), `M${id}`)}</g>`);
  // Wordmark only
  const wc = wordmark(scheme, "center");
  out.wordmark = svg(wc.width, wc.height, wc.markup);
  // Horizontal: emblem height = 2.15 × wordmark block height
  {
    const eh = wc.height * 2.5, es = eh / 276, ew = 240 * es, gap = wc.height * 0.62;
    const W = ew + gap + wc.width, H = eh;
    out.horizontal = svg(W, H,
      `<g transform="scale(${f(es)})">${scopeIds(emblemMarkup(scheme), `H${id}`)}</g>` +
      `<g transform="translate(${f(ew + gap)} ${f((H - wc.height) / 2)})">${wc.markup}</g>`);
  }
  // Stacked
  {
    const ew = wc.width * 0.42, es = ew / 240, eh = 276 * es, gap = wc.height * 0.45;
    const W = wc.width, H = eh + gap + wc.height;
    out.stacked = svg(W, H,
      `<g transform="translate(${f((W - ew) / 2)} 0) scale(${f(es)})">${scopeIds(emblemMarkup(scheme), `S${id}`)}</g>` +
      `<g transform="translate(0 ${f(eh + gap)})">${wc.markup}</g>`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Write files + presentation renders
// ---------------------------------------------------------------------------
async function present(svgStr, bg, file, { W = 2400, H = 1600, fill = 0.62 } = {}) {
  const m = svgStr.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const vw = +m[1], vh = +m[2];
  const k = Math.min((W * fill) / vw, (H * fill) / vh);
  const w = Math.round(vw * k), h = Math.round(vh * k);
  const art = await sharp(Buffer.from(svgStr), { density: Math.max(72, 72 * k) }).resize(w, h).png().toBuffer();
  await sharp({ create: { width: W, height: H, channels: 4, background: bg } })
    .composite([{ input: art, left: Math.round((W - w) / 2), top: Math.round((H - h) / 2) }])
    .png().toFile(file);
}

(async () => {
  fs.mkdirSync(path.join(OUT, "svg"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "png"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "favicon"), { recursive: true });
  const only = process.env.ONLY;
  for (const [name, scheme] of Object.entries(schemes)) {
    const set = lockups(name, scheme);
    for (const [kind, s] of Object.entries(set)) {
      const base = `american-elite-${kind}-${name}`;
      if (only && !base.includes(only)) continue;
      fs.writeFileSync(path.join(OUT, "svg", base + ".svg"), s);
      const fill = kind === "emblem" || kind === "mark" ? 0.6 : kind === "stacked" ? 0.66 : 0.72;
      await present(s, scheme.bg, path.join(OUT, "png", base + ".png"), { fill });
    }
  }
  // Favicons / app icons from the compact mark on navy
  const dark = lockups("dark", schemes.dark).mark;
  const iconSvg = svg(240, 240, `<rect width="240" height="240" fill="${P.navyDeep}"/><g transform="translate(24 30) scale(0.8)">${dark.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`);
  fs.writeFileSync(path.join(OUT, "favicon", "icon.svg"), iconSvg);
  for (const s of [16, 32, 48, 180, 192, 512]) {
    await sharp(Buffer.from(iconSvg), { density: 72 * (s / 240) * 4 }).resize(s, s).png().toFile(path.join(OUT, "favicon", `icon-${s}.png`));
  }
  console.log("done");
})();
