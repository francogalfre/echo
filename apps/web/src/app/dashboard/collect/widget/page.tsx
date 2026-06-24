"use client";

import { env } from "@echo/env/web";
import { Icons } from "@echo/ui/components/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import { WidgetInstallSection } from "./components/widget-install-section";

type InstallInfo = {
  publicKey: string;
  orgSlug: string;
};

export default function WidgetPage(): React.ReactElement {
  const [info, setInfo] = useState<InstallInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    trpc.widget.getInstallInfo
      .query()
      .then((data) => {
        if (data) setInfo(data);
      })
      .catch(() => toast.error("Failed to load widget configuration"))
      .finally(() => setIsLoading(false));
  }, []);

  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-base font-semibold">Widget</h1>
          <p className="text-sm text-muted-foreground">
            Add a floating feedback button to any React application.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-36 animate-pulse rounded-2xl border border-border bg-muted/30" />
            <div className="h-36 animate-pulse rounded-2xl border border-border bg-muted/30" />
            <div className="h-48 animate-pulse rounded-2xl border border-border bg-muted/30" />
          </div>
        ) : !info ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16">
            <Icons.lock className="size-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">No API keys yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate your API keys first in the{" "}
              <a href="/dashboard/collect/api" className="underline underline-offset-2">
                API section
              </a>{" "}
              to enable the widget.
            </p>
          </div>
        ) : (
          <WidgetInstallSection
            publicKey={info.publicKey}
            orgSlug={info.orgSlug}
            serverUrl={serverUrl}
          />
        )}
      </div>
    </div>
  );
}
