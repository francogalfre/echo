import { cn } from "@echo/ui/lib/utils";

import { onboardingSteps } from "../hooks/use-onboarding-steps";

type OnboardingProgressProps = {
  index: number;
};

export const OnboardingProgress = ({
  index,
}: OnboardingProgressProps): React.ReactElement => (
  <div
    className="mt-6 flex items-center justify-center gap-1.5"
    role="progressbar"
    aria-valuenow={index + 1}
    aria-valuemin={1}
    aria-valuemax={onboardingSteps.length}
    aria-label="Onboarding progress"
  >
    {onboardingSteps.map((step, position) => (
      <span
        key={step}
        className={cn(
          "h-1 rounded-full transition-all duration-300",
          position === index ? "w-6 bg-accent" : "w-1.5",
          position < index ? "bg-accent/40" : "",
          position > index ? "bg-border" : "",
        )}
      />
    ))}
  </div>
);
