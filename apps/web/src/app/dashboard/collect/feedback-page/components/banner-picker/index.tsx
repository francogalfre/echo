"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import { BannerGallery } from "./banner-gallery";
import { BannerUploadTab } from "./banner-upload-tab";
import { useBannerUpload } from "./use-banner-upload";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { isUploading, upload } = useBannerUpload(organizationId, (url) => {
    onUploaded(url);
    setOpen(false);
  });

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
            <BannerGallery
              currentValue={currentValue}
              hasImage={hasImage}
              onPickSwatch={(value) => {
                onSelectColor(value);
                setOpen(false);
              }}
              onCustomChange={onSelectColor}
            />
          ) : (
            <BannerUploadTab
              isUploading={isUploading}
              onFileSelected={(file) => void upload(file)}
            />
          )}
        </div>
      )}
    </div>
  );
};
