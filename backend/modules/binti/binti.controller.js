import { AppError } from "../../shared/errors/AppError.js";
import { getBintiPostBySlug, listBintiPosts } from "./binti.service.js";

export function getBintiPosts(_req, res) {
  res.json({ posts: listBintiPosts() });
}

export function getBintiPost(req, res, next) {
  const post = getBintiPostBySlug(req.params.slug);
  if (!post) return next(new AppError("Post not found", 404, { code: "NOT_FOUND" }));
  return res.json({ post });
}
