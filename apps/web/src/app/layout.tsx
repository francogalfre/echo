import { Toaster } from "@echo/ui/components/toast";
import { geistMono, geistPixel, geistSans, instrumentSans } from "@/lib/fonts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";

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
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
