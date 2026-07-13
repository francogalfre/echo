"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@echo/ui/components/avatar";
import { Badge } from "@echo/ui/components/badge";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { cn } from "@echo/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { authClient } from "@/lib/auth-client";

import type { BillingOverviewData } from "../../../hooks/use-billing-overview";

const SKELETON_COUNT = 4;

type ProjectCardProps = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  isActive: boolean;
  isSwitching: boolean;
  plan?: string;
  onSwitch: (id: string) => void;
};

function planLabel(plan: string): string {
  return plan === "pro" ? "Pro" : "Free";
}

function ProjectCard({
  id,
  name,
  slug,
  logo,
  isActive,
  isSwitching,
  plan,
  onSwitch,
}: ProjectCardProps): React.ReactElement {
  return (
    <StaggerItem>
      <button
        type="button"
        onClick={() => onSwitch(id)}
        disabled={isActive || isSwitching}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl border border-border bg-card",
          "p-4 text-left transition-all duration-150",
          isActive
            ? "cursor-default"
            : "cursor-pointer hover:-translate-y-0.5 hover:border-foreground/15",
        )}
      >
        <Avatar className="size-9 shrink-0 rounded-lg">
          {logo ? <AvatarImage src={logo} alt={`${name} logo`} /> : null}
          <AvatarFallback name={name} className="rounded-lg text-sm" />
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{name}</p>
            {isActive ? (
              <Badge variant="success" dot>
                Active
              </Badge>
            ) : null}
            {plan ? (
              <Badge variant={plan === "pro" ? "accent" : "outline"}>
                {planLabel(plan)}
              </Badge>
            ) : null}
          </div>
          <p className="truncate font-mono text-xs text-muted-foreground">{slug}</p>
        </div>

        {!isActive ? (
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground",
              "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            {isSwitching ? (
              <Icons.loading className="size-3.5 animate-spin" />
            ) : (
              <>
                Switch
                <Icons.arrowRight className="size-3.5" />
              </>
            )}
          </span>
        ) : null}
      </button>
    </StaggerItem>
  );
}

function ProjectsListSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-[68px] rounded-xl" />
      ))}
    </div>
  );
}

type ProjectsListProps = {
  readonly initialData: BillingOverviewData;
};

export function ProjectsList({ initialData }: ProjectsListProps): React.ReactElement {
  const router = useRouter();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  if (isPending) {
    return <ProjectsListSkeleton />;
  }

  const switchProject = async (organizationId: string): Promise<void> => {
    if (organizationId === activeOrg?.id) return;

    setSwitchingId(organizationId);
    const { error } = await authClient.organization.setActive({ organizationId });
    setSwitchingId(null);

    if (error) {
      toast.error(error.message ?? "Could not switch project.");
      return;
    }

    toast.success("Switched project");
    router.refresh();
  };

  const activePlan = initialData.plan;

  return (
    <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {organizations?.map((org) => (
        <ProjectCard
          key={org.id}
          id={org.id}
          name={org.name}
          slug={org.slug}
          logo={org.logo}
          isActive={activeOrg?.id === org.id}
          isSwitching={switchingId === org.id}
          plan={activeOrg?.id === org.id ? activePlan : undefined}
          onSwitch={switchProject}
        />
      ))}
    </Stagger>
  );
}
