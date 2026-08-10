import { Button } from "@echo/ui/components/button";
import {
  DrawerHeader as ChatDrawerHeader,
  DrawerTitle as ChatDrawerTitle,
} from "@echo/ui/components/drawer";
import { Icons } from "@echo/ui/components/icons";
import Image from "next/image";

import type { ChatUsageState } from "../../hooks/use-chat-usage";
import type { AgentPersona } from "./agent-personas";

type AgentChatHeaderProps = {
  readonly agent: AgentPersona;
  readonly usage: ChatUsageState;
  readonly onOpenHistory: () => void;
};

export function AgentChatHeader({
  agent,
  usage,
  onOpenHistory,
}: AgentChatHeaderProps): React.ReactElement {
  return (
    <ChatDrawerHeader className="border-b border-border py-4 pl-6 pr-14">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image src={agent.avatarImage} alt="" fill className="object-cover" />
          </span>
          <div>
            <ChatDrawerTitle>{agent.name}</ChatDrawerTitle>
            <p className="text-xs text-muted-foreground">
              {usage.status === "ready"
                ? `${usage.data.used}/${usage.data.limit} messages today`
                : agent.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenHistory}
          aria-label="Chat history"
        >
          <Icons.clock className="size-4" />
        </Button>
      </div>
    </ChatDrawerHeader>
  );
}
