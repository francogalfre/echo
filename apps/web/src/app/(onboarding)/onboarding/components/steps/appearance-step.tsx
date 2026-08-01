import echoGreetings from "@echo/assets/character/greetings.webp";

import { ThemeSelector } from "@/lib/theme-selector";

import { BackButton, ContinueButton } from "../onboarding-nav";
import { OnboardingShell } from "../onboarding-shell";

type AppearanceStepProps = {
  stepIndex: number;
  stepCount: number;
  error: string | null;
  finishing: boolean;
  onBack: () => void;
  onFinish: () => void;
};

export const AppearanceStep = ({
  stepIndex,
  stepCount,
  error,
  finishing,
  onBack,
  onFinish,
}: AppearanceStepProps): React.ReactElement => (
  <OnboardingShell
    character={echoGreetings}
    caption="Last one. Pick a look and I'll get your project set up."
    stepIndex={stepIndex}
    stepCount={stepCount}
    title="Pick your look"
    description="Choose how Echo looks on this device. You can switch it anytime from settings."
    footer={
      <>
        <BackButton onClick={onBack} />
        <ContinueButton onClick={onFinish} pending={finishing}>
          Finish setup
        </ContinueButton>
      </>
    }
  >
    <ThemeSelector />

    {error ? <p className="mt-6 text-xs text-destructive">{error}</p> : null}
  </OnboardingShell>
);
