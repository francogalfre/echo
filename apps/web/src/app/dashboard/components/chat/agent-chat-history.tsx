import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
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
        variant="outline"
        size="sm"
        className="mb-2 justify-start"
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
        <p className="px-2 py-6 text-center text-xs text-muted-foreground">
          No past conversations yet.
        </p>
      )}

      <div className="flex flex-col gap-1">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left text-sm",
              "transition-colors hover:bg-muted",
              activeId === conversation.id && "bg-muted",
            )}
          >
            <span className="line-clamp-1 font-medium">
              {conversationLabel(conversation)}
            </span>
            <span className="text-xs text-muted-foreground">
              {conversation.lastMessageAt.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
