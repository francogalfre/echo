import { Button } from "@echo/ui/components/button";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";

import type { ConversationItem } from "../../hooks/use-chat-conversations";

type AgentChatHistoryProps = {
  conversations: readonly ConversationItem[];
  loading: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
};

function conversationLabel(item: ConversationItem): string {
  return item.title ?? item.createdAt.toLocaleDateString();
}

export function AgentChatHistory({
  conversations,
  loading,
  activeId,
  onSelect,
  onNewConversation,
}: AgentChatHistoryProps): React.ReactElement {
  return (
    <div className="flex h-[400px] flex-col overflow-y-auto p-3">
      <Button
        variant="ghost"
        size="sm"
        className="mb-2 justify-start text-muted-foreground"
        onClick={onNewConversation}
      >
        <Icons.circlePlus className="size-4" />
        New chat
      </Button>

      {loading && (
        <p className="px-2 py-6 text-center text-xs text-muted-foreground">
          Loading history…
        </p>
      )}

      {!loading && conversations.length === 0 && (
        <EmptyState
          icon={<Icons.clock />}
          title="No past conversations"
          description="Conversations with Echo will show up here."
        />
      )}

      <div className="flex flex-col gap-1">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left text-sm",
              "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeId === conversation.id && "bg-muted",
            )}
          >
            <span className="line-clamp-1 font-medium">
              {conversationLabel(conversation)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(conversation.lastMessageAt)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
