import { getBillingOverview, syncBillingPlan } from "../controllers/billing";
import { organizationProcedure, protectedProcedure, router } from "../index";

export const billingRouter = router({
  overview: organizationProcedure.query(({ ctx }) => {
    return getBillingOverview(ctx.organizationId, ctx.session.user.id);
  }),
  sync: protectedProcedure.mutation(({ ctx }) => {
    return syncBillingPlan(ctx.session.user.id);
  }),
});
