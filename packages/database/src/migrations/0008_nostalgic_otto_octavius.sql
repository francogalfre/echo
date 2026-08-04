CREATE TABLE "board_items" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"feedback_id" text NOT NULL,
	"column" text DEFAULT 'backlog' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "board_items_feedback_id_unique" UNIQUE("feedback_id")
);
--> statement-breakpoint
CREATE TABLE "feedback_digests" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"digest" jsonb NOT NULL,
	"generated_at" timestamp NOT NULL,
	"feedback_count" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "board_items" ADD CONSTRAINT "board_items_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_items" ADD CONSTRAINT "board_items_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_digests" ADD CONSTRAINT "feedback_digests_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_digests_org_generated_at_idx" ON "feedback_digests" USING btree ("organization_id","generated_at");--> statement-breakpoint
CREATE INDEX "feedback_org_created_idx" ON "feedback" USING btree ("organization_id","created_at" desc);