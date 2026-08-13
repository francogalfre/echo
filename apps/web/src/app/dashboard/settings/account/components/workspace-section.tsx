"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@echo/ui/components/avatar";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { authClient } from "@/lib/auth-client";
import { useLogoUpload } from "@/lib/project/use-logo-upload";

import { SettingsCard } from "../../components/settings-card";
import { SettingsRow } from "../../components/settings-row";

export const WorkspaceSection = (): React.ReactElement => {
  const router = useRouter();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const logo = useLogoUpload();
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (activeOrg?.name) setName(activeOrg.name);
  }, [activeOrg?.name]);

  const uploadLogo = async (file: File | undefined): Promise<void> => {
    if (!file || !activeOrg) return;

    logo.onChange(file);
    if (file.size > 1024 * 1024) return;

    setUploadingLogo(true);
    try {
      await logo.upload(activeOrg.id, file);
      toast.success("Logo updated");
      router.refresh();
    } catch {
      toast.error("Could not upload the logo");
    } finally {
      setUploadingLogo(false);
    }
  };

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
      <h2 className="text-sm font-medium text-foreground">Workspace</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Rename this workspace. The slug stays fixed once created.
      </p>

      <div className="mt-6 divide-y divide-border/60">
        <SettingsRow
          label="Logo"
          description="Shown in the sidebar and across your dashboard."
        >
          <div className="flex items-center gap-4">
            <Avatar className="size-12 rounded-xl">
              {(logo.preview ?? activeOrg?.logo) ? (
                <AvatarImage
                  src={logo.preview ?? activeOrg?.logo ?? undefined}
                  alt={`${activeOrg?.name ?? "Workspace"} logo`}
                />
              ) : null}
              <AvatarFallback
                name={activeOrg?.name ?? "·"}
                className="rounded-xl text-sm"
              />
            </Avatar>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => logo.fileInputRef.current?.click()}
                disabled={!activeOrg || uploadingLogo}
                className="h-9 text-sm"
              >
                {uploadingLogo ? (
                  <Icons.loading className="size-4 animate-spin" />
                ) : (
                  "Change logo"
                )}
              </Button>
              {logo.error ? (
                <p className="mt-1.5 text-xs text-destructive">{logo.error}</p>
              ) : null}
            </div>
            <input
              ref={logo.fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => uploadLogo(e.target.files?.[0])}
            />
          </div>
        </SettingsRow>

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
