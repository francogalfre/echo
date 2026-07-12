"use client";

import {
  AVATAR_PRESETS,
  AvatarPicker,
  avatarDataUri,
} from "@echo/ui/components/avatar-picker";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { useEffect, useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { authClient, useSession } from "@/lib/auth-client";

import { SettingsCard } from "../../components/settings-card";
import { SettingsRow } from "../../components/settings-row";

export const ProfileSection = (): React.ReactElement => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string>(AVATAR_PRESETS[0].id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user.name) setName(session.user.name);
  }, [session?.user.name]);

  const save = async (): Promise<void> => {
    const preset = AVATAR_PRESETS.find((p) => p.id === avatar) ?? AVATAR_PRESETS[0];
    setSaving(true);
    const { error } = await authClient.updateUser({
      name: name.trim() || undefined,
      image: avatarDataUri(preset),
    });
    setSaving(false);
    if (error) {
      toast.error("Could not update your profile");
      return;
    }
    toast.success("Profile updated");
  };

  return (
    <SettingsCard>
      <h2 className="text-sm font-semibold text-foreground">Profile</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Update your display name and how you appear across Echo.
      </p>

      <div className="mt-6 divide-y divide-border/60">
        <SettingsRow
          label="Display name"
          htmlFor="name"
          description="Shown on comments and activity."
        >
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="max-w-sm"
          />
        </SettingsRow>

        <SettingsRow
          label="Email"
          htmlFor="email"
          description="Used to sign in and receive updates."
        >
          <Input
            id="email"
            value={session?.user.email ?? ""}
            disabled
            readOnly
            className="max-w-sm"
          />
        </SettingsRow>

        <SettingsRow
          label="Avatar"
          description="Pick a color. This is how you appear across Echo."
        >
          <AvatarPicker value={avatar} onChange={setAvatar} />
        </SettingsRow>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} className="h-9 text-sm">
          {saving ? <Icons.loading className="size-4 animate-spin" /> : "Save changes"}
        </Button>
      </div>
    </SettingsCard>
  );
};
