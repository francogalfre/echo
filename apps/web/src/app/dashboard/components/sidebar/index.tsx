"use client";

import imagotipo from "@echo/assets/imagotipo/dark.png";
import { Skeleton } from "@echo/ui/components/skeleton";
import { Icons } from "@echo/ui/components/icons";
import type { Route } from "next";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient, useSession } from "@/lib/auth-client";

import { ExpandableNavLink, NavLink } from "./nav-item";
import { OrgSwitcher } from "./org-switcher";
import type { NavItem } from "./types";
import { UpgradeCard } from "./upgrade-card";
import { UserMenu } from "./user-menu";

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Icons.home },
  { label: "Feedback", href: "/dashboard/feedback", icon: Icons.message },
];

const collectItem: NavItem = {
  label: "Collect",
  href: "/dashboard/collect",
  icon: Icons.radar,
};

const collectSubLinks = [
  { label: "Feedback page", href: "/dashboard/collect" },
  { label: "API", href: "/dashboard/collect/api" },
];

const utilityLinks: NavItem[] = [
  { label: "Support", href: "#", icon: Icons.help },
  { label: "Documentation", href: "https://docs.echo.dev", icon: Icons.book },
];

const settingsItem: NavItem = {
  label: "Settings",
  href: "/dashboard/settings",
  icon: Icons.slidersHorizontal,
};

export const Sidebar = (): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: orgsPending } = authClient.useListOrganizations();

  useEffect(() => {
    if (!sessionPending && !session) router.replace("/login");
  }, [sessionPending, session, router]);

  useEffect(() => {
    if (!orgsPending && organizations && organizations.length === 0) {
      router.replace("/create-project" as Route);
    }
  }, [orgsPending, organizations, router]);

  const isActive = (href: string): boolean =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex min-w-72 max-w-72 w-full shrink-0 flex-col border-r border-border px-2 bg-card">
      <div className="px-4 py-4">
        <Image src={imagotipo} alt="echo" className="h-6 w-auto" priority />
      </div>

      <div className="my-2 h-px bg-border" />

      <div className="px-2 pb-1">
        <OrgSwitcher />
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pt-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
        <ExpandableNavLink item={collectItem} subLinks={collectSubLinks} />
        <NavLink item={settingsItem} active={isActive(settingsItem.href)} />
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-0.5 p-2 pb-3">
        <UpgradeCard />

        <div className="mt-1 flex flex-col gap-0.5">
          {utilityLinks.map((item) => (
            <NavLink key={item.label} item={item} active={false} />
          ))}
        </div>

        <div className="my-2 h-px bg-border" />

        {sessionPending ? (
          <Skeleton className="h-8 w-full rounded-md" />
        ) : session ? (
          <UserMenu session={session} />
        ) : null}
      </div>
    </aside>
  );
};
