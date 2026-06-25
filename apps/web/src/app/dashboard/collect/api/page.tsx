"use client";

import { env } from "@echo/env/web";
import { Icons } from "@echo/ui/components/icons";

import { CodeSection } from "./components/code-section";
import { KeysSection } from "./components/keys-section";
import { useApiKeys } from "./hooks/use-api-keys";

export default function CollectApiPage(): React.ReactElement {
  const { state, pending, generate, roll } = useApiKeys();
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <header className="mb-8">
        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          REST API
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">API keys</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Send feedback events straight from your backend with a single authenticated
          request.
        </p>
      </header>

      {state.status === "loading" ? (
        <div className="space-y-4">
          <div className="h-44 animate-pulse rounded-2xl border border-border bg-muted/30" />
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-muted/30" />
        </div>
      ) : state.status === "empty" ? (
        <EmptyState onGenerate={generate} isGenerating={pending === "generate"} />
      ) : (
        <div className="space-y-4">
          <KeysSection keys={state.keys} onRoll={roll} isRolling={pending === "roll"} />
          <CodeSection serverUrl={serverUrl} publicKey={state.keys.publicKey} />
        </div>
      )}
    </div>
  );
}

function EmptyState({
  onGenerate,
  isGenerating,
}: {
  onGenerate: () => void;
  isGenerating: boolean;
}): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background">
        <Icons.lock className="size-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-sm font-semibold">No API keys yet</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Generate a publishable and secret key pair to start sending feedback.
      </p>
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="mt-6 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {isGenerating ? <Icons.loading className="size-3.5 animate-spin" /> : null}
        Generate API keys
      </button>
    </div>
  );
}
