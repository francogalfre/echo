import { ImageResponse } from "next/og";

export const alt = "Echo — User feedback infrastructure for developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): Response {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f7f7f7",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "280px",
          background:
            "linear-gradient(160deg, rgba(107,92,231,0.28) 0%, rgba(107,92,231,0.06) 55%, rgba(247,247,247,0) 100%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "#6b5ce7",
          }}
        />
        <div style={{ fontSize: 30, fontWeight: 600, color: "#111111" }}>Echo</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#111111",
          }}
        >
          User feedback,
        </div>
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#6b5ce7",
          }}
        >
          already sorted
        </div>
        <div
          style={{
            marginTop: "26px",
            fontSize: 30,
            lineHeight: 1.4,
            color: "#5a5a5a",
            maxWidth: "820px",
          }}
        >
          A drop-in widget, a REST API and a hosted page — with sentiment scored the moment
          feedback lands.
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        {["Widget", "REST API", "Hosted page", "AI summaries"].map((chip) => (
          <div
            key={chip}
            style={{
              borderRadius: "999px",
              border: "1px solid #e2e2e2",
              padding: "10px 20px",
              fontSize: 22,
              color: "#4a4a4a",
            }}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
