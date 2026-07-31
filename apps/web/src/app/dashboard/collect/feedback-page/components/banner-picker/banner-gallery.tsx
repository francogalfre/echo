"use client";

import { cn } from "@echo/ui/lib/utils";

const SOLID_COLORS = [
  "#2D7DD2",
  "#7C3AED",
  "#0891B2",
  "#059669",
  "#D97706",
  "#DC2626",
  "#DB2777",
  "#4F46E5",
  "#475569",
  "#18181B",
] as const;

const GRADIENTS = [
  "linear-gradient(135deg, #ABDCFF, #0396FF)",
  "linear-gradient(135deg, #CE9FFC, #7367F0)",
  "linear-gradient(135deg, #90F7EC, #32CCBC)",
  "linear-gradient(135deg, #FEB692, #EA5455)",
  "linear-gradient(135deg, #FFF6B7, #F6416C)",
  "linear-gradient(135deg, #81FBB8, #28C76F)",
  "linear-gradient(135deg, #E2B0FF, #9F44D3)",
  "linear-gradient(135deg, #F6D365, #FDA085)",
] as const;

type BannerGalleryProps = {
  currentValue: string;
  hasImage: boolean;
  onPickSwatch: (value: string) => void;
  onCustomChange: (value: string) => void;
};

export function BannerGallery({
  currentValue,
  hasImage,
  onPickSwatch,
  onCustomChange,
}: BannerGalleryProps): React.ReactElement {
  const customHex = /^#[0-9a-fA-F]{6}$/.test(currentValue) ? currentValue : "#2D7DD2";

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Solid colors
        </p>
        <div className="grid grid-cols-5 gap-2">
          {SOLID_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Solid color ${color}`}
              onClick={() => onPickSwatch(color)}
              className={cn(
                "h-10 rounded-md border border-border/40 transition-transform hover:scale-105",
                !hasImage &&
                  currentValue === color &&
                  "ring-2 ring-foreground ring-offset-2 ring-offset-card",
              )}
              style={{ background: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Gradients
        </p>
        <div className="grid grid-cols-4 gap-2">
          {GRADIENTS.map((gradient) => (
            <button
              key={gradient}
              type="button"
              aria-label="Gradient"
              onClick={() => onPickSwatch(gradient)}
              className={cn(
                "h-12 rounded-md border border-border/40 transition-transform hover:scale-105",
                !hasImage &&
                  currentValue === gradient &&
                  "ring-2 ring-foreground ring-offset-2 ring-offset-card",
              )}
              style={{ background: gradient }}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Custom color
        </p>
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative size-8 shrink-0">
            <input
              type="color"
              aria-label="Pick a custom banner color"
              value={hasImage ? "#000000" : customHex}
              onChange={(event) => onCustomChange(event.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div
              className="size-8 rounded-lg border border-border/40"
              style={{ background: hasImage ? "#000000" : currentValue }}
            />
          </div>
          <input
            type="text"
            aria-label="Banner hex color"
            value={customHex.toUpperCase()}
            onChange={(event) => {
              const next = event.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(next)) onCustomChange(next);
            }}
            className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider outline-none focus:ring-2 focus:ring-ring"
            maxLength={7}
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
}
