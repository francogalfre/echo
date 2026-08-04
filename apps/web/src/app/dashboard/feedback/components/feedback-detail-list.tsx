import { Badge } from "@echo/ui/components/badge";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";

import { SentimentBadge, SourceBadge } from "@/app/dashboard/components/feedback-badges";

import type { FeedbackItem } from "../utils/map-feedback";
import { StarDisplay } from "./star-display";

type FeedbackDetailListProps = {
  item: FeedbackItem;
};

type DetailRowProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
};

function DetailRow({ icon: Icon, label, children }: DetailRowProps): React.ReactElement {
  return (
    <div className="flex min-h-10 items-center gap-4 rounded-xl px-3 transition-colors hover:bg-muted/50">
      <span className="flex w-28 shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

export function FeedbackDetailList({ item }: FeedbackDetailListProps): React.ReactElement {
  return (
    <div className="flex flex-col">
      <DetailRow icon={Icons.sparkles} label="Sentiment">
        <SentimentBadge sentiment={item.sentiment} />
      </DetailRow>

      <DetailRow icon={Icons.radar} label="Source">
        <SourceBadge source={item.source} />
      </DetailRow>

      {item.rating && (
        <DetailRow icon={Icons.star} label="Rating">
          <StarDisplay rating={item.rating} />
          <span className="text-sm tabular-nums text-muted-foreground">
            {item.rating.toFixed(1)}
          </span>
        </DetailRow>
      )}

      <DetailRow icon={Icons.clock} label="Submitted">
        <span className="text-sm tabular-nums text-foreground">
          {formatRelativeTime(item.createdAt)}
        </span>
      </DetailRow>

      {item.tags && item.tags.length > 0 && (
        <DetailRow icon={Icons.board} label="Tags">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </DetailRow>
      )}
    </div>
  );
}
