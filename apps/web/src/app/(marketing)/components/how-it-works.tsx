import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";

type Step = {
  number: string;
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

const STEPS: readonly Step[] = [
  {
    number: "01",
    icon: "message",
    title: "Drop in the widget or call the API",
    description:
      "Add the React widget in minutes, or send feedback straight from your backend with the REST API.",
  },
  {
    number: "02",
    icon: "aiMagic",
    title: "Every comment is classified by AI",
    description:
      "Sentiment is scored the moment feedback comes in — included free, on every submission.",
  },
  {
    number: "03",
    icon: "board",
    title: "Triage the board, read the summary",
    description:
      "Work through feedback on a Kanban board built for review, then skim an AI summary instead of every comment.",
  },
];

export const HowItWorks = (): React.ReactElement => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          How it works
        </h2>
      </FadeIn>
      <div className="relative mt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-5 hidden border-t border-border sm:block"
        />
        <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step, index) => {
            const Icon = Icons[step.icon];

            return (
              <FadeIn key={step.number} delay={index * 0.08}>
                <div className="flex flex-col items-start gap-4">
                  <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-accent">
                    {step.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-accent" />
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
