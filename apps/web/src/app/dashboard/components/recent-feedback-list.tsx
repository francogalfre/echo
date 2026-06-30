import Link from "next/link";

import type { RecentItem } from "@echo/api/services/dashboard";

type Props = {
  items: RecentItem[];
};

const SENTIMENT_DOT: Record<string, string> = {
  positive: "bg-emerald-500",
  negative: "bg-red-500",
  neutral: "bg-gray-400",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(h / 24);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h`;
  return `${d}d`;
}

export function RecentFeedbackList({ items }: Props): React.ReactElement {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold">Recent feedback</h2>
        <Link
          href="/dashboard/feedback"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all →
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          No feedback yet.
        </p>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
            >
              <span
                className={`mt-0.5 size-2 shrink-0 rounded-full ${SENTIMENT_DOT[item.sentiment ?? ""] ?? "bg-muted-foreground/30"}`}
              />
              <span className="w-28 shrink-0 truncate text-sm font-medium">
                {item.name}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {item.content}
              </p>
              <span className="shrink-0 rounded-md border border-border px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                {item.source}
              </span>
              <span className="w-6 shrink-0 text-right text-xs text-muted-foreground">
                {timeAgo(item.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
