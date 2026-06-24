import {
  getPublicKeyByOrgSlug,
  getWidgetInstallInfo,
  type WidgetInstallInfo,
} from "../services/api-keys";
import { generateShadcnWidget, generateStandaloneWidget } from "./widget-templates";

export type { WidgetInstallInfo } from "../services/api-keys";

export type ComponentResult =
  | { success: true; code: string }
  | { success: false; status: 404; error: string };

export type RegistryResult =
  | { success: true; registry: Record<string, unknown> }
  | { success: false; status: 404; error: string };

export async function resolveInstallInfo(
  organizationId: string,
): Promise<WidgetInstallInfo | null> {
  return getWidgetInstallInfo(organizationId);
}

export async function resolveStandaloneComponent(
  orgSlug: string,
  widgetUrl: string,
): Promise<ComponentResult> {
  const info = await getPublicKeyByOrgSlug(orgSlug);

  if (!info) {
    return {
      success: false,
      status: 404,
      error: "Organization not found or API keys not generated",
    };
  }

  return {
    success: true,
    code: generateStandaloneWidget(info.publicKey, widgetUrl),
  };
}

export async function resolveShadcnRegistry(
  orgSlug: string,
  widgetUrl: string,
): Promise<RegistryResult> {
  const info = await getPublicKeyByOrgSlug(orgSlug);

  if (!info) {
    return {
      success: false,
      status: 404,
      error: "Organization not found or API keys not generated",
    };
  }

  return {
    success: true,
    registry: {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "echo-widget",
      type: "registry:component",
      registryDependencies: ["button", "input", "label", "textarea"],
      files: [
        {
          path: "components/echo-widget.tsx",
          content: generateShadcnWidget(info.publicKey, widgetUrl),
          type: "registry:component",
        },
      ],
    },
  };
}
