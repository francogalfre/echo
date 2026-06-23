CREATE TABLE "feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"author_name" text NOT NULL,
	"content" text NOT NULL,
	"email" text,
	"rating" integer,
	"source" text DEFAULT 'form' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_page_config" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"accent_color" text DEFAULT '#7C3AED' NOT NULL,
	"enable_email" boolean DEFAULT false NOT NULL,
	"enable_rating" boolean DEFAULT false NOT NULL,
	"enable_cover_banner" boolean DEFAULT false NOT NULL,
	"cover_banner_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feedback_page_config_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_page_config" ADD CONSTRAINT "feedback_page_config_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_org_idx" ON "feedback" USING btree ("organization_id");