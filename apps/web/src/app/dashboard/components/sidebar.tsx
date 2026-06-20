"use client";

import {
  IconHome2,
  IconLayoutDashboard,
  IconLoader2,
  IconLogout,
  IconMessageCircle,
  IconRadar2,
  IconSettings,
} from "@tabler/icons-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient, signOut, useSession } from "@/lib/auth-client";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: IconHome2 },
  { label: "Feedback", href: "/dashboard/feedback", icon: IconMessageCircle },
  { label: "Collect", href: "/dashboard/collect", icon: IconRadar2 },
  { label: "Settings", href: "/dashboard/settings", icon: IconSettings },
];

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const Sidebar = (): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: orgsPending } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  useEffect(() => {
    if (!sessionPending && !session) {
      router.replace("/login");
    }
  }, [sessionPending, session, router]);

  useEffect(() => {
    if (!orgsPending && organizations && organizations.length === 0) {
      router.replace("/create-project" as Route);
    }
  }, [orgsPending, organizations, router]);

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.replace("/login");
  };

  const isActive = (href: string): boolean =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  if (sessionPending || orgsPending) {
    return (
      <aside className="flex w-56 shrink-0 items-center justify-center border-r border-border">
        <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
      </aside>
    );
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border">
      <div className="flex flex-col gap-0.5 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          {activeOrg?.logo ? (
            <img
              src={activeOrg.logo}
              alt=""
              className="size-6 shrink-0 rounded-md object-cover"
            />
          ) : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
              <IconLayoutDashboard className="size-3.5 text-muted-foreground" />
            </span>
          )}
          <span className="truncate text-sm font-medium">
            {activeOrg?.name ?? "Dashboard"}
          </span>
        </div>
      </div>

      <div className="h-px bg-border mx-3" />

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href as Route}
              className={[
                "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors duration-150",
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="h-px bg-border mx-3" />

      <div className="p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors duration-150 hover:bg-accent/60"
        >
          {session?.user.name ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {getInitials(session.user.name)}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {session?.user.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {session?.user.email}
            </p>
          </div>
          <IconLogout className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        </button>
      </div>
    </aside>
  );
};
