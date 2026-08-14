import { env } from "@echo/env/web";

type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  twitter: string;
  links: {
    docs: string;
    privacy: string;
    terms: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "Echo",
  title: "Echo",
  description:
    "Collect user feedback via widget, REST API or hosted page. Echo classifies sentiment " +
    "and summarizes what matters for product, support and engineering teams.",
  url: env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  twitter: "@echo",
  links: {
    docs: "/docs",
    privacy: "/legal/privacy",
    terms: "/legal/terms",
  },
} as const;
