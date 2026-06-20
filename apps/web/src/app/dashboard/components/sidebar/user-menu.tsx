"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { IconChevronDown, IconLogout, IconSettings } from "@tabler/icons-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth-client";

import { initials } from "./utils";

type UserMenuProps = {
  session: { user: { name: string; email: string } };
};

export const UserMenu = ({ session }: UserMenuProps): React.ReactElement => {
  const router = useRouter();

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.replace("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 outline-none transition-colors hover:bg-accent/60">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
          {initials(session.user.name)}
        </span>
        <span className="flex-1 truncate text-left text-sm font-medium text-foreground">
          {session.user.name}
        </span>
        <IconChevronDown className="size-3 shrink-0 text-muted-foreground" />
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
