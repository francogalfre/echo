import { createServerTrpc } from "@/lib/trpc-server";

import type { WidgetInstallInitial } from "../hooks/use-widget-install";
import { WidgetSection } from "./widget-section";

export async function WidgetData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const initial = await fetchInitial(api);

  return <WidgetSection initial={initial} />;
}

async function fetchInitial(
  api: Awaited<ReturnType<typeof createServerTrpc>>,
): Promise<WidgetInstallInitial> {
  try {
    const info = await api.widget.getInstallInfo.query();
    return { info };
  } catch {
    return { error: true };
  }
}
