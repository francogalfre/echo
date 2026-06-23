"use client";

import { env } from "@echo/env/web";
import { useRef, useState } from "react";

type UseLogoUploadReturn = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  preview: string | null;
  error: string | null;
  onChange: (file: File | undefined) => void;
  upload: (organizationId: string) => Promise<void>;
};

export const useLogoUpload = (): UseLogoUploadReturn => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (incoming: File | undefined): void => {
    if (!incoming) return;

    if (incoming.size > 1024 * 1024) {
      setError("Logo must be 1MB or smaller.");
      return;
    }

    setError(null);
    setFile(incoming);
    setPreview(URL.createObjectURL(incoming));
  };

  const upload = async (organizationId: string): Promise<void> => {
    if (!file) return;

    const body = new FormData();

    body.append("organizationId", organizationId);
    body.append("file", file);

    const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/projects/logo`, {
      method: "POST",
      credentials: "include",
      body,
    });

    if (!response.ok) throw new Error("Logo upload failed");
  };

  return { fileInputRef, preview, error, onChange, upload };
};
