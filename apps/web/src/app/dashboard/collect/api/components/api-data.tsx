import { createServerTrpc } from "@/lib/trpc-server";

import { ApiKeysSection } from "./api-keys-section";

export async function ApiData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const initialData = await api.apiKeys.get.query();

  return <ApiKeysSection initialData={initialData} />;
}
