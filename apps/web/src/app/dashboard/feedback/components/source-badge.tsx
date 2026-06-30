import { cn } from "@echo/ui/lib/utils";

type Props = { source: string };

const STYLES: Record<string, string> = {
  api: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
  widget: "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400",
  form: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
};

export function SourceBadge({ source }: Props): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        STYLES[source] ?? "bg-muted text-muted-foreground",
      )}
    >
      {source}
    </span>
  );
}
