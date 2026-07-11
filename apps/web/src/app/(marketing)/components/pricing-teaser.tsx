import { Badge } from "@echo/ui/components/badge";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import Link from "next/link";

type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
  highlighted?: boolean;
};

const PLANS: readonly Plan[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Everything you need to start collecting feedback.",
    features: [
      "1 project",
      "AI sentiment included",
      "Up to 300 feedback / month",
      "Widget + REST API",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/ month",
    description: "For teams shipping fast and acting on feedback at scale.",
    features: [
      "Up to 5 projects",
      "AI summaries",
      "Webhooks",
      'Remove "Powered by Echo" branding',
      "Usage-based, pay for what you use",
    ],
    highlighted: true,
  },
];

export const PricingTeaser = (): React.ReactElement => {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn>
        <div className="text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Simple, usage-based pricing
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Start free on a single project. Upgrade when you need more projects and deeper
            AI insight.
          </p>
        </div>
      </FadeIn>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PLANS.map((plan, index) => (
          <FadeIn key={plan.name} delay={index * 0.08}>
            <div
              className={cn(
                "flex h-full flex-col rounded-2xl border p-6",
                plan.highlighted ? "border-accent bg-accent/5" : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.highlighted ? <Badge variant="accent">Recommended</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.cadence}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Icons.check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={buttonVariants({
                  variant: plan.highlighted ? "default" : "outline",
                  className: "mt-6 h-10 w-full text-sm",
                })}
              >
                Start for free
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
