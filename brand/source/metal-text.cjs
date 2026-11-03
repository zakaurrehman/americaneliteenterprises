// Renders a word as glossy red metal, matching the red "DIGITAL" lettering of
// the American Elite Digital logo (calibrated by rendering "DIGITAL" itself and
// comparing it with the original). Montserrat ExtraBold Italic, condensed and
// slanted a little further, with a colour profile sampled from the original
// and an SVG bevel/specular filter for the shine.
const path = require("path");
const opentype = require("opentype.js");
const sharp = require("sharp");

const FONTS = path.join(path.dirname(require.resolve("@fontsource/montserrat/package.json")), "files");
const font = opentype.loadSync(`${FONTS}/montserrat-latin-800-italic.woff`);

// Vertical colour profile sampled row by row from the original "DIGITAL",
// with its two highlight bands strengthened (averaging had softened them).
const STOPS = [
  [0.0, "rgb(171,0,4)"], [0.08, "rgb(238,110,112)"], [0.15, "rgb(170,6,10)"], [0.31, "rgb(132,4,8)"],
  [0.46, "rgb(150,8,12)"], [0.58, "rgb(228,52,60)"], [0.68, "rgb(205,16,26)"], [0.83, "rgb(160,8,12)"],
  [0.9, "rgb(150,4,6)"], [1.0, "rgb(110,12,12)"],
];

// Calibrated against the original: same ink height, width and look.
const STYLE = { sx: 0.88, skew: 6, trackingEm: 0.132, gloss: 1.6, exponent: 30, elevation: 32 };

function glyphRun(word, size, tracking) {
  const glyphs = font.stringToGlyphs(word);
  const scale = size / font.unitsPerEm;
  let x = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  const parts = [];
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    const bb = p.getBoundingBox();
    x0 = Math.min(x0, bb.x1); x1 = Math.max(x1, bb.x2); y0 = Math.min(y0, bb.y1); y1 = Math.max(y1, bb.y2);
    parts.push(p.toPathData(2));
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) x += font.getKerningValue(g, glyphs[i + 1]) * scale + tracking;
  });
  return { d: parts.join(""), x0, x1, y0, y1 };
}

/** Renders `word` as a trimmed transparent PNG whose ink is `height` px tall. */
async function render(word, { height }) {
  const { sx, skew, trackingEm, gloss, exponent, elevation } = STYLE;
  const probe = glyphRun(word, 100, 0);
  const size = (100 * height) / (probe.y1 - probe.y0);
  const run = glyphRun(word, size, trackingEm * size);
  const pad = 8;
  const W = Math.ceil((run.x1 - run.x0) * sx + pad * 2 + height * 0.3);
  const H = Math.ceil(run.y1 - run.y0 + pad * 2);
  const stops = STOPS.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="${pad}" x2="0" y2="${H - pad}">${stops}</linearGradient>
    <filter id="bevel" x="-10%" y="-20%" width="120%" height="140%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${(height * 0.035).toFixed(2)}" result="blur"/>
      <feSpecularLighting in="blur" surfaceScale="${(height * 0.06).toFixed(2)}" specularConstant="${(1.1 * gloss).toFixed(2)}" specularExponent="${exponent}" lighting-color="#ffffff" result="spec">
        <feDistantLight azimuth="235" elevation="${elevation}"/>
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
      <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="${(0.85 * gloss).toFixed(2)}" k4="0" result="lit"/>
      <feMorphology in="SourceAlpha" operator="erode" radius="${Math.max(1, height * 0.012).toFixed(2)}" result="inner"/>
      <feComposite in="SourceAlpha" in2="inner" operator="out" result="rim"/>
      <feFlood flood-color="#5c0006" flood-opacity="0.85"/>
      <feComposite in2="rim" operator="in" result="rimC"/>
      <feMerge><feMergeNode in="lit"/><feMergeNode in="rimC"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#bevel)"><path d="${run.d}" transform="translate(${(pad + height * 0.15).toFixed(2)} ${(pad - run.y0).toFixed(2)}) skewX(${-skew}) scale(${sx} 1) translate(${(-run.x0).toFixed(2)} 0)" fill="url(#g)"/></g>
</svg>`;
  const trimmed = await sharp(await sharp(Buffer.from(svg)).png().toBuffer()).trim({ threshold: 1 }).png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  return { png: trimmed, width: meta.width, height: meta.height };
}

module.exports = { render };
