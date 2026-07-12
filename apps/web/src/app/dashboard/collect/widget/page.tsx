"use client";

import { env } from "@echo/env/web";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { useEffect, useRef, useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";

import { PageContainer } from "../../components/page-container";
import { DocsHeader } from "../components/docs-header";
import { SectionHeading } from "../components/section-heading";
import { CustomizeAccent } from "./components/customize-accent";
import { InstallMethods } from "./components/install-methods";
import { WidgetShowcase } from "./components/widget-showcase";
import { useWidgetInstall } from "./hooks/use-widget-install";

const ACCENT_PERSIST_DELAY_MS = 400;

export default function WidgetPage(): React.ReactElement {
  const state = useWidgetInstall();
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  const [accentOverride, setAccentOverride] = useState<string | null>(null);
  const persistTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (persistTimeout.current) clearTimeout(persistTimeout.current);
    };
  }, []);

  if (state.status === "loading") {
    return (
      <PageContainer>
        <WidgetPageSkeleton />
      </PageContainer>
    );
  }

  if (state.status === "error") {
    return (
      <PageContainer>
        <StatusCard
          icon={<Icons.alertCircle className="size-5 text-muted-foreground" />}
          title="Couldn't load the widget"
          description="Something went wrong while fetching your widget configuration."
          action={
            <button
              type="button"
              onClick={state.retry}
              className="mt-6 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity active:scale-[0.96] hover:opacity-85"
            >
              <Icons.refresh className="size-3.5" />
              Retry
            </button>
          }
        />
      </PageContainer>
    );
  }

  if (state.status === "empty") {
    return (
      <PageContainer>
        <StatusCard
          icon={<Icons.lock className="size-5 text-muted-foreground" />}
          title="No API keys yet"
          description="Generate your API keys to enable the widget."
          action={
            <a
              href="/dashboard/collect/api"
              className="mt-6 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity active:scale-[0.96] hover:opacity-85"
            >
              Go to API keys
            </a>
          }
        />
      </PageContainer>
    );
  }

  const accentColor = accentOverride ?? state.info.accentColor;

  const handleAccentChange = (color: string): void => {
    const previous = accentColor;
    setAccentOverride(color);

    if (persistTimeout.current) clearTimeout(persistTimeout.current);
    persistTimeout.current = setTimeout(() => {
      trpc.feedbackPage.upsertConfig
        .mutate({ accentColor: color })
        .then(() => toast.success("Accent color saved"))
        .catch(() => {
          setAccentOverride(previous);
          toast.error("Failed to save accent color");
        });
    }, ACCENT_PERSIST_DELAY_MS);
  };

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

      <div className="space-y-20">
        <FadeIn delay={0.05}>
          <section>
            <SectionHeading
              title="Preview"
              description="See how the widget looks and behaves before you install it."
            />
            <WidgetShowcase
              publicKey={state.info.publicKey}
              serverUrl={serverUrl}
              accentColor={accentColor}
              logoUrl={state.info.logo}
              projectName={state.info.name}
            />
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <CustomizeAccent
            accentColor={accentColor}
            onAccentColorChange={handleAccentChange}
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          <section>
            <SectionHeading
              title="Install"
              description="Choose the install method that fits your stack."
            />
            <InstallMethods orgSlug={state.info.orgSlug} serverUrl={serverUrl} />
          </section>
        </FadeIn>
      </div>
    </PageContainer>
  );
}

type StatusCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
};

function StatusCard({
  icon,
  title,
  description,
  action,
}: StatusCardProps): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background">
        {icon}
      </div>
      <h2 className="mt-4 text-sm font-semibold">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

function WidgetPageSkeleton(): React.ReactElement {
  return (
    <div className="space-y-20" aria-hidden="true">
      <section>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-2.5 h-3.5 w-full max-w-md" />
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-1 border-b border-border px-4 py-2.5">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
          </div>
          <div className="p-6">
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-1.5 h-3 w-64" />
        <div className="mt-5 flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </section>

      <section>
        <Skeleton className="h-4 w-14" />
        <Skeleton className="mt-2.5 h-3.5 w-full max-w-sm" />
        <div className="mt-6 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-1 flex items-center gap-2.5">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-3.5 w-32" />
              </div>
              <Skeleton className="mb-4 ml-[30px] h-3 w-72" />
              <Skeleton className="ml-[30px] h-20 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
