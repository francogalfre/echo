"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

import { ConfigPanel } from "./components/config-panel";
import { ConfigPanelSkeleton } from "./components/config-panel-skeleton";
import { PreviewPanel } from "./components/preview-panel";
import { PreviewPanelSkeleton } from "./components/preview-panel-skeleton";
import { DEFAULT_CONFIG, type ConfigValues } from "./components/types";

export default function FeedbackPage(): React.ReactElement {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const form = useForm<ConfigValues>({ mode: "onChange", defaultValues: DEFAULT_CONFIG });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const title = useWatch({
    control: form.control,
    name: "title",
    defaultValue: DEFAULT_CONFIG.title,
  });
  const description = useWatch({
    control: form.control,
    name: "description",
    defaultValue: DEFAULT_CONFIG.description,
  });
  const accentColor = useWatch({
    control: form.control,
    name: "accentColor",
    defaultValue: DEFAULT_CONFIG.accentColor,
  });
  const backgroundColor = useWatch({
    control: form.control,
    name: "backgroundColor",
    defaultValue: DEFAULT_CONFIG.backgroundColor,
  });
  const enableEmail = useWatch({
    control: form.control,
    name: "enableEmail",
    defaultValue: DEFAULT_CONFIG.enableEmail,
  });
  const enableRating = useWatch({
    control: form.control,
    name: "enableRating",
    defaultValue: DEFAULT_CONFIG.enableRating,
  });
  const enableCoverBanner = useWatch({
    control: form.control,
    name: "enableCoverBanner",
    defaultValue: DEFAULT_CONFIG.enableCoverBanner,
  });

  const preview = useMemo<ConfigValues>(
    () => ({
      title,
      description,
      accentColor,
      backgroundColor,
      enableEmail,
      enableRating,
      enableCoverBanner,
    }),
    [
      title,
      description,
      accentColor,
      backgroundColor,
      enableEmail,
      enableRating,
      enableCoverBanner,
    ],
  );

  const pageUrl = useMemo(
    () =>
      typeof window !== "undefined" && activeOrg?.slug
        ? `${window.location.origin}/feedback/${activeOrg.slug}`
        : null,
    [activeOrg?.slug],
  );

  useEffect(() => {
    trpc.feedbackPage.getConfig
      .query()
      .then((config) => {
        if (config) {
          form.reset({
            title: config.title,
            description: config.description,
            accentColor: config.accentColor,
            backgroundColor: config.backgroundColor,
            enableEmail: config.enableEmail,
            enableRating: config.enableRating,
            enableCoverBanner: config.enableCoverBanner,
          });
          setIsPublished(config.published);
        }
      })
      .catch(() => toast.error("Failed to load config"))
      .finally(() => setIsLoading(false));
  }, [form]);

  const validateAndSubmit = async (
    onSuccess: () => Promise<void>,
    errorMessage: string,
  ): Promise<void> => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error(errorMessage);
      return;
    }
    setIsSaving(true);
    try {
      await onSuccess();
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const save = async (): Promise<void> => {
    await validateAndSubmit(async () => {
      await trpc.feedbackPage.upsertConfig.mutate(form.getValues());
      toast.success("Changes saved");
    }, "Fix the errors before saving");
  };

  const publish = async (): Promise<void> => {
    await validateAndSubmit(async () => {
      await trpc.feedbackPage.upsertConfig.mutate(form.getValues());
      await trpc.feedbackPage.publish.mutate();
      setIsPublished(true);
      toast.success("Page published!");
    }, "Fix the errors before publishing");
  };

  const copyLink = (): void => {
    if (!pageUrl) return;
    void navigator.clipboard.writeText(pageUrl);
    toast.success("Link copied");
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="h-full w-[500px] shrink-0 overflow-y-auto border-r border-border">
        {isLoading ? (
          <ConfigPanelSkeleton />
        ) : (
          <ConfigPanel form={form} isPro={false} onSave={save} isSaving={isSaving} />
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/20 p-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold">Feedback page</h1>
              <p className="text-sm text-muted-foreground">Your public feedback form.</p>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="h-10 w-32 rounded-lg" />
              ) : isPublished ? (
                <>
                  <Button variant="outline" size="default" onClick={copyLink}>
                    <Icons.copy className="size-4" />
                    Copy link
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => pageUrl && window.open(pageUrl, "_blank")}
                  >
                    <Icons.externalLink className="size-4" />
                    Preview
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={publish}
                  disabled={isSaving}
                  className="flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ backgroundColor: preview.accentColor }}
                >
                  {isSaving ? <Icons.loading className="size-4 animate-spin" /> : null}
                  Publish page
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <PreviewPanelSkeleton />
          ) : (
            <PreviewPanel
              values={preview}
              orgLogo={activeOrg?.logo ?? null}
              orgSlug={activeOrg?.slug ?? ""}
            />
          )}
        </div>
      </div>
    </div>
  );
}
