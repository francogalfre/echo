import { z } from "zod";

import { getChatMessages, listChatConversations } from "../controllers/chat";
import { readQuota } from "../controllers/quota";
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
    const { used, limit, plan } = await readQuota(ctx.organizationId, "chat");

    return { used, limit, plan };
  }),
});
