import { Badge } from "@echo/ui/components/badge";
import type { BadgeVariantProps } from "@echo/ui/components/badge-variants";
import { cn } from "@echo/ui/lib/utils";

const SENTIMENT_VARIANT: Record<string, NonNullable<BadgeVariantProps["variant"]>> = {
  positive: "success",
  negative: "destructive",
  neutral: "outline",
};

export function SentimentBadge({
  sentiment,
  className,
}: {
  sentiment: string | null;
  className?: string;
}): React.ReactElement {
  const value = sentiment ?? "neutral";

  return (
    <Badge
      dot
      variant={SENTIMENT_VARIANT[value] ?? "outline"}
      className={cn("capitalize", className)}
    >
      {value}
    </Badge>
  );
}

const SOURCE_DOT: Record<string, string> = {
  api: "bg-info",
  form: "bg-accent",
  widget: "bg-warning",
};

export function SourceBadge({
  source,
  className,
}: {
  source: string;
  className?: string;
}): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 text-[11px] font-medium capitalize text-foreground/80",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          SOURCE_DOT[source] ?? "bg-muted-foreground",
        )}
      />
      {source}
    </span>
  );
}
