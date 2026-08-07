"use client";

import { Button } from "@echo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@echo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";
import { toast } from "@echo/ui/components/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import type { MemberRole } from "./member-role";
import { RoleIcon } from "./role-icon";

const ROLE_ORDER: readonly MemberRole[] = ["owner", "admin", "member"];

function roleArticle(role: MemberRole): string {
  return role === "member" ? "a" : "an";
}

type ConfirmAction = "remove" | "leave" | null;

type MemberActionsProps = {
  organizationId: string;
  memberId: string;
  name: string;
  role: MemberRole;
  isCurrentUser: boolean;
  viewerRole: MemberRole;
  ownerCount: number;
};

export function MemberActions({
  organizationId,
  memberId,
  name,
  role,
  isCurrentUser,
  viewerRole,
  ownerCount,
}: MemberActionsProps): React.ReactElement | null {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const canManageOthers = viewerRole === "owner" || viewerRole === "admin";

  if (!canManageOthers && !isCurrentUser) {
    return null;
  }

  const isLastOwner = role === "owner" && ownerCount <= 1;
  const showRoleChange = canManageOthers && !isCurrentUser && !isLastOwner;
  const showRemove = canManageOthers && !isCurrentUser && !isLastOwner;
  const showLeave = isCurrentUser && !isLastOwner;

  if (!showRoleChange && !showRemove && !showLeave) {
    return null;
  }

  const changeRole = async (nextRole: MemberRole): Promise<void> => {
    setPending(true);
    const { error } = await authClient.organization.updateMemberRole({
      organizationId,
      memberId,
      role: nextRole,
    });
    setPending(false);

    if (error) {
      toast.error(
        error.message ?? `Could not make ${name} ${roleArticle(nextRole)} ${nextRole}`,
      );
      return;
    }

    toast.success(`${name} is now ${roleArticle(nextRole)} ${nextRole}`);
    router.refresh();
  };

  const removeMember = async (): Promise<void> => {
    setPending(true);
    const { error } = await authClient.organization.removeMember({
      organizationId,
      memberIdOrEmail: memberId,
    });
    setPending(false);
    setConfirmAction(null);

    if (error) {
      toast.error(error.message ?? `Could not remove ${name}`);
      return;
    }

    toast.success(`${name} removed from project`);
    router.refresh();
  };

  const leaveProject = async (): Promise<void> => {
    setPending(true);
    const { error } = await authClient.organization.leave({ organizationId });
    setPending(false);
    setConfirmAction(null);

    if (error) {
      toast.error(error.message ?? "Could not leave the project");
      return;
    }

    toast.success("You left the project");
    router.refresh();
  };

  const roleOptions = ROLE_ORDER.filter((candidate) => candidate !== role);

  const confirmCopy =
    confirmAction === "remove"
      ? {
          title: `Remove ${name}?`,
          description: `${name} will lose access to this project immediately. This action cannot be undone.`,
          cta: "Remove",
          onConfirm: removeMember,
        }
      : confirmAction === "leave"
        ? {
            title: "Leave this project?",
            description:
              "You will lose access to this project immediately. This action cannot be undone.",
            cta: "Leave",
            onConfirm: leaveProject,
          }
        : null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Actions for ${name}`}
          disabled={pending}
          className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground/70 transition-all duration-150 hover:scale-105 hover:bg-muted hover:text-foreground aria-expanded:scale-105 aria-expanded:bg-muted aria-expanded:text-foreground active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? (
            <Icons.loading className="size-4 animate-spin" />
          ) : (
            <Icons.moreHorizontal className="size-4" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showRoleChange
            ? roleOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => changeRole(option)}>
                  <RoleIcon role={option} className="size-4" />
                  Make {option}
                </DropdownMenuItem>
              ))
            : null}
          {showRoleChange && (showRemove || showLeave) ? <DropdownMenuSeparator /> : null}
          {showRemove ? (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmAction("remove")}
            >
              <Icons.trash className="size-4" />
              Remove from project
            </DropdownMenuItem>
          ) : null}
          {showLeave ? (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmAction("leave")}
            >
              <Icons.logout className="size-4" />
              Leave project
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={confirmCopy !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <DialogContent className="gap-6 p-8 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmCopy?.title}</DialogTitle>
            <DialogDescription>{confirmCopy?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={confirmCopy?.onConfirm}
            >
              {pending ? (
                <Icons.loading className="size-4 animate-spin" />
              ) : (
                confirmCopy?.cta
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
