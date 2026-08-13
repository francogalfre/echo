"use client";

import { Icons } from "@echo/ui/components/icons";
import { toast } from "@echo/ui/components/toast";
import Link from "next/link";
import type { Route } from "next";

type DocsHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  baseUrl?: string;
  docsHref?: Route;
};

export const DocsHeader = ({
  eyebrow,
  title,
  description,
  baseUrl,
  docsHref,
}: DocsHeaderProps): React.ReactElement => {
  const copy = (): void => {
    if (!baseUrl) return;
    void navigator.clipboard.writeText(baseUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <header className="mb-10 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="inline-block rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="mt-5 font-pixel text-3xl font-medium tracking-tight">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {docsHref ? (
          <Link
            href={docsHref}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            Full documentation
            <Icons.arrowRight className="size-3" />
          </Link>
        ) : null}
      </div>

      {baseUrl && (
        <div className="lg:max-w-md">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Base URL</p>
          <button
            type="button"
            onClick={copy}
            className="group flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-foreground/20"
          >
            <span className="min-w-0 flex-1 font-mono text-xs text-foreground">
              {baseUrl}
            </span>
            <Icons.copy className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
          </button>
        </div>
      )}
    </header>
  );
};
