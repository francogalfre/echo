"use client";

import { Icons } from "@echo/ui/components/icons";
import Image from "next/image";

type LogoPickerProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  preview: string | null;
  error: string | null;
  onChange: (file: File | undefined) => void;
};

export const LogoPicker = ({
  inputRef,
  preview,
  error,
  onChange,
}: LogoPickerProps): React.ReactElement => (
  <div className="flex items-center gap-4">
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-foreground"
    >
      {preview ? (
        <Image
          src={preview}
          alt="Project logo"
          width={64}
          height={64}
          className="size-full object-cover"
        />
      ) : (
        <Icons.imageAdd className="size-5" />
      )}
    </button>
    <div className="text-xs text-muted-foreground">
      <p className="font-medium text-foreground">Logo</p>
      <p>PNG, JPG, WebP or SVG. Max 1MB. Optional.</p>
      {error ? <p className="text-destructive">{error}</p> : null}
    </div>
    <input
      ref={inputRef}
      type="file"
      accept="image/png,image/jpeg,image/webp,image/svg+xml"
      className="hidden"
      onChange={(e) => onChange(e.target.files?.[0])}
    />
  </div>
);
