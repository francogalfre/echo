import { z } from "zod";

import { chatWithAgent } from "../controllers/chat";
import { todayKey } from "../controllers/quota";
import { organizationProcedure, router } from "../index";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.string().datetime(),
});

export const chatRouter = router({
  send: organizationProcedure
    .input(
      z.object({
        messages: z.array(messageSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const messages = input.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));

      return chatWithAgent(ctx.organizationId, messages);
    }),

  getUsage: organizationProcedure.query(async ({ ctx }) => {
    const { getUsageCount } = await import("../services/ai-usage");
    const { getOrgPlan } = await import("../services/organization");
    const { FREE_CHAT_DAILY_LIMIT, PRO_CHAT_DAILY_LIMIT } =
      await import("../lib/plan-limits");

    const plan = await getOrgPlan(ctx.organizationId);
    const isPro = plan === "pro";
    const day = todayKey();
    const used = await getUsageCount(ctx.organizationId, "chat", day);
    const limit = isPro ? PRO_CHAT_DAILY_LIMIT : FREE_CHAT_DAILY_LIMIT;

    return { used, limit, plan: plan ?? "free" };
  }),
});
