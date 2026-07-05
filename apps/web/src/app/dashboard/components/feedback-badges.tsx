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

export function SourceBadge({
  source,
  className,
}: {
  source: string;
  className?: string;
}): React.ReactElement {
  return (
    <Badge variant="outline" className={cn("uppercase", className)}>
      {source}
    </Badge>
  );
}
