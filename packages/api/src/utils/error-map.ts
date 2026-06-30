import type { TRPCErrorCode } from "@trpc/server/rpc";

type HttpStatus = 400 | 401 | 403 | 404 | 502;

const httpStatusToTrpcCode: Record<HttpStatus, TRPCErrorCode> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  502: "INTERNAL_SERVER_ERROR",
};

export function getErrorCode(status: HttpStatus): TRPCErrorCode {
  return httpStatusToTrpcCode[status];
}
