import { z } from "zod";

import { getChatMessages, listChatConversations } from "../controllers/chat";
import { todayKey } from "../controllers/quota";
import { organizationProcedure, router } from "../index";

export const chatRouter = router({
  listConversations: organizationProcedure.query(async ({ ctx }) => {
    return listChatConversations(ctx.organizationId, ctx.session.user.id);
  }),

  getMessages: organizationProcedure
    .input(z.object({ conversationId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const messages = await getChatMessages(
        ctx.organizationId,
        ctx.session.user.id,
        input.conversationId,
      );

      return { messages: messages ?? [] };
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
