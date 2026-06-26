"use client";

import { Icons } from "@echo/ui/components/icons";
import { toast } from "sonner";

type DocsHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  baseUrl?: string;
};

export const DocsHeader = ({
  eyebrow,
  title,
  description,
  baseUrl,
}: DocsHeaderProps): React.ReactElement => {
  const copy = (): void => {
    if (!baseUrl) return;
    void navigator.clipboard.writeText(baseUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="inline-block rounded-full border border-border px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {baseUrl && (
        <div className="lg:w-80">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Base URL
          </p>
          <button
            type="button"
            onClick={copy}
            className="group flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-foreground/20"
          >
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
              {baseUrl}
            </span>
            <Icons.copy className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
          </button>
        </div>
      )}
    </header>
  );
};
