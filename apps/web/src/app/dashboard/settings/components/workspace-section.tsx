"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { SettingsCard } from "./settings-card";
import { SettingsRow } from "./settings-row";

export const WorkspaceSection = (): React.ReactElement => {
  const router = useRouter();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeOrg?.name) setName(activeOrg.name);
  }, [activeOrg?.name]);

  const save = async (): Promise<void> => {
    const trimmed = name.trim();
    if (!activeOrg || !trimmed || trimmed === activeOrg.name) return;

    setSaving(true);
    const { error } = await authClient.organization.update({
      organizationId: activeOrg.id,
      data: { name: trimmed },
    });
    setSaving(false);

    if (error) {
      toast.error(error.message ?? "Could not rename the workspace");
      return;
    }

    toast.success("Workspace renamed");
    router.refresh();
  };

  const unchanged = !activeOrg || name.trim() === activeOrg.name || !name.trim();

  return (
    <SettingsCard>
      <h2 className="text-sm font-semibold text-foreground">Workspace</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Rename this workspace. The slug stays fixed once created.
      </p>

      <div className="mt-6 divide-y divide-border/60">
        <SettingsRow
          label="Workspace name"
          htmlFor="workspace-name"
          description="Displayed across your dashboard."
        >
          <Input
            id="workspace-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!activeOrg}
            placeholder="Acme Feedback"
            className="max-w-sm"
          />
        </SettingsRow>

        <SettingsRow
          label="Slug"
          htmlFor="workspace-slug"
          description="Used in URLs and API requests."
        >
          <Input
            id="workspace-slug"
            value={activeOrg?.slug ?? ""}
            disabled
            readOnly
            className="max-w-sm"
          />
        </SettingsRow>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving || unchanged} className="h-9 text-sm">
          {saving ? <Icons.loading className="size-4 animate-spin" /> : "Save changes"}
        </Button>
      </div>
    </SettingsCard>
  );
};
