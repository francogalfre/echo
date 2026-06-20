import { supabaseProjectUrl } from "@echo/db/storage";

interface UploadObjectInput {
  readonly supabaseUrl: string;
  readonly serviceKey: string;
  readonly bucket: string;
  readonly path: string;
  readonly contentType: string;
  readonly body: ArrayBuffer;
}

export function uploadObject(input: UploadObjectInput): Promise<Response> {
  const endpoint = `${supabaseProjectUrl(input.supabaseUrl)}/storage/v1/object/${input.bucket}/${input.path}`;

  return fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: input.serviceKey,
      Authorization: `Bearer ${input.serviceKey}`,
      "Content-Type": input.contentType,
      "x-upsert": "true",
    },
    body: input.body,
  });
}
