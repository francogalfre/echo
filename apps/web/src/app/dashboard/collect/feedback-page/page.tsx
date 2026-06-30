"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useEffect, useState } from "react";
import { type PathValue, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

import { CanvasSkeleton } from "./components/canvas-skeleton";
import { ColorPicker } from "./components/color-picker";
import { EditorCanvas } from "./components/editor-canvas";
import { DEFAULT_CONFIG, type ConfigValues } from "./components/types";

const ToggleChip = ({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: (props: { className?: string }) => React.ReactElement;
  label: string;
}): React.ReactElement => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors",
      active
        ? "border-foreground/20 bg-muted text-foreground"
        : "border-border text-muted-foreground hover:text-foreground",
    )}
  >
    <Icon className="size-3.5" />
    {label}
  </button>
);

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
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-6 py-3">
        <div>
          <h1 className="text-sm font-semibold">Feedback page</h1>
          <p className="text-xs text-muted-foreground">
            Click the title, description or fields to edit them.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Accent color</span>
            <ColorPicker
              value={config.accentColor}
              onChange={(color) => setField("accentColor", color)}
            />
          </div>

          <div className="mx-1 h-5 w-px bg-border" />

          <ToggleChip
            active={config.enableCoverBanner}
            onClick={() => setField("enableCoverBanner", !config.enableCoverBanner)}
            icon={Icons.imageAdd}
            label="Banner"
          />
          <ToggleChip
            active={config.showFeedback}
            onClick={() => setField("showFeedback", !config.showFeedback)}
            icon={Icons.message}
            label="Feedback"
          />

          <div className="mx-1 h-5 w-px bg-border" />

          {isPublished ? (
            <>
              <Button variant="outline" onClick={copyLink}>
                <Icons.copy className="size-4" />
                Copy link
              </Button>
              <Button
                variant="outline"
                onClick={() => pageUrl && globalThis.open(pageUrl, "_blank")}
              >
                <Icons.externalLink className="size-4" />
                Preview
              </Button>
            </>
          ) : (
            <Button onClick={publish} disabled={isSaving || isLoading}>
              {isSaving ? <Icons.loading className="size-4 animate-spin" /> : null}
              Publish
            </Button>
          )}
          <Button variant="secondary" onClick={save} disabled={isSaving || isLoading}>
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {isLoading ? (
          <CanvasSkeleton />
        ) : (
          <EditorCanvas
            form={form}
            orgLogo={activeOrg?.logo ?? null}
            orgId={activeOrg?.id ?? ""}
          />
        )}
      </div>
    </div>
  );
}
