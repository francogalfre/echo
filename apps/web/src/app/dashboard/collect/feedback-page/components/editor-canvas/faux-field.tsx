"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

type FauxFieldProps = {
  label: string;
  placeholder: string;
  multiline?: boolean;
  onRemove?: () => void;
};

export const FauxField = ({
  label,
  placeholder,
  multiline = false,
  onRemove,
}: FauxFieldProps): React.ReactElement => (
  <div className="group/field relative">
    <p className="mb-1.5 block text-sm font-medium text-foreground">{label}</p>
    <div
      className={cn(
        "flex rounded-lg border border-border bg-muted/40 px-3.5 text-sm text-muted-foreground/60",
        multiline ? "h-28 items-start py-2.5" : "h-11 items-center",
      )}
    >
      {placeholder}
    </div>
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="absolute top-0 right-0 rounded text-muted-foreground/50 opacity-0 transition-opacity duration-150 group-hover/field:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icons.cancelCircle className="size-4" />
      </button>
    )}
  </div>
);
