"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { formatRelativeTime } from "@echo/ui/lib/format";
import Image from "next/image";

import { AGENT_PERSONAS } from "../../chat/agent-personas";

type AnalysisHeaderProps = {
  onClose: () => void;
  feedbackCount?: number;
  generatedAt?: Date;
  canRegenerate?: boolean;
  isGenerating: boolean;
  onRegenerate: () => void;
};

export function AnalysisHeader({
  onClose,
  feedbackCount,
  generatedAt,
  canRegenerate,
  isGenerating,
  onRegenerate,
}: AnalysisHeaderProps): React.ReactElement {
  const echo = AGENT_PERSONAS.echo;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
      <div className="flex items-center gap-3">
        <Image
          src={echo.avatarImage}
          alt={echo.name}
          className="h-11 w-auto shrink-0 object-contain"
          priority
        />
        <div>
          <h2 className="font-pixel text-xl font-medium tracking-tight text-foreground">
            Feedback analysis
          </h2>
          {feedbackCount !== undefined && generatedAt && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {feedbackCount} feedbacks · {formatRelativeTime(generatedAt.toISOString())}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {canRegenerate !== undefined && (
          <Button
            variant="default"
            size="lg"
            onClick={onRegenerate}
            disabled={isGenerating || !canRegenerate}
            title={canRegenerate ? undefined : "Regenerate isn't available right now"}
          >
            {isGenerating ? (
              <Icons.loading className="size-3.5 animate-spin" />
            ) : (
              <Icons.refresh className="size-3.5" />
            )}
            {isGenerating ? "Regenerating…" : "Regenerate"}
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
          <Icons.x className="size-4" />
        </Button>
      </div>
    </div>
  );
}
