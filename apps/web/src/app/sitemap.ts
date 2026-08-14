import type { MetadataRoute } from "next";

import { siteConfig } from "@/utils/site";

const buildUrl = (path: string): string => new URL(path, siteConfig.url).toString();

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: buildUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildUrl("/docs"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: buildUrl("/docs/getting-started"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl("/docs/api"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl("/docs/widget"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl("/legal/privacy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: buildUrl("/legal/terms"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
