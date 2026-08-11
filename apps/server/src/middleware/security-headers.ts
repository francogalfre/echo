import { secureHeaders } from "hono/secure-headers";
import type { MiddlewareHandler } from "hono";

export const secureHeadersMiddleware: MiddlewareHandler = secureHeaders({
  crossOriginResourcePolicy: "cross-origin",
});
