import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

export type NotificationType = "feedback.received" | "plan.upgraded" | "member.joined";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  readAt: string | Date | null;
  createdAt: string | Date;
};

const NOTIFICATION_ICONS: Record<NotificationType, typeof Icons.message> = {
  "feedback.received": Icons.message,
  "plan.upgraded": Icons.aiMagic,
  "member.joined": Icons.user,
};

type NotificationRowProps = {
  item: NotificationItem;
};

export function NotificationRow({ item }: NotificationRowProps): React.ReactElement {
  const Icon = NOTIFICATION_ICONS[item.type];
  const unread = item.readAt === null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md px-3 py-2.5",
        unread && "bg-accent/5",
      )}
    >
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
    </div>
  );
}
