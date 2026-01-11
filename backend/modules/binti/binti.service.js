import { bintiPosts } from "./binti.model.js";

export function listBintiPosts() {
  // list view, newest first
  return [...bintiPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBintiPostBySlug(slug) {
  return bintiPosts.find((p) => p.slug === slug) ?? null;
}
