import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NavZen - Smart Search Hub";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0c1222, #0f2847, #0c1222)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 800, color: "white" }}>N</span>
          </div>
          <span style={{ fontSize: 56, fontWeight: 700, color: "white" }}>NavZen</span>
        </div>
        <span style={{ fontSize: 24, color: "rgba(255,255,255,0.5)" }}>
          Smart Search Hub
        </span>
      </div>
    ),
    { ...size }
  );
}
