"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { durations, easings } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";

import type { FeedbackItem } from "../utils/map-feedback";
import { useFeedbackInsight } from "../hooks/use-feedback-insight";
import { AiThinking } from "../../components/ai/ai-thinking";
import { ErrorCard } from "../../components/error-card";
import { UpgradeDialog } from "../../components/dialogs/upgrade-dialog";
import { InsightContent } from "./insight-content";
import { AGENT_PERSONAS } from "../../components/chat/agent-personas";

const PHASE_TRANSITION = { duration: durations.base, ease: easings.out };

const THINKING_PHRASES = [
  "Reading your feedback",
  "Finding patterns",
  "Writing the summary",
] as const;

type InsightPanelProps = {
  item: FeedbackItem;
  active: boolean;
  bare?: boolean;
};

export function InsightPanel({
  item,
  active,
  bare = false,
}: InsightPanelProps): React.ReactElement {
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
  }, [active, item.id, item.hasInsight, generate, reset]);

  const isLoading =
    state.status === "loading" || (item.hasInsight && state.status === "idle");

  const header = (
    <div
      className={cn(
        "flex items-center gap-2.5",
        bare ? "mb-3" : "border-b border-border bg-muted/40 px-5 py-3",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-md",
          agent.bgColor,
        )}
      >
        <agent.icon className={cn("size-3", agent.color)} />
      </span>
      <h3 className="text-sm font-medium text-foreground">Insight</h3>
    </div>
  );

  return (
    <div className={cn(!bare && "overflow-hidden rounded-2xl border border-border")}>
      {header}

      <div className={cn(!bare && "p-5")}>
        <AnimatePresence mode="wait" initial={false}>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={PHASE_TRANSITION}
            >
              <AiThinking phrases={THINKING_PHRASES} />
            </motion.div>
          )}

          {state.status === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={PHASE_TRANSITION}
            >
              <InsightContent insight={state.insight} />
            </motion.div>
          )}

          {state.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={PHASE_TRANSITION}
            >
              <ErrorCard
                message="We couldn't generate this insight. Please try again."
                onRetry={() => void generate(item.id)}
              />
            </motion.div>
          )}

          {!item.hasInsight && state.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={PHASE_TRANSITION}
              className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border/80 bg-background/50 p-4"
            >
              <p className="text-xs leading-relaxed text-muted-foreground">
                Generate a quick AI summary of what this feedback means.
              </p>
              <Button size="lg" onClick={() => void generate(item.id)}>
                <Icons.aiMagic className="size-4" />
                Generate insight
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
