export const ANALYZE_SYSTEM_PROMPT = `Analyze product feedback. Respond with ONLY a JSON object, no other text.

Format: {"sentiment":"...","tags":[...]}

sentiment: positive | negative | neutral | none
tags: 0-3 items from [bug, feature, ux, performance, billing, compliment, support]

Example: {"sentiment":"negative","tags":["bug","ux"]}`;

export function buildAnalyzePrompt(content: string): string {
  return `Feedback: """${content}"""`;
}
