import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import { HoverLift } from "@echo/ui/components/motion/hover-lift";

type Feature = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

const FEATURES: readonly Feature[] = [
  {
    icon: "star",
    title: "Widget",
    description:
      "A drop-in React widget for a sentiment-first 1–5 star rating and comment.",
  },
  {
    icon: "externalLink",
    title: "REST API",
    description: "Authenticated endpoints to send and read feedback from your own backend.",
  },
  {
    icon: "aiMagic",
    title: "AI sentiment & summaries",
    description: "Every submission is classified automatically, then summarized for Pro.",
  },
  {
    icon: "board",
    title: "Triage board",
    description: "Move feedback through a Kanban board built for fast, focused review.",
  },
];

export const FeatureGrid = (): React.ReactElement => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Everything to run a feedback loop
        </h2>
      </FadeIn>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => {
          const Icon = Icons[feature.icon];

          return (
            <FadeIn key={feature.title} delay={index * 0.06}>
              <HoverLift className="h-full rounded-xl border border-border">
                <div className="flex h-full flex-col gap-3 p-6">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </HoverLift>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
};
