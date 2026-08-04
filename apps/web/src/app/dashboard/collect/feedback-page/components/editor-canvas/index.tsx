"use client";

import Image from "next/image";
import { type PathValue, useWatch, type UseFormReturn } from "react-hook-form";

import { cn } from "@echo/ui/lib/utils";

import { EditableText } from "../editable-text";
import { RecentFeedback, type FeedbackItem } from "../recent-feedback";
import type { ConfigValues } from "../types";
import type { AddableField } from "./add-field-menu";
import { EditorBanner } from "./editor-banner";
import { EditorFormPreview } from "./editor-form-preview";

type EditorCanvasProps = {
  form: UseFormReturn<ConfigValues>;
  orgLogo: string | null;
  orgId: string;
  recentFeedback: FeedbackItem[];
};

export const EditorCanvas = ({
  form,
  orgLogo,
  orgId,
  recentFeedback,
}: EditorCanvasProps): React.ReactElement => {
  const { control, setValue } = form;
  const config = useWatch({ control }) as ConfigValues;

  const setField = <FieldName extends keyof ConfigValues>(
    fieldName: FieldName,
    value: ConfigValues[FieldName],
  ): void => {
    setValue(fieldName, value as PathValue<ConfigValues, FieldName>, { shouldDirty: true });
  };

  const accentColor = config.accentColor;
  const hasImage = config.coverBannerUrl.length > 0;

  const addableFields: { field: AddableField; label: string }[] = [];
  if (!config.enableEmail) addableFields.push({ field: "enableEmail", label: "Email" });
  if (!config.enableRating)
    addableFields.push({ field: "enableRating", label: "Star rating" });

  return (
    <div className="min-h-full w-full bg-background">
      <EditorBanner
        config={config}
        orgId={orgId}
        hasImage={hasImage}
        onSelectColor={(value) => {
          setField("backgroundColor", value);
          setField("coverBannerUrl", "");
        }}
        onUploaded={(url) => setField("coverBannerUrl", url)}
      />

      <div
        className={cn(
          "relative z-10 mx-auto px-6 pb-32",
          config.showFeedback ? "max-w-5xl" : "max-w-2xl",
        )}
      >
        <div
          className={cn(
            config.showFeedback &&
              "grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]",
          )}
        >
          <div className={cn(config.showFeedback && "lg:sticky lg:top-12")}>
            {orgLogo && (
              <Image
                src={orgLogo}
                alt="Logo"
                width={96}
                height={96}
                unoptimized={orgLogo.startsWith("data:")}
                className={cn(
                  "relative z-10 size-16 rounded-2xl object-cover sm:size-20",
                  config.enableCoverBanner ? "-mt-8 sm:-mt-10" : "mt-14",
                )}
              />
            )}

            <EditableText
              value={config.title}
              onChange={(title) => setField("title", title)}
              placeholder="Share your feedback"
              ariaLabel="Page title"
              maxLength={80}
              className="mt-4 font-pixel text-2xl font-normal tracking-tight text-foreground sm:text-3xl"
            />
            <EditableText
              value={config.description}
              onChange={(description) => setField("description", description)}
              placeholder="We read every note and use it to make things better. Tell us what's on your mind."
              ariaLabel="Page description"
              maxLength={150}
              className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base"
            />

            <EditorFormPreview
              config={config}
              accentColor={accentColor}
              addableFields={addableFields}
              onRemoveField={(field) => setField(field, false)}
              onAddField={(field) => setField(field, true)}
            />
          </div>

          {config.showFeedback && (
            <RecentFeedback accentColor={accentColor} items={recentFeedback} />
          )}
        </div>
      </div>
    </div>
  );
};
