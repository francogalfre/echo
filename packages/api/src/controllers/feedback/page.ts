import { organizationBannerPath, organizationBannerUrl } from "@echo/db/storage";

import { isPro } from "../../lib/plan";
import {
  getFeedbackPageBySlug,
  upsertFeedbackPageConfig,
  type FeedbackPageConfig,
  type PublicFeedbackItem,
  type PublicOrganization,
} from "../../services/feedback-page";
import type { UploadLogoResult } from "../../types";
import { uploadImage } from "../upload-image";

export type PublicFeedbackPage = {
  org: PublicOrganization;
  config: FeedbackPageConfig;
  feedback: PublicFeedbackItem[];
  hideBranding: boolean;
};

export async function resolvePublicFeedbackPage(
  slug: string,
): Promise<PublicFeedbackPage | null> {
  const page = await getFeedbackPageBySlug(slug);
  if (!page) return null;

  return { ...page, hideBranding: isPro(page.org.plan) };
}

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

export function uploadFeedbackPageBanner(
  input: UploadBannerInput,
): Promise<UploadLogoResult> {
  return uploadImage(
    {
      maxBytes: MAX_BANNER_BYTES,
      allowedTypes: extensionByType,
      pathFor: (organizationId, extension, supabaseUrl) => {
        const filename = `banner-${Date.now()}.${extension}`;
        return {
          path: organizationBannerPath(organizationId, filename),
          url: organizationBannerUrl(supabaseUrl, organizationId, filename),
        };
      },
      onUploaded: (organizationId, url) =>
        upsertFeedbackPageConfig(organizationId, {
          coverBannerUrl: url,
          enableCoverBanner: true,
        }),
    },
    input,
  );
}
