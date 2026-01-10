import { AppError } from "../shared/errors/AppError.js";
import { getBlogPostBySlugAsync, listBlogPostsAsync } from "../services/blogMongo.service.js";

export async function getBlogPosts(_req, res) {
  res.json({ posts: await listBlogPostsAsync() });
}

export async function getBlogPost(req, res, next) {
  const post = await getBlogPostBySlugAsync(req.params.slug);
  if (!post) return next(new AppError("Post not found", 404, { code: "NOT_FOUND" }));
  return res.json({ post });
}


