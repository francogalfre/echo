"use client";

import Image from "next/image";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import type { ConfigValues } from "./types";

type PreviewPanelProps = {
  values: ConfigValues;
  orgLogo: string | null;
  orgSlug: string;
};

const PLACEHOLDER_DESC =
  "We read every note and use it to make things better. Tell us what's on your mind—any feedback helps us improve.";

const BrowserChrome = ({ slug }: { slug: string }): React.ReactElement => (
  <div className="rounded-t-2xl border border-border bg-muted/40 px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="flex shrink-0 gap-1.5">
        <span className="size-3 rounded-full bg-red-400/80" />
        <span className="size-3 rounded-full bg-yellow-400/80" />
        <span className="size-3 rounded-full bg-green-400/80" />
      </div>

      <div
        className="flex shrink-0 items-center gap-1"
        role="toolbar"
        aria-label="Browser navigation"
      >
        {[
          { icon: Icons.arrowLeft, label: "Back" },
          { icon: Icons.arrowRight, label: "Forward" },
          { icon: Icons.refresh, label: "Refresh" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            disabled
            aria-label={label}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground/40 cursor-not-allowed"
          >
            <Icon className="size-3.5" />
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-border/60 bg-background/70 px-3 py-1.5">
        <Icons.lock className="size-3 shrink-0 text-muted-foreground/50" />
        <span className="truncate font-mono text-xs text-muted-foreground/70">
          {slug ? `echo.dev/feedback/${slug}` : "echo.dev/feedback/your-project"}
        </span>
      </div>
    </div>
  </div>
);

const FormField = ({
  label,
  inputSize = "h-10",
}: {
  label: string;
  inputSize?: string;
}): React.ReactElement => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-foreground">
      {label}
    </label>
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-gray-50 dark:border-border dark:bg-muted/30",
        inputSize,
      )}
    />
  </div>
);

const FormPreview = ({
  values,
  orgLogo,
}: {
  values: ConfigValues;
  orgLogo: string | null;
}): React.ReactElement => (
  <div className="rounded-b-2xl border border-t-0 border-border bg-white px-10 py-8 dark:bg-card">
    {orgLogo && (
      <Image
        src={orgLogo}
        alt="Logo"
        width={40}
        height={40}
        className="mb-5 size-10 rounded-lg object-cover"
      />
    )}

    <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
      {values.title || "Share your feedback"}
    </h2>

    <p
      className={cn(
        "mt-1.5 break-words text-sm leading-relaxed",
        values.description
          ? "text-gray-500 dark:text-muted-foreground"
          : "text-gray-400 dark:text-muted-foreground/60",
      )}
    >
      {values.description || PLACEHOLDER_DESC}
    </p>

    <div className="mt-7 space-y-4">
      <FormField label="Name" />
      <FormField label="Your feedback" inputSize="h-24" />
      {values.enableEmail && <FormField label="Email" />}

      {values.enableRating && (
        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-foreground">
            Rating
          </legend>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="size-8 rounded-lg border border-gray-200 bg-gray-50 dark:border-border dark:bg-muted/30"
                role="presentation"
              />
            ))}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        className="mt-2 h-11 w-full rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: values.accentColor }}
      >
        Send feedback
      </button>

      <p className="text-center text-xs text-gray-400">Powered by echo</p>
    </div>
  </div>
);

export const PreviewPanel = ({
  values,
  orgLogo,
  orgSlug,
}: PreviewPanelProps): React.ReactElement => (
  <div className="overflow-hidden rounded-2xl border border-border">
    <BrowserChrome slug={orgSlug} />
    <FormPreview values={values} orgLogo={orgLogo} />
  </div>
);
