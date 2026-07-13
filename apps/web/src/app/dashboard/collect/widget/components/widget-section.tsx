"use client";

import { env } from "@echo/env/web";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import { toast } from "@echo/ui/components/toast";
import { cn } from "@echo/ui/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trpc } from "@/lib/trpc";

import { ErrorCard } from "../../../components/error-card";
import { DocsHeader } from "../../components/docs-header";
import { SectionHeading } from "../../components/section-heading";
import { useWidgetInstall, type WidgetInstallInitial } from "../hooks/use-widget-install";
import { CustomizeAccent } from "./customize-accent";
import { InstallMethods } from "./install-methods";
import { WidgetPageSkeleton } from "./widget-page-skeleton";
import { WidgetShowcase } from "./widget-showcase";

const ACCENT_PERSIST_DELAY_MS = 400;

type WidgetSectionProps = {
  readonly initial: WidgetInstallInitial;
};

export function WidgetSection({ initial }: WidgetSectionProps): React.ReactElement {
  const state = useWidgetInstall(initial);
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  const [accentOverride, setAccentOverride] = useState<string | null>(null);
  const persistTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (persistTimeout.current) clearTimeout(persistTimeout.current);
    };
  }, []);

  if (state.status === "loading") {
    return <WidgetPageSkeleton />;
  }

  if (state.status === "error") {
    return (
      <ErrorCard
        title="Couldn't load the widget"
        message="Something went wrong while fetching your widget configuration."
        onRetry={state.retry}
        className="mx-auto max-w-md"
      />
    );
  }

  if (state.status === "empty") {
    return (
      <EmptyState
        icon={<Icons.lock />}
        title="No API keys yet"
        description="Generate your API keys to enable the widget."
        className="mx-auto max-w-md"
        action={
          <Link
            href="/dashboard/collect/api"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Go to API keys
          </Link>
        }
      />
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
    <>
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
    </>
  );
}
