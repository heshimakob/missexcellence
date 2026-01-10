import { blogPosts } from "../models/blog.model.js";

export function listBlogPosts() {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}


