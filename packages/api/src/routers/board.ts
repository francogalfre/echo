import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { addBoardItemForFeedback } from "../controllers/board";
import { adminProcedure, organizationProcedure, router } from "../index";
import { getErrorCode } from "../lib/error-map";
import {
  clearBoardColumn,
  getBoardItems,
  moveBoardItem,
  reindexColumn,
  removeBoardItem,
} from "../services/board";
import { BOARD_COLUMN_VALUES } from "../types";

export const boardRouter = router({
  items: organizationProcedure.query(({ ctx }) => {
    return getBoardItems(ctx.organizationId);
  }),

  add: organizationProcedure
    .input(z.object({ feedbackId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const result = await addBoardItemForFeedback(ctx.organizationId, input.feedbackId);
      if (!result.success) {
        throw new TRPCError({ code: getErrorCode(result.status), message: result.error });
      }
    }),

  move: organizationProcedure
    .input(
      z.object({
        id: z.string().min(1),
        column: z.enum(BOARD_COLUMN_VALUES),
        position: z.number().int().min(0),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const moved = await moveBoardItem(
        input.id,
        ctx.organizationId,
        input.column,
        input.position,
      );
      if (!moved) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Board item not found" });
      }
    }),

  reorder: organizationProcedure
    .input(
      z.object({
        column: z.enum(BOARD_COLUMN_VALUES),
        orderedIds: z.array(z.string().min(1)),
      }),
    )
    .mutation(({ input, ctx }) => {
      return reindexColumn(ctx.organizationId, input.column, input.orderedIds);
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
    .input(z.object({ column: z.enum(BOARD_COLUMN_VALUES) }))
    .mutation(({ input, ctx }) => {
      return clearBoardColumn(ctx.organizationId, input.column);
    }),
});
