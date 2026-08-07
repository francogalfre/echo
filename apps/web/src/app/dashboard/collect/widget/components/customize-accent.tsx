"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import { ColorPicker } from "../../feedback-page/components/color-picker";

type AccentStatus = "idle" | "saving" | "saved";

type CustomizeAccentProps = {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  status: AccentStatus;
};

const STATUS_COPY: Record<AccentStatus, string | null> = {
  idle: null,
  saving: "Saving…",
  saved: "Saved",
};

export const CustomizeAccent = ({
  accentColor,
  onAccentColorChange,
  status,
}: CustomizeAccentProps): React.ReactElement => {
  const statusCopy = STATUS_COPY[status];

  return (
    <section className="rounded-lg bg-card p-6 ring-1 ring-foreground/10">
      <div className="flex items-center gap-3">
        <ColorPicker value={accentColor} onChange={onAccentColorChange} variant="accent" />
        <div>
          <p className="text-sm font-medium">Accent color</p>
          <p className="text-xs text-muted-foreground">
            Used for the toggle button, star ratings, and the submit action.
          </p>
        </div>
        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity",
            statusCopy ? "opacity-100" : "opacity-0",
          )}
        >
          {status === "saving" ? (
            <Icons.loading className="size-3 animate-spin" />
          ) : (
            <Icons.circleCheck className="size-3 text-success" />
          )}
          {statusCopy}
        </span>
      </div>
    </section>
  );
};
