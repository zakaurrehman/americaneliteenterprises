// Builds the metallic American Elite Enterprises logo from the American Elite
// Digital artwork: the lion, laurel, ribbon and "AMERICAN ELITE" are kept
// untouched; "DIGITAL" is replaced by "ENTERPRISES" in matching metallic red,
// and the two gold rules are shortened to fit the longer word.
//
//   node build-metallic-logo.cjs [source=digital-lockup-full.png] [outDir=../logo-metallic]
//
// Needs (in a folder on NODE_PATH): sharp, opentype.js, @fontsource/montserrat.
// The source is americanelitedigital/public/brand/lockup-full.png (transparent,
// 1431 × 1099), itself made from the designer's JPEG.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { render } = require("./metal-text.cjs");

const SRC = process.argv[2] || path.join(__dirname, "digital-lockup-full.png");
const OUT = process.argv[3] || path.join(__dirname, "../logo-metallic");

// Measured on the source: the subtitle band and the two gold rules.
const BAND_TOP = 1000; // everything below this row is the "— DIGITAL —" line
const TEXT_TOP = 1017; // top of the red lettering
const TEXT_HEIGHT = 82; // ink height of the red lettering
const TEXT_CENTER = 717; // horizontal centre of "DIGITAL"
const RULE = { top: 1049, height: 23, left: [5, 435], right: [996, 1424] };
const GAP = 30; // space between a rule and the word

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const src = sharp(SRC);
  const { width: W, height: H } = await src.metadata();

  const rule = (x0, x1) =>
    sharp(SRC).extract({ left: x0, top: RULE.top, width: x1 - x0 + 1, height: RULE.height }).png().toBuffer();
  const leftRule = await rule(...RULE.left);
  const rightRule = await rule(...RULE.right);

  // Source with the subtitle band cleared.
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let y = BAND_TOP; y < H; y++) data.fill(0, y * W * 4, (y + 1) * W * 4);
  const base = await sharp(data, { raw: info }).png().toBuffer();

  const word = await render("ENTERPRISES", { height: TEXT_HEIGHT });
  const textLeft = Math.round(TEXT_CENTER - word.width / 2);
  const leftW = textLeft - GAP - RULE.left[0];
  const rightStart = textLeft + word.width + GAP;
  const rightW = RULE.right[1] - rightStart + 1;
  if (leftW < 60 || rightW < 60) throw new Error(`Rules too short (${leftW}, ${rightW}): word is ${word.width}px`);

  const stretch = (buf, w) => sharp(buf).resize({ width: w, height: RULE.height, fit: "fill" }).png().toBuffer();
  const full = await sharp(base)
    .composite([
      { input: await stretch(leftRule, leftW), left: RULE.left[0], top: RULE.top },
      { input: await stretch(rightRule, rightW), left: rightStart, top: RULE.top },
      { input: word.png, left: textLeft, top: TEXT_TOP },
    ])
    .png()
    .toBuffer();

  // Split into emblem and wordmark at the first empty row below the ribbon
  // (same method as americanelitedigital/scripts/build-logo-assets.mjs).
  const raw = await sharp(full).raw().toBuffer();
  let split = -1;
  for (let y = Math.floor(H * 0.6); y < H && split < 0; y++) {
    let any = false;
    for (let x = 0; x < W && !any; x++) any = raw[(y * W + x) * 4 + 3] > 24;
    if (!any) split = y;
  }
  const trimmed = (img) => img.png().toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).png().toBuffer());
  const fullTrim = await trimmed(sharp(full));
  const emblem = await trimmed(sharp(full).extract({ left: 0, top: 0, width: W, height: split }));
  const wordmark = await trimmed(sharp(full).extract({ left: 0, top: split, width: W, height: H - split }));

  // Wordmark for dark backgrounds: blue lettering → chrome, red brightened.
  const w = await sharp(wordmark).raw().toBuffer({ resolveWithObject: true });
  for (let p = 0; p < w.info.width * w.info.height; p++) {
    const i = p * 4, r = w.data[i], g = w.data[i + 1], b = w.data[i + 2];
    if (b > r + 25 && b > g + 10) {
      const v = Math.round(200 + (Math.min(0.3 * r + 0.59 * g + 0.11 * b, 140) / 140) * 55);
      w.data.set([v, v, Math.min(255, v + 6)], i);
    } else if (r > g + 70 && r > b + 60) {
      w.data.set([Math.min(255, r + 45), Math.min(255, g + 38), Math.min(255, b + 48)], i);
    }
  }
  const wordmarkOnDark = await sharp(w.data, { raw: w.info }).png().toBuffer();

  // Horizontal lockup: emblem beside the wordmark.
  const em = await sharp(emblem).metadata();
  const wm = await sharp(wordmark).metadata();
  const eh = 600, ew = Math.round((em.width * eh) / em.height);
  const wh = Math.round(eh * 0.58), ww = Math.round((wm.width * wh) / wm.height), gap = 50;
  const horizontal = async (wordBuf) =>
    sharp({ create: { width: ew + gap + ww, height: eh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: await sharp(emblem).resize({ height: eh }).png().toBuffer(), left: 0, top: 0 },
        { input: await sharp(wordBuf).resize({ height: wh }).png().toBuffer(), left: ew + gap, top: Math.round((eh - wh) / 2) },
      ])
      .png()
      .toBuffer();

  const png = { compressionLevel: 9 };
  const files = {
    "lockup-full.png": fullTrim,
    "emblem.png": emblem,
    "wordmark.png": wordmark,
    "wordmark-on-dark.png": wordmarkOnDark,
    "lockup-horizontal.png": await sharp(await horizontal(wordmark)).resize({ width: 1600 }).png().toBuffer(),
    "lockup-horizontal-on-dark.png": await sharp(await horizontal(wordmarkOnDark)).resize({ width: 1600 }).png().toBuffer(),
  };
  for (const [name, buf] of Object.entries(files)) {
    await sharp(buf).png(png).toFile(path.join(OUT, name));
    const m = await sharp(path.join(OUT, name)).metadata();
    console.log(`${name} ${m.width}x${m.height}`);
  }
  console.log(`word ${word.width}px at x=${textLeft}; rules ${leftW}px / ${rightW}px`);
})();
