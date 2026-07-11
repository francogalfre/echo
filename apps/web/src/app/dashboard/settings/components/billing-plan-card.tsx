"use client";

import { Badge } from "@echo/ui/components/badge";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { BillingUpgradeButton } from "./billing-upgrade-button";
import { SettingsCard } from "./settings-card";

type BillingPlanCardProps = { plan: string };

const PLAN_COPY = {
  free: {
    price: "$0 / month",
    description: "Core feedback collection with limited AI usage.",
  },
  pro: {
    price: "$12 / month",
    description: "Unlimited feedback, higher AI limits, and priority support.",
  },
} as const;

export const BillingPlanCard = ({ plan }: BillingPlanCardProps): React.ReactElement => {
  const isPro = plan === "pro";
  const copy = PLAN_COPY[isPro ? "pro" : "free"];
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
    <SettingsCard>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {isPro ? "Pro" : "Free"} plan
            </h3>
            <Badge variant={isPro ? "accent" : "default"}>{isPro ? "Pro" : "Free"}</Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{copy.price}</p>
          <p className="mt-2 text-xs/relaxed text-muted-foreground">{copy.description}</p>
        </div>

        {isPro ? (
          <Button
            onClick={manage}
            disabled={managing}
            variant="outline"
            className="h-9 text-sm"
          >
            {managing ? (
              <Icons.loading className="size-4 animate-spin" />
            ) : (
              "Manage subscription"
            )}
          </Button>
        ) : (
          <BillingUpgradeButton className="h-9 text-sm" />
        )}
      </div>
    </SettingsCard>
  );
};
