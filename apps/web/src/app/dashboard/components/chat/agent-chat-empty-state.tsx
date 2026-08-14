import codingCharacter from "@echo/assets/character/coding.webp";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

import type { AgentPersona } from "./agent-personas";

type AgentChatEmptyStateProps = {
  readonly agent: AgentPersona;
  readonly questions: readonly string[];
  readonly disabled: boolean;
  readonly onSelect: (question: string) => void;
};

function SuggestionChip({
  text,
  onClick,
  disabled,
  className,
}: {
  text: string;
  onClick: () => void;
  disabled: boolean;
  className?: string;
}): React.ReactElement {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border/80",
        "bg-background px-3.5 py-2 text-xs font-medium text-foreground",
        "transition-colors duration-200",
        "hover:border-accent/30 hover:bg-accent/5 hover:text-accent",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {text}
    </motion.button>
  );
}

export function AgentChatEmptyState({
  agent,
  questions,
  disabled,
  onSelect,
}: AgentChatEmptyStateProps): React.ReactElement {
  const firstRow = questions.slice(0, 2);
  const secondRow = questions.slice(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute -inset-5 rounded-full bg-accent/5 blur-2xl" />
        <Image
          src={codingCharacter}
          alt=""
          className="relative h-36 w-auto drop-shadow-sm"
          sizes="150px"
          priority
        />
      </motion.div>

      <div className="max-w-md space-y-2">
        <p className="font-pixel text-sm font-medium tracking-wide text-foreground">
          Ask {agent.name} anything
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{agent.description}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-2">
          {firstRow.map((question) => (
            <SuggestionChip
              key={question}
              text={question}
              onClick={() => onSelect(question)}
              disabled={disabled}
            />
          ))}
        </div>
        {secondRow.length > 0 && (
          <div className="flex justify-center gap-2">
            {secondRow.map((question) => (
              <SuggestionChip
                key={question}
                text={question}
                onClick={() => onSelect(question)}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
