import { z } from "zod";

import { getDashboardOverview } from "../services/dashboard-overview";
import { organizationProcedure, router } from "../index";

const OverviewInput = z
  .object({ range: z.enum(["7d", "30d", "6m", "1y", "all"]).default("30d") })
  .optional();

export const dashboardRouter = router({
  overview: organizationProcedure.input(OverviewInput).query(({ ctx, input }) => {
    return getDashboardOverview(ctx.organizationId, input?.range ?? "30d");
  }),
});
