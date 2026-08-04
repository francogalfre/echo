import { z } from "zod";

import { organizationProcedure, router } from "../index";
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationsRead,
} from "../services/notifications";

const ListNotificationsInput = z.object({
  limit: z.number().int().min(1).max(50).default(20),
});

export const notificationsRouter = router({
  list: organizationProcedure
    .input(ListNotificationsInput.optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const [items, unread] = await Promise.all([
        listNotifications(ctx.organizationId, limit),
        countUnreadNotifications(ctx.organizationId),
      ]);
      return { items, unread };
    }),

  markAllRead: organizationProcedure.mutation(async ({ ctx }) => {
    await markNotificationsRead(ctx.organizationId);
    return { success: true };
  }),
});
