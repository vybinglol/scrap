import { ImageResponse } from "next/og";

// Generated OG/Twitter preview — no static asset needed. Uses inline styles
// (Tailwind/CSS vars aren't available here) in the warm default palette.
export const runtime = "edge";
export const alt =
  "Scrapable — a to-do + notes app that becomes your aesthetic. Free for Mac.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f7f1e3",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(66,64,47,0.08) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          color: "#42402f",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#7c9a5e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 44,
            }}
          >
            ✦
          </div>
          <div style={{ fontSize: 56, fontWeight: 700 }}>Scrapable</div>
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            marginTop: 40,
            maxWidth: 900,
          }}
        >
          Your to-do list, but make it{" "}
          <span style={{ color: "#7c9a5e" }}>yours.</span>
        </div>

        <div
          style={{
            fontSize: 34,
            color: "#8a836f",
            marginTop: 28,
            maxWidth: 880,
          }}
        >
          Pin your Pinterest vibe → the whole app becomes it. Free for Mac.
        </div>
      </div>
    ),
    size,
  );
}
