/**
 * Simple structured logger for the API layer.
 * Wraps console.* so lint rules don't flag every error-handling site.
 */
export function logError(context: string, error: unknown): void {
  // eslint-disable-next-line no-console
  console.error(`[echo:${context}]`, error);
}

export function logWarn(context: string, message: string, meta?: unknown): void {
  // eslint-disable-next-line no-console
  console.warn(`[echo:${context}] ${message}`, meta ?? "");
}

export function logInfo(context: string, message: string, meta?: unknown): void {
  // eslint-disable-next-line no-console
  console.log(`[echo:${context}] ${message}`, meta ?? "");
}
