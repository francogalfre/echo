ALTER TABLE "api_keys" ALTER COLUMN "public_key_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "secret_key_prefix" SET NOT NULL;