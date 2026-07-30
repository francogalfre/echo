import { Icons } from "@echo/ui/components/icons";

export type AgentPersona = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly color: string;
  readonly bgColor: string;
  readonly avatarBg: string;
  readonly avatarText: string;
  readonly thinkingPhrases: readonly string[];
};

export const AGENT_PERSONAS = {
  sentinel: {
    id: "sentinel",
    name: "Sentinel",
    role: "Finds problems",
    description: "Scans feedback to find bugs, complaints, and urgent issues.",
    icon: Icons.radar,
    color: "text-destructive",
    bgColor: "bg-destructive/8",
    avatarBg: "bg-destructive",
    avatarText: "text-white",
    thinkingPhrases: ["Scanning for issues", "Finding problems", "Checking for bugs"],
  },
  compass: {
    id: "compass",
    name: "Compass",
    role: "Finds patterns",
    description: "Groups similar feedback to reveal what users actually want.",
    icon: Icons.search,
    color: "text-info",
    bgColor: "bg-info/8",
    avatarBg: "bg-info",
    avatarText: "text-white",
    thinkingPhrases: ["Grouping feedback", "Finding patterns", "Identifying themes"],
  },
  pulse: {
    id: "pulse",
    name: "Pulse",
    role: "Reads emotions",
    description: "Understands how users feel about your product.",
    icon: Icons.trendUp,
    color: "text-success",
    bgColor: "bg-success/8",
    avatarBg: "bg-success",
    avatarText: "text-white",
    thinkingPhrases: ["Reading sentiment", "Measuring feelings", "Analyzing mood"],
  },
  echo: {
    id: "echo",
    name: "Echo",
    role: "Answers questions",
    description: "Reads all feedback and answers your questions about it.",
    icon: Icons.message,
    color: "text-accent",
    bgColor: "bg-accent/8",
    avatarBg: "bg-accent",
    avatarText: "text-white",
    thinkingPhrases: ["Reading feedback", "Thinking", "Preparing answer"],
  },
} as const;

export type AgentId = keyof typeof AGENT_PERSONAS;
export type AnalysisAgentId = "sentinel" | "compass" | "pulse";

export const ANALYSIS_AGENTS: readonly AnalysisAgentId[] = ["sentinel", "compass", "pulse"];
export const ALL_AGENTS: readonly AgentId[] = ["sentinel", "compass", "pulse", "echo"];

export function getAgent(agentId: AgentId): AgentPersona {
  return AGENT_PERSONAS[agentId];
}

export function getAgentSummary(
  agentId: AgentId,
  digest: {
    topIssues?: readonly string[];
    themes?: readonly { title: string; count: number; insight: string }[];
    positiveHighlight?: string;
  },
): string {
  switch (agentId) {
    case "sentinel": {
      const count = digest.topIssues?.length ?? 0;
      if (count === 0) return "No issues found";
      return `${count} ${count === 1 ? "issue" : "issues"} need attention`;
    }
    case "compass": {
      const count = digest.themes?.length ?? 0;
      if (count === 0) return "No themes yet";
      return `${count} ${count === 1 ? "theme" : "themes"} identified`;
    }
    case "pulse": {
      if (!digest.positiveHighlight) return "Analyzing sentiment";
      return "Users are satisfied";
    }
    case "echo": {
      return "Ask me anything";
    }
  }
}
