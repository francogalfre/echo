"use client";

import { env } from "@echo/env/web";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";

import { PageContainer } from "../../components/page-container";
import { DocsHeader } from "../components/docs-header";
import { InstallMethods } from "./components/install-methods";
import { WidgetShowcase } from "./components/widget-showcase";
import { useWidgetInstall } from "./hooks/use-widget-install";

export default function WidgetPage(): React.ReactElement {
  const state = useWidgetInstall();
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  if (state.status === "loading") {
    return (
      <PageContainer>
        <div className="space-y-4">
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-muted/30" />
          <div className="h-36 animate-pulse rounded-2xl border border-border bg-muted/30" />
        </div>
      </PageContainer>
    );
  }

  if (state.status === "empty") {
    return (
      <PageContainer>
        <EmptyState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        <DocsHeader
          eyebrow="React"
          title="Feedback widget"
          description="A floating feedback button you can drop into any React application."
          baseUrl={`${serverUrl}/api/widget`}
        />
      </FadeIn>

      <div className="space-y-4">
        <FadeIn delay={0.05}>
          <WidgetShowcase
            publicKey={state.info.publicKey}
            serverUrl={serverUrl}
            accentColor={state.info.accentColor}
            logoUrl={state.info.logo}
            projectName={state.info.name}
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <InstallMethods orgSlug={state.info.orgSlug} serverUrl={serverUrl} />
        </FadeIn>
      </div>
    </PageContainer>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background">
        <Icons.lock className="size-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-sm font-semibold">No API keys yet</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Generate your API keys to enable the widget.
      </p>
      <a
        href="/dashboard/collect/api"
        className="mt-6 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
      >
        Go to API keys
      </a>
    </div>
  );
}
