import { createHash } from "node:crypto";

import { db } from "@echo/db";
import { apiKeys } from "@echo/db/schema/feedback";
import { eq } from "drizzle-orm";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function main(): Promise<void> {
  const rows = await db.query.apiKeys.findMany();

  let updated = 0;

  for (const row of rows) {
    if (row.publicKeyHash && row.secretKeyPrefix) continue;

    await db
      .update(apiKeys)
      .set({
        publicKeyHash: row.publicKeyHash ?? sha256(row.publicKey),
        secretKeyPrefix: row.secretKeyPrefix ?? row.secretKeyHash.slice(0, 12),
      })
      .where(eq(apiKeys.id, row.id));

    updated += 1;
  }

  console.log(`Backfilled ${updated} of ${rows.length} api_keys row(s).`);
}

main().catch((error: unknown) => {
  console.error("Failed to backfill api_keys hashes:", error);
  process.exit(1);
});
