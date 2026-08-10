import { Button } from "@echo/ui/components/button";
import Image from "next/image";

import type { AgentPersona } from "./agent-personas";

type AgentChatEmptyStateProps = {
  readonly agent: AgentPersona;
  readonly questions: readonly string[];
  readonly disabled: boolean;
  readonly onSelect: (question: string) => void;
};

export function AgentChatEmptyState({
  agent,
  questions,
  disabled,
  onSelect,
}: AgentChatEmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <Image src={agent.avatarImage} alt="" className="h-24 w-auto" priority />
      <div className="max-w-xs space-y-1">
        <p className="text-sm font-medium text-foreground">Ask {agent.name} anything</p>
        <p className="text-xs text-muted-foreground">
          {agent.name} reads all your feedback and answers questions with real numbers.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((question) => (
          <Button
            key={question}
            variant="outline"
            size="sm"
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="rounded-full text-xs font-normal"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
