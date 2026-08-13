import { Button } from "@echo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@echo/ui/components/dialog";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";

import type { ApiKeyEntry } from "@/app/dashboard/hooks/use-api-keys";

import { KeyCard } from "./key-card";

type KeysSectionProps = {
  keys: ApiKeyEntry[];
  onGenerate: () => void;
  generating: boolean;
  onRoll: (id: string) => void;
  onRevoke: (id: string) => void;
  rollingId: string | null;
  revokingId: string | null;
};

export const KeysSection = ({
  keys,
  onGenerate,
  generating,
  onRoll,
  onRevoke,
  rollingId,
  revokingId,
}: KeysSectionProps): React.ReactElement => {
  const [confirmKey, setConfirmKey] = useState<ApiKeyEntry | null>(null);

  const confirmRevoke = (): void => {
    if (!confirmKey) return;
    onRevoke(confirmKey.id);
    setConfirmKey(null);
  };

  return (
    <section className="rounded-lg bg-card p-6 ring-1 ring-foreground/10">
      <h3 className="text-sm font-semibold">Keys</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Use your publishable key to read feedback and your secret key to write it.
      </p>

      {keys.length === 0 ? (
        <EmptyState
          icon={<Icons.lock />}
          title="No API keys yet"
          description="Generate a publishable and secret key pair to start sending feedback."
          className="py-10"
          action={
            <Button size="sm" onClick={onGenerate} disabled={generating}>
              {generating ? <Icons.loading className="size-3.5 animate-spin" /> : null}
              Generate API keys
            </Button>
          }
        />
      ) : (
        <div className="mt-6 space-y-6">
          {keys.map((key) => (
            <div key={key.id}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">{key.name}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setConfirmKey(key)}
                  disabled={revokingId === key.id}
                  aria-label={`Revoke ${key.name}`}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Icons.trash className="size-3.5" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <KeyCard
                  label="Publishable key"
                  badge="Read"
                  description="Safe for client-side code. Read-only (GET)."
                  value={key.publicKey}
                  canReveal
                />
                <KeyCard
                  label="Secret key"
                  badge="Write"
                  description="Server-side only. Required for POST."
                  value={key.justIssued ? key.secretKey : null}
                  keyExists={key.hasSecret}
                  revealOnMount={key.justIssued}
                  warning={
                    key.justIssued
                      ? "Save this now — it won't be shown again after you navigate away."
                      : undefined
                  }
                  onRoll={() => onRoll(key.id)}
                  isRolling={rollingId === key.id}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={confirmKey !== null}
        onOpenChange={(open) => !open && setConfirmKey(null)}
      >
        <DialogContent className="max-w-md gap-6 p-8">
          <DialogHeader>
            <DialogTitle>Revoke &ldquo;{confirmKey?.name}&rdquo;</DialogTitle>
            <DialogDescription>
              Any requests using this key pair will stop working immediately. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={confirmRevoke}>
              Revoke key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
