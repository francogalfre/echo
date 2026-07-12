import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };
export const SOCIAL_IMAGE_CONTENT_TYPE = "image/png";
export const SOCIAL_IMAGE_ALT = siteConfig.name;
export const SOCIAL_IMAGE_TAGLINE = "Feedback infrastructure for developers";

export async function renderSocialImage(): Promise<ImageResponse> {
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
        {siteConfig.name.toLowerCase()}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "36px",
          color: "#a1a1aa",
          marginTop: "24px",
        }}
      >
        {SOCIAL_IMAGE_TAGLINE}
      </div>
    </div>,
    { ...SOCIAL_IMAGE_SIZE },
  );
}
