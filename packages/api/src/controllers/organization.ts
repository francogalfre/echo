import { organizationLogoPath, organizationLogoUrl } from "@echo/db/storage";

import { updateOrganizationLogo } from "../services/organization";
import type { UploadLogoResult } from "../types";
import { uploadImage } from "./upload-image";

const MAX_LOGO_BYTES = 1024 * 1024;

const extensionByType: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export type UploadLogoInput = {
  readonly userId: string;
  readonly organizationId: string;
  readonly file: File;
};

export function uploadOrganizationLogo(input: UploadLogoInput): Promise<UploadLogoResult> {
  return uploadImage(
    {
      maxBytes: MAX_LOGO_BYTES,
      allowedTypes: extensionByType,
      pathFor: (organizationId, extension, supabaseUrl) => {
        const filename = `logo.${extension}`;
        return {
          path: organizationLogoPath(organizationId, filename),
          url: organizationLogoUrl(supabaseUrl, organizationId, filename),
        };
      },
      onUploaded: (organizationId, url) => updateOrganizationLogo(organizationId, url),
    },
    input,
  );
}
