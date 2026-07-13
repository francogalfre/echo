"use client";

import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { Skeleton } from "@echo/ui/components/skeleton";
import { cn } from "@echo/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

import { useApiKeys } from "../../collect/api/hooks/use-api-keys";

type OnboardingChecklistProps = {
  hasFeedback: boolean;
};

type Step = {
  title: string;
  description: string;
  href: string;
  completed: boolean;
  showCta: boolean;
  loading: boolean;
  ctaLabel: string;
};

function useSteps(hasFeedback: boolean): readonly Step[] {
  const { state } = useApiKeys();
  const apiKeyLoading = state.status === "loading";
  const apiKeyReady = state.status === "ready";

  return [
    {
      title: "Project created",
      description: "Your workspace is ready.",
      href: "/dashboard",
      completed: true,
      showCta: false,
      loading: false,
      ctaLabel: "",
    },
    {
      title: "Generate an API key",
      description: "Needed to authenticate your widget or API requests.",
      href: "/dashboard/collect/api",
      completed: apiKeyReady,
      showCta: !apiKeyLoading,
      loading: apiKeyLoading,
      ctaLabel: "Create API key",
    },
    {
      title: "Send your first feedback",
      description: "Install the widget, POST to the API, or share your feedback page.",
      href: "/dashboard/collect",
      completed: hasFeedback,
      showCta: true,
      loading: false,
      ctaLabel: "Install the widget",
    },
  ];
}

function StepCircle({
  index,
  completed,
  loading,
}: {
  index: number;
  completed: boolean;
  loading: boolean;
}): React.ReactElement {
  if (loading) {
    return <Skeleton className="size-7 shrink-0 rounded-full" />;
  }
  if (completed) {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icons.circleCheck className="size-4" />
      </span>
    );
  }
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums text-muted-foreground ring-1 ring-foreground/15">
      {index + 1}
    </span>
  );
}

function ProgressBar({ completed }: { completed: number }): React.ReactElement {
  const reduced = useReducedMotion();
  const widthPercent = `${(completed / 3) * 100}%`;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={{ width: reduced ? widthPercent : "0%" }}
        animate={{ width: widthPercent }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export function OnboardingChecklist({
  hasFeedback,
}: OnboardingChecklistProps): React.ReactElement {
  const steps = useSteps(hasFeedback);
  const completedCount = steps.filter((step) => step.completed).length;
  const firstIncompleteIndex = steps.findIndex((step) => !step.completed);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-card p-6 ring-1 ring-foreground/10">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium">Get started with Echo</h2>
          <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {completedCount} of 3 complete
          </p>
        </div>
        <div className="mt-3">
          <ProgressBar completed={completedCount} />
        </div>
      </div>
      <Stagger className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <StaggerItem key={step.title} className="flex items-center gap-3.5">
            <StepCircle index={index} completed={step.completed} loading={step.loading} />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.completed && "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            {index === firstIncompleteIndex && step.loading && (
              <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
            )}
            {index === firstIncompleteIndex && step.showCta && (
              <Link
                href={step.href as Route}
                className={cn(buttonVariants({ size: "sm" }), "active:scale-[0.96]")}
              >
                {step.ctaLabel}
              </Link>
            )}
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
