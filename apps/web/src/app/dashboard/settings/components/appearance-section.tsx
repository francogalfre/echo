"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { SettingsCard } from "./settings-card";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Icons.sun },
  { value: "dark", label: "Dark", icon: Icons.moon },
  { value: "system", label: "System", icon: Icons.monitor },
] as const;

export const AppearanceSection = (): React.ReactElement => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SettingsCard className="h-fit">
      <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Choose how Echo looks on this device.
      </p>

      <fieldset className="mt-6">
        <legend className="sr-only">Theme</legend>
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = mounted && theme === option.value;

            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4",
                  "text-xs font-medium transition-colors hover:bg-muted",
                  "focus-within:ring-1 focus-within:ring-ring/50",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground",
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
                <Icon className="size-5" />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </SettingsCard>
  );
};
