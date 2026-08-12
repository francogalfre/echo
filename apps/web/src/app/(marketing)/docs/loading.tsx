import { Skeleton } from "@echo/ui/components/skeleton";

const DocsLoading = (): React.ReactElement => (
  <div className="docs-page-stack" aria-hidden="true">
    <div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-3 h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-full max-w-lg" />
    </div>
    <Skeleton className="h-40 w-full rounded-lg" />
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

export default DocsLoading;
