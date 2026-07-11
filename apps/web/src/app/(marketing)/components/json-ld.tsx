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
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "free",
    },
  };
};
