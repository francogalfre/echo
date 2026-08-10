import { adminProcedure, router } from "../index";
import { resolveInstallInfo } from "../controllers/widget";

export const widgetRouter = router({
  getInstallInfo: adminProcedure.query(({ ctx }) => {
    return resolveInstallInfo(ctx.organizationId);
  }),
});
