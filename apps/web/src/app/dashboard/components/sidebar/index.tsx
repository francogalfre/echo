"use client";

import isotipo from "@echo/assets/isotipo/accent.png";
import {
  IconBook,
  IconHelp,
  IconHome2,
  IconLoader2,
  IconMessageCircle,
  IconRadar2,
} from "@tabler/icons-react";
import type { Route } from "next";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient, useSession } from "@/lib/auth-client";

import { NavLink } from "./nav-item";
import { OrgSwitcher } from "./org-switcher";
import type { NavItem } from "./types";
import { UpgradeCard } from "./upgrade-card";
import { UserMenu } from "./user-menu";

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: IconHome2 },
  { label: "Feedback", href: "/dashboard/feedback", icon: IconMessageCircle },
  { label: "Collect", href: "/dashboard/collect", icon: IconRadar2 },
];

const utilityLinks: NavItem[] = [
  { label: "Support", href: "#", icon: IconHelp },
  { label: "Documentation", href: "https://docs.echo.dev", icon: IconBook },
];

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

  if (sessionPending || orgsPending) {
    return (
      <aside className="flex w-52 shrink-0 items-center justify-center border-r border-border">
        <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
      </aside>
    );
  }

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-border">
      <div className="px-4 py-3">
        <Image src={isotipo} alt="echo" className="h-6 w-auto" priority />
      </div>

      <div className="px-2 pb-1">
        <OrgSwitcher />
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pt-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-1 p-2 pb-3">
        <UpgradeCard />

        <div className="mt-1 flex flex-col gap-0.5">
          {utilityLinks.map((item) => (
            <NavLink key={item.label} item={item} active={false} />
          ))}
        </div>

        {session ? <UserMenu session={session} /> : null}
      </div>
    </aside>
  );
};
