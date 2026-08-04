import type { MetadataRoute } from "next";

import { siteConfig } from "@/utils/site";

const buildUrl = (path: string): string => new URL(path, siteConfig.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: buildUrl("/docs"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: buildUrl("/docs/getting-started"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl("/docs/api"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl("/docs/widget"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl("/legal/privacy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: buildUrl("/legal/terms"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
