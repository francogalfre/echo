import { createServerTrpc } from "@/lib/trpc-server";

import type { ApiKeysInitialState } from "../hooks/use-api-keys";
import { ApiKeysSection } from "./api-keys-section";

export async function ApiData(): Promise<React.ReactElement> {
  const initial = await fetchInitial();

  return <ApiKeysSection initial={initial} />;
}

async function fetchInitial(): Promise<ApiKeysInitialState> {
  try {
    const api = await createServerTrpc();
    const keys = await api.apiKeys.get.query();
    return { keys };
  } catch {
    return { error: true };
  }
}
