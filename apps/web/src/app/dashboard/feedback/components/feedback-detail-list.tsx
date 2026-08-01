import { Badge } from "@echo/ui/components/badge";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";

import { SentimentBadge, SourceBadge } from "@/app/dashboard/components/feedback-badges";

import type { FeedbackItem } from "../utils/map-feedback";
import { StarDisplay } from "./star-display";

type FeedbackDetailListProps = {
  item: FeedbackItem;
};

type DetailFieldProps = {
  label: string;
  children: React.ReactNode;
};

function DetailField({ label, children }: DetailFieldProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5 text-sm text-foreground">
        {children}
      </div>
    </div>
  );
}

export function FeedbackDetailList({ item }: FeedbackDetailListProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Details
      </h3>

      <DetailField label="Sentiment">
        <SentimentBadge sentiment={item.sentiment} />
      </DetailField>

      <DetailField label="Source">
        <SourceBadge source={item.source} />
      </DetailField>

      {item.rating && (
        <DetailField label="Rating">
          <StarDisplay rating={item.rating} />
          <span className="tabular-nums text-muted-foreground">
            {item.rating.toFixed(1)}
          </span>
        </DetailField>
      )}

      <DetailField label="Submitted">
        <Icons.clock className="size-3.5 text-muted-foreground" />
        <span className="tabular-nums">{formatRelativeTime(item.createdAt)}</span>
      </DetailField>

      {item.tags && item.tags.length > 0 && (
        <DetailField label="Tags">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </DetailField>
      )}
    </div>
  );
}
