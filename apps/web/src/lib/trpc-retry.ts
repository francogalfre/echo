const nonRetryableHttpStatuses = new Set([400, 401, 403, 404]);

const retryBaseDelayMs = 300;

function extractHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return undefined;
  }
  const data = (error as { data?: unknown }).data;
  if (typeof data !== "object" || data === null || !("httpStatus" in data)) {
    return undefined;
  }
  const httpStatus = (data as { httpStatus?: unknown }).httpStatus;
  return typeof httpStatus === "number" ? httpStatus : undefined;
}

export function isRetryableTrpcError(error: unknown): boolean {
  const httpStatus = extractHttpStatus(error);
  return httpStatus === undefined || !nonRetryableHttpStatuses.has(httpStatus);
}

export function retryDelayMs(attempts: number): number {
  return retryBaseDelayMs * 2 ** (attempts - 1);
}
