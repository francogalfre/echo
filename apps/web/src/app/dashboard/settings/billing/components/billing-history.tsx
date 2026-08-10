"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { toast } from "@echo/ui/components/toast";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { SettingsCard } from "../../components/settings-card";

type BillingHistoryProps = { plan: string };

export const BillingHistory = ({ plan }: BillingHistoryProps): React.ReactElement => {
  const [opening, setOpening] = useState(false);
  const isPro = plan === "pro";

  const openPortal = async (): Promise<void> => {
    setOpening(true);
    try {
      await authClient.customer.portal();
    } catch {
      toast.error("Could not open billing portal — try again.");
      setOpening(false);
    }
  };

  return (
    <SettingsCard>
      <h3 className="text-sm font-medium text-foreground">Billing history</h3>
      {isPro ? (
        <>
          <p className="mt-0.5 text-xs text-muted-foreground">
            View your invoices, receipts, and payment history in the billing portal.
          </p>
          <Button
            onClick={openPortal}
            disabled={opening}
            variant="outline"
            className="mt-4"
          >
            {opening ? (
              <Icons.loading className="size-4 animate-spin" />
            ) : (
              "View invoices & receipts"
            )}
          </Button>
        </>
      ) : (
        <p className="mt-0.5 text-sm text-muted-foreground">
          No billing history yet — upgrade to Pro to start a subscription.
        </p>
      )}
    </SettingsCard>
  );
};
