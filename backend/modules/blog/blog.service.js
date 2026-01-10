import { blogPosts } from "./blog.model.js";

export function listBlogPosts() {
  // list view, newest first
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}


