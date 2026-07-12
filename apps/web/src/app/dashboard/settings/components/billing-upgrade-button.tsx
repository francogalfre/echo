"use client";

import { Button } from "@echo/ui/components/button";
import type { ButtonVariantProps } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { authClient } from "@/lib/auth-client";

type BillingUpgradeButtonProps = {
  size?: ButtonVariantProps["size"];
  className?: string;
};

export const BillingUpgradeButton = ({
  size = "default",
  className,
}: BillingUpgradeButtonProps): React.ReactElement => {
  const [loading, setLoading] = useState(false);

  const upgrade = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await authClient.checkout({ slug: "pro" });
      if (error) throw new Error(error.message);
    } catch {
      toast.error("Could not start checkout — try again.");
      setLoading(false);
    }
  };

  return (
    <Button onClick={upgrade} disabled={loading} size={size} className={className}>
      {loading ? <Icons.loading className="size-4 animate-spin" /> : "Upgrade to Pro"}
    </Button>
  );
};
