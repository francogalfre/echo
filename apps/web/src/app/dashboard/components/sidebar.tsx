"use client";

import isotipo from "@echo/assets/isotipo/accent.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import {
  IconBolt,
  IconBook,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCirclePlus,
  IconHelp,
  IconHome2,
  IconLoader2,
  IconLogout,
  IconMessageCircle,
  IconRadar2,
  IconSettings,
} from "@tabler/icons-react";
import type { Route } from "next";
import Image from "next/image";
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
];

const initials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

type OrgAvatarProps = { logo?: string | null; name?: string | null };

const OrgAvatar = ({ logo, name }: OrgAvatarProps): React.ReactElement => {
  if (logo) {
    return <img src={logo} alt="" className="size-5 shrink-0 rounded-md object-cover" />;
  }
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[9px] font-semibold text-muted-foreground">
      {name?.[0]?.toUpperCase() ?? "·"}
    </span>
  );
};

const OrgSwitcher = (): React.ReactElement => {
  const router = useRouter();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const switchOrg = async (orgId: string): Promise<void> => {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent/60">
        <OrgAvatar logo={activeOrg?.logo} name={activeOrg?.name} />
        <span className="flex-1 truncate text-left font-medium">
          {activeOrg?.name ?? "Select project"}
        </span>
        <IconChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        {organizations?.map((org) => (
          <DropdownMenuItem key={org.id} onClick={() => switchOrg(org.id)}>
            <OrgAvatar logo={org.logo} name={org.name} />
            <span className="flex-1 truncate">{org.name}</span>
            {activeOrg?.id === org.id ? (
              <IconCheck className="ml-auto size-3.5 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/create-project" as Route)}>
          <IconCirclePlus className="size-4 text-muted-foreground" />
          Add project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UpgradeCard = (): React.ReactElement => (
  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
    <div className="flex items-start gap-2">
      <IconBolt className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">Upgrade to Pro</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
          Unlock unlimited feedback, advanced analytics and priority support.
        </p>
        <Link
          href={"/dashboard/settings" as Route}
          className="mt-2 inline-flex text-[11px] font-medium text-primary hover:underline"
        >
          Upgrade →
        </Link>
      </div>
    </div>
  </div>
);

type NavLinkProps = { item: NavItem; active: boolean };

const NavLink = ({
  item: { label, href, icon: Icon },
  active,
}: NavLinkProps): React.ReactElement => (
  <Link
    href={href as Route}
    className={[
      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
      "transition-colors duration-150",
      active
        ? "bg-accent/60 text-foreground"
        : "text-muted-foreground hover:text-foreground",
    ].join(" ")}
  >
    <Icon
      className={[
        "size-5 shrink-0 transition-colors duration-150",
        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
      ].join(" ")}
    />
    {label}
  </Link>
);

type UserMenuProps = {
  session: { user: { name: string; email: string } };
};

const UserMenu = ({ session }: UserMenuProps): React.ReactElement => {
  const router = useRouter();

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.replace("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 outline-none transition-colors hover:bg-accent/60">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {initials(session.user.name)}
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-xs font-semibold text-foreground">
            {session.user.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{session.user.email}</p>
        </div>
        <IconChevronUp className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start">
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings" as Route)}>
          <IconSettings className="size-4" />
          User settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <IconLogout className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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

  if (sessionPending || orgsPending) {
    return (
      <aside className="flex w-60 shrink-0 items-center justify-center border-r border-border">
        <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
      </aside>
    );
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border">
      <div className="px-5 py-4">
        <Image src={isotipo} alt="echo" className="h-7 w-auto" priority />
      </div>

      <div className="h-px bg-border" />

      <div className="p-2">
        <OrgSwitcher />
      </div>

      <div className="h-px bg-border" />

      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="flex flex-col gap-2 p-3">
        <UpgradeCard />

        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconHelp className="size-5 shrink-0" />
            Support
          </button>
          <Link
            href="https://docs.echo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconBook className="size-5 shrink-0" />
            Documentation
          </Link>
        </div>

        <div className="h-px bg-border" />

        {session ? <UserMenu session={session} /> : null}
      </div>
    </aside>
  );
};
