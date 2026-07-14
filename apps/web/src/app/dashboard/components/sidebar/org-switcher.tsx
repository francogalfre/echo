"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@echo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { CreateProjectModal } from "../create-project-modal";

type OrgAvatarProps = { logo?: string | null; name?: string | null };

const OrgAvatar = ({ logo, name }: OrgAvatarProps): React.ReactElement => (
  <Avatar className="size-6 rounded-md">
    {logo ? <AvatarImage src={logo} alt={`${name} logo`} /> : null}
    <AvatarFallback name={name ?? "·"} className="rounded-md text-[9px]" />
  </Avatar>
);

export const OrgSwitcher = (): React.ReactElement => {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  useEffect(() => {
    if (!activeOrg && organizations && organizations.length > 0) {
      authClient.organization
        .setActive({ organizationId: organizations[0].id })
        .then(() => router.refresh());
    }
  }, [activeOrg, organizations, router]);

  if (isPending) {
    return <Skeleton className="h-8 w-full rounded-md" />;
  }

  const switchOrg = async (orgId: string): Promise<void> => {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  };

  return (
    <>
      <CreateProjectModal open={createOpen} onOpenChange={setCreateOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.75 text-sm outline-none transition-colors hover:border-border hover:bg-background data-popup-open:border-border data-popup-open:bg-background">
          <OrgAvatar logo={activeOrg?.logo} name={activeOrg?.name} />
          <span className="flex-1 truncate text-left text-foreground">
            {activeOrg?.name ?? organizations?.[0]?.name ?? "Select"}
          </span>
          <Icons.chevronDown className="size-3.5 shrink-0 text-muted-foreground/70" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="px-2 py-2.5 shadow-xs" side="bottom" align="start">
          {organizations?.map((org) => (
            <DropdownMenuItem
              className="text-sm transition-[background-color,color] duration-300"
              key={org.id}
              onClick={() => switchOrg(org.id)}
            >
              <OrgAvatar logo={org.logo} name={org.name} />
              <span className="flex-1 truncate">{org.name}</span>

              {activeOrg?.id === org.id ? (
                <Icons.check className="ml-auto size-3.5 text-accent" />
              ) : null}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem
            className="text-sm text-muted-foreground transition-[background-color,color] duration-300"
            onClick={() => setCreateOpen(true)}
          >
            <Icons.circlePlus className="size-4 text-muted-foreground" />
            Add project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
