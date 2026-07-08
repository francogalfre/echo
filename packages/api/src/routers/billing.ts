import { getBillingOverview } from "../controllers/billing";
import { organizationProcedure, router } from "../index";

export const billingRouter = router({
  overview: organizationProcedure.query(({ ctx }) => {
    return getBillingOverview(ctx.organizationId, ctx.session.user.id);
  }),
});
