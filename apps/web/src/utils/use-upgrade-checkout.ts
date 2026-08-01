"use client";

import { toast } from "@echo/ui/components/toast";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

type UseUpgradeCheckoutResult = {
  readonly loading: boolean;
  readonly upgrade: () => Promise<void>;
};

export function useUpgradeCheckout(): UseUpgradeCheckoutResult {
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

  return { loading, upgrade };
}
