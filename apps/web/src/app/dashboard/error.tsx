"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";

type Props = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

const DashboardError = ({ reset }: Props): React.ReactElement => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-card px-5 py-16 text-center ring-1 ring-foreground/10">
      <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icons.alertCircle className="size-5" />
      </span>
      <div>
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn&apos;t load your dashboard. Please try again.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
};

export default DashboardError;
