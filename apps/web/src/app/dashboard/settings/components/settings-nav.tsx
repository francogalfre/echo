"use client";

import { cn } from "@echo/ui/lib/utils";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SettingsNavItem = {
  label: string;
  href: Route;
};

const SETTINGS_NAV_ITEMS: readonly SettingsNavItem[] = [
  { label: "Account", href: "/dashboard/settings/account" },
  { label: "Team", href: "/dashboard/settings/team" },
  { label: "Billing", href: "/dashboard/settings/billing" },
];

export const SettingsNav = (): React.ReactElement => {
  const pathname = usePathname();

  return (
    <nav aria-label="Settings" className="flex gap-1 border-b border-border">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:opacity-0",
              "after:bg-foreground after:transition-opacity",
              isActive
                ? "text-foreground after:opacity-100"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
