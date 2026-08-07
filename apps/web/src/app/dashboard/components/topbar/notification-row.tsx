import type { Route } from "next";
import Link from "next/link";

import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

import type { NotificationItem, NotificationType } from "@echo/api/types";

const NOTIFICATION_ICONS: Record<NotificationType, typeof Icons.message> = {
  "feedback.received": Icons.message,
  "plan.upgraded": Icons.aiMagic,
  "member.joined": Icons.user,
  "organization.created": Icons.sparkles,
};

type NotificationRowProps = {
  item: NotificationItem;
  onNavigate?: () => void;
};

export function NotificationRow({
  item,
  onNavigate,
}: NotificationRowProps): React.ReactElement {
  const Icon = NOTIFICATION_ICONS[item.type] ?? Icons.bell;
  const unread = item.readAt === null;

  const content = (
    <>
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-3.5">
        <Icon />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        {item.body ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.body}</p>
        ) : null}
        <p className="text-xs text-muted-foreground/70">
          {formatRelativeTime(item.createdAt)}
        </p>
      </div>
    </>
  );

  const className = cn(
    "flex items-start gap-3 rounded-md px-3 py-2.5",
    unread && "bg-accent/5",
  );

  if (item.link) {
    return (
      <Link
        href={item.link as Route}
        onClick={onNavigate}
        className={cn(className, "transition-colors hover:bg-muted/60")}
      >
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
