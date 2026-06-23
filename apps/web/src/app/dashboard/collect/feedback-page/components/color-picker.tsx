"use client";

import { cn } from "@echo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

const accentPresets = [
  "#7C3AED",
  "#2563EB",
  "#0891B2",
  "#059669",
  "#D97706",
  "#DC2626",
  "#DB2777",
  "#64748B",
  "#18181B",
] as const;

const backgroundPresets = [
  "#EDE9FE",
  "#DBEAFE",
  "#CCFBF1",
  "#DCFCE7",
  "#FEF9C3",
  "#FFE4E6",
  "#FCE7F3",
  "#E0F2FE",
  "#F1F5F9",
] as const;

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  variant?: "accent" | "background";
};

export const ColorPicker = ({
  value,
  onChange,
  variant = "accent",
}: ColorPickerProps): React.ReactElement => {
  const presets = variant === "background" ? backgroundPresets : accentPresets;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent): void => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Color picker, currently ${value}`}
        aria-expanded={open}
        aria-controls="color-picker-menu"
        onClick={() => setOpen((o) => !o)}
        className="size-8 cursor-pointer rounded-lg border border-border/60 ring-offset-1 transition-transform duration-200 hover:scale-105"
        style={{ backgroundColor: value }}
        title={value}
      />

      {open && (
        <div
          id="color-picker-menu"
          className="animate-in fade-in zoom-in-95 absolute left-0 top-10 z-50 w-56 rounded-2xl border border-border bg-card p-4 shadow-2xl duration-150"
          role="menu"
        >
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Presets
          </p>
          <div
            className="mb-4 grid grid-cols-5 gap-2"
            role="group"
            aria-label="Color presets"
          >
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Select color ${color}`}
                aria-pressed={value.toLowerCase() === color.toLowerCase()}
                onClick={() => {
                  onChange(color);
                  setOpen(false);
                }}
                className={cn(
                  "size-8 rounded-lg border border-border/40 transition-all duration-150 hover:scale-110",
                  value.toLowerCase() === color.toLowerCase() &&
                    "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-card",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="border-t border-border pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Custom
            </p>
            <div className="flex min-w-0 items-center gap-2">
              <div className="relative size-8 shrink-0">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div
                  className="size-8 rounded-lg border border-border/40"
                  style={{ backgroundColor: value }}
                />
              </div>
              <input
                type="text"
                aria-label="Hex color code"
                value={value.toUpperCase()}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
                }}
                className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider outline-none focus:ring-2 focus:ring-ring"
                maxLength={7}
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
