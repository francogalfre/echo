"use client";

import { useEffect, useState } from "react";
import { type PathValue, useForm, useWatch } from "react-hook-form";
import { toast } from "@echo/ui/components/toast";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

import { CanvasSkeleton } from "./components/canvas-skeleton";
import { EditorCanvas } from "./components/editor-canvas";
import { EditorDock } from "./components/editor-dock";
import { DEFAULT_CONFIG, type ConfigValues } from "./components/types";

export default function FeedbackPage(): React.ReactElement {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const form = useForm<ConfigValues>({ mode: "onChange", defaultValues: DEFAULT_CONFIG });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const config = useWatch({
    control: form.control,
    defaultValue: DEFAULT_CONFIG,
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

  useEffect(() => {
    trpc.feedbackPage.getConfig
      .query()
      .then((loaded) => {
        if (loaded) {
          form.reset({
            ...DEFAULT_CONFIG,
            title: loaded.title,
            description: loaded.description,
            accentColor: loaded.accentColor,
            backgroundColor: loaded.backgroundColor,
            enableEmail: loaded.enableEmail,
            enableRating: loaded.enableRating,
            enableCoverBanner: loaded.enableCoverBanner,
            coverBannerUrl: loaded.coverBannerUrl ?? "",
            showFeedback: loaded.showFeedback,
          });
          setIsPublished(loaded.published);
        }
      })
      .catch(() => toast.error("Failed to load config"))
      .finally(() => setIsLoading(false));
  }, [form]);

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
    <div className="h-full overflow-x-hidden overflow-y-auto">
      {isLoading ? (
        <CanvasSkeleton />
      ) : (
        <EditorCanvas
          form={form}
          orgLogo={activeOrg?.logo ?? null}
          orgId={activeOrg?.id ?? ""}
        />
      )}

      <EditorDock
        accentColor={config.accentColor}
        onAccentColorChange={(color) => setField("accentColor", color)}
        bannerEnabled={config.enableCoverBanner}
        onToggleBanner={() => setField("enableCoverBanner", !config.enableCoverBanner)}
        feedbackPanelEnabled={config.showFeedback}
        onToggleFeedbackPanel={() => setField("showFeedback", !config.showFeedback)}
        isPublished={isPublished}
        isSaving={isSaving}
        isLoading={isLoading}
        onCopyLink={copyLink}
        onPreview={() => pageUrl && globalThis.open(pageUrl, "_blank")}
        onSave={save}
        onPublish={publish}
      />
    </div>
  );
}
