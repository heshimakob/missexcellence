import { Router } from "express";

import { healthRouter } from "./health.routes.js";
import { publicRouter } from "./public.routes.js";
import { blogRouter } from "./blog.routes.js";
import { newsRouter } from "./news.routes.js";
import { siteContentRouter } from "./siteContent.routes.js";
import { adminAuthRouter, adminRouter } from "./admin.routes.js";
import { adminCmsRouter } from "./adminCms.routes.js";

export function buildRoutes() {
  const router = Router();

  router.use("/health", healthRouter);

  router.use("/api/public", publicRouter);
  router.use("/api/public/blog", blogRouter);
  router.use("/api/public/news", newsRouter);
  router.use("/api/public/content", siteContentRouter);

  router.use("/api/admin/auth", adminAuthRouter);
  router.use("/api/admin", adminRouter);
  router.use("/api/admin/cms", adminCmsRouter);

  return router;
}


