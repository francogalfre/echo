"use client";

import { Skeleton } from "@echo/ui/components/skeleton";
import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";
import * as React from "react";

import { trpc } from "@/lib/trpc";

import type { BillingOverviewData } from "../../../hooks/use-billing-overview";
import { ErrorCard } from "../../../components/error-card";

import { BillingHistory } from "./billing-history";
import { BillingPlanCard } from "./billing-plan-card";
import { BillingUsageMeters } from "./billing-usage-meters";

type Props = {
  readonly initialData: BillingOverviewData;
};

type State = { status: "error" } | { status: "ready"; data: BillingOverviewData };

export function BillingSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

export const BillingSection = ({ initialData }: Props): React.ReactElement => {
  const [state, setState] = React.useState<State>({ status: "ready", data: initialData });

  const reload = (): void => {
    trpc.billing.overview
      .query()
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error" }));
  };

  if (state.status === "error") {
    return <ErrorCard message="Failed to load billing information." onRetry={reload} />;
  }

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeInUp}>
        <BillingPlanCard plan={state.data.plan} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <BillingUsageMeters overview={state.data} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <BillingHistory plan={state.data.plan} />
      </motion.div>
    </motion.div>
  );
};
