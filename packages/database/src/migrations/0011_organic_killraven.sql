ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_organization_id_unique";--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "name" text DEFAULT 'Default' NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "public_key_hash" text;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "secret_key_prefix" text;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "scopes" text[] DEFAULT '{"feedback:write"}' NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "last_used_at" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "revoked_at" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_keys_org_idx" ON "api_keys" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "api_keys_org_name_live_idx" ON "api_keys" USING btree ("organization_id","name") WHERE "api_keys"."revoked_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "api_keys_public_key_hash_idx" ON "api_keys" USING btree ("public_key_hash");