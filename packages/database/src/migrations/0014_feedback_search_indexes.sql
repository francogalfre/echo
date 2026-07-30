CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS btree_gin;
--> statement-breakpoint
CREATE INDEX "feedback_org_fts_idx" ON "feedback" USING gin (organization_id, to_tsvector('english', content));
--> statement-breakpoint
CREATE INDEX "feedback_content_trgm_idx" ON "feedback" USING gin (content gin_trgm_ops);
