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
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type UpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
};

const BENEFITS = [
  "5 projects",
  "Unlimited feedback",
  "10 AI summaries/day",
  "50 AI insights/day",
  "Remove branding",
];

export function UpgradeDialog({
  open,
  onOpenChange,
  reason,
}: UpgradeDialogProps): React.ReactElement {
  const [loading, setLoading] = useState(false);

  const upgrade = async (): Promise<void> => {
    setLoading(true);
    try {
      await authClient.checkout({ slug: "pro" });
    } catch {
      toast.error("Could not start checkout — try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <span className="flex size-8 items-center justify-center rounded-full bg-accent/10">
            <Icons.sparkles className="size-4 text-accent" />
          </span>
          <DialogTitle className="mt-2 text-base">Upgrade to Echo Pro</DialogTitle>
          <DialogDescription>{reason}</DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-1.5">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
              <Icons.check className="size-3.5 shrink-0 text-accent" />
              {benefit}
            </li>
          ))}
        </ul>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Maybe later</DialogClose>
          <Button onClick={upgrade} disabled={loading}>
            {loading ? (
              <Icons.loading className="size-4 animate-spin" />
            ) : (
              "Upgrade — $12/month"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
