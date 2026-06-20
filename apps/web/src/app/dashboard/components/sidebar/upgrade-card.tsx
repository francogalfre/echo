import type { Route } from "next";
import Link from "next/link";

export const UpgradeCard = (): React.ReactElement => (
  <div className="rounded-lg border border-border p-4">
    <h3 className="text-sm font-medium text-foreground">Introducing echo plans</h3>
    <p className="mt-1 text-sm font-light leading-relaxed text-muted-foreground">
      Unlimited feedback, AI summaries and webhooks.
    </p>
    <Link
      href={"/dashboard/settings" as Route}
      className="mt-2 block w-fit text-sm font-medium text-accent hover:underline"
    >
      Upgrade
    </Link>
  </div>
);
