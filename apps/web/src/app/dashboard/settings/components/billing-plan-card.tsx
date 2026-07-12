"use client";

import { Badge } from "@echo/ui/components/badge";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { authClient } from "@/lib/auth-client";

import { BillingUpgradeButton } from "./billing-upgrade-button";
import { SettingsCard } from "./settings-card";

type PlanTier = "free" | "pro";

type PlanDefinition = {
  tier: PlanTier;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
};

const PLANS: Record<PlanTier, PlanDefinition> = {
  free: {
    tier: "free",
    name: "Free",
    price: "$0",
    cadence: "/month",
    description: "Core feedback collection to get started.",
    features: [
      "1 project",
      "AI sentiment analysis",
      "Up to 300 feedback / month",
      "Widget + REST API",
    ],
  },
  pro: {
    tier: "pro",
    name: "Pro",
    price: "$12",
    cadence: "/month",
    description: "Scale collection with AI summaries and automation.",
    features: [
      "Up to 5 projects",
      "AI summaries & insights",
      "Webhooks",
      'Remove "Powered by Echo" branding',
      "Usage-based pricing beyond limits",
    ],
  },
};

type ManageSubscriptionButtonProps = { className?: string };

const ManageSubscriptionButton = ({
  className,
}: ManageSubscriptionButtonProps): React.ReactElement => {
  const [managing, setManaging] = useState(false);

  const manage = async (): Promise<void> => {
    setManaging(true);
    try {
      await authClient.customer.portal();
    } catch {
      toast.error("Could not open billing portal — try again.");
      setManaging(false);
    }
  };

  return (
    <Button onClick={manage} disabled={managing} variant="outline" className={className}>
      {managing ? <Icons.loading className="size-4 animate-spin" /> : "Manage subscription"}
    </Button>
  );
};

type PlanCardProps = { definition: PlanDefinition; isCurrent: boolean };

const PlanCard = ({ definition, isCurrent }: PlanCardProps): React.ReactElement => {
  const isPro = definition.tier === "pro";

  return (
    <SettingsCard
      className={cn(
        "flex flex-col gap-6",
        isPro ? "ring-2 ring-accent/40" : "ring-1 ring-foreground/10",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{definition.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{definition.description}</p>
        </div>
        {isCurrent ? (
          <Badge variant="accent">Current plan</Badge>
        ) : isPro ? (
          <Badge variant="outline">Recommended</Badge>
        ) : null}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl font-semibold tabular-nums text-foreground">
          {definition.price}
        </span>
        <span className="text-sm text-muted-foreground">{definition.cadence}</span>
      </div>

      {isCurrent && isPro ? (
        <ManageSubscriptionButton className="h-9 w-full text-sm" />
      ) : isCurrent ? (
        <Button disabled variant="outline" className="h-9 w-full text-sm">
          Current plan
        </Button>
      ) : isPro ? (
        <BillingUpgradeButton className="h-9 w-full text-sm" />
      ) : (
        <div aria-hidden="true" className="h-9" />
      )}

      <ul className="flex flex-col gap-2.5 border-t border-border pt-6">
        {definition.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
            <Icons.check className="mt-0.5 size-3.5 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>
    </SettingsCard>
  );
};

type BillingPlanCardProps = { plan: string };

export const BillingPlanCard = ({ plan }: BillingPlanCardProps): React.ReactElement => {
  const isPro = plan === "pro";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <PlanCard definition={PLANS.free} isCurrent={!isPro} />
      <PlanCard definition={PLANS.pro} isCurrent={isPro} />
    </div>
  );
};
