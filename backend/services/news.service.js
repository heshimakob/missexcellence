import { newsItems } from "../models/news.model.js";
import mongoose from "mongoose";
import { NewsModel } from "../db/models/News.js";

export function listNews() {
  if (mongoose.connection?.readyState === 1) {
    // async equivalent handled in listNewsAsync
    return [];
  }
  return [...newsItems].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsBySlug(slug) {
  if (mongoose.connection?.readyState === 1) return null;
  return newsItems.find((n) => n.slug === slug) ?? null;
}

export function getLatestNews(limit = 3) {
  if (mongoose.connection?.readyState === 1) return [];
  return listNews().slice(0, limit);
}

export async function listNewsAsync() {
  if (mongoose.connection?.readyState !== 1) return listNews();
  const docs = await NewsModel.find({}).sort({ date: -1 }).lean();
  return docs.map(toPublic);
}

export async function getNewsBySlugAsync(slug) {
  if (mongoose.connection?.readyState !== 1) return getNewsBySlug(slug);
  const doc = await NewsModel.findOne({ slug }).lean();
  return doc ? toPublic(doc) : null;
}

export async function getLatestNewsAsync(limit = 3) {
  if (mongoose.connection?.readyState !== 1) return getLatestNews(limit);
  const docs = await NewsModel.find({}).sort({ date: -1 }).limit(limit).lean();
  return docs.map(toPublic);
}

export async function adminCreateNews(payload) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await NewsModel.create(payload);
  return toPublic(doc.toObject());
}

export async function adminUpdateNews(id, payload) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await NewsModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  return doc ? toPublic(doc) : null;
}

export async function adminDeleteNews(id) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await NewsModel.findByIdAndDelete(id).lean();
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
    imageUrl: doc.imageUrl,
    content: doc.content ?? [],
  };
}


