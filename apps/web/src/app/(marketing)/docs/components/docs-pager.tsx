"use client";

import { Icons } from "@echo/ui/components/icons";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DOCS_LINKS } from "./docs-nav";

export function DocsPager(): React.ReactElement | null {
  const pathname = usePathname();
  const index = DOCS_LINKS.findIndex((link) => link.href === pathname);
  if (index === -1) return null;

  const previous = DOCS_LINKS[index - 1];
  const next = DOCS_LINKS[index + 1];
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Docs pager"
      className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-6"
    >
      {previous ? (
        <Link
          href={previous.href as Route}
          className="group flex flex-col items-start gap-0.5"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icons.arrowLeft className="size-3" />
            Previous
          </span>
          <span className="text-sm font-medium text-foreground group-hover:underline">
            {previous.label}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={next.href as Route}
          className="group flex flex-col items-end gap-0.5 text-right"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next
            <Icons.arrowRight className="size-3" />
          </span>
          <span className="text-sm font-medium text-foreground group-hover:underline">
            {next.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
