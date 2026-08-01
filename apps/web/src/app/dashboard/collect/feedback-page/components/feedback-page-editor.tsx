"use client";

import { useState } from "react";
import { type PathValue, useForm, useWatch } from "react-hook-form";
import { toast } from "@echo/ui/components/toast";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

import { EditorCanvas } from "./editor-canvas";
import { EditorDock } from "./editor-dock";
import type { FeedbackItem } from "./recent-feedback";
import { DEFAULT_CONFIG, type ConfigValues } from "./types";

type InitialConfig = Awaited<ReturnType<typeof trpc.feedbackPage.getConfig.query>>;

function buildDefaultValues(config: InitialConfig): ConfigValues {
  if (!config) return DEFAULT_CONFIG;
  return {
    ...DEFAULT_CONFIG,
    title: config.title,
    description: config.description,
    accentColor: config.accentColor,
    backgroundColor: config.backgroundColor,
    enableEmail: config.enableEmail,
    enableRating: config.enableRating,
    enableCoverBanner: config.enableCoverBanner,
    coverBannerUrl: config.coverBannerUrl ?? "",
    showFeedback: config.showFeedback,
  };
}

type FeedbackPageEditorProps = {
  readonly initialConfig: InitialConfig;
  readonly initialRecentFeedback: FeedbackItem[];
};

export function FeedbackPageEditor({
  initialConfig,
  initialRecentFeedback,
}: FeedbackPageEditorProps): React.ReactElement {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const defaultValues = buildDefaultValues(initialConfig);
  const form = useForm<ConfigValues>({ mode: "onChange", defaultValues });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(initialConfig?.published ?? false);

  const config = useWatch({
    control: form.control,
    defaultValue: defaultValues,
  }) as ConfigValues;

  const setField = <FieldName extends keyof ConfigValues>(
    fieldName: FieldName,
    value: ConfigValues[FieldName],
  ): void => {
    form.setValue(fieldName, value as PathValue<ConfigValues, FieldName>, {
      shouldDirty: true,
    });
  };

  const pageUrl =
    typeof globalThis.window !== "undefined" && activeOrg?.slug
      ? `${globalThis.location.origin}/feedback/${activeOrg.slug}`
      : null;

  const save = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await trpc.feedbackPage.upsertConfig.mutate(form.getValues());
      toast.success("Changes saved");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const publish = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await trpc.feedbackPage.upsertConfig.mutate(form.getValues());
      await trpc.feedbackPage.publish.mutate();
      setIsPublished(true);
      toast.success("Page published!");
    } catch {
      toast.error("Failed to publish");
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = (): void => {
    if (!pageUrl) return;
    void navigator.clipboard.writeText(pageUrl);
    toast.success("Link copied");
  };

  return (
    <>
      <EditorCanvas
        form={form}
        orgLogo={activeOrg?.logo ?? null}
        orgId={activeOrg?.id ?? ""}
        recentFeedback={initialRecentFeedback}
      />

      <EditorDock
        accentColor={config.accentColor}
        onAccentColorChange={(color) => setField("accentColor", color)}
        bannerEnabled={config.enableCoverBanner}
        onToggleBanner={() => setField("enableCoverBanner", !config.enableCoverBanner)}
        feedbackPanelEnabled={config.showFeedback}
        onToggleFeedbackPanel={() => setField("showFeedback", !config.showFeedback)}
        isPublished={isPublished}
        isSaving={isSaving}
        onCopyLink={copyLink}
        onPreview={() => pageUrl && globalThis.open(pageUrl, "_blank")}
        onSave={save}
        onPublish={publish}
      />
    </>
  );
}
