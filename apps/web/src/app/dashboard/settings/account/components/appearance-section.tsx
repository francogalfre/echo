"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { SettingsCard } from "../../components/settings-card";
import { SettingsRow } from "../../components/settings-row";

type ThemeValue = "system" | "light" | "dark";

type ThemeOption = {
  value: ThemeValue;
  label: string;
  icon: typeof Icons.sun;
};

const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: "system", label: "System", icon: Icons.monitor },
  { value: "light", label: "Light", icon: Icons.sun },
  { value: "dark", label: "Dark", icon: Icons.moon },
];

type PreviewTone = "light" | "dark";

const TONE_STYLES: Record<
  PreviewTone,
  { bg: string; rail: string; bar: string; barSoft: string }
> = {
  light: {
    bg: "bg-white",
    rail: "bg-neutral-100",
    bar: "bg-neutral-300",
    barSoft: "bg-neutral-200",
  },
  dark: {
    bg: "bg-neutral-900",
    rail: "bg-neutral-800",
    bar: "bg-neutral-600",
    barSoft: "bg-neutral-700",
  },
};

type PreviewPaneProps = {
  tone: PreviewTone;
};

const PreviewPane = ({ tone }: PreviewPaneProps): React.ReactElement => {
  const styles = TONE_STYLES[tone];

  return (
    <div className={cn("flex h-full w-full", styles.bg)}>
      <div className={cn("flex w-5 shrink-0 flex-col gap-1 p-1.5", styles.rail)}>
        <span className={cn("h-1 rounded-full", styles.bar)} />
        <span className={cn("h-1 rounded-full", styles.bar)} />
        <span className={cn("h-1 rounded-full", styles.bar)} />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <span className={cn("block h-1.5 w-1/2 rounded-full", styles.bar)} />
        <span className={cn("block h-1 rounded-full", styles.barSoft)} />
        <span className={cn("block h-1 w-4/5 rounded-full", styles.barSoft)} />
      </div>
    </div>
  );
};

type ThemePreviewProps = {
  value: ThemeValue;
};

const ThemePreview = ({ value }: ThemePreviewProps): React.ReactElement => {
  if (value === "system") {
    return (
      <div className="grid h-20 grid-cols-2 overflow-hidden rounded-lg">
        <PreviewPane tone="light" />
        <PreviewPane tone="dark" />
      </div>
    );
  }

  return (
    <div className="h-20 overflow-hidden rounded-lg">
      <PreviewPane tone={value} />
    </div>
  );
};

export const AppearanceSection = (): React.ReactElement => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SettingsCard>
      <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Choose how Echo looks on this device.
      </p>

      <div className="mt-6">
        <SettingsRow label="Interface theme" description="Select or sync with your system.">
          <fieldset>
            <legend className="sr-only">Theme</legend>
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = mounted && theme === option.value;

                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer flex-col gap-2 rounded-2xl p-2 ring-1 transition-colors",
                      "focus-within:ring-2 focus-within:ring-ring/50",
                      active
                        ? "ring-2 ring-accent"
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
                    <ThemePreview value={option.value} />
                    <div className="flex items-center gap-1.5 px-1 pb-1">
                      <Icon className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        {option.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </SettingsRow>
      </div>
    </SettingsCard>
  );
};
