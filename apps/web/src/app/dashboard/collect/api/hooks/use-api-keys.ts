"use client";

import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";

export type ApiKeyListItem = {
  id: string;
  name: string;
  publicKey: string;
  hasSecret: boolean;
};

export type ApiKeysInitial = readonly ApiKeyListItem[];

export type ApiKeysInitialState = { keys: ApiKeysInitial } | { error: true };

export type ApiKeyEntry = ApiKeyListItem & {
  secretKey: string | null;
  justIssued: boolean;
};

type Pending = { action: "generate" | "roll" | "revoke"; id: string | null } | null;

function toEntries(initial: ApiKeysInitial): ApiKeyEntry[] {
  return initial.map((item) => ({ ...item, secretKey: null, justIssued: false }));
}

export function useApiKeys(initial: ApiKeysInitial): {
  keys: ApiKeyEntry[];
  pending: Pending;
  generate: () => Promise<void>;
  roll: (id: string) => Promise<void>;
  revoke: (id: string) => Promise<void>;
} {
  const [keys, setKeys] = useState<ApiKeyEntry[]>(() => toEntries(initial));
  const [pending, setPending] = useState<Pending>(null);

  const generate = async (): Promise<void> => {
    setPending({ action: "generate", id: null });
    try {
      const issued = await trpc.apiKeys.generate.mutate({});
      setKeys((prev) => [
        {
          id: issued.id,
          name: issued.name,
          publicKey: issued.publicKey,
          hasSecret: true,
          secretKey: issued.secretKey,
          justIssued: true,
        },
        ...prev,
      ]);
      toast.success("API key generated");
    } catch {
      toast.error("Failed to generate key");
    } finally {
      setPending(null);
    }
  };

  const roll = async (id: string): Promise<void> => {
    setPending({ action: "roll", id });
    try {
      const issued = await trpc.apiKeys.roll.mutate({ id });
      setKeys((prev) => [
        {
          id: issued.id,
          name: issued.name,
          publicKey: issued.publicKey,
          hasSecret: true,
          secretKey: issued.secretKey,
          justIssued: true,
        },
        ...prev.filter((key) => key.id !== id),
      ]);
      toast.success("Key rolled — previous key stays valid for 24 hours");
    } catch {
      toast.error("Failed to roll key");
    } finally {
      setPending(null);
    }
  };

  const revoke = async (id: string): Promise<void> => {
    setPending({ action: "revoke", id });
    try {
      await trpc.apiKeys.revoke.mutate({ id });
      setKeys((prev) => prev.filter((key) => key.id !== id));
      toast.success("Key revoked");
    } catch {
      toast.error("Failed to revoke key");
    } finally {
      setPending(null);
    }
  };

  return { keys, pending, generate, roll, revoke };
}
