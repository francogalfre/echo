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
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
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
      <DialogContent className="max-w-md gap-7 overflow-hidden p-0">
        <div
          className="relative px-8 pt-8 pb-2"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 90% 60% at 30% 0%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 65%)",
            ].join(", "),
          }}
        >
          <DialogHeader className="gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Icons.sparkles className="size-5" />
            </span>
            <DialogTitle className="text-lg">Upgrade to Echo Pro</DialogTitle>
            <DialogDescription className="text-sm/relaxed">{reason}</DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold tabular-nums text-foreground">
              $12
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </div>

        <div className="px-8">
          <Stagger className="flex flex-col gap-3" stagger={0.05}>
            {BENEFITS.map((benefit) => (
              <StaggerItem key={benefit}>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icons.check className="size-2.5" />
                  </span>
                  {benefit}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <DialogFooter className="gap-3 border-t border-border px-8 py-6">
          <DialogClose render={<Button variant="outline" />}>Maybe later</DialogClose>
          <Button onClick={upgrade} disabled={loading}>
            {loading ? <Icons.loading className="size-4 animate-spin" /> : "Upgrade to Pro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
