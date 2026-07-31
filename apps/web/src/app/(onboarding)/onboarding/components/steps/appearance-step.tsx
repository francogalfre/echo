"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { themeOptions } from "@/lib/theme";

import { OnboardingActions, OnboardingCard } from "../onboarding-card";

type AppearanceStepProps = {
  onFinish: () => void;
  finishing: boolean;
};

export const AppearanceStep = ({
  onFinish,
  finishing,
}: AppearanceStepProps): React.ReactElement => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <OnboardingCard
      title="Pick your look"
      description="Choose how Echo looks on this device. You can change it anytime in settings."
    >
      <fieldset className="mt-6">
        <legend className="sr-only">Theme</legend>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const active = mounted && theme === option.value;

            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-xl px-3 py-5 ring-1 transition-colors",
                  "focus-within:ring-2 focus-within:ring-ring/50",
                  active
                    ? "bg-accent/5 ring-2 ring-accent"
                    : "ring-foreground/10 hover:ring-foreground/20",
                )}
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={active}
                  onChange={() => setTheme(option.value)}
                  className="sr-only"
                />
                <Icon
                  className={cn("size-5", active ? "text-accent" : "text-muted-foreground")}
                />
                <span className="text-xs font-medium text-foreground">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <OnboardingActions>
        <Button size="lg" onClick={onFinish} disabled={finishing}>
          {finishing ? (
            <Icons.loading className="size-4 animate-spin" />
          ) : (
            <>
              Enter Echo
              <Icons.arrowRight data-icon="inline-end" className="size-4" />
            </>
          )}
        </Button>
      </OnboardingActions>
    </OnboardingCard>
  );
};
