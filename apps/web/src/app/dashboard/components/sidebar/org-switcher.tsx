"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Skeleton } from "@echo/ui/components/skeleton";
import { IconCheck, IconChevronDown, IconCirclePlus } from "@tabler/icons-react";
import type { Route } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

type OrgAvatarProps = { logo?: string | null; name?: string | null };

const OrgAvatar = ({ logo, name }: OrgAvatarProps): React.ReactElement => {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={`${name} project logo`}
        width={32}
        height={32}
        className="size-6 shrink-0 rounded-sm object-cover"
      />
    );
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-muted text-[8px] font-semibold text-muted-foreground">
      {name?.[0]?.toUpperCase() ?? "·"}
    </span>
  );
};

export const OrgSwitcher = (): React.ReactElement => {
  const router = useRouter();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  useEffect(() => {
    if (!activeOrg && organizations && organizations.length > 0) {
      authClient.organization.setActive({ organizationId: organizations[0].id });
    }
  }, [activeOrg, organizations]);

  if (isPending) {
    return <Skeleton className="h-8 w-full rounded-md" />;
  }

  const switchOrg = async (orgId: string): Promise<void> => {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-foreground/5">
        <OrgAvatar logo={activeOrg?.logo} name={activeOrg?.name} />
        <span className="flex-1 truncate text-left text-foreground">
          {activeOrg?.name ?? organizations?.[0]?.name ?? "Select"} project
        </span>
        <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="px-2 py-2.5 shadow-xs" side="bottom" align="start">
        {organizations?.map((org) => (
          <DropdownMenuItem
            className="text-sm transition-all duration-300"
            key={org.id}
            onClick={() => switchOrg(org.id)}
          >
            <OrgAvatar logo={org.logo} name={org.name} />
            <span className="flex-1 truncate">{org.name}</span>

            {activeOrg?.id === org.id ? (
              <IconCheck className="ml-auto size-3.5 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="text-sm transition-all duration-300"
          onClick={() => router.push("/create-project" as Route)}
        >
          <IconCirclePlus className="size-4 text-muted-foreground" />
          Add project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
