import mongoose from "mongoose";
import { BintiPostModel } from "../db/models/BintiPost.js";
import { bintiPosts } from "../models/binti.model.js";

export async function listBintiPostsAsync() {
  if (mongoose.connection?.readyState !== 1) return [...bintiPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const docs = await BintiPostModel.find({}).sort({ date: -1 }).lean();
  return docs.map(toPublic);
}

export async function getBintiPostBySlugAsync(slug) {
  if (mongoose.connection?.readyState !== 1) return bintiPosts.find((p) => p.slug === slug) ?? null;
  const doc = await BintiPostModel.findOne({ slug }).lean();
  return doc ? toPublic(doc) : null;
}

export async function adminCreateBinti(payload) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await BintiPostModel.create(payload);
  return toPublic(doc.toObject());
}

export async function adminUpdateBinti(id, payload) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await BintiPostModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  return doc ? toPublic(doc) : null;
}

export async function adminDeleteBinti(id) {
  if (mongoose.connection?.readyState !== 1) throw new Error("MongoDB not connected");
  const doc = await BintiPostModel.findByIdAndDelete(id).lean();
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
