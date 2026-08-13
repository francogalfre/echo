import { Badge } from "@echo/ui/components/badge";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import Link from "next/link";

import { Section, SectionHeading } from "../section";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
  cta: string;
  highlighted: boolean;
};

const tiers: readonly Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    description: "Everything you need to close the loop on your first product.",
    features: [
      "1 project",
      "300 stored feedback",
      "3 AI insights / day",
      "1 AI summary / week",
      "5 AI chats / day",
      "Widget, REST API and hosted page",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/month",
    description: "For teams whose feedback volume has outgrown a spreadsheet.",
    features: [
      "Unlimited stored feedback",
      "5 projects",
      "50 AI insights / day",
      "10 AI summaries / day",
      "100 AI chats / day",
      'Remove "Powered by Echo" branding',
    ],
    cta: "Go Pro",
    highlighted: true,
  },
];

export const Pricing = (): React.ReactElement => {
  return (
    <Section id="pricing">
      <SectionHeading
        align="center"
        title="Start free. Upgrade when the feedback keeps coming."
        description="No seat pricing, no annual contract, no sales call. Cancel from the billing page whenever you like."
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "flex flex-col rounded-2xl border bg-card p-7",
              tier.highlighted ? "border-accent" : "border-border",
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight">{tier.name}</h3>
              {tier.highlighted ? (
                <Badge variant="accent">
                  <Icons.crown />
                  Most popular
                </Badge>
              ) : null}
            </div>

            <p className="mt-5 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold tracking-tight">
                {tier.price}
              </span>
              <span className="text-sm text-muted-foreground">{tier.cadence}</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Icons.check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className={buttonVariants({
                variant: tier.highlighted ? "default" : "outline",
                size: "lg",
                className: "mt-8 h-10 w-full rounded-full text-sm",
              })}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
};
