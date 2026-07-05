import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
import { Badge } from "@echo/ui/components/badge";
import type { BadgeVariantProps } from "@echo/ui/components/badge-variants";
import { formatRelativeTime } from "@echo/ui/lib/format";
import Link from "next/link";

import type { OverviewRecentItem } from "@echo/api/services/dashboard-overview";

const SENTIMENT_VARIANT: Record<string, NonNullable<BadgeVariantProps["variant"]>> = {
  positive: "success",
  negative: "destructive",
  neutral: "outline",
};

export function RecentFeedbackTable({
  items,
}: {
  items: OverviewRecentItem[];
}): React.ReactElement {
  return (
    <div className="overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-medium">Recent feedback</h2>
        <Link
          href="/dashboard/feedback"
          className="group text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>View all</span>{" "}
          <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
      <ul>
        {items.map((item) => {
          const sentiment = item.sentiment ?? "neutral";
          return (
            <li
              key={item.id}
              className="flex items-center gap-3.5 border-b border-border px-5 py-3 transition-colors last:border-0 hover:bg-muted/40"
            >
              <Avatar className="size-7">
                <AvatarFallback name={item.name} />
              </Avatar>
              <span className="w-32 shrink-0 truncate text-[13px] font-medium">
                {item.name}
              </span>
              <p className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
                {item.content}
              </p>
              <Badge
                dot
                variant={SENTIMENT_VARIANT[sentiment] ?? "outline"}
                className="capitalize max-sm:hidden"
              >
                {sentiment}
              </Badge>
              <Badge variant="outline" className="uppercase max-sm:hidden">
                {item.source}
              </Badge>
              <span className="w-16 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                {formatRelativeTime(item.createdAt)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
