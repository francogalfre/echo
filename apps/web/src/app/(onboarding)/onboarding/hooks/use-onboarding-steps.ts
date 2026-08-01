"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";

export const onboardingStepIds = [
  "welcome",
  "project",
  "team",
  "invite",
  "appearance",
] as const;

export type OnboardingStep = (typeof onboardingStepIds)[number];

type UseOnboardingStepsReturn = {
  step: OnboardingStep;
  index: number;
  count: number;
  next: () => void;
  back: () => void;
};

export const useOnboardingSteps = (
  steps: readonly OnboardingStep[],
): UseOnboardingStepsReturn => {
  const [, setParam] = useQueryState(
    "step",
    parseAsStringLiteral(onboardingStepIds).withDefault("welcome"),
  );
  const [step, setStep] = useState<OnboardingStep>("welcome");

  const maxIndex = steps.length - 1;
  const currentIndex = steps.indexOf(step);
  const index = currentIndex === -1 ? 0 : currentIndex;

  useEffect(() => {
    void setParam(step);
  }, [step, setParam]);

  const goTo = useCallback(
    (target: number): void => {
      const clamped = Math.min(Math.max(target, 0), maxIndex);
      setStep(steps[clamped] ?? "welcome");
    },
    [maxIndex, steps],
  );

  const next = useCallback((): void => goTo(index + 1), [goTo, index]);
  const back = useCallback((): void => goTo(index - 1), [goTo, index]);

  return { step, index, count: steps.length, next, back };
};
