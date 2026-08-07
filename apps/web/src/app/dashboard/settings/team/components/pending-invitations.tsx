"use client";

import { Badge } from "@echo/ui/components/badge";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { toast } from "@echo/ui/components/toast";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { siteConfig } from "@/utils/site";

import type { InviteMemberValues } from "../schemas";

export type PendingInvitation = {
  id: string;
  email: string;
  role: string;
  expiresAt: Date;
};

function roleLabel(role: string): string {
  return `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
}

function isExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() < Date.now();
}

type PendingInvitationRowProps = {
  invitation: PendingInvitation;
  onChange: () => void;
};

function PendingInvitationRow({
  invitation,
  onChange,
}: PendingInvitationRowProps): React.ReactElement {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const expired = isExpired(invitation.expiresAt);

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
    onChange();
  };

  const resendInvitation = async (): Promise<void> => {
    setIsResending(true);
    const { error } = await authClient.organization.inviteMember({
      email: invitation.email,
      role: invitation.role as InviteMemberValues["role"],
      resend: true,
    });
    setIsResending(false);

    if (error) {
      toast.error(error.message ?? "Could not resend the invitation.");
      return;
    }

    toast.success(`Invitation resent to ${invitation.email}`);
    onChange();
  };

  const copyInviteLink = (): void => {
    const link = `${siteConfig.url}/accept-invitation/${invitation.id}`;
    void navigator.clipboard.writeText(link);
    toast.success("Invite link copied");
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
            {expired ? (
              <Badge variant="outline" className="text-muted-foreground">
                <Icons.alertCircle />
                Expired
              </Badge>
            ) : (
              <Badge variant="outline">
                <Icons.clock />
                Pending
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Invited as {roleLabel(invitation.role)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={copyInviteLink}
            aria-label={`Copy invite link for ${invitation.email}`}
          >
            <Icons.copy className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={resendInvitation}
            disabled={isResending || isCancelling}
            aria-label={`Resend invitation to ${invitation.email}`}
          >
            {isResending ? (
              <Icons.loading className="size-4 animate-spin" />
            ) : (
              <Icons.refresh className="size-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={cancelInvitation}
            disabled={isCancelling || isResending}
            aria-label={`Cancel invitation to ${invitation.email}`}
          >
            {isCancelling ? (
              <Icons.loading className="size-4 animate-spin" />
            ) : (
              <Icons.x className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </StaggerItem>
  );
}

type PendingInvitationsProps = {
  invitations: readonly PendingInvitation[];
  onChange: () => void;
};

export function PendingInvitations({
  invitations,
  onChange,
}: PendingInvitationsProps): React.ReactElement | null {
  if (invitations.length === 0) return null;

  return (
    <Stagger className="flex flex-col gap-3">
      {invitations.map((invitation) => (
        <PendingInvitationRow
          key={invitation.id}
          invitation={invitation}
          onChange={onChange}
        />
      ))}
    </Stagger>
  );
}
