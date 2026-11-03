// American Elite Enterprises — logo generator, family style of the
// American Elite Digital mark (lion + laurel + flag ribbon + Roman wordmark).
// Pure vector, flat colour, type converted to outlines.
// Usage: node logo2.js <outDir>   (ONLY=<substring> to render a subset)
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");
const sharp = require("sharp");

const OUT = process.argv[2] || "out2";
const FONTS = path.join(__dirname, "node_modules/@fontsource");
const roman = opentype.loadSync(`${FONTS}/cinzel/files/cinzel-latin-900-normal.woff`);
const italic = opentype.loadSync(`${FONTS}/montserrat/files/montserrat-latin-700-italic.woff`);

// Palette — every hue is taken from the original crest
const P = {
  gold: "#C9A13F", //      frame gold   #F1C23B, deepened
  goldLight: "#E0BF6A", // same hue, for dark grounds
  royal: "#1A2A7A", //     ribbon blue  #0807B2, deepened
  royalDeep: "#101A52", // same hue, ribbon folds
  navy: "#0D1236", //      same hue, dark background
  red: "#B3141E", //       crown jewel  #C80012
  redLight: "#E0444C", //  same hue, for dark grounds
  green: "#1F7A2C", //     laurel green #1DED27, deepened
  greenLight: "#3FA34D", // same hue, for dark grounds
  ivory: "#F7F3EA", //     field white  #F5F5F5, warmed
};

const f = (n) => +n.toFixed(2);
const pts = (a) => "M" + a.map((p) => `${f(p[0])} ${f(p[1])}`).join("L") + "Z";

// ---------------------------------------------------------------------------
// Type → outlines with tracking + kerning
// ---------------------------------------------------------------------------
function textPath(font, text, size, tracking) {
  const glyphs = font.stringToGlyphs(text);
  const scale = size / font.unitsPerEm;
  let x = 0;
  const parts = [];
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(x, 0, size).toPathData(2));
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) x += font.getKerningValue(g, glyphs[i + 1]) * scale + tracking * size;
  });
  const capH = (font.tables.os2.sCapHeight || font.unitsPerEm * 0.7) * scale;
  return { d: parts.join(""), width: x, capH };
}

// ---------------------------------------------------------------------------
// Lion (grid 0 0 200 220, facing left)
// ---------------------------------------------------------------------------
// A tapered, curved strand: wide at `b`, pointed at `t`, bending through `c`.
function blade(b, c, t, w, n = 28) {
  const L = [], R = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const x = (1 - s) ** 2 * b[0] + 2 * s * (1 - s) * c[0] + s * s * t[0];
    const y = (1 - s) ** 2 * b[1] + 2 * s * (1 - s) * c[1] + s * s * t[1];
    const dx = 2 * (1 - s) * (c[0] - b[0]) + 2 * s * (t[0] - c[0]);
    const dy = 2 * (1 - s) * (c[1] - b[1]) + 2 * s * (t[1] - c[1]);
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const ww = (w / 2) * Math.pow(1 - s, 0.8);
    L.push([x + nx * ww, y + ny * ww]);
    R.push([x - nx * ww, y - ny * ww]);
  }
  return pts([...L, ...R.reverse()]);
}

// Mane: every strand grows from the back contour of the face (forehead →
// cheek → jaw) and flows back, fanning from up-and-back at the brow to
// straight down at the beard. Bases sit just inside the face, which hides them.
const qpt = (a, c, b, t) => [
  (1 - t) ** 2 * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0],
  (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1],
];
function contour(t) {
  // matches the back edge of FACE: (94,50) → (100,128) → (72,155)
  return t < 0.62 ? qpt([94, 50], [107, 96], [100, 128], t / 0.62) : qpt([100, 128], [92, 150], [72, 155], (t - 0.62) / 0.38);
}
function strands({ count, t0, t1, lengthScale, width, inset }) {
  const deg = Math.PI / 180;
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = t0 + ((t1 - t0) * i) / (count - 1);
    const [cx, cy] = contour(t);
    const b = [cx - inset, cy];
    const phi = (-68 + 168 * t) * deg; // up-and-back → down
    const len = (60 + 32 * Math.sin(Math.PI * t)) * lengthScale;
    const tip = [b[0] + len * Math.cos(phi), b[1] + len * Math.sin(phi)];
    const ctrl = [b[0] + 0.55 * len * Math.cos(phi - 36 * deg), b[1] + 0.55 * len * Math.sin(phi - 36 * deg)];
    out.push(blade(b, ctrl, tip, width));
  }
  return out;
}
const MANE = [
  // crest on top of the head
  blade([88, 56], [102, 24], [132, 12], 15),
  // outer layer, then a shorter inner layer staggered between it
  ...strands({ count: 9, t0: 0, t1: 1, lengthScale: 1, width: 22, inset: 6 }),
  ...strands({ count: 8, t0: 0.06, t1: 0.94, lengthScale: 0.62, width: 17, inset: 6 }),
];
// Reduced-detail cut for ≤ 48px: fewer, broader strands and only the eye.
const MANE_SMALL = [
  blade([88, 56], [102, 24], [132, 12], 18),
  ...strands({ count: 6, t0: 0, t1: 1, lengthScale: 0.95, width: 30, inset: 6 }),
];

