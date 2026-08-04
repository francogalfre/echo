import echoGreetings from "@echo/assets/character/greetings.webp";
import { Icons } from "@echo/ui/components/icons";

import { ContinueButton } from "../onboarding-nav";
import { OnboardingShell } from "../onboarding-shell";

type Highlight = {
  icon: typeof Icons.message;
  title: string;
  description: string;
};

const highlights: readonly Highlight[] = [
  {
    icon: Icons.message,
    title: "Collect everywhere",
    description: "An API, a form and a drop-in widget all feed the same inbox.",
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
  stepIndex: number;
  stepCount: number;
  onContinue: () => void;
};

export const WelcomeStep = ({
  stepIndex,
  stepCount,
  onContinue,
}: WelcomeStepProps): React.ReactElement => (
  <OnboardingShell
    character={echoGreetings}
    caption="Hi, I'm Echo. I'll read every piece of feedback so you don't have to."
    stepIndex={stepIndex}
    stepCount={stepCount}
    title="Welcome to Echo"
    description="Echo is where your product feedback lands, gets understood, and turns into decisions. A few short steps and you're in."
    footer={<ContinueButton onClick={onContinue}>Get started</ContinueButton>}
  >
    <ul className="space-y-6">
      {highlights.map((highlight) => {
        const Icon = highlight.icon;

        return (
          <li key={highlight.title} className="flex items-start gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{highlight.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {highlight.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  </OnboardingShell>
);
