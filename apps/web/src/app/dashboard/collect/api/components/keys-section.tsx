import type { ApiKeys } from "../hooks/use-api-keys";
import { KeyCard } from "./key-card";

type KeysSectionProps = {
  keys: ApiKeys;
  onRoll: () => void;
  isRolling: boolean;
};

export const KeysSection = ({
  keys,
  onRoll,
  isRolling,
}: KeysSectionProps): React.ReactElement => (
  <section className="rounded-2xl border border-border bg-card p-5">
    <h2 className="text-sm font-semibold">Keys</h2>
    <p className="mt-0.5 text-xs text-muted-foreground">
      Use your publishable key to read feedback and your secret key to write it.
    </p>

    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <KeyCard
        label="Publishable key"
        badge="Read"
        description="Safe for client-side code. Read-only (GET)."
        value={keys.publicKey}
        canReveal
      />
      <KeyCard
        label="Secret key"
        badge="Write"
        description="Server-side only. Required for POST."
        value={keys.justGenerated ? keys.secretKey : null}
        keyExists={keys.hasSecret}
        revealOnMount={keys.justGenerated}
        warning={
          keys.justGenerated
            ? "Save this now — it won't be shown again after you navigate away."
            : undefined
        }
        onRoll={onRoll}
        isRolling={isRolling}
      />
    </div>
  </section>
);
