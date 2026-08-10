"use client";

import { Button } from "@echo/ui/components/button";
import type { ButtonVariantProps } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import { useUpgradeCheckout } from "@/utils/use-upgrade-checkout";

type BillingUpgradeButtonProps = {
  size?: ButtonVariantProps["size"];
  className?: string;
};

export const BillingUpgradeButton = ({
  size = "default",
  className,
}: BillingUpgradeButtonProps): React.ReactElement => {
  const { loading, upgrade } = useUpgradeCheckout();

  return (
    <Button
      onClick={upgrade}
      disabled={loading}
      size={size}
      scaleOnHover={false}
      className={cn("hover:bg-accent/85", className)}
    >
      {loading ? <Icons.loading className="size-4 animate-spin" /> : "Upgrade to Pro"}
    </Button>
  );
};
