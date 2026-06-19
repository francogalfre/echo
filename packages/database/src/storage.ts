export const ORGANIZATION_BUCKET = "organizations" as const;

export function supabaseProjectUrl(rawUrl: string): string {
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export function organizationLogoPath(organizationId: string, filename: string): string {
  return `logo/${organizationId}/${filename}`;
}

export function organizationLogoUrl(
  supabaseUrl: string,
  organizationId: string,
  filename: string,
): string {
  const path = organizationLogoPath(organizationId, filename);
  return `${supabaseProjectUrl(supabaseUrl)}/storage/v1/object/public/${ORGANIZATION_BUCKET}/${path}`;
}
