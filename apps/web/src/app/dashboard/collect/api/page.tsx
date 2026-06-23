"use client";

import { env } from "@echo/env/web";
import { Icons } from "@echo/ui/components/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import { CodeSection } from "./components/code-section";
import { KeysSection } from "./components/keys-section";

type KeysState = {
  publicKey: string;
  secretKey: string | null;
  hasSecret: boolean;
  justGenerated: boolean;
};

export default function CollectApiPage(): React.ReactElement {
  const [keys, setKeys] = useState<KeysState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    trpc.apiKeys.get
      .query()
      .then((data) => {
        if (data) {
          setKeys({
            publicKey: data.publicKey,
            secretKey: null,
            hasSecret: true,
            justGenerated: false,
          });
        }
      })
      .catch(() => toast.error("Failed to load API keys"))
      .finally(() => setIsLoading(false));
  }, []);

  const generate = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      const data = await trpc.apiKeys.generate.mutate();
      setKeys({
        publicKey: data.publicKey,
        secretKey: data.secretKey,
        hasSecret: true,
        justGenerated: true,
      });
      toast.success("API keys generated");
    } catch {
      toast.error("Failed to generate keys");
    } finally {
      setIsGenerating(false);
    }
  };

  const roll = async (): Promise<void> => {
    setIsRolling(true);
    try {
      const data = await trpc.apiKeys.roll.mutate();
      setKeys({
        publicKey: data.publicKey,
        secretKey: data.secretKey,
        hasSecret: true,
        justGenerated: true,
      });
      toast.success("Keys rolled — previous keys are now invalid");
    } catch {
      toast.error("Failed to roll keys");
    } finally {
      setIsRolling(false);
    }
  };

  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-base font-semibold">API</h1>
          <p className="text-sm text-muted-foreground">
            Send feedback events straight from your backend.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-48 animate-pulse rounded-2xl border border-border bg-muted/30" />
            <div className="h-64 animate-pulse rounded-2xl border border-border bg-muted/30" />
          </div>
        ) : !keys ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16">
            <Icons.lock className="size-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">No API keys yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate your publishable and secret keys to start integrating.
            </p>
            <button
              type="button"
              onClick={generate}
              disabled={isGenerating}
              className="mt-5 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {isGenerating ? <Icons.loading className="size-3.5 animate-spin" /> : null}
              Generate API keys
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <KeysSection
              publicKey={keys.publicKey}
              secretKey={keys.secretKey}
              hasSecret={keys.hasSecret}
              justGenerated={keys.justGenerated}
              onRoll={roll}
              isRolling={isRolling}
            />
            <CodeSection serverUrl={serverUrl} publicKey={keys.publicKey} />
          </div>
        )}
      </div>
    </div>
  );
}
