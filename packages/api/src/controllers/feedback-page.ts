import {
  ORGANIZATION_BUCKET,
  organizationBannerPath,
  organizationBannerUrl,
} from "@echo/db/storage";
import { env } from "@echo/env/server";

import { findMembership } from "../services/organization";
import { upsertFeedbackPageConfig } from "../services/feedback-page";
import { uploadObject } from "../services/storage";
import type { UploadLogoResult } from "../types";

const MAX_BANNER_BYTES = 5 * 1024 * 1024;

const extensionByType: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

type UploadBannerInput = {
  readonly userId: string;
  readonly organizationId: string;
  readonly file: File;
};

export async function uploadFeedbackPageBanner(
  input: UploadBannerInput,
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

  if (input.file.size > MAX_BANNER_BYTES) {
    return { success: false, status: 400, error: "File too large (max 5MB)" };
  }

  const membership = await findMembership(input.userId, input.organizationId);

  if (!membership) {
    return { success: false, status: 403, error: "Forbidden" };
  }

  const filename = `banner-${Date.now()}.${extension}`;
  const path = organizationBannerPath(input.organizationId, filename);

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

  const url = organizationBannerUrl(supabaseUrl, input.organizationId, filename);
  await upsertFeedbackPageConfig(input.organizationId, {
    coverBannerUrl: url,
    enableCoverBanner: true,
  });

  return { success: true, url };
}
