import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
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
  return (
    <div className="border-t border-border p-4">
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about your feedback..."
          className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          rows={1}
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={!value.trim() || disabled}
          className="shrink-0"
        >
          <Icons.arrowRight className="size-4" />
        </Button>
      </form>
    </div>
  );
}
