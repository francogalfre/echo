"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { ColorPicker } from "./color-picker";
import type { ConfigValues } from "./types";

const maxTitleLength = 80;
const maxDescriptionLength = 150;

const Toggle = ({
  checked,
  onChange,
  locked = false,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}): React.ReactElement => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => !locked && onChange?.(!checked)}
    className={cn(
      "relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition-colors duration-200",
      checked ? "bg-foreground" : "bg-muted-foreground/20",
      locked || !onChange ? "cursor-default" : "cursor-pointer",
      locked && "opacity-35",
    )}
  >
    <span
      className={cn(
        "inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-1",
      )}
    />
  </button>
);

const ProBadge = (): React.ReactElement => (
  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
    PRO
  </span>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <h3 className="mb-4 text-sm font-semibold">{title}</h3>
    {children}
  </div>
);

const FieldRow = ({
  label,
  badge,
  toggle,
}: {
  label: string;
  badge?: React.ReactNode;
  toggle: React.ReactNode;
}): React.ReactElement => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-2">
      <span className="text-sm">{label}</span>
      {badge}
    </div>
    {toggle}
  </div>
);

export type ConfigPanelProps = {
  form: UseFormReturn<ConfigValues>;
  isPro: boolean;
  onSave: () => void;
  isSaving: boolean;
};

export const ConfigPanel = ({
  form,
  isPro,
  onSave,
  isSaving,
}: ConfigPanelProps): React.ReactElement => {
  const { register, setValue, control } = form;
  const { errors } = useFormState({ control });

  const title = useWatch({ control, name: "title", defaultValue: "" });
  const description = useWatch({ control, name: "description", defaultValue: "" });
  const accentColor = useWatch({ control, name: "accentColor", defaultValue: "#7C3AED" });
  const enableEmail = useWatch({ control, name: "enableEmail", defaultValue: false });
  const enableRating = useWatch({ control, name: "enableRating", defaultValue: false });
  const enableCoverBanner = useWatch({
    control,
    name: "enableCoverBanner",
    defaultValue: false,
  });

  const handleToggle = (field: keyof ConfigValues, value: boolean): void => {
    if (!isPro) {
      toast.info("Upgrade to Pro to unlock this field.");
      return;
    }
    setValue(field, value, { shouldDirty: true });
  };

  const inputBase =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none" +
    " transition-all duration-150 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring";

  const getCharacterCountClasses = (current: number, max: number): string =>
    cn(
      "text-xs tabular-nums",
      current > max ? "text-destructive" : "text-muted-foreground",
    );

  return (
    <div className="space-y-3 p-5">
      <Section title="Branding">
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs text-muted-foreground" htmlFor="cfg-title">
                Page title
              </label>
              <span className={getCharacterCountClasses(title.length, maxTitleLength)}>
                {title.length} / {maxTitleLength}
              </span>
            </div>
            <input
              id="cfg-title"
              maxLength={maxTitleLength}
              className={cn(
                inputBase,
                errors.title && "border-destructive focus:ring-destructive",
              )}
              placeholder="Share your feedback on…"
              {...register("title", {
                maxLength: {
                  value: maxTitleLength,
                  message: `Title must be ${maxTitleLength} characters or less`,
                },
              })}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs text-muted-foreground" htmlFor="cfg-desc">
                Description
              </label>
              <span
                className={getCharacterCountClasses(
                  description.length,
                  maxDescriptionLength,
                )}
              >
                {description.length} / {maxDescriptionLength}
              </span>
            </div>
            <textarea
              id="cfg-desc"
              rows={3}
              maxLength={maxDescriptionLength}
              className={cn(
                inputBase,
                "resize-none leading-relaxed",
                errors.description && "border-destructive focus:ring-destructive",
              )}
              placeholder="We read every note and use it to make things better…"
              {...register("description", {
                maxLength: {
                  value: maxDescriptionLength,
                  message: `Description must be ${maxDescriptionLength} characters or less`,
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Appearance">
        <div className="space-y-1">
          <div>
            <p className="mb-3 text-xs text-muted-foreground">Accent color</p>
            <div className="flex items-center gap-3">
              <ColorPicker
                value={accentColor}
                onChange={(color) => setValue("accentColor", color, { shouldDirty: true })}
              />
              <span className="font-mono text-sm text-muted-foreground">
                {accentColor.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="border-t border-border pt-1">
            <FieldRow
              label="Cover banner"
              badge={<ProBadge />}
              toggle={
                <Toggle
                  checked={enableCoverBanner}
                  onChange={(v) => handleToggle("enableCoverBanner", v)}
                  locked={!isPro}
                />
              }
            />
          </div>
        </div>
      </Section>

      <Section title="Fields">
        <div className="divide-y divide-border">
          <FieldRow label="Name" toggle={<Toggle checked={true} />} />
          <FieldRow label="Feedback" toggle={<Toggle checked={true} />} />
          <FieldRow
            label="Email"
            badge={<ProBadge />}
            toggle={
              <Toggle
                checked={enableEmail}
                onChange={(v) => handleToggle("enableEmail", v)}
                locked={!isPro}
              />
            }
          />
          <FieldRow
            label="Star rating"
            badge={<ProBadge />}
            toggle={
              <Toggle
                checked={enableRating}
                onChange={(v) => handleToggle("enableRating", v)}
                locked={!isPro}
              />
            }
          />
        </div>
      </Section>

      <div className="rounded-2xl border border-border bg-card p-5">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? <Icons.loading className="size-3.5 animate-spin" /> : null}
          Save changes
        </button>
      </div>
    </div>
  );
};
