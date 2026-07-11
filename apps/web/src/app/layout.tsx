import { Toaster } from "@echo/ui/components/sonner";
import { geistMono, geistSans, instrumentSans } from "@/utils/fonts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";

import type { Viewport } from "next";
import type { ReactNode } from "react";

import { createMetadata } from "@/lib/metadata";

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
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable}`}
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
