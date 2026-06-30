import { cn } from "@echo/ui/lib/utils";

type Props = { sentiment: string | null };

const STYLES: Record<string, string> = {
  positive: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  negative: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  neutral: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  none: "bg-muted text-muted-foreground",
};

export function SentimentBadge({ sentiment }: Props): React.ReactElement | null {
  if (!sentiment) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        STYLES[sentiment] ?? STYLES.none,
      )}
    >
      {sentiment}
    </span>
  );
}
