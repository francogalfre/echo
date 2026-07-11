"use client";

import { Button } from "@echo/ui/components/button";
import { Field } from "@echo/ui/components/field";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { SettingsCard } from "./settings-card";

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
    <SettingsCard className="h-fit">
      <h2 className="text-sm font-semibold text-foreground">Workspace</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Rename this workspace. The slug stays fixed once created.
      </p>

      <div className="mt-6 space-y-4">
        <Field name="workspace-name" label="Workspace name">
          <Input
            id="workspace-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!activeOrg}
            placeholder="Acme Feedback"
          />
        </Field>
        <Field name="workspace-slug" label="Slug" hint="Used in URLs and API requests.">
          <Input id="workspace-slug" value={activeOrg?.slug ?? ""} disabled readOnly />
        </Field>
        <Button onClick={save} disabled={saving || unchanged} className="h-9 text-sm">
          {saving ? <Icons.loading className="size-4 animate-spin" /> : "Save changes"}
        </Button>
      </div>
    </SettingsCard>
  );
};
