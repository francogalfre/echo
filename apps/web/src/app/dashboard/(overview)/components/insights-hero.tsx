"use client";

import { Button } from "@echo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@echo/ui/components/card";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { formatCount, formatRelativeTime } from "@echo/ui/lib/format";
import * as React from "react";

import type { DigestOutput } from "@echo/ai";

import { DigestModal } from "../../components/digest-modal";
import {
  ANALYSIS_AGENTS,
  getAgent,
  getAgentSummary,
  type AnalysisAgentId,
} from "../../components/agent-personas";

type InsightsHeroProps = {
  readonly digest: DigestOutput | null;
  readonly generatedAt: Date | null;
  readonly feedbackCount: number;
  readonly className?: string;
};

function AgentCard({
  agentId,
  digest,
}: {
  agentId: AnalysisAgentId;
  digest: DigestOutput;
}): React.ReactElement {
  const agent = getAgent(agentId);
  const AgentIcon = agent.icon;
  const summary = getAgentSummary(agentId, digest);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${agent.avatarBg}`}
      >
        <AgentIcon className={`size-4 ${agent.avatarText}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{agent.name}</p>
        <p className="text-xs text-muted-foreground">{summary}</p>
      </div>
    </div>
  );
}

function EmptyAgentState({
  onGenerate,
  className,
}: {
  onGenerate: () => void;
  className?: string;
}): React.ReactElement {
  return (
    <Card className={className}>
      <CardContent className="flex flex-1 items-center justify-center py-12">
        <EmptyState
          icon={<Icons.aiMagic />}
          title="No insights yet"
          description="Generate an AI analysis to understand your feedback."
          action={
            <Button size="sm" onClick={onGenerate}>
              <Icons.aiMagic data-icon="inline-start" className="size-4" />
              Generate insights
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}

function AgentInsightsCard({
  digest,
  generatedAt,
  feedbackCount,
  onViewFull,
  className,
}: {
  digest: DigestOutput;
  generatedAt: Date | null;
  feedbackCount: number;
  onViewFull: () => void;
  className?: string;
}): React.ReactElement {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.aiMagic className="size-4 text-accent" />
          AI Analysis
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={onViewFull}>
            View full analysis
            <Icons.arrowRight className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ANALYSIS_AGENTS.map((agentId) => (
            <AgentCard key={agentId} agentId={agentId} digest={digest} />
          ))}
        </div>

        {digest.positiveHighlight && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success">
              <Icons.circleCheck className="size-4 text-white" />
            </span>
            <p className="text-sm">{digest.positiveHighlight}</p>
          </div>
        )}

        {generatedAt && (
          <p className="mt-3 text-xs text-muted-foreground">
            {formatCount(feedbackCount)} feedback · updated{" "}
            {formatRelativeTime(generatedAt.toISOString())}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function InsightsHero({
  digest,
  generatedAt,
  feedbackCount,
  className,
}: InsightsHeroProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const hasContent =
    digest !== null &&
    (digest.topIssues.length > 0 || digest.themes.length > 0 || digest.positiveHighlight);

  if (!hasContent) {
    return (
      <>
        <EmptyAgentState className={className} onGenerate={() => setOpen(true)} />
        <DigestModal open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <AgentInsightsCard
        className={className}
        digest={digest}
        generatedAt={generatedAt}
        feedbackCount={feedbackCount}
        onViewFull={() => setOpen(true)}
      />
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
