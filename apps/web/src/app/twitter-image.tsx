import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Echo";

export default async function Image(): Promise<ImageResponse> {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        padding: "96px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          backgroundColor: "#7C3AED",
          marginBottom: "48px",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: "128px",
          color: "#ffffff",
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        echo
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "36px",
          color: "#a1a1aa",
          marginTop: "24px",
        }}
      >
        Feedback infrastructure for developers
      </div>
    </div>,
    { ...size },
  );
}
