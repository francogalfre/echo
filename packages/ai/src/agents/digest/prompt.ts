import type { DigestInput } from "./types";

export const DIGEST_SYSTEM_PROMPT = `Analyze product feedback and summarize it for the team.

Rules:
- executiveSummary: honest overview — what users feel, main signal this period
- themes: 2-5 recurring topics, count = number of feedbacks about it
- topIssues: up to 3 most urgent things to fix (empty array if no issues)
- positiveHighlight: what users love (empty string if no positive feedback)`;

const SENTIMENT_ABBR: Record<string, string> = {
  positive: "+",
  negative: "-",
  neutral: "~",
};

export function buildDigestPrompt(inputs: DigestInput[]): string {
  const total = inputs.length;
  const pos = inputs.filter((i) => i.sentiment === "positive").length;
  const neg = inputs.filter((i) => i.sentiment === "negative").length;
  const neu = inputs.filter((i) => i.sentiment === "neutral").length;

  const lines = inputs.map((item, idx) => {
    const tags = item.tags?.length ? `[${item.tags.join(",")}]` : "";
    const s = item.sentiment ? `(${SENTIMENT_ABBR[item.sentiment] ?? "?"})` : "";
    const content = item.content.slice(0, 150).replace(/\n/g, " ");
    return `${idx + 1}. ${s}${tags} ${content}`;
  });

  return `${total} feedbacks: ${pos} positive, ${neg} negative, ${neu} neutral.\n\n${lines.join("\n")}`;
}
