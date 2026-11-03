import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { sectors, totalCompanies } from "@/content/portfolio";

export const alt = "American Elite Enterprises — a private enterprise group in Los Angeles since 1991";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const lion = await readFile(join(process.cwd(), "public/brand/american-elite-emblem.png"));
  const lionSrc = `data:image/png;base64,${lion.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px",
          background: "radial-gradient(circle at 78% 40%, #dbeafe 0%, #f8fafc 55%)",
          color: "#0f1729",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 24, letterSpacing: 6, color: "#2463ea" }}>AMERICAN ELITE ENTERPRISES</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, marginTop: 28 }}>
            {`${totalCompanies} businesses. ${sectors.length} sectors. One group.`}
          </div>
          <div style={{ fontSize: 26, color: "#475569", marginTop: 28 }}>
            A private enterprise group · Los Angeles · Since 1991
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 380,
            height: 380,
            borderRadius: 999,
            border: "2px solid rgba(36,99,234,0.30)",
            boxShadow: "0 0 120px rgba(36,99,234,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 300,
              height: 300,
              borderRadius: 999,
              border: "1px solid rgba(15,23,42,0.10)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
            <img src={lionSrc} width={210} height={210} alt="" />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
