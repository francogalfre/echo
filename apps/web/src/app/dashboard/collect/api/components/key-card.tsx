"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const MASK = "•".repeat(24);

type KeyCardProps = {
  label: string;
  badge: string;
  description: string;
  value: string | null;
  keyExists?: boolean;
  canReveal?: boolean;
  warning?: string;
  onRoll?: () => void;
  isRolling?: boolean;
  revealOnMount?: boolean;
};

export const KeyCard = ({
  label,
  badge,
  description,
  value,
  keyExists = false,
  canReveal = false,
  warning,
  onRoll,
  isRolling,
  revealOnMount = false,
}: KeyCardProps): React.ReactElement => {
  const [revealed, setRevealed] = useState(revealOnMount);

  const prefix = value?.startsWith("echo_pk_") ? "echo_pk_" : "echo_sk_";
  const masked = `${prefix}${MASK}`;
  const hasValue = value !== null;

  const copy = (): void => {
    if (!value) return;
    void navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {badge}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>

      {warning && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 dark:bg-amber-950/30">
          <Icons.alertCircle className="mt-0.5 size-3 shrink-0 text-amber-500" />
          <p className="text-xs text-amber-700 dark:text-amber-400">{warning}</p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
          {hasValue && revealed ? value : masked}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        {canReveal && hasValue && (
          <ActionButton
            icon={revealed ? Icons.eyeOff : Icons.eye}
            label={revealed ? "Hide" : "Reveal"}
            onClick={() => setRevealed((r) => !r)}
          />
        )}

        {hasValue && <ActionButton icon={Icons.copy} label="Copy" onClick={copy} />}

        {onRoll && (keyExists || hasValue) && (
          <ActionButton
            icon={Icons.refresh}
            label="Roll"
            onClick={onRoll}
            disabled={isRolling}
            spinning={isRolling}
            className="ml-auto"
          />
        )}
      </div>
    </div>
  );
};

type ActionButtonProps = {
  icon: (props: { className?: string }) => React.ReactElement;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  spinning?: boolean;
  className?: string;
};

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled,
  spinning,
  className,
}: ActionButtonProps): React.ReactElement => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex h-7 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px]",
      "text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
      "disabled:opacity-50",
      className,
    )}
  >
    <Icon className={cn("size-3", spinning && "animate-spin")} />
    {label}
  </button>
);
