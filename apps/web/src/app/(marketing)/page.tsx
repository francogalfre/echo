import { createMetadata } from "@/lib/metadata";

import {
  JsonLd,
  organizationSchema,
  softwareApplicationSchema,
  webSiteSchema,
} from "./components/json-ld";
import { FeatureGrid } from "./components/feature-grid";
import { FinalCta } from "./components/final-cta";
import { Hero } from "./components/hero";
import { LandingFooter } from "./components/landing-footer";
import { LandingNav } from "./components/landing-nav";
import { PricingTeaser } from "./components/pricing-teaser";
import { Showcase } from "./components/showcase";

export const metadata = createMetadata({ path: "/" });

const Home = () => {
  return (
    <div className="flex min-h-svh flex-col">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <Showcase />
        <PricingTeaser />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Home;
