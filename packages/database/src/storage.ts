// Shared constants/helpers for the organization logos bucket. The SQL that
// provisions the bucket lives in ./storage.sql (run via `bun db:storage`).

export const ORGANIZATION_BUCKET = "organizations" as const;

export function organizationLogoPath(organizationId: string, filename: string): string {
  return `logo/${organizationId}/${filename}`;
}

export function organizationLogoUrl(
  supabaseUrl: string,
  organizationId: string,
  filename: string,
): string {
  const path = organizationLogoPath(organizationId, filename);
  return `${supabaseUrl}/storage/v1/object/public/${ORGANIZATION_BUCKET}/${path}`;
}
