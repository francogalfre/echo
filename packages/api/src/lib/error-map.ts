import type { TRPC_ERROR_CODE_KEY } from "@trpc/server";

type HttpStatus = 400 | 401 | 403 | 404 | 429 | 502;

const httpStatusToTrpcCode: Record<HttpStatus, TRPC_ERROR_CODE_KEY> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  429: "TOO_MANY_REQUESTS",
  502: "INTERNAL_SERVER_ERROR",
};

export function getErrorCode(status: HttpStatus): TRPC_ERROR_CODE_KEY {
  return httpStatusToTrpcCode[status];
}
