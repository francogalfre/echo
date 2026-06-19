import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../index.css";

export const metadata: Metadata = {
  title: "echo",
  description: "echo",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
