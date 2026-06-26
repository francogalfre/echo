"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export type AvatarPreset = {
  id: string;
  name: string;
  from: string;
  to: string;
};

export const AVATAR_PRESETS = [
  { id: "violet", name: "Violet", from: "#7C6CF0", to: "#B6A8FF" },
  { id: "emerald", name: "Emerald", from: "#34D399", to: "#6EE7B7" },
  { id: "amber", name: "Amber", from: "#FBBF24", to: "#FCD34D" },
  { id: "rose", name: "Rose", from: "#FB7185", to: "#FDA4AF" },
  { id: "sky", name: "Sky", from: "#38BDF8", to: "#7DD3FC" },
  { id: "slate", name: "Slate", from: "#64748B", to: "#94A3B8" },
] as const satisfies readonly AvatarPreset[];

export function avatarSvg(preset: AvatarPreset): string {
  const gradientId = `avatar-${preset.id}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="100%" height="100%"><defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${preset.from}"/><stop offset="1" stop-color="${preset.to}"/></linearGradient></defs><rect width="80" height="80" rx="40" fill="url(#${gradientId})"/></svg>`;
}

export function avatarDataUri(preset: AvatarPreset): string {
  return `data:image/svg+xml,${encodeURIComponent(avatarSvg(preset))}`;
}

type AvatarOrbProps = {
  preset: AvatarPreset;
  className?: string;
};

const AvatarOrb = ({ preset, className }: AvatarOrbProps): React.ReactElement => (
  <span
    aria-hidden="true"
    className={cn("block overflow-hidden rounded-full", className)}
    dangerouslySetInnerHTML={{ __html: avatarSvg(preset) }}
  />
);

type AvatarPickerProps = {
  value: string;
  onChange: (id: string) => void;
};

export function AvatarPicker({ value, onChange }: AvatarPickerProps): React.ReactElement {
  const selected = AVATAR_PRESETS.find((p) => p.id === value) ?? AVATAR_PRESETS[0];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative size-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <AvatarOrb preset={selected} className="size-full shadow-lg shadow-black/5" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {AVATAR_PRESETS.map((preset) => {
          const isSelected = preset.id === selected.id;
          return (
            <motion.button
              key={preset.id}
              type="button"
              aria-label={`Select ${preset.name}`}
              aria-pressed={isSelected}
              onClick={() => onChange(preset.id)}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "relative size-12 rounded-full outline-none transition-opacity",
                isSelected
                  ? "opacity-100 ring-2 ring-foreground/70 ring-offset-2 ring-offset-background"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              <AvatarOrb preset={preset} className="size-full" />
              {isSelected && (
                <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-background">
                  <Icons.check className="size-2.5" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
