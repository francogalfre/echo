import type { Route } from "next";
import Link from "next/link";

export const UpgradeCard = (): React.ReactElement => (
  <div className="rounded-lg border border-border p-3">
    <p className="text-xs font-semibold text-foreground">Echo Pro</p>
    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
      Unlimited feedback, AI summaries, webhooks and priority support.
    </p>
    <Link
      href={"/dashboard/settings" as Route}
      className="mt-2 block text-xs font-medium text-primary hover:underline"
    >
      Upgrade →
    </Link>
  </div>
);
