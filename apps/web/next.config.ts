import "@echo/env/web";
import type { NextConfig } from "next";

const oneYearInSeconds = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: oneYearInSeconds,
    qualities: [60, 75],
  },
  async headers() {
    const globalHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    const frameProtectionHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
    ];

    return [
      { source: "/:path*", headers: globalHeaders },
      { source: "/dashboard/:path*", headers: frameProtectionHeaders },
      { source: "/login", headers: frameProtectionHeaders },
      { source: "/register", headers: frameProtectionHeaders },
      { source: "/onboarding", headers: frameProtectionHeaders },
    ];
  },
};

export default nextConfig;
