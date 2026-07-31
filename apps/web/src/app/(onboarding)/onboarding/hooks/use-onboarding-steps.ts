"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";

export const onboardingSteps = ["welcome", "organization", "invite", "appearance"] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];

type UseOnboardingStepsReturn = {
  step: OnboardingStep;
  index: number;
  total: number;
  next: () => void;
  back: () => void;
};

export const useOnboardingSteps = (): UseOnboardingStepsReturn => {
  const [requested, setRequested] = useQueryState(
    "step",
    parseAsStringLiteral(onboardingSteps).withDefault("welcome"),
  );
  const [unlocked, setUnlocked] = useState(0);

  const index = Math.min(onboardingSteps.indexOf(requested), unlocked);
  const step = onboardingSteps[index] ?? "welcome";

  useEffect(() => {
    if (requested !== step) void setRequested(step);
  }, [requested, step, setRequested]);

  const next = useCallback((): void => {
    const target = Math.min(index + 1, onboardingSteps.length - 1);
    setUnlocked((current) => Math.max(current, target));
    void setRequested(onboardingSteps[target] ?? "welcome");
  }, [index, setRequested]);

  const back = useCallback((): void => {
    const target = Math.max(index - 1, 0);
    void setRequested(onboardingSteps[target] ?? "welcome");
  }, [index, setRequested]);

  return { step, index, total: onboardingSteps.length, next, back };
};
