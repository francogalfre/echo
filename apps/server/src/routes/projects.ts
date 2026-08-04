import { uploadFeedbackPageBanner } from "@echo/api/controllers/feedback/page";
import { uploadOrganizationLogo } from "@echo/api/controllers/organization";
import { Hono } from "hono";

import { createUploadHandler } from "@/lib/upload";

export const projectRoutes = new Hono();

projectRoutes.post("/logo", createUploadHandler(uploadOrganizationLogo));
projectRoutes.post("/banner", createUploadHandler(uploadFeedbackPageBanner));
