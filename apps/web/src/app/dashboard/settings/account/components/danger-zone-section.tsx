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
import { Field } from "@echo/ui/components/field";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { authClient, signOut } from "@/lib/auth-client";

import { SettingsCard } from "../../components/settings-card";
import { SettingsRow } from "../../components/settings-row";

export const DangerZoneSection = (): React.ReactElement => {
  const router = useRouter();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true);
    await signOut();
    router.replace("/login");
  };

  const closeConfirm = (open: boolean): void => {
    setConfirmOpen(open);
    if (!open) setConfirmText("");
  };

  const deleteWorkspace = async (): Promise<void> => {
    if (!activeOrg) return;

    setDeleting(true);
    const { error } = await authClient.organization.delete({
      organizationId: activeOrg.id,
    });

    if (error) {
      setDeleting(false);
      toast.error(error.message ?? "Could not delete the workspace");
      return;
    }

    const { data: remainingOrganizations } = await authClient.organization.list({});
    const nextOrganization = remainingOrganizations?.[0];

    if (nextOrganization) {
      await authClient.organization.setActive({ organizationId: nextOrganization.id });
      router.replace("/dashboard");
      return;
    }

    await authClient.organization.setActive({ organizationId: null });
    router.replace("/onboarding");
  };

  const canDelete = Boolean(activeOrg) && confirmText.trim() === activeOrg?.name;

  return (
    <SettingsCard className="bg-destructive/[0.02] ring-destructive/20">
      <h2 className="text-sm font-medium text-destructive">Danger zone</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Irreversible actions for your account and workspace.
      </p>

      <div className="mt-6 divide-y divide-destructive/10">
        <SettingsRow label="Sign out" description="End your session on this device.">
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={signingOut}
            className="h-9 text-sm"
          >
            {signingOut ? <Icons.loading className="size-4 animate-spin" /> : "Sign out"}
          </Button>
        </SettingsRow>

        {activeOrg ? (
          <SettingsRow
            label="Delete workspace"
            description={`Permanently delete “${activeOrg.name}” and all of its feedback.`}
          >
            <Button
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
              className="h-9 text-sm"
            >
              <Icons.trash className="size-4" />
              Delete workspace
            </Button>
          </SettingsRow>
        ) : null}
      </div>

      <Dialog open={confirmOpen} onOpenChange={closeConfirm}>
        <DialogContent className="gap-6 p-8 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{activeOrg?.name}&rdquo;</DialogTitle>
            <DialogDescription>
              This permanently deletes the workspace and all of its feedback. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Field
            name="confirm-workspace-name"
            label={`Type "${activeOrg?.name}" to confirm`}
          >
            <Input
              id="confirm-workspace-name"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
            />
          </Field>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              disabled={!canDelete || deleting}
              onClick={deleteWorkspace}
            >
              {deleting ? (
                <Icons.loading className="size-4 animate-spin" />
              ) : (
                "Delete workspace"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsCard>
  );
};
