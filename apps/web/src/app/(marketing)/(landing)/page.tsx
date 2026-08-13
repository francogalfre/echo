import {
  faqPageJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/structured-data";
import { createMetadata } from "@/utils/metadata";

import { CallToAction } from "./components/blocks/call-to-action";
import { Channels } from "./components/blocks/channels";
import { Faq, faqItems } from "./components/blocks/faq";
import { Features } from "./components/blocks/features";
import { Hero } from "./components/blocks/hero";
import { Pricing } from "./components/blocks/pricing";

export const metadata = createMetadata({
  title: "Echo — User feedback infrastructure for developers",
  description:
    "Collect user feedback with a drop-in widget, a REST API or a hosted page, then let AI classify sentiment and summarize what matters. Free plan, no credit card.",
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
      <CallToAction />
    </>
  );
};

export default LandingPage;
