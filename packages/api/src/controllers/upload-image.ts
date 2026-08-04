import { ORGANIZATION_BUCKET } from "@echo/db/storage";
import { env } from "@echo/env/server";

import { findMembership } from "../services/organization";
import { uploadObject } from "../services/storage";
import type { UploadLogoResult } from "../types";

export type UploadImagePath = { path: string; url: string };

export type UploadImageConfig = {
  readonly maxBytes: number;
  readonly allowedTypes: Readonly<Record<string, string>>;
  readonly pathFor: (
    organizationId: string,
    extension: string,
    supabaseUrl: string,
  ) => UploadImagePath;
  readonly onUploaded: (organizationId: string, url: string) => Promise<void>;
};

export type UploadImageInput = {
  readonly userId: string;
  readonly organizationId: string;
  readonly file: File;
};

export async function uploadImage(
  config: UploadImageConfig,
  input: UploadImageInput,
): Promise<UploadLogoResult> {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, status: 500, error: "Storage is not configured" };
  }

  const extension = config.allowedTypes[input.file.type];
  if (!extension) {
    return { success: false, status: 400, error: "Unsupported file type" };
  }

  if (input.file.size > config.maxBytes) {
    const maxMb = Math.round(config.maxBytes / (1024 * 1024));
    return { success: false, status: 400, error: `File too large (max ${maxMb}MB)` };
  }

  const membership = await findMembership(input.userId, input.organizationId);
  if (!membership) {
    return { success: false, status: 403, error: "Forbidden" };
  }

  const { path, url } = config.pathFor(input.organizationId, extension, supabaseUrl);

  const response = await uploadObject({
    supabaseUrl,
    serviceKey,
    bucket: ORGANIZATION_BUCKET,
    path,
    contentType: input.file.type,
    body: await input.file.arrayBuffer(),
  });

  if (!response.ok) {
    const detail = await response.text();
    return {
      success: false,
      status: 502,
      error: `Upload failed (${response.status}): ${detail}`,
    };
  }

  await config.onUploaded(input.organizationId, url);

  return { success: true, url };
}
