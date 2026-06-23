CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"public_key" text NOT NULL,
	"secret_key_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_organization_id_unique" UNIQUE("organization_id"),
	CONSTRAINT "api_keys_public_key_unique" UNIQUE("public_key"),
	CONSTRAINT "api_keys_secret_key_hash_unique" UNIQUE("secret_key_hash")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;