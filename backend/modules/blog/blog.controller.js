import { AppError } from "../../shared/errors/AppError.js";
import { getBlogPostBySlug, listBlogPosts } from "./blog.service.js";

export function getBlogPosts(_req, res) {
  res.json({ posts: listBlogPosts() });
}

export function getBlogPost(req, res, next) {
  const post = getBlogPostBySlug(req.params.slug);
  if (!post) return next(new AppError("Post not found", 404, { code: "NOT_FOUND" }));
  return res.json({ post });
}


