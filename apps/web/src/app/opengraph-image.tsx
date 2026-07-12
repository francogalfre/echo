import type { ImageResponse } from "next/og";

import { renderSocialImage } from "@/lib/seo/social-image";

export {
  SOCIAL_IMAGE_SIZE as size,
  SOCIAL_IMAGE_CONTENT_TYPE as contentType,
  SOCIAL_IMAGE_ALT as alt,
} from "@/lib/seo/social-image";

export default async function Image(): Promise<ImageResponse> {
  return renderSocialImage();
}
