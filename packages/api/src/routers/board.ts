import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { organizationProcedure, router } from "../index";
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
    .mutation(({ input }) => {
      return moveBoardItem(input.id, input.column);
    }),

  remove: organizationProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ input }) => {
      return removeBoardItem(input.id);
    }),

  clearColumn: organizationProcedure
    .input(z.object({ column: z.enum(COLUMNS) }))
    .mutation(({ input, ctx }) => {
      return clearBoardColumn(ctx.organizationId, input.column);
    }),
});
