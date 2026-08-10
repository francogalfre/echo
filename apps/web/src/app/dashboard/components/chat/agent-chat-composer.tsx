"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import type { RefObject } from "react";

type AgentChatComposerProps = {
  readonly value: string;
  readonly inputRef: RefObject<HTMLTextAreaElement | null>;
  readonly disabled: boolean;
  readonly onChange: (value: string) => void;
  readonly onSubmit: (event: React.FormEvent) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function AgentChatComposer({
  value,
  inputRef,
  disabled,
  onChange,
  onSubmit,
  onKeyDown,
}: AgentChatComposerProps): React.ReactElement {
  const hasValue = value.trim().length > 0;

  return (
    <div className="border-t border-border p-4">
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about your feedback..."
            className={cn(
              "w-full resize-none rounded-2xl border bg-background",
              "px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30",
              "transition-all duration-300",
              "disabled:opacity-60",
              disabled ? "border-border/60" : "border-border/80",
            )}
            rows={1}
            disabled={disabled}
          />
          {/* Subtle gradient glow when focused */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
        </div>

        <motion.div
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button
            type="submit"
            size="icon"
            disabled={!hasValue || disabled}
            className={cn(
              "shrink-0 rounded-2xl size-12 transition-all duration-300",
              "bg-accent text-accent-foreground hover:bg-accent-deep",
              "disabled:opacity-30 disabled:bg-muted disabled:text-muted-foreground",
              "shadow-sm hover:shadow-md mb-2",
            )}
          >
            <Icons.arrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
