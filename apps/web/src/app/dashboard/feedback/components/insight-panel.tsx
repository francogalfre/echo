"use client";

import { useEffect, useRef } from "react";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { cn } from "@echo/ui/lib/utils";

import type { FeedbackItem } from "../utils/map-feedback";
import { useFeedbackInsight } from "../hooks/use-feedback-insight";
import { AiThinking } from "../../components/ai-thinking";
import { ErrorCard } from "../../components/error-card";
import { UpgradeDialog } from "../../components/upgrade-dialog";
import { InsightContent } from "./insight-content";
import { AGENT_PERSONAS } from "../../components/agent-personas";

const THINKING_PHRASES = [
  "Reading your feedback",
  "Finding patterns",
  "Writing the summary",
] as const;

type InsightPanelProps = {
  item: FeedbackItem;
  active: boolean;
};

export function InsightPanel({ item, active }: InsightPanelProps): React.ReactElement {
  const { state, generate, reset, upgradeReason, dismissUpgrade } = useFeedbackInsight();
  const requestedIdRef = useRef<string | null>(null);
  const agent = AGENT_PERSONAS.echo;

  useEffect(() => {
    if (!active) {
      requestedIdRef.current = null;
      reset();
      return;
    }
    if (requestedIdRef.current === item.id) return;
    requestedIdRef.current = item.id;
    reset();
    if (item.hasInsight) {
      void generate(item.id);
    }
  }, [active, item, generate, reset]);

  const isLoading =
    state.status === "loading" || (item.hasInsight && state.status === "idle");

  return (
    <div className="flex flex-col gap-3.5 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg",
            agent.bgColor,
          )}
        >
          <agent.icon className={cn("size-3.5", agent.color)} />
        </span>
        <div>
          <p className="text-sm font-medium">{agent.name}</p>
          <p className="text-xs text-muted-foreground">{agent.role}</p>
        </div>
      </div>

      {isLoading && (
        <AiThinking phrases={THINKING_PHRASES}>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
            <Skeleton className="h-3 w-3/5 rounded" />
          </div>
        </AiThinking>
      )}

      {state.status === "ready" && <InsightContent insight={state.insight} agent={agent} />}

      {state.status === "error" && (
        <ErrorCard
          message="We couldn't generate this insight. Please try again."
          onRetry={() => void generate(item.id)}
        />
      )}

      {!item.hasInsight && state.status === "idle" && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border/80 bg-background/50 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Generate a quick AI summary of what this feedback means.
          </p>
          <Button size="sm" onClick={() => void generate(item.id)}>
            <Icons.aiMagic className="size-4" />
            Generate insight
          </Button>
        </div>
      )}

      <UpgradeDialog
        open={upgradeReason !== null}
        onOpenChange={(next) => {
          if (!next) dismissUpgrade();
        }}
        reason={upgradeReason ?? ""}
      />
    </div>
  );
}
