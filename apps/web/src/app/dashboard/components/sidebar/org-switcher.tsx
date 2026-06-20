"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
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
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0 rounded-sm object-cover"
      />
    );
  }
  return (
    <span className="flex size-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[8px] font-semibold text-muted-foreground">
      {name?.[0]?.toUpperCase() ?? "·"}
    </span>
  );
};

export const OrgSwitcher = (): React.ReactElement => {
  const router = useRouter();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  useEffect(() => {
    if (!activeOrg && organizations && organizations.length > 0) {
      authClient.organization.setActive({ organizationId: organizations[0].id });
    }
  }, [activeOrg, organizations]);

  const switchOrg = async (orgId: string): Promise<void> => {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent/60">
        <OrgAvatar logo={activeOrg?.logo} name={activeOrg?.name} />
        <span className="flex-1 truncate text-left font-medium text-foreground">
          {activeOrg?.name ?? organizations?.[0]?.name ?? "Select project"}
        </span>
        <IconChevronDown className="size-3 shrink-0 text-muted-foreground" />
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
