import {
  faqPageJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/structured-data";
import { createMetadata } from "@/utils/metadata";

import { Channels } from "./components/blocks/channels";
import { Faq, faqItems } from "./components/blocks/faq";
import { Features } from "./components/blocks/features";
import { Hero } from "./components/blocks/hero";
import { Pricing } from "./components/blocks/pricing";

export const metadata = createMetadata({
  title: "Echo: user feedback infrastructure for product teams",
  description:
    "Collect user feedback with a drop-in widget, REST API or hosted page. Echo classifies sentiment and summarizes what matters, so product, support and engineering teams see it in one inbox.",
  path: "/",
});

const structuredData = [
  organizationJsonLd(),
  websiteJsonLd(),
  softwareApplicationJsonLd(),
  faqPageJsonLd(faqItems),
];

const LandingPage = (): React.ReactElement => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <Features />
      <Channels />
      <Pricing />
      <Faq />
    </>
  );
};

export default LandingPage;
