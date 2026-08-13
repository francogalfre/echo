import { createServerTrpc } from "@/lib/trpc-server";

import { ApiKeysSection } from "./api-keys-section";

export async function ApiKeysData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const keys = await api.apiKeys.get.query();

  return <ApiKeysSection initialKeys={keys} />;
}
