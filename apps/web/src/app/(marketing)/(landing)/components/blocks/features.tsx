"use client";

import { Icons } from "@echo/ui/components/icons";
import { durations, easings } from "@echo/ui/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Section, SectionHeading } from "../section";
import { AskVisual, DigestVisual, InboxVisual } from "./feature-visuals";

const cards = [
  {
    title: "Sorted before you open it",
    description:
      "Every submission is scored positive, neutral or negative on arrival and tagged with the channel it came from. Filter to what is broken instead of reading all of it.",
    visual: <InboxVisual />,
  },
  {
    title: "The week, already written",
    description:
      "Recurring summaries say what changed and which complaints are trending up — short enough that your team actually reads them.",
    visual: <DigestVisual />,
  },
  {
    title: "Ask your feedback anything",
    description:
      "Question your inbox in plain language and get an answer grounded in what your users wrote, with the themes behind it.",
    visual: <AskVisual />,
  },
] as const;

const extras = [
  { label: "Board and roadmap", icon: "board" },
  { label: "Multi-project workspaces", icon: "building" },
  { label: "Team members and invites", icon: "userGroup" },
  { label: "Publishable and secret keys", icon: "lock" },
] as const;

type FeatureCardProps = {
  title: string;
  description: string;
  visual: ReactNode;
};

const FeatureCard = ({
  title,
  description,
  visual,
}: FeatureCardProps): React.ReactElement => {
  const reduced = useReducedMotion();

  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-foreground/15"
      initial="rest"
      animate="rest"
      whileHover={reduced ? undefined : "hover"}
      transition={{ duration: durations.slow, ease: easings.out }}
    >
      <div className="relative h-72 overflow-hidden bg-linear-to-b from-accent/10 to-transparent">
        {visual}
      </div>

      <div className="flex flex-1 flex-col border-t border-border p-7">
        <h3 className="font-display text-base font-medium tracking-tight">{title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.article>
  );
};

export const Features = (): React.ReactElement => {
  return (
    <Section id="features" className="pt-28 sm:pt-36">
      <SectionHeading
        align="center"
        title="Feedback stops being a chore to read"
        description="Echo does the triage the moment something lands, so the only thing left is deciding what to build."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {cards.map((card) => (
          <FeatureCard
            key={card.title}
            title={card.title}
            description={card.description}
            visual={card.visual}
          />
        ))}
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {extras.map((extra) => {
          const Icon = Icons[extra.icon];

          return (
            <li
              key={extra.label}
              className="flex items-center gap-2.5 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground"
            >
              <Icon className="size-4 shrink-0 text-accent" />
              {extra.label}
            </li>
          );
        })}
      </ul>
    </Section>
  );
};
