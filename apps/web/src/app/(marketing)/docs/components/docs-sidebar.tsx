"use client";

import { cn } from "@echo/ui/lib/utils";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DocsLink = {
  href: string;
  label: string;
};

const LINKS: readonly DocsLink[] = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/getting-started", label: "Getting started" },
  { href: "/docs/api", label: "REST API" },
  { href: "/docs/widget", label: "Widget" },
];

export const DocsSidebar = (): React.ReactElement => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:w-48 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
      {LINKS.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href as Route}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
              isActive
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};
