// Exports the metallic logo (brand/logo-metallic, made by build-metallic-logo.cjs)
// as the website's assets: public/brand files, favicons and the apple icon.
//
//   node export-metallic-web.cjs
//
// Needs sharp on NODE_PATH.
const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "../logo-metallic");
const ROOT = path.join(__dirname, "../..");
const pub = (f) => path.join(ROOT, "public/brand", f);
const app = (f) => path.join(ROOT, "src/app", f);
const png = { compressionLevel: 9 };
// Icons are quantised: a 512px favicon should not weigh hundreds of kilobytes.
const icon = { compressionLevel: 9, palette: true, quality: 92, effort: 10 };

// Emblem centred on a square canvas; `pad` is the margin as a share of the side.
const square = (size, pad, background = { r: 0, g: 0, b: 0, alpha: 0 }) => {
  const inner = Math.round(size * (1 - pad * 2));
  return sharp(path.join(SRC, "emblem.png"))
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
    .then((e) =>
      sharp({ create: { width: size, height: size, channels: 4, background } })
        .composite([{ input: e, gravity: "center" }])
        .png(icon),
    );
};

(async () => {
  const jobs = [
    // Header and footer (next/image resizes and converts these on request).
    [sharp(path.join(SRC, "lockup-horizontal.png")).png(png), pub("american-elite-lockup.png")],
    // About page, Open Graph image and structured data.
    [sharp(path.join(SRC, "emblem.png")).resize({ width: 640 }).png(png), pub("american-elite-emblem.png")],
    [sharp(path.join(SRC, "lockup-full.png")).resize({ width: 800 }).png(png), pub("american-elite-logo.png")],
    // Centre of the homepage orbit canvas (drawn at up to ~130 CSS px).
    [sharp(path.join(SRC, "emblem.png")).resize({ width: 288 }).webp({ quality: 85, alphaQuality: 90 }), pub("american-elite-emblem-sm.webp")],
    // Browser and app icons. The apple icon needs an opaque background.
    [await square(32, 0), app("icon1.png")],
    [await square(512, 0.04), app("icon2.png")],
    [await square(180, 0.08, { r: 255, g: 255, b: 255, alpha: 1 }), app("apple-icon.png")],
  ];
  for (const [img, out] of jobs) {
    await img.toFile(out);
    const m = await sharp(out).metadata();
    console.log(`${path.relative(ROOT, out)} ${m.width}x${m.height}`);
  }
})();
