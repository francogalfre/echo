"use client";

import {
  AVATAR_PRESETS,
  AvatarPicker,
  avatarDataUri,
} from "@echo/ui/components/avatar-picker";
import { Button } from "@echo/ui/components/button";
import { Field } from "@echo/ui/components/field";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient, useSession } from "@/lib/auth-client";

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
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold">Profile</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Update your display name and avatar.
      </p>

      <div className="mt-6 grid gap-8 sm:grid-cols-[auto_minmax(0,1fr)]">
        <AvatarPicker value={avatar} onChange={setAvatar} />

        <div className="space-y-4">
          <Field name="name" label="Display name">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>
          <Field name="email" label="Email">
            <Input id="email" value={session?.user.email ?? ""} disabled readOnly />
          </Field>
          <Button onClick={save} disabled={saving} className="h-9 text-sm">
            {saving ? <Icons.loading className="size-4 animate-spin" /> : "Save changes"}
          </Button>
        </div>
      </div>
    </section>
  );
};
