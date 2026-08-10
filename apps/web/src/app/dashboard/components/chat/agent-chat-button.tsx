"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@echo/ui/components/tooltip";
import Image from "next/image";
import { useState } from "react";

import { useBillingOverview } from "../../hooks/use-billing-overview";
import { AgentChat } from "./agent-chat";
import { AGENT_PERSONAS } from "./agent-personas";

export function AgentChatButton(): React.ReactElement | null {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useBillingOverview();
  const isPro = state.status === "ready" && state.data.plan === "pro";
  const echo = AGENT_PERSONAS.echo;

  if (!isPro) return null;

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center overflow-hidden rounded-full border border-border bg-card shadow-lg transition-shadow hover:shadow-xl"
            />
          }
        >
          <Image src={echo.avatarImage} alt="" className="size-10 object-contain" />
          <span className="sr-only">Chat with Echo agent</span>
        </TooltipTrigger>
        <TooltipContent side="left">Chat with Echo</TooltipContent>
      </Tooltip>

      <AgentChat open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
