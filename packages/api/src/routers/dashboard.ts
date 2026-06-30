import { getDashboardStats } from "../services/dashboard";
import { organizationProcedure, router } from "../index";

export const dashboardRouter = router({
  stats: organizationProcedure.query(({ ctx }) => {
    return getDashboardStats(ctx.organizationId);
  }),
});
