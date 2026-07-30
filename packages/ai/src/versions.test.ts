import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { ANALYZE_SYSTEM_PROMPT } from "./agents/analyze/prompt";
import { CHAT_SYSTEM_PROMPT } from "./agents/chat/prompt";
import { DIGEST_SYSTEM_PROMPT } from "./agents/digest/prompt";
import { INSIGHT_SYSTEM_PROMPT } from "./agents/insight/prompt";
import { AGENT_VERSIONS } from "./versions";

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const RECORDED_PROMPT_HASHES: Record<keyof typeof AGENT_VERSIONS, string> = {
  analyze: "81ffdcf588fe83eed9e281aff93de607d861ca67085458922846dfda1edf3dd0",
  chat: "be324b1a5f8f3483cc5ee0d0f967edb59d7384d9690dbc867956376f681c5895",
  digest: "57454f46916716f3229345a080067a86025422148b697af1d6f0f63da6a10f7e",
  insight: "fd2daaf3c630931cc712e0e4fa42b5af00680b8ab2a7baa0943c0bac5d664016",
};

const PROMPTS: Record<keyof typeof AGENT_VERSIONS, string> = {
  analyze: ANALYZE_SYSTEM_PROMPT,
  chat: CHAT_SYSTEM_PROMPT,
  digest: DIGEST_SYSTEM_PROMPT,
  insight: INSIGHT_SYSTEM_PROMPT,
};

describe("prompt version discipline", () => {
  for (const agent of Object.keys(AGENT_VERSIONS) as (keyof typeof AGENT_VERSIONS)[]) {
    it(`should keep the recorded hash for ${agent} in sync with its prompt text`, () => {
      expect(hash(PROMPTS[agent])).toBe(RECORDED_PROMPT_HASHES[agent]);
    });

    it(`should have a positive PROMPT_VERSION for ${agent}`, () => {
      expect(AGENT_VERSIONS[agent]).toBeGreaterThan(0);
    });
  }
});
