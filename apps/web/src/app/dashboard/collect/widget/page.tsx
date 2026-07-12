"use client";

import { env } from "@echo/env/web";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
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
        <div className="space-y-4">
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-muted/30" />
          <div className="h-36 animate-pulse rounded-2xl border border-border bg-muted/30" />
        </div>
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
              className="mt-6 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
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
              className="mt-6 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
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
