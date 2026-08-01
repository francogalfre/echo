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
import { useState } from "react";

import type { ApiKeyEntry } from "../hooks/use-api-keys";
import { KeyCard } from "./key-card";

type KeysSectionProps = {
  keys: ApiKeyEntry[];
  onRoll: (id: string) => void;
  onRevoke: (id: string) => void;
  rollingId: string | null;
  revokingId: string | null;
};

export const KeysSection = ({
  keys,
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
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold">Keys</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Use your publishable key to read feedback and your secret key to write it.
      </p>

      <div className="mt-6 space-y-6">
        {keys.map((key) => (
          <div key={key.id}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">{key.name}</p>
              <button
                type="button"
                onClick={() => setConfirmKey(key)}
                disabled={revokingId === key.id}
                className="text-xs text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
              >
                Revoke
              </button>
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
