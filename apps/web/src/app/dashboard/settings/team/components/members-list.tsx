"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@echo/ui/components/avatar";
import { Badge } from "@echo/ui/components/badge";
import type { BadgeVariantProps } from "@echo/ui/components/badge-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { Skeleton } from "@echo/ui/components/skeleton";

import { authClient } from "@/lib/auth-client";

import { PendingInvitations } from "./pending-invitations";

const SKELETON_COUNT = 4;

type MemberRole = "owner" | "admin" | "member";

function roleBadgeVariant(role: MemberRole): NonNullable<BadgeVariantProps["variant"]> {
  if (role === "owner") return "accent";
  if (role === "admin") return "default";
  return "outline";
}

function roleLabel(role: MemberRole): string {
  return `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
}

function MembersListSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-[68px] rounded-xl" />
      ))}
    </div>
  );
}

function MembersEmptyState(): React.ReactElement {
  return (
    <EmptyState
      icon={<Icons.user />}
      title="No members found"
      description="Invite teammates with the button above to start collaborating."
    />
  );
}

type MemberRowProps = {
  name: string;
  email: string;
  image?: string;
  role: MemberRole;
  isCurrentUser: boolean;
};

function MemberRow({
  name,
  email,
  image,
  role,
  isCurrentUser,
}: MemberRowProps): React.ReactElement {
  return (
    <StaggerItem>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <Avatar className="size-9 shrink-0">
          {image ? <AvatarImage src={image} alt={`${name} avatar`} /> : null}
          <AvatarFallback name={name} />
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{name}</p>
            {isCurrentUser ? <Badge variant="outline">You</Badge> : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>

        <Badge variant={roleBadgeVariant(role)} className="shrink-0">
          {roleLabel(role)}
        </Badge>
      </div>
    </StaggerItem>
  );
}

export function MembersList(): React.ReactElement {
  const { data: activeOrg, isPending } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();

  if (isPending) {
    return <MembersListSkeleton />;
  }

  const members = activeOrg?.members ?? [];
  const pendingInvitations = (activeOrg?.invitations ?? [])
    .filter((invitation) => invitation.status === "pending")
    .map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
    }));

  if (members.length === 0 && pendingInvitations.length === 0) {
    return <MembersEmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Stagger className="flex flex-col gap-3">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            name={member.user.name}
            email={member.user.email}
            image={member.user.image}
            role={member.role}
            isCurrentUser={session?.user.id === member.userId}
          />
        ))}
      </Stagger>
      <PendingInvitations invitations={pendingInvitations} />
    </div>
  );
}
