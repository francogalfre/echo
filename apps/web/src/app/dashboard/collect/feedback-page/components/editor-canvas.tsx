"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";
import { Rating } from "@echo/ui/components/reui/rating";
import { cn } from "@echo/ui/lib/utils";
import Image from "next/image";
import { type PathValue, useWatch, type UseFormReturn } from "react-hook-form";

import { BannerPicker } from "./banner-picker";
import { EditableText } from "./editable-text";
import { RecentFeedback, type FeedbackItem } from "./recent-feedback";
import { DEFAULT_CONFIG, type ConfigValues } from "./types";

type EditorCanvasProps = {
  form: UseFormReturn<ConfigValues>;
  orgLogo: string | null;
  orgId: string;
  recentFeedback: FeedbackItem[];
};

const ADDABLE_FIELD_META: Record<
  "enableEmail" | "enableRating",
  { icon: (props: { className?: string }) => React.ReactElement; description: string }
> = {
  enableEmail: {
    icon: Icons.mail,
    description: "Collect a way to follow up with users",
  },
  enableRating: {
    icon: Icons.star,
    description: "Let users rate their experience",
  },
};

const FauxField = ({
  label,
  placeholder,
  multiline = false,
  onRemove,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  onRemove?: () => void;
}): React.ReactElement => (
  <div className="group/field relative">
    <p className="mb-1.5 block text-sm font-medium text-foreground">{label}</p>
    <div
      className={cn(
        "flex rounded-lg border border-border bg-muted/40 px-3.5 text-sm text-muted-foreground/60",
        multiline ? "h-28 items-start py-2.5" : "h-11 items-center",
      )}
    >
      {placeholder}
    </div>
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="absolute top-0 right-0 text-muted-foreground/50 opacity-0 transition-opacity duration-150 group-hover/field:opacity-100 hover:text-foreground"
      >
        <Icons.cancelCircle className="size-4" />
      </button>
    )}
  </div>
);

export const EditorCanvas = ({
  form,
  orgLogo,
  orgId,
  recentFeedback,
}: EditorCanvasProps): React.ReactElement => {
  const { control, setValue } = form;
  const config = useWatch({ control, defaultValue: DEFAULT_CONFIG }) as ConfigValues;

  const setField = <FieldName extends keyof ConfigValues>(
    fieldName: FieldName,
    value: ConfigValues[FieldName],
  ): void => {
    setValue(fieldName, value as PathValue<ConfigValues, FieldName>, { shouldDirty: true });
  };

  const addField = (field: "enableEmail" | "enableRating"): void => {
    setField(field, true);
  };

  const accentColor = config.accentColor;
  const hasImage = config.coverBannerUrl.length > 0;

  const addableFields: { field: "enableEmail" | "enableRating"; label: string }[] = [];
  if (!config.enableEmail) addableFields.push({ field: "enableEmail", label: "Email" });
  if (!config.enableRating)
    addableFields.push({ field: "enableRating", label: "Star rating" });

  return (
    <div className="min-h-full w-full bg-background">
      {config.enableCoverBanner && (
        <div
          className="group/banner relative h-48 w-full sm:h-64"
          style={
            hasImage
              ? {
                  backgroundImage: `url("${config.coverBannerUrl}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { background: config.backgroundColor }
          }
        >
          <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-150 group-hover/banner:opacity-100">
            <BannerPicker
              organizationId={orgId}
              currentValue={config.backgroundColor}
              hasImage={hasImage}
              onSelectColor={(value) => {
                setField("backgroundColor", value);
                setField("coverBannerUrl", "");
              }}
              onUploaded={(url) => setField("coverBannerUrl", url)}
            />
          </div>
        </div>
      )}

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
              className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            />
            <EditableText
              value={config.description}
              onChange={(description) => setField("description", description)}
              placeholder="We read every note and use it to make things better. Tell us what's on your mind."
              ariaLabel="Page description"
              maxLength={150}
              className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base"
            />

            <div className="mt-10 space-y-6">
              <FauxField label="Name" placeholder="Your name" />
              <FauxField
                label="Your feedback"
                placeholder="Tell us what you think…"
                multiline
              />
              {config.enableEmail && (
                <FauxField
                  label="Email"
                  placeholder="you@example.com"
                  onRemove={() => setField("enableEmail", false)}
                />
              )}
              {config.enableRating && (
                <div className="group/field relative">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">
                    Rating
                  </span>
                  <Rating rating={4} accentColor={accentColor} size="lg" />
                  <button
                    type="button"
                    onClick={() => setField("enableRating", false)}
                    aria-label="Remove Rating"
                    className="absolute top-0 right-0 text-muted-foreground/50 opacity-0 transition-opacity duration-150 group-hover/field:opacity-100 hover:text-foreground"
                  >
                    <Icons.cancelCircle className="size-4" />
                  </button>
                </div>
              )}

              {addableFields.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="group flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground outline-none transition-[border-color,background-color,color] duration-150 hover:border-accent/40 hover:bg-accent/5 hover:text-accent aria-expanded:border-accent/40 aria-expanded:bg-accent/5 aria-expanded:text-accent">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-accent/10 group-aria-expanded:bg-accent/10">
                      <Icons.circlePlus className="size-3.5" />
                    </span>
                    Add a field
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-72">
                    {addableFields.map((addable) => {
                      const meta = ADDABLE_FIELD_META[addable.field];
                      return (
                        <DropdownMenuItem
                          key={addable.field}
                          onClick={() => addField(addable.field)}
                          className="gap-3 py-2.5"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <meta.icon className="size-4" />
                          </span>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {addable.label}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {meta.description}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <button
                type="button"
                className="mt-1 h-11 w-full rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Send feedback
              </button>
              <p className="text-center text-xs text-muted-foreground">Powered by echo</p>
            </div>
          </div>

          {config.showFeedback && (
            <RecentFeedback accentColor={accentColor} items={recentFeedback} />
          )}
        </div>
      </div>
    </div>
  );
};
