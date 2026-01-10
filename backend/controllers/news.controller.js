import { AppError } from "../shared/errors/AppError.js";
import { getNewsBySlugAsync, listNewsAsync } from "../services/news.service.js";

export async function getNewsList(_req, res) {
  res.json({ items: await listNewsAsync() });
}

export async function getNewsDetail(req, res, next) {
  const item = await getNewsBySlugAsync(req.params.slug);
  if (!item) return next(new AppError("News not found", 404, { code: "NOT_FOUND" }));
  return res.json({ item });
}


