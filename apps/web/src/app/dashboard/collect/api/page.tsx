"use client";

import { env } from "@echo/env/web";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";

import { PageContainer } from "../../components/page-container";
import { DocsHeader } from "../components/docs-header";
import { CodeSection } from "./components/code-section";
import { KeysSection } from "./components/keys-section";
import { useApiKeys } from "./hooks/use-api-keys";

export default function CollectApiPage(): React.ReactElement {
  const { state, pending, generate, roll } = useApiKeys();
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  if (state.status === "loading") {
    return (
      <PageContainer>
        <div className="space-y-4">
          <div className="h-44 animate-pulse rounded-2xl border border-border bg-muted/30" />
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-muted/30" />
        </div>
      </PageContainer>
    );
  }

  if (state.status === "empty") {
    return (
      <PageContainer>
        <EmptyState onGenerate={generate} isGenerating={pending === "generate"} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        <DocsHeader
          eyebrow="REST API"
          title="API keys"
          description="Send feedback events straight from your backend with a single authenticated request."
          baseUrl={`${serverUrl}/api/feedback`}
        />
      </FadeIn>

      <div className="space-y-4">
        <FadeIn delay={0.05}>
          <KeysSection keys={state.keys} onRoll={roll} isRolling={pending === "roll"} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <CodeSection serverUrl={serverUrl} publicKey={state.keys.publicKey} />
        </FadeIn>
      </div>
    </PageContainer>
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
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
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
