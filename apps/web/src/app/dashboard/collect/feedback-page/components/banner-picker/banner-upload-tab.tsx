"use client";

import { useRef } from "react";

type BannerUploadTabProps = {
  isUploading: boolean;
  onFileSelected: (file: File | undefined) => void;
};

export function BannerUploadTab({
  isUploading,
  onFileSelected,
}: BannerUploadTabProps): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3 py-2 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onFileSelected(event.target.files?.[0])}
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
  );
}
