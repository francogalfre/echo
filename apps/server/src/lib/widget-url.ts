export function getWidgetUrl(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "echo.dev";
  return `${proto}://${host}/api/widget`;
}
