"use client";

import { Skeleton } from "@echo/ui/components/skeleton";
import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";

import { useBillingOverview } from "../../hooks/use-billing-overview";
import { BillingPlanCard } from "./billing-plan-card";
import { BillingPlanComparison } from "./billing-plan-comparison";
import { BillingUsageMeters } from "./billing-usage-meters";

function BillingSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-80 rounded-lg" />
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
      <div className="rounded-lg bg-card px-5 py-10 text-center ring-1 ring-foreground/10">
        <p className="text-sm text-muted-foreground">Failed to load billing information.</p>
        <button
          type="button"
          onClick={reload}
          className="mt-3 text-sm font-medium text-accent hover:underline"
        >
          Try again
        </button>
      </div>
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
      <motion.div variants={fadeInUp}>
        <BillingUsageMeters overview={state.data} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <BillingPlanComparison plan={state.data.plan} />
      </motion.div>
    </motion.div>
  );
};
