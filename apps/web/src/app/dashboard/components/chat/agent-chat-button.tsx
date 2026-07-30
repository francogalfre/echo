"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@echo/ui/components/tooltip";
import { useState } from "react";

import { AgentChat } from "./agent-chat";

export function AgentChatButton(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg transition-shadow hover:shadow-xl"
              size="icon"
            />
          }
        >
          <Icons.aiMagic className="size-6" />
          <span className="sr-only">Chat with Echo agent</span>
        </TooltipTrigger>
        <TooltipContent side="left">Chat with Echo</TooltipContent>
      </Tooltip>

      <AgentChat open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
