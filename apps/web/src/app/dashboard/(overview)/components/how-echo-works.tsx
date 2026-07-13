"use client";

import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

type EchoStep = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STEPS: readonly EchoStep[] = [
  {
    title: "Collect",
    description: "Drop in the widget, POST to the REST API, or share your feedback page.",
    icon: Icons.message,
  },
  {
    title: "Understand",
    description: "Echo classifies sentiment and tags every submission automatically.",
    icon: Icons.aiMagic,
  },
  {
    title: "Act",
    description:
      "Get AI summaries of what users actually want, then move items to your board.",
    icon: Icons.board,
  },
];

export function HowEchoWorks(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
      <div>
        <h2 className="text-sm font-semibold">How Echo works</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Three steps from raw feedback to decisions.
        </p>
      </div>
      <Stagger className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <StaggerItem key={step.title} className="flex flex-col gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-accent/10">
              <step.icon className="size-4 text-accent" />
            </span>
            <p className="text-sm font-medium">{step.title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
      <Link
        href={"/docs" as Route}
        className="group inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Read the docs
        <Icons.arrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
