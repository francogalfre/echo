"use client";

import { Badge } from "@echo/ui/components/badge";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { toast } from "@echo/ui/components/toast";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export type PendingInvitation = {
  id: string;
  email: string;
  role: string;
};

function roleLabel(role: string): string {
  return `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
}

type PendingInvitationRowProps = {
  invitation: PendingInvitation;
};

function PendingInvitationRow({
  invitation,
}: PendingInvitationRowProps): React.ReactElement {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelInvitation = async (): Promise<void> => {
    setIsCancelling(true);
    const { error } = await authClient.organization.cancelInvitation({
      invitationId: invitation.id,
    });
    setIsCancelling(false);

    if (error) {
      toast.error(error.message ?? "Could not cancel the invitation.");
      return;
    }

    toast.success(`Invitation to ${invitation.email} canceled`);
  };

  return (
    <StaggerItem>
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icons.mail className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {invitation.email}
            </p>
            <Badge variant="outline">
              <Icons.clock />
              Pending
            </Badge>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Invited as {roleLabel(invitation.role)}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={cancelInvitation}
          disabled={isCancelling}
          aria-label={`Cancel invitation to ${invitation.email}`}
        >
          {isCancelling ? (
            <Icons.loading className="size-4 animate-spin" />
          ) : (
            <Icons.x className="size-4" />
          )}
        </Button>
      </div>
    </StaggerItem>
  );
}

type PendingInvitationsProps = {
  invitations: readonly PendingInvitation[];
};

export function PendingInvitations({
  invitations,
}: PendingInvitationsProps): React.ReactElement | null {
  if (invitations.length === 0) return null;

  return (
    <Stagger className="flex flex-col gap-3">
      {invitations.map((invitation) => (
        <PendingInvitationRow key={invitation.id} invitation={invitation} />
      ))}
    </Stagger>
  );
}
