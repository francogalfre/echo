import type { ReactElement } from "react";

import { siteConfig } from "@/lib/site";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export const JsonLd = ({ data }: JsonLdProps): ReactElement => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const organizationSchema = (): Record<string, unknown> => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: new URL("/apple-icon", siteConfig.url).toString(),
    sameAs: [`https://twitter.com/${siteConfig.twitter.replace("@", "")}`],
  };
};

export const softwareApplicationSchema = (): Record<string, unknown> => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    featureList: [
      "Drop-in feedback widget",
      "REST API",
      "Sentiment classification",
      "AI summaries",
      "Team collaboration",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        category: "free",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "12",
        priceCurrency: "USD",
        category: "subscription",
      },
    ],
  };
};

export const webSiteSchema = (): Record<string, unknown> => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
};
