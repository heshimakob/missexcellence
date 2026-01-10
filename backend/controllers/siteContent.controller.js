import { AppError } from "../shared/errors/AppError.js";
import { getSiteContent, upsertSiteContent } from "../services/siteContent.service.js";

export async function getPublicSiteContent(_req, res) {
  const content = await getSiteContent();
  res.json({ content });
}

export async function getAdminSiteContent(_req, res) {
  const content = await getSiteContent();
  res.json({ content });
}

export async function putAdminSiteContent(req, res, next) {
  const content = req.body?.content;
  if (!content || typeof content !== "object") {
    return next(new AppError("Invalid payload: expected { content: object }", 400, { code: "BAD_REQUEST" }));
  }
  const result = await upsertSiteContent(content);
  if (!result.saved) {
    return next(new AppError("MongoDB not connected. Cannot persist.", 503, { code: "SERVICE_UNAVAILABLE" }));
  }
  return res.json({ content: result.content });
}




