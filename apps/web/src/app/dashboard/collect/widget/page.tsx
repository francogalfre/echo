"use client";

import { env } from "@echo/env/web";
import { Icons } from "@echo/ui/components/icons";

import { InstallMethods } from "./components/install-methods";
import { WidgetShowcase } from "./components/widget-showcase";
import { useWidgetInstall } from "./hooks/use-widget-install";

export default function WidgetPage(): React.ReactElement {
  const state = useWidgetInstall();
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <header className="mb-8">
        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          React
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Feedback widget</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          A floating feedback button you can drop into any React application.
        </p>
      </header>

      {state.status === "loading" ? (
        <div className="space-y-4">
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-muted/30" />
          <div className="h-36 animate-pulse rounded-2xl border border-border bg-muted/30" />
        </div>
      ) : state.status === "empty" ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <WidgetShowcase publicKey={state.info.publicKey} serverUrl={serverUrl} />
          <InstallMethods orgSlug={state.info.orgSlug} serverUrl={serverUrl} />
        </div>
      )}
    </div>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
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
