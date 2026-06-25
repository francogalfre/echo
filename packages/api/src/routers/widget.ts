import { organizationProcedure, router } from "../index";
import { resolveInstallInfo } from "../controllers/widget";

export const widgetRouter = router({
  getInstallInfo: organizationProcedure.query(({ ctx }) => {
    return resolveInstallInfo(ctx.organizationId);
  }),
});
