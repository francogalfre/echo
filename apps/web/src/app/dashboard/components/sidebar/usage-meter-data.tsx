import { Skeleton } from "@echo/ui/components/skeleton";

import { createServerTrpc } from "@/lib/trpc-server";

import { UsageMeter } from "./usage-meter";

export async function UsageMeterData(): Promise<React.ReactElement | null> {
  const api = await createServerTrpc();
  const data = await api.billing.overview.query();

  return <UsageMeter initialData={data} />;
}

export function UsageMeterSkeleton(): React.ReactElement {
  return (
    <div className="px-2.5 py-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-14 rounded-sm" />
        <Skeleton className="h-3 w-10 rounded-sm" />
      </div>
      <Skeleton className="mt-1.5 h-1 w-full rounded-full" />
      <Skeleton className="mt-2 h-3 w-24 rounded-sm" />
    </div>
  );
}
