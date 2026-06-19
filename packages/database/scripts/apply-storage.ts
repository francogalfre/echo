import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({ path: "../../apps/server/.env" });

const here = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const sql = readFileSync(join(here, "..", "src", "storage.sql"), "utf8");
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }

  console.warn("✓ Supabase storage bucket 'organizations' is ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
