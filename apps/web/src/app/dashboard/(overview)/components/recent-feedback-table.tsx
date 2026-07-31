import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import Link from "next/link";

import type { OverviewRecentItem } from "@echo/api/services/dashboard-overview";

import { AccentAvatar } from "../../components/accent-avatar";
import { SentimentBadge, SourceBadge } from "../../components/feedback-badges";

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
          className="group flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>View all</span>
          <Icons.arrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 border-b border-border px-5 py-4 transition-colors duration-150 last:border-0 hover:bg-muted/30"
          >
            <AccentAvatar name={item.name} className="size-7 ring-1 ring-border" />
            <span className="w-32 shrink-0 truncate text-[13px] font-medium">
              {item.name}
            </span>
            <p className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
              {item.content}
            </p>
            <span className="flex shrink-0 items-center gap-2 max-sm:hidden">
              <SentimentBadge sentiment={item.sentiment} className="max-sm:hidden" />
              <SourceBadge source={item.source} className="max-sm:hidden" />
            </span>
            <span className="w-16 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
              {formatRelativeTime(item.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
