import { buildWidgetComponent, type WidgetBranding } from "./component";

export function generateShadcnWidget(
  publicKey: string,
  widgetUrl: string,
  branding: WidgetBranding,
): string {
  return buildWidgetComponent({ publicKey, widgetUrl, branding, variant: "shadcn" });
}
