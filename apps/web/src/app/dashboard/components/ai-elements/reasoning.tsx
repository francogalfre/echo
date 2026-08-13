"use client";

import { Diamond } from "@echo/ui/components/diamond";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createContext, useContext, useState } from "react";

type ReasoningContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isStreaming: boolean;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

function useReasoning(): ReasoningContextValue {
  const context = useContext(ReasoningContext);
  if (!context) throw new Error("useReasoning must be used within a Reasoning");
  return context;
}

type ReasoningProps = {
  children: React.ReactNode;
  isStreaming?: boolean;
  className?: string;
};

export function Reasoning({
  children,
  isStreaming = false,
  className,
}: ReasoningProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ReasoningContext.Provider value={{ isOpen, setIsOpen, isStreaming }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </ReasoningContext.Provider>
  );
}

type ReasoningTriggerProps = {
  className?: string;
};

export function ReasoningTrigger({ className }: ReasoningTriggerProps): React.ReactElement {
  const { isOpen, setIsOpen, isStreaming } = useReasoning();

  return (
    <button
      type="button"
      onClick={() => !isStreaming && setIsOpen(!isOpen)}
      className={cn(
        "group flex items-center gap-2 text-sm",
        isStreaming
          ? "text-muted-foreground"
          : "text-muted-foreground/60 hover:text-muted-foreground",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1 py-0.5 -ml-1",
        className,
      )}
    >
      {isStreaming ? (
        <Diamond className="size-4.5 text-muted-foreground" />
      ) : (
        <span className="size-2 rounded-full border border-current" />
      )}
      <span className="font-medium">
        {isStreaming ? "Thinking" : isOpen ? "Hide reasoning" : "Reasoning"}
      </span>
      {!isStreaming && (
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="ml-0.5 text-muted-foreground/60 group-hover:text-muted-foreground"
        >
          <path
            d="M2 4L5 7L8 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </button>
  );
}

type ReasoningContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function ReasoningContent({
  children,
  className,
}: ReasoningContentProps): React.ReactElement {
  const { isOpen } = useReasoning();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "text-xs leading-relaxed text-muted-foreground/50 pt-1 pl-1 border-l border-border/40 ml-1",
              className,
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
