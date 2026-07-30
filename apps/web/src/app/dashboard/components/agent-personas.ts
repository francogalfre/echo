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
  echo: {
    id: "echo",
    name: "Echo",
    role: "Reads your feedback and explains it",
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

export function getAgent(agentId: AgentId): AgentPersona {
  return AGENT_PERSONAS[agentId];
}

export type DigestSectionId = "issues" | "themes" | "mood";

export type DigestSection = {
  readonly id: DigestSectionId;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
};

export const DIGEST_SECTIONS: readonly DigestSection[] = [
  { id: "issues", label: "Issues", icon: Icons.radar },
  { id: "themes", label: "Themes", icon: Icons.search },
  { id: "mood", label: "Mood", icon: Icons.trendUp },
];

export function getDigestSectionSummary(
  sectionId: DigestSectionId,
  digest: {
    topIssues?: readonly string[];
    themes?: readonly { title: string; count: number; insight: string }[];
    positiveHighlight?: string;
  },
): string {
  switch (sectionId) {
    case "issues": {
      const count = digest.topIssues?.length ?? 0;
      if (count === 0) return "No issues found";
      return `${count} ${count === 1 ? "issue" : "issues"} need attention`;
    }
    case "themes": {
      const count = digest.themes?.length ?? 0;
      if (count === 0) return "No themes yet";
      return `${count} ${count === 1 ? "theme" : "themes"} identified`;
    }
    case "mood": {
      if (!digest.positiveHighlight) return "Analyzing sentiment";
      return "Users are satisfied";
    }
  }
}
