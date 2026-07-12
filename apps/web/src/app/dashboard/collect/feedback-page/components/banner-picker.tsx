"use client";

import { env } from "@echo/env/web";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "@echo/ui/components/toast";

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

const MAX_BANNER_DIMENSION = 1600;
const BANNER_QUALITY = 0.82;

async function downscaleImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_BANNER_DIMENSION / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", BANNER_QUALITY);
  });

  if (!blob) return file;

  return new File([blob], "banner.jpg", { type: "image/jpeg" });
}

type BannerPickerProps = {
  organizationId: string;
  currentValue: string;
  hasImage: boolean;
  onSelectColor: (value: string) => void;
  onUploaded: (url: string) => void;
};

export const BannerPicker = ({
  organizationId,
  currentValue,
  hasImage,
  onSelectColor,
  onUploaded,
}: BannerPickerProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"gallery" | "upload">("gallery");
  const [isUploading, setIsUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customHex = /^#[0-9a-fA-F]{6}$/.test(currentValue) ? currentValue : "#2D7DD2";

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleFile = async (file: File | undefined): Promise<void> => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller");
      return;
    }

    setIsUploading(true);
    try {
      const processed = await downscaleImage(file);

      const body = new FormData();
      body.append("organizationId", organizationId);
      body.append("file", processed);

      const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/projects/banner`, {
        method: "POST",
        credentials: "include",
        body,
      });

      if (!response.ok) {
        const detail = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(detail?.error ?? "Upload failed");
      }

      const data = (await response.json()) as { url: string };
      onUploaded(data.url);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/55"
      >
        <Icons.imageAdd className="size-3.5" />
        Change cover
      </button>

      {open && (
        <div className="animate-in fade-in zoom-in-95 absolute top-9 right-0 z-50 max-h-[70vh] w-72 max-w-[calc(100vw-3rem)] overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-2xl duration-150">
          <div className="mb-3 flex items-center gap-1 border-b border-border pb-2">
            <button
              type="button"
              onClick={() => setTab("gallery")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                tab === "gallery"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => setTab("upload")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                tab === "upload"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Upload
            </button>
          </div>

          {tab === "gallery" ? (
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
                      onClick={() => {
                        onSelectColor(color);
                        setOpen(false);
                      }}
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
                      onClick={() => {
                        onSelectColor(gradient);
                        setOpen(false);
                      }}
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
                      onChange={(event) => onSelectColor(event.target.value)}
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
                      if (/^#[0-9a-fA-F]{0,6}$/.test(next)) onSelectColor(next);
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider outline-none focus:ring-2 focus:ring-ring"
                    maxLength={7}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => void handleFile(event.target.files?.[0])}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border border-border bg-muted/40 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                {isUploading ? "Uploading…" : "Upload file"}
              </button>
              <p className="text-xs text-muted-foreground">
                Recommended size 1500 × 600px. PNG, JPG or WebP up to 5MB.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
