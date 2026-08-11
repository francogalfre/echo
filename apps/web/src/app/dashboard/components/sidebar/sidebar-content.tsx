"use client";

import imagotipoDark from "@echo/assets/imagotipo/dark.png";
import imagotipoLight from "@echo/assets/imagotipo/light.png";
import { Skeleton } from "@echo/ui/components/skeleton";
import { Icons } from "@echo/ui/components/icons";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { authClient, useSession } from "@/lib/auth-client";

import { useRole } from "../../hooks/use-role";

import { ExpandableNavLink, NavLink } from "./nav-item";
import { OrgSwitcher } from "./org-switcher";
import type { NavItem } from "./types";
import { UserMenu } from "./user-menu";

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Icons.home },
  { label: "Feedback", href: "/dashboard/feedback", icon: Icons.message },
  { label: "Board", href: "/dashboard/board", icon: Icons.board },
];

const collectItem: NavItem = {
  label: "Collect",
  href: "/dashboard/collect",
  icon: Icons.radar,
};

const collectSubLinks = [
  { label: "Feedback page", href: "/dashboard/collect/feedback-page" },
  { label: "API", href: "/dashboard/collect/api" },
  { label: "Widget", href: "/dashboard/collect/widget" },
];

const utilityLinks: NavItem[] = [
  { label: "Support", href: "#", icon: Icons.help },
  { label: "Documentation", href: "/docs", icon: Icons.book },
];

const settingsItem: NavItem = {
  label: "Settings",
  href: "/dashboard/settings",
  icon: Icons.slidersHorizontal,
};

type SidebarContentProps = {
  usageMeterSlot: ReactNode;
  onNavigate?: () => void;
};

export const SidebarContent = ({
  usageMeterSlot,
  onNavigate,
}: SidebarContentProps): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: orgsPending } = authClient.useListOrganizations();
  const { isAdmin, isPending: rolePending } = useRole();

  useEffect(() => {
    if (!sessionPending && !session) router.replace("/login");
  }, [sessionPending, session, router]);

  useEffect(() => {
    if (!orgsPending && organizations && organizations.length === 0) {
      router.replace("/onboarding");
    }
  }, [orgsPending, organizations, router]);

  const isActive = (href: string): boolean =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-full min-h-0 flex-col px-3">
      <div className="flex h-14 items-center px-2">
        <Image
          src={imagotipoDark}
          alt="echo"
          className="h-5.5 w-auto dark:hidden"
          priority
        />

        <Image
          src={imagotipoLight}
          alt="echo"
          className="hidden h-5.5 w-auto dark:block"
          priority
        />
      </div>

      <div className="pb-2 pt-6">
        <OrgSwitcher />
      </div>

      <nav aria-label="Main" className="flex flex-col gap-0.5 pt-1">
        <p className="micro-label px-2.5 pb-1.5">Workspace</p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}
        {!rolePending && isAdmin ? (
          <ExpandableNavLink
            item={collectItem}
            subLinks={collectSubLinks}
            onNavigate={onNavigate}
          />
        ) : null}
        <NavLink
          item={settingsItem}
          active={isActive(settingsItem.href)}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-0.5 pb-3">
        {usageMeterSlot}

        <div className="mt-2 flex flex-col gap-0.5">
          {utilityLinks.map((item) => (
            <NavLink key={item.label} item={item} active={false} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="my-2 h-px bg-border" />

        {sessionPending ? (
          <Skeleton className="h-9 w-full rounded-lg" />
        ) : session ? (
          <UserMenu session={session} />
        ) : null}
      </div>
    </div>
  );
};
