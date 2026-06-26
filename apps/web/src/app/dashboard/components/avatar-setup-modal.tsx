"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  AVATAR_PRESETS,
  AvatarPicker,
  avatarDataUri,
} from "@echo/ui/components/avatar-picker";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient, useSession } from "@/lib/auth-client";

const SKIP_KEY = "echo:avatar-skip";

export const AvatarSetupModal = (): React.ReactElement => {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(AVATAR_PRESETS[0].id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending || !session) return;
    const skipped = localStorage.getItem(SKIP_KEY);
    if (!session.user.image && !skipped) setOpen(true);
  }, [isPending, session]);

  const skip = (): void => {
    localStorage.setItem(SKIP_KEY, "1");
    setOpen(false);
  };

  const save = async (): Promise<void> => {
    const preset = AVATAR_PRESETS.find((p) => p.id === selected) ?? AVATAR_PRESETS[0];
    setSaving(true);
    const { error } = await authClient.updateUser({ image: avatarDataUri(preset) });
    setSaving(false);
    if (error) {
      toast.error("Could not save your avatar");
      return;
    }
    toast.success("Avatar saved");
    setOpen(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) skip();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-200 data-closed:opacity-0 data-open:opacity-100" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 text-center shadow-xl shadow-black/10 outline-none transition-all duration-200 data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100">
          <Dialog.Close
            aria-label="Skip"
            className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icons.cancelCircle className="size-5" />
          </Dialog.Close>

          <Dialog.Title className="text-lg font-semibold tracking-tight">
            Pick your avatar
          </Dialog.Title>
          <Dialog.Description className="mx-auto mt-1 mb-6 max-w-xs text-sm text-muted-foreground">
            Choose one to personalize your account. You can change it anytime in settings.
          </Dialog.Description>

          <AvatarPicker value={selected} onChange={setSelected} />

          <div className="mt-7 flex flex-col gap-2">
            <Button onClick={save} disabled={saving} className="h-10 w-full text-sm">
              {saving ? (
                <Icons.loading className="size-4 animate-spin" />
              ) : (
                "Use this avatar"
              )}
            </Button>
            <button
              type="button"
              onClick={skip}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip for now
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
