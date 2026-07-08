"use client";

import { Skeleton } from "@echo/ui/components/skeleton";
import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";

import { useBillingOverview } from "../../hooks/use-billing-overview";
import { BillingPlanCard } from "./billing-plan-card";
import { BillingPlanComparison } from "./billing-plan-comparison";
import { BillingUsageMeters } from "./billing-usage-meters";
import { SettingsCard } from "./settings-card";

function BillingSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-28 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  );
}

export const BillingSection = (): React.ReactElement => {
  const { state, reload } = useBillingOverview();

  if (state.status === "loading") {
    return <BillingSkeleton />;
  }

  if (state.status === "error") {
    return (
      <SettingsCard className="py-10 text-center">
        <p className="text-sm text-muted-foreground">Failed to load billing information.</p>
        <button
          type="button"
          onClick={reload}
          className="mt-3 text-sm font-medium text-accent hover:underline"
        >
          Try again
        </button>
      </SettingsCard>
    );
  }

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      <motion.div variants={fadeInUp}>
        <BillingPlanCard plan={state.data.plan} />
      </motion.div>
      <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BillingUsageMeters overview={state.data} />
        <BillingPlanComparison plan={state.data.plan} />
      </motion.div>
    </motion.div>
  );
};
