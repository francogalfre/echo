import { createHash } from "node:crypto";

import { db } from "@echo/db";
import { apiKeys } from "@echo/db/schema/feedback";
import type { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function backfillOne(row: InferSelectModel<typeof apiKeys>): Promise<void> {
  await db
    .update(apiKeys)
    .set({
      publicKeyHash: row.publicKeyHash ?? sha256(row.publicKey),
      secretKeyPrefix: row.secretKeyPrefix ?? row.secretKeyHash.slice(0, 12),
    })
    .where(eq(apiKeys.id, row.id));
}

async function main(): Promise<void> {
  const rows = await db.query.apiKeys.findMany();
  const pending = rows.filter((row) => !row.publicKeyHash || !row.secretKeyPrefix);

  await Promise.all(pending.map(backfillOne));

  console.log(`Backfilled ${pending.length} of ${rows.length} api_keys row(s).`);
}

main().catch((error: unknown) => {
  console.error("Failed to backfill api_keys hashes:", error);
  process.exit(1);
});
