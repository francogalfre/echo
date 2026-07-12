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
import { toast } from "@echo/ui/components/toast";

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
      const { error } = await authClient.checkout({ slug: "pro" });
      if (error) throw new Error(error.message);
    } catch {
      toast.error("Could not start checkout — try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6 p-8">
        <DialogHeader className="gap-3">
          <Icons.sparkles className="size-5 text-accent" />
          <DialogTitle className="text-lg">Upgrade to Echo Pro</DialogTitle>
          <DialogDescription className="text-sm/relaxed">{reason}</DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-foreground">
              <Icons.check className="size-3.5 shrink-0 text-accent" />
              {benefit}
            </li>
          ))}
        </ul>

        <DialogFooter className="gap-3">
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
