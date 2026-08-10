import {
  DrawerHeader as ChatDrawerHeader,
  DrawerTitle as ChatDrawerTitle,
} from "@echo/ui/components/drawer";
import Image from "next/image";

import type { ChatUsageState } from "../../hooks/use-chat-usage";
import type { AgentPersona } from "./agent-personas";

type AgentChatHeaderProps = {
  readonly agent: AgentPersona;
  readonly usage: ChatUsageState;
};

export function AgentChatHeader({
  agent,
  usage,
}: AgentChatHeaderProps): React.ReactElement {
  return (
    <ChatDrawerHeader className="border-b border-border py-4 pl-6 pr-14">
      <div className="flex items-center gap-3">
        <span className="relative flex h-10 w-9 shrink-0 overflow-hidden">
          <Image
            src={agent.avatarImage}
            alt="Echo character"
            fill
            className="object-contain"
          />
        </span>
        <div>
          <ChatDrawerTitle className="font-pixel">{agent.name}</ChatDrawerTitle>
          <p className="text-xs text-muted-foreground">
            {usage.status === "ready"
              ? `${usage.data.used}/${usage.data.limit} messages this week`
              : agent.role}
          </p>
        </div>
      </div>
    </ChatDrawerHeader>
  );
}
