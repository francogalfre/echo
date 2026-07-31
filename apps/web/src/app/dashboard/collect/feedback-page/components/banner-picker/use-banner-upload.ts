"use client";

import { useState } from "react";
import { env } from "@echo/env/web";
import { toast } from "@echo/ui/components/toast";

import { downscaleImage } from "./downscale-image";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

type UseBannerUploadResult = {
  isUploading: boolean;
  upload: (file: File | undefined) => Promise<void>;
};

export function useBannerUpload(
  organizationId: string,
  onUploaded: (url: string) => void,
): UseBannerUploadResult {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File | undefined): Promise<void> => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Image must be 5MB or smaller");
      return;
    }

    setIsUploading(true);
    try {
      const processed = await downscaleImage(file);

      const body = new FormData();
      body.append("organizationId", organizationId);
      body.append("file", processed);

      const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/projects/banner`, {
        method: "POST",
        credentials: "include",
        body,
      });

      if (!response.ok) {
        const detail = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(detail?.error ?? "Upload failed");
      }

      const data = (await response.json()) as { url: string };
      onUploaded(data.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, upload };
}
