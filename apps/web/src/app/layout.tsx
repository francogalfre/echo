import { Toaster } from "@echo/ui/components/toast";
import { geistMono, geistPixel, geistSans, instrumentSans } from "@/lib/fonts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import { PostHogAuthSync } from "@/components/posthog-auth-sync";
import { PostHogPageView } from "@/components/posthog-pageview";
import { PostHogProvider } from "@/components/posthog-provider";

import type { Viewport } from "next";
import type { ReactNode } from "react";

import { createMetadata } from "@/utils/metadata";

import "../index.css";

export const metadata = createMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable} ${geistPixel.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <NuqsAdapter>
            <PostHogProvider>
              {children}
              <PostHogAuthSync />
              <PostHogPageView />
            </PostHogProvider>
          </NuqsAdapter>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
