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
import Image from "next/image";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth-client";
import { initials } from "./utils";

type UserMenuProps = {
  session: { user: { name: string; email: string; image?: string | null } };
};

const UserAvatar = ({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}): React.ReactElement => {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={32}
        height={32}
        className="size-6 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
      {initials(name)}
    </span>
  );
};

export const UserMenu = ({ session }: UserMenuProps): React.ReactElement => {
  const router = useRouter();

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.replace("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 outline-none">
        <UserAvatar name={session.user.name} image={session.user.image} />
        <span className="flex-1 truncate text-left text-sm font-normal text-foreground">
          {session.user.name}
        </span>

        <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="px-2 py-2.5 mb-2 shadow-xs">
        <DropdownMenuItem
          className="text-sm transition-all duration-300"
          onClick={() => router.push("/dashboard/settings" as Route)}
        >
          <IconSettings className="size-5" />
          User settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="text-sm transition-all duration-300"
          variant="destructive"
          onClick={handleSignOut}
        >
          <IconLogout className="size-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
