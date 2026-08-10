"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@echo/ui/components/tooltip";
import echoGreetings from "@echo/assets/character/greetings.webp";
import Image from "next/image";
import { useState } from "react";

import { useBillingOverview } from "../../hooks/use-billing-overview";
import { AgentChat } from "./agent-chat";

export function AgentChatButton(): React.ReactElement | null {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useBillingOverview();
  const isPro = state.status === "ready" && state.data.plan === "pro";

  if (!isPro) return null;

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 z-50 flex size-16 items-center justify-center overflow-hidden rounded-full border border-border bg-card transition-all duration-300 hover:scale-105  hover:border-accent/30 active:scale-95"
            />
          }
        >
          <Image src={echoGreetings} alt="" className="size-12 object-contain" />
          <span className="sr-only">Chat with Echo agent</span>
        </TooltipTrigger>
        <TooltipContent side="left">Chat with Echo</TooltipContent>
      </Tooltip>

      <AgentChat open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
