import {
  ORGANIZATION_BUCKET,
  organizationLogoPath,
  organizationLogoUrl,
} from "@echo/db/storage";
import { env } from "@echo/env/server";

import { findMembership, updateOrganizationLogo } from "../services/organization";
import { uploadObject } from "../services/storage";
import type { UploadLogoResult } from "../types";

const MAX_LOGO_BYTES = 1024 * 1024;

const extensionByType: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export interface UploadLogoInput {
  readonly userId: string;
  readonly organizationId: string;
  readonly file: File;
}

export async function uploadOrganizationLogo(
  input: UploadLogoInput,
): Promise<UploadLogoResult> {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, status: 500, error: "Storage is not configured" };
  }

  const extension = extensionByType[input.file.type];

  if (!extension) {
    return { success: false, status: 400, error: "Unsupported file type" };
  }

  if (input.file.size > MAX_LOGO_BYTES) {
    return { success: false, status: 400, error: "File too large (max 1MB)" };
  }

  const membership = await findMembership(input.userId, input.organizationId);

  if (!membership) {
    return { success: false, status: 403, error: "Forbidden" };
  }

  const filename = `logo.${extension}`;
  const path = organizationLogoPath(input.organizationId, filename);

  const response = await uploadObject({
    supabaseUrl,
    serviceKey,
    bucket: ORGANIZATION_BUCKET,
    path,
    contentType: input.file.type,
    body: await input.file.arrayBuffer(),
  });

  if (!response.ok) {
    return { success: false, status: 502, error: "Upload failed" };
  }

  const url = organizationLogoUrl(supabaseUrl, input.organizationId, filename);
  await updateOrganizationLogo(input.organizationId, url);

  return { success: true, url };
}
