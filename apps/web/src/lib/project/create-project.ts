import { authClient } from "@/lib/auth-client";

import type { CreateProjectValues } from "./schema";

const organizationLimitCode = "YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS";

export type CreateProjectResult =
  | { success: true; organizationId: string; logoUploaded: boolean }
  | { success: false; limitReached: boolean; message: string };

export const createProject = async (
  values: CreateProjectValues,
  uploadLogo: (organizationId: string) => Promise<void>,
): Promise<CreateProjectResult> => {
  const { data, error } = await authClient.organization.create({
    name: values.name.trim(),
    slug: values.slug,
  });

  if (error || !data) {
    return {
      success: false,
      limitReached: error?.code === organizationLimitCode,
      message: error?.message ?? "Could not create the project.",
    };
  }

  let logoUploaded = true;

  try {
    await uploadLogo(data.id);
  } catch {
    logoUploaded = false;
  }

  await authClient.organization.setActive({ organizationId: data.id });

  return { success: true, organizationId: data.id, logoUploaded };
};
