import echoIdle from "@echo/assets/character/idle.webp";
import { Icons } from "@echo/ui/components/icons";
import type { StaticImageData } from "next/image";

export type AgentPersona = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly avatarImage: StaticImageData;
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
    avatarImage: echoIdle,
    color: "text-accent",
    bgColor: "bg-accent/8",
    avatarBg: "bg-accent",
    avatarText: "text-white",
    thinkingPhrases: ["Reading feedback", "Thinking", "Preparing answer"],
  },
} as const;

export type DigestSectionId = "issues" | "themes" | "mood";

type DigestSectionMeta = {
  readonly id: DigestSectionId;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
};

export const DIGEST_SECTIONS: readonly DigestSectionMeta[] = [
  { id: "issues", label: "Issues", icon: Icons.radar },
  { id: "themes", label: "Themes", icon: Icons.search },
  { id: "mood", label: "Mood", icon: Icons.trendUp },
];
