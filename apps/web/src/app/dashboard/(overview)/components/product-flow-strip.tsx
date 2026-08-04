"use client";

import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { cn } from "@echo/ui/lib/utils";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

type FlowStep = {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
};

const FLOW_STEPS: readonly FlowStep[] = [
  {
    key: "collect",
    title: "Collect",
    description: "Widget, API, or your feedback page.",
    href: "/dashboard/collect",
    icon: Icons.message,
  },
  {
    key: "analyze",
    title: "Analyze",
    description: "Sentiment classified automatically.",
    href: "/dashboard/feedback",
    icon: Icons.radar,
  },
  {
    key: "insights",
    title: "Insights",
    description: "What people want changed, distilled by AI.",
    href: "/dashboard",
    icon: Icons.aiMagic,
  },
  {
    key: "board",
    title: "Board",
    description: "Track the changes you decide to ship.",
    href: "/dashboard/board",
    icon: Icons.board,
  },
];

type ProductFlowStripProps = {
  readonly hasFeedback: boolean;
  readonly hasInsights: boolean;
  readonly variant?: "full" | "compact";
};

function useCompletion(hasFeedback: boolean, hasInsights: boolean): readonly boolean[] {
  return [hasFeedback, hasFeedback, hasInsights, false];
}

type FlowStepIconProps = {
  readonly step: FlowStep;
  readonly completed: boolean;
  readonly current: boolean;
};

function FlowStepIcon({ step, completed, current }: FlowStepIconProps): React.ReactElement {
  if (completed) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icons.circleCheck className="size-4" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-foreground/10",
        current && "text-accent ring-2 ring-accent/40",
      )}
    >
      <step.icon className="size-4" />
    </span>
  );
}

function CompactFlowStrip({
  hasFeedback,
  hasInsights,
}: Omit<ProductFlowStripProps, "variant">): React.ReactElement {
  const completed = useCompletion(hasFeedback, hasInsights);
  const currentIndex = completed.findIndex((done) => !done);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 rounded-full bg-card px-3 py-2 ring-1 ring-foreground/10 sm:gap-2">
      {FLOW_STEPS.map((step, index) => (
        <React.Fragment key={step.key}>
          <Link
            href={step.href as Route}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              index === currentIndex && "bg-accent/10 text-accent",
            )}
          >
            <step.icon className="size-3.5" />
            <span className="hidden sm:inline">{step.title}</span>
          </Link>
          {index < FLOW_STEPS.length - 1 && (
            <Icons.chevronRight className="size-3.5 shrink-0 text-muted-foreground/30" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function FullFlowStrip({
  hasFeedback,
  hasInsights,
}: Omit<ProductFlowStripProps, "variant">): React.ReactElement {
  const completed = useCompletion(hasFeedback, hasInsights);
  const currentIndex = completed.findIndex((done) => !done);

  return (
    <div className="rounded-lg bg-card p-6 ring-1 ring-foreground/10">
      <p className="text-xs font-semibold text-muted-foreground">Your feedback loop</p>
      <Stagger
        className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-1"
        stagger={0.06}
      >
        {FLOW_STEPS.map((step, index) => (
          <React.Fragment key={step.key}>
            <StaggerItem className="flex flex-1 items-start gap-3 sm:flex-col sm:gap-2.5">
              <FlowStepIcon
                step={step}
                completed={completed[index] ?? false}
                current={index === currentIndex}
              />
              <div className="min-w-0">
                <Link
                  href={step.href as Route}
                  className="text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  {step.title}
                </Link>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
            {index < FLOW_STEPS.length - 1 && (
              <div className="flex items-center justify-center pt-4 max-sm:pl-3 sm:w-8">
                <Icons.chevronRight className="size-4 shrink-0 rotate-90 text-muted-foreground/40 sm:rotate-0" />
              </div>
            )}
          </React.Fragment>
        ))}
      </Stagger>
    </div>
  );
}

export function ProductFlowStrip({
  hasFeedback,
  hasInsights,
  variant = "full",
}: ProductFlowStripProps): React.ReactElement {
  if (variant === "compact") {
    return <CompactFlowStrip hasFeedback={hasFeedback} hasInsights={hasInsights} />;
  }

  return <FullFlowStrip hasFeedback={hasFeedback} hasInsights={hasInsights} />;
}
