import { AppError } from "../shared/errors/AppError.js";
import { getBintiPostBySlugAsync, listBintiPostsAsync } from "../services/bintiMongo.service.js";

export async function getBintiPosts(_req, res) {
  res.json({ posts: await listBintiPostsAsync() });
}

export async function getBintiPost(req, res, next) {
  const post = await getBintiPostBySlugAsync(req.params.slug);
  if (!post) return next(new AppError("Post not found", 404, { code: "NOT_FOUND" }));
  return res.json({ post });
}
