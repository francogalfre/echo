"use client";

import echoIdle from "@echo/assets/character/idle.webp";
import { Icons } from "@echo/ui/components/icons";

import type { TeamSize } from "../../schemas";
import { BackButton, ContinueButton } from "../onboarding-nav";
import { OnboardingShell } from "../onboarding-shell";
import { OptionCard } from "../option-card";

type TeamSizeOption = {
  value: TeamSize;
  label: string;
  description: string;
  icon: typeof Icons.user;
};

const teamSizeOptions: readonly TeamSizeOption[] = [
  {
    value: "solo",
    label: "Just me",
    description: "A solo project for now.",
    icon: Icons.user,
  },
  {
    value: "small",
    label: "2 – 10",
    description: "A small product team.",
    icon: Icons.userGroup,
  },
  {
    value: "medium",
    label: "11 – 50",
    description: "A growing company.",
    icon: Icons.building,
  },
  {
    value: "large",
    label: "51+",
    description: "Several teams and orgs.",
    icon: Icons.radar,
  },
];

type TeamStepProps = {
  teamSize: TeamSize | null;
  onTeamSizeChange: (teamSize: TeamSize) => void;
  stepIndex: number;
  stepCount: number;
  onBack: () => void;
  onContinue: () => void;
};

export const TeamStep = ({
  teamSize,
  onTeamSizeChange,
  stepIndex,
  stepCount,
  onBack,
  onContinue,
}: TeamStepProps): React.ReactElement => (
  <OnboardingShell
    character={echoIdle}
    caption="Feedback is easier to act on together, but Echo works just as well solo."
    stepIndex={stepIndex}
    stepCount={stepCount}
    title="How many people are on this?"
    description="This only decides whether we ask you to invite anyone. You can change your team at any time."
    footer={
      <>
        <BackButton onClick={onBack} />
        <ContinueButton onClick={onContinue} disabled={teamSize === null}>
          Continue
        </ContinueButton>
      </>
    }
  >
    <fieldset>
      <legend className="sr-only">Team size</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {teamSizeOptions.map((option) => (
          <OptionCard
            key={option.value}
            name="team-size"
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            checked={teamSize === option.value}
            onSelect={onTeamSizeChange}
          />
        ))}
      </div>
    </fieldset>
  </OnboardingShell>
);
