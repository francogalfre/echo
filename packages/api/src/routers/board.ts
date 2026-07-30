import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, organizationProcedure, router } from "../index";
import {
  addBoardItem,
  clearBoardColumn,
  getBoardItems,
  moveBoardItem,
  removeBoardItem,
} from "../services/board";

const COLUMNS = ["backlog", "in_progress", "done"] as const;

export const boardRouter = router({
  items: organizationProcedure.query(({ ctx }) => {
    return getBoardItems(ctx.organizationId);
  }),

  add: organizationProcedure
    .input(z.object({ feedbackId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const id = crypto.randomUUID();
      try {
        await addBoardItem(ctx.organizationId, input.feedbackId, id);
      } catch {
        throw new TRPCError({ code: "CONFLICT", message: "Already on board" });
      }
    }),

  move: organizationProcedure
    .input(z.object({ id: z.string().min(1), column: z.enum(COLUMNS) }))
    .mutation(async ({ input, ctx }) => {
      const moved = await moveBoardItem(input.id, ctx.organizationId, input.column);
      if (!moved) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Board item not found" });
      }
    }),

  remove: organizationProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const removed = await removeBoardItem(input.id, ctx.organizationId);
      if (!removed) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Board item not found" });
      }
    }),

  clearColumn: adminProcedure
    .input(z.object({ column: z.enum(COLUMNS) }))
    .mutation(({ input, ctx }) => {
      return clearBoardColumn(ctx.organizationId, input.column);
    }),
});
