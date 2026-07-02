import { Icons } from "@echo/ui/components/icons";
import type { Route } from "next";
import Link from "next/link";

export const UpgradeCard = (): React.ReactElement => (
  <Link
    href={"/dashboard/settings" as Route}
    className="group block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent/40"
  >
    <div className="flex items-center gap-2">
      <Icons.aiMagic className="size-4 text-accent" />
      <p className="text-xs font-medium text-foreground">Echo Pro</p>
    </div>
    <p className="mt-1 text-xs/relaxed text-muted-foreground">
      Unlimited feedback, AI summaries and webhooks.
    </p>
    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">
      Upgrade
      <Icons.arrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
    </span>
  </Link>
);
