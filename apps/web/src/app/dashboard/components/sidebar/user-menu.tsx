"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";
import type { Route } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth-client";
import { initials } from "./utils";

type UserMenuProps = {
  session: { user: { name: string; email: string; image?: string | null } };
};

type AvatarProps = {
  name: string;
  image?: string | null;
  size: "sm" | "lg";
};

const UserAvatar = ({ name, image, size }: AvatarProps): React.ReactElement => {
  const dimension = size === "lg" ? 40 : 24;
  const box = size === "lg" ? "size-9 text-xs" : "size-5 text-[9px]";

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={dimension}
        height={dimension}
        unoptimized={image.startsWith("data:")}
        className={
          size === "lg"
            ? "size-9 shrink-0 rounded-full object-cover"
            : "size-6 shrink-0 rounded-full object-cover"
        }
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground ${box}`}
    >
      {initials(name)}
    </span>
  );
};

export const UserMenu = ({ session }: UserMenuProps): React.ReactElement => {
  const router = useRouter();
  const { name, email, image } = session.user;

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.replace("/login");
  };

  const go = (href: string): void => router.push(href as Route);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 outline-none transition-colors hover:bg-foreground/5">
        <UserAvatar name={name} image={image} size="sm" />
        <span className="flex-1 truncate text-left text-sm font-normal text-foreground">
          {name}
        </span>
        <Icons.chevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="mb-2 w-64 p-0 shadow-md">
        <div className="flex items-center gap-3 border-b border-border px-3 py-3">
          <UserAvatar name={name} image={image} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="p-1.5">
          <DropdownMenuItem
            className="text-sm transition-colors"
            onClick={() => go("/dashboard/settings")}
          >
            <Icons.user className="size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-sm transition-colors"
            onClick={() => go("/dashboard/settings")}
          >
            <Icons.creditCard className="size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-sm transition-colors"
            onClick={() => go("/dashboard/settings")}
          >
            <Icons.settings className="size-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5" />

          <DropdownMenuItem
            className="text-sm transition-colors"
            variant="destructive"
            onClick={handleSignOut}
          >
            <Icons.logout className="size-4" />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
