import mongoose from "mongoose";
import { BlogPostModel } from "../db/models/BlogPost.js";
import { blogPosts } from "../models/blog.model.js";

export async function listBlogPostsAsync() {
  if (mongoose.connection?.readyState !== 1) return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const docs = await BlogPostModel.find({}).sort({ date: -1 }).lean();
  return docs.map(toPublic);
}

export async function getBlogPostBySlugAsync(slug) {
  if (mongoose.connection?.readyState !== 1) return blogPosts.find((p) => p.slug === slug) ?? null;
  const doc = await BlogPostModel.findOne({ slug }).lean();
  return doc ? toPublic(doc) : null;
}

export async function adminCreateBlog(payload) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await BlogPostModel.create(payload);
  return toPublic(doc.toObject());
}

export async function adminUpdateBlog(id, payload) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await BlogPostModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  return doc ? toPublic(doc) : null;
}

export async function adminDeleteBlog(id) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await BlogPostModel.findByIdAndDelete(id).lean();
  return doc ? toPublic(doc) : null;
}

function toPublic(doc) {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    date: doc.date,
    tag: doc.tag,
    excerpt: doc.excerpt,
    cover: doc.cover ?? undefined,
    content: doc.content ?? [],
  };
}




