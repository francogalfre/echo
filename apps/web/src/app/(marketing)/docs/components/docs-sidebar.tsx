"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DOCS_GROUPS, DOCS_LINKS } from "./docs-nav";

export const DocsSidebar = (): React.ReactElement => {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs navigation" className="docs-sidebar-rail">
      <div className="relative hidden docs-sidebar-chips">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {DOCS_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = Icons[link.icon];

            return (
              <Link
                key={link.href}
                href={link.href as Route}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent"
        />
      </div>

      <div className="hidden docs-sidebar-groups">
        {DOCS_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {group.label}
            </p>
            <div className="mt-2 space-y-0.5">
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = Icons[link.icon];

                return (
                  <Link
                    key={link.href}
                    href={link.href as Route}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};