// Head silhouette: brow → long nose line → blunt nose → muzzle → chin → cheek.
const FACE =
  "M94 50C80 52 67 60 60 72L35 95Q25 100 22.5 108L23 117Q25.5 121 33 121.5Q37 129 47 131L57 132L49 138" +
  "Q50.5 148 61 152.5L72 155Q92 150 100 128Q107 96 94 50Z";

// Features cut out of the head.
const FACE_CUTS = [
  "M57 86Q65 77.5 77 79.5Q70 88.5 57 86Z", // eye
  "M52 77.5Q65 68 83 70.5Q66 72 52 77.5Z", // brow
  "M27 108.5Q31 106 34 108Q31 111 27 108.5Z", // nostril
  "M36 114Q46 112.5 55 116.5Q45 115 36 114Z", // whisker line
  "M38 119.5Q47 119 55 123Q46 121 38 119.5Z", // whisker line
  "M80 96Q90 118 74 145Q85 118 77 96.5Z", // cheek line
];

// Renders the lion as a mask (white = ink) so the gaps between strands are
// transparent in every colour scheme.
function lionMask(id, transform, small = false) {
  const gap = small ? 6 : 2.6;
  const strand = (d) => `<path d="${d}" fill="#fff" stroke="#000" stroke-width="${gap}" stroke-linejoin="round"/>`;
  const cuts = small ? ["M55 87Q65 75 80 78Q71 91 55 87Z"] : FACE_CUTS;
  return (
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="500">` +
    `<g transform="${transform}">${(small ? MANE_SMALL : MANE).map(strand).join("")}${strand(FACE)}` +
    `<path d="${cuts.join("")}" fill="#000"/></g></mask>`
  );
}

// ---------------------------------------------------------------------------
// Laurel
// ---------------------------------------------------------------------------
function leaf(bx, by, len, w, angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  const pt = (u, v) => [bx + u * c - v * s, by + u * s + v * c].map(f).join(" ");
  return `M${pt(0, 0)}Q${pt(len * 0.45, -w)} ${pt(len, 0)}Q${pt(len * 0.45, w)} ${pt(0, 0)}Z`;
}

function laurelLeft(cx, cy, r, a0d, a1d, N, size) {
  const deg = Math.PI / 180;
  const a0 = a0d * deg, a1 = a1d * deg;
  const at = (t) => {
    const a = a0 + (a1 - a0) * t;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), dir: a + Math.PI / 2 };
  };
  const s0 = at(0), s1 = at(1);
  const stem = `M${f(s0.x)} ${f(s0.y)}A${r} ${r} 0 0 1 ${f(s1.x)} ${f(s1.y)}`;
  const spread = 36 * deg;
  let leaves = "";
  for (let i = 0; i < N; i++) {
    const t = 0.06 + (i / (N - 1)) * 0.88;
    const p = at(t);
    const len = size * (1 - i * 0.025), w = size * 0.27 * (1 - i * 0.02);
    leaves += leaf(p.x, p.y, len, w, p.dir - spread);
    leaves += leaf(p.x, p.y, len * 0.88, w * 0.94, p.dir + spread);
  }
  leaves += leaf(s1.x, s1.y, size * 0.85, size * 0.24, s1.dir);
  return { stem, leaves };
}

function star(cx, cy, r) {
  const a = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.42 : r;
    a.push([cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)]);
  }
  return pts(a);
}

// ---------------------------------------------------------------------------
// Emblem (viewBox 0 0 320 296)
// ---------------------------------------------------------------------------
const EW = 320, EH = 296;
// Ribbon arches upward like the Digital mark.
const archY = (x, base) => base - 80 * ((x - 78) / 164) * (1 - (x - 78) / 164); // matches the band curve, x 78..242
const BAND = `M78 232Q160 192 242 232L242 264Q160 224 78 264Z`;
const TAIL_L = "M84 240L46 246L60 259L50 274L88 270Z";
const TAIL_R = "M236 240L274 246L260 259L270 274L232 270Z";
const FOLD_L = "M78 264L88 270L84 256Z";
const FOLD_R = "M242 264L232 270L236 256Z";

function emblem(role, id) {
  const g = [];
  // Laurel, behind everything
  const l = laurelLeft(160, 128, 122, 98, 236, 11, 23);
  const branch = `<path d="${l.stem}" fill="none" stroke="${role("laurel")}" stroke-width="2.6" stroke-linecap="round"/><path d="${l.leaves}" fill="${role("laurel")}"/>`;
  g.push(branch, `<g transform="translate(${EW} 0) scale(-1 1)">${branch}</g>`);
  // Lion
  g.push(lionMask(`lion${id}`, "translate(41 0) scale(1.1)"));
  g.push(`<rect x="0" y="0" width="${EW}" height="${EH}" fill="${role("lion")}" mask="url(#lion${id})"/>`);
  // Ribbon
  g.push(`<path d="${TAIL_L}${TAIL_R}" fill="${role("ribbon")}" stroke="${role("edge")}" stroke-width="1.8" stroke-linejoin="round"/>`);
  g.push(`<path d="${FOLD_L}${FOLD_R}" fill="${role("fold")}"/>`);
  g.push(`<path d="${BAND}" fill="${role("ribbon")}" stroke="${role("edge")}" stroke-width="1.8" stroke-linejoin="round"/>`);
  // Stripes on the fly, clipped to the band
  g.push(`<clipPath id="band${id}"><path d="${BAND}"/></clipPath>`);
  const stripes = [9.5, 16, 22.5].map((o) => `M78 ${232 + o}Q160 ${192 + o} 242 ${232 + o}`).join("");
  g.push(`<clipPath id="fly${id}"><rect x="131" y="190" width="104" height="80"/></clipPath>`);
  g.push(`<g clip-path="url(#band${id})"><g clip-path="url(#fly${id})"><path d="${stripes}" fill="none" stroke="${role("stripe")}" stroke-width="3.8"/></g></g>`);
  g.push(`<path d="M128 ${f(archY(128, 232) + 1)}L128 ${f(archY(128, 264) - 1)}" stroke="${role("edge")}" stroke-width="1.6"/>`);
  // Five stars in the canton
  const sy = (x, dy) => archY(x, 248) + dy;
  g.push(`<path d="${star(93, sy(93, -7), 4.3)}${star(108, sy(108, -8), 4.3)}${star(117, sy(117, 1.5), 4.3)}${star(93, sy(93, 7), 4.3)}${star(108, sy(108, 8), 4.3)}" fill="${role("star")}"/>`);
  return g.join("");
}

// Compact mark: the lion head alone (favicon, avatar, app icon).
function mark(role, id) {
  return lionMask(`lionM${id}`, "translate(10 0) scale(1.0)") +
    `<rect x="0" y="0" width="220" height="220" fill="${role("lion")}" mask="url(#lionM${id})"/>`;
}
function markSmall(role, id) {
  return lionMask(`lionS${id}`, "translate(10 0) scale(1.0)", true) +
    `<rect x="0" y="0" width="220" height="220" fill="${role("lion")}" mask="url(#lionS${id})"/>`;
}

// ---------------------------------------------------------------------------
// Wordmark: Roman capitals + italic "ENTERPRISES" between tapered gold rules
// ---------------------------------------------------------------------------
const MAIN = textPath(roman, "AMERICAN ELITE", 100, 0.012);
const SUB = textPath(italic, "ENTERPRISES", 40, 0.2);

function wordmark(s) {
  const W = MAIN.width;
  const base = MAIN.capH;
  const subBase = base + 26 + SUB.capH;
  const subX = (W - SUB.width) / 2;
  const ruleY = subBase - SUB.capH / 2;
  const gap = 26;
  const rl = subX - gap;
  // tapered rules: thick near the word, pointed at the outer end
  const ruleL = `M0 ${f(ruleY)}L${f(rl)} ${f(ruleY - 2.2)}L${f(rl)} ${f(ruleY + 2.2)}Z`;
  const ruleR = `M${f(W)} ${f(ruleY)}L${f(W - rl)} ${f(ruleY - 2.2)}L${f(W - rl)} ${f(ruleY + 2.2)}Z`;
  const markup =
    `<path d="${MAIN.d}" transform="translate(0 ${f(base)})" fill="${s.word}"/>` +
    `<path d="${SUB.d}" transform="translate(${f(subX)} ${f(subBase)})" fill="${s.sub}"/>` +
    `<path d="${ruleL}${ruleR}" fill="${s.rule}"/>`;
  return { markup, width: W, height: subBase + 2 };
}

// ---------------------------------------------------------------------------
// Colour schemes
// ---------------------------------------------------------------------------
const schemes = {
  light: {
    bg: P.ivory,
    roles: { laurel: P.green, lion: P.gold, ribbon: P.royal, fold: P.royalDeep, edge: P.gold, stripe: P.red, star: P.gold },
    word: P.royal, sub: P.red, rule: P.gold,
  },
  dark: {
    bg: P.navy,
    roles: { laurel: P.greenLight, lion: P.goldLight, ribbon: P.royal, fold: P.royalDeep, edge: P.goldLight, stripe: P.red, star: P.goldLight },
    word: P.ivory, sub: P.redLight, rule: P.goldLight,
  },
  mono: { bg: "#FFFFFF", mono: P.royal },
  "mono-reverse": { bg: P.navy, mono: P.ivory },
};
// One colour: ink = solid, knock = transparent
const MONO = { laurel: "#fff", lion: "#fff", ribbon: "#fff", fold: "#fff", edge: "#fff", stripe: "#000", star: "#000" };

let uid = 0;
function draw(fn, scheme, w, h) {
  const id = `i${uid++}`;
  if (!scheme.mono) return fn((r) => scheme.roles[r], id);
  // Build the drawing in white/black and use it as a mask for one ink colour.
  const inner = fn((r) => MONO[r], id);
  return `<mask id="mono${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#000"/>${inner}</mask><rect width="${w}" height="${h}" fill="${scheme.mono}" mask="url(#mono${id})"/>`;
}
const wordScheme = (s) => (s.mono ? { word: s.mono, sub: s.mono, rule: s.mono } : s);

function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(w)} ${f(h)}" width="${f(w)}" height="${f(h)}">${body}</svg>`;
}

function lockups(scheme) {
  const out = {};
  const em = () => draw(emblem, scheme, EW, EH);
  out.emblem = svg(EW, EH, em());
  out.mark = svg(220, 220, draw(mark, scheme, 220, 220));
  const wm = wordmark(wordScheme(scheme));
  out.wordmark = svg(wm.width, wm.height, wm.markup);
  {
    // Stacked (primary family layout, as in the Digital mark)
    const ew = wm.width * 0.7, k = ew / EW, eh = EH * k, gap = wm.height * 0.32;
    out.stacked = svg(wm.width, eh + gap + wm.height,
      `<g transform="translate(${f((wm.width - ew) / 2)} 0) scale(${f(k)})">${em()}</g>` +
      `<g transform="translate(0 ${f(eh + gap)})">${wm.markup}</g>`);
  }
  {
    const eh = wm.height * 2.7, k = eh / EH, ew = EW * k, gap = wm.height * 0.5;
    out.horizontal = svg(ew + gap + wm.width, eh,
      `<g transform="scale(${f(k)})">${em()}</g>` +
      `<g transform="translate(${f(ew + gap)} ${f((eh - wm.height) / 2)})">${wm.markup}</g>`);
  }
  return out;
}

async function present(svgStr, bg, file, fill) {
  const W = 2400, H = 1600;
  const m = svgStr.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const vw = +m[1], vh = +m[2];
  const k = Math.min((W * fill) / vw, (H * fill) / vh);
  const w = Math.round(vw * k), h = Math.round(vh * k);
  const art = await sharp(Buffer.from(svgStr), { density: 72 * k }).resize(w, h).png().toBuffer();
  await sharp({ create: { width: W, height: H, channels: 4, background: bg } })
    .composite([{ input: art, left: Math.round((W - w) / 2), top: Math.round((H - h) / 2) }])
    .png().toFile(file);
}

(async () => {
  for (const d of ["svg", "png", "favicon"]) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  const only = process.env.ONLY;
  for (const [name, scheme] of Object.entries(schemes)) {
    for (const [kind, s] of Object.entries(lockups(scheme))) {
      const base = `american-elite-${kind}-${name}`;
      if (only && !base.includes(only)) continue;
      fs.writeFileSync(path.join(OUT, "svg", base + ".svg"), s);
      const fill = { emblem: 0.66, mark: 0.56, stacked: 0.7, wordmark: 0.74, horizontal: 0.8 }[kind];
      await present(s, scheme.bg, path.join(OUT, "png", base + ".png"), fill);
    }
  }
  if (!only) {
    // App icon / favicon: gold lion on navy; the reduced cut is used ≤ 48px
    const iconFor = (fn) => svg(240, 240, `<rect width="240" height="240" fill="${P.navy}"/><g transform="translate(22 22) scale(0.9)">${draw(fn, schemes.dark, 220, 220)}</g>`);
    const icon = iconFor(mark), iconSmall = iconFor(markSmall);
    fs.writeFileSync(path.join(OUT, "favicon", "icon.svg"), icon);
    fs.writeFileSync(path.join(OUT, "favicon", "icon-small.svg"), iconSmall);
    for (const s of [16, 32, 48, 180, 192, 512]) {
      const src = s <= 48 ? iconSmall : icon;
      await sharp(Buffer.from(src), { density: 72 * (s / 240) * 4 }).resize(s, s).png().toFile(path.join(OUT, "favicon", `icon-${s}.png`));
    }
  }
  console.log("done");
})();
