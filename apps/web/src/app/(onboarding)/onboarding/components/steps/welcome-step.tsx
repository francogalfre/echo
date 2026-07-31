import echoGreetings from "@echo/assets/character/greetings.webp";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import Image from "next/image";

import { OnboardingActions, OnboardingCard } from "../onboarding-card";

type Highlight = {
  icon: typeof Icons.message;
  title: string;
  description: string;
};

const highlights: readonly Highlight[] = [
  {
    icon: Icons.message,
    title: "Collect everywhere",
    description: "An API, a form and a drop-in widget feed the same inbox.",
  },
  {
    icon: Icons.aiMagic,
    title: "Read it for you",
    description: "Every entry arrives tagged, scored and summarised.",
  },
  {
    icon: Icons.board,
    title: "Turn it into work",
    description: "Promote what matters to a board your team can ship from.",
  },
];

type WelcomeStepProps = {
  onContinue: () => void;
};

export const WelcomeStep = ({ onContinue }: WelcomeStepProps): React.ReactElement => (
  <OnboardingCard
    title="Welcome to Echo"
    description="Echo is where your product feedback lands, gets understood and turns into decisions. Three short steps and you are in."
  >
    <div className="mt-6 flex items-start gap-5">
      <Image
        src={echoGreetings}
        alt=""
        aria-hidden="true"
        className="hidden size-20 shrink-0 object-contain sm:block"
      />
      <ul className="flex-1 space-y-4">
        {highlights.map((highlight) => {
          const Icon = highlight.icon;

          return (
            <li key={highlight.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{highlight.title}</p>
                <p className="text-xs text-muted-foreground">{highlight.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>

    <OnboardingActions>
      <Button size="lg" onClick={onContinue}>
        Get started
        <Icons.arrowRight data-icon="inline-end" className="size-4" />
      </Button>
    </OnboardingActions>
  </OnboardingCard>
);
