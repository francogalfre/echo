"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

type KeyCardProps = {
  label: string;
  description: string;
  value: string | null;
  keyExists?: boolean;
  canReveal?: boolean;
  warning?: string;
  onRoll?: () => void;
  isRolling?: boolean;
  revealOnMount?: boolean;
};

const KeyCard = ({
  label,
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
  const masked = `${prefix}${"•".repeat(24)}`;
  const hasValue = value !== null;

  const copy = (): void => {
    if (!value) return;
    void navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>

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
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px]",
              "text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
            )}
          >
            {revealed ? (
              <Icons.eyeOff className="size-3" />
            ) : (
              <Icons.eye className="size-3" />
            )}
            {revealed ? "Hide" : "Reveal"}
          </button>
        )}

        {hasValue && (
          <button
            type="button"
            onClick={copy}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px]",
              "text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
            )}
          >
            <Icons.copy className="size-3" />
            Copy
          </button>
        )}

        {onRoll && (keyExists || hasValue) && (
          <button
            type="button"
            onClick={onRoll}
            disabled={isRolling}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px]",
              "text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
              "ml-auto disabled:opacity-50",
            )}
          >
            <Icons.refresh className={cn("size-3", isRolling && "animate-spin")} />
            Roll
          </button>
        )}
      </div>
    </div>
  );
};

type KeysSectionProps = {
  publicKey: string | null;
  secretKey: string | null;
  hasSecret: boolean;
  justGenerated: boolean;
  onRoll: () => void;
  isRolling: boolean;
};

export const KeysSection = ({
  publicKey,
  secretKey,
  hasSecret,
  justGenerated,
  onRoll,
  isRolling,
}: KeysSectionProps): React.ReactElement => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <h2 className="text-sm font-semibold">API Keys</h2>
    <p className="mt-0.5 text-xs text-muted-foreground">
      Use your publishable key for read operations and your secret key for writes.
    </p>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <KeyCard
        label="Publishable key"
        description="Safe for client-side code. Read-only (GET)."
        value={publicKey}
        canReveal
      />
      <KeyCard
        label="Secret key"
        description="Server-side only. Required for POST."
        value={justGenerated ? secretKey : null}
        keyExists={hasSecret}
        revealOnMount={justGenerated}
        warning={
          justGenerated
            ? "Save this now — it won't be shown again after you navigate away."
            : undefined
        }
        onRoll={onRoll}
        isRolling={isRolling}
      />
    </div>
  </div>
);
