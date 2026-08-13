import { siteConfig } from "@/utils/site";

export type JsonLd = Record<string, unknown>;

type FaqEntry = {
  question: string;
  answer: string;
};

const absolute = (path: string): string => new URL(path, siteConfig.url).toString();

export const organizationJsonLd = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": absolute("/#organization"),
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
});

export const websiteJsonLd = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absolute("/#website"),
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: { "@id": absolute("/#organization") },
});

export const softwareApplicationJsonLd = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": absolute("/#software"),
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Customer feedback management",
  operatingSystem: "Web",
  url: siteConfig.url,
  description: siteConfig.description,
  featureList: [
    "Drop-in feedback widget",
    "REST API for feedback submission",
    "Hosted feedback page",
    "AI sentiment classification",
    "AI summaries and digests",
    "Feedback board and roadmap",
    "Multi-project workspaces",
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "1 project, 300 stored feedback, widget, REST API and hosted page.",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "12",
      priceCurrency: "USD",
      description: "Unlimited stored feedback, 5 projects and higher daily AI limits.",
    },
  ],
  provider: { "@id": absolute("/#organization") },
});

export const faqPageJsonLd = (entries: readonly FaqEntry[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": absolute("/#faq"),
  mainEntity: entries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: { "@type": "Answer", text: entry.answer },
  })),
});
