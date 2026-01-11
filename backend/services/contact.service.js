import mongoose from "mongoose";
import { ContactMessageModel } from "../db/models/ContactMessage.js";

export async function createContactMessage(payload) {
  if (mongoose.connection?.readyState !== 1) {
    throw new Error("MongoDB not connected");
  }
  const doc = await ContactMessageModel.create(payload);
  return doc.toObject();
}

export async function listContactMessages() {
  if (mongoose.connection?.readyState !== 1) {
    return [];
  }
  const docs = await ContactMessageModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((doc) => ({
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    subject: doc.subject,
    message: doc.message,
    read: doc.read || false,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  }));
}

export async function markAsRead(id) {
  if (mongoose.connection?.readyState !== 1) {
    throw new Error("MongoDB not connected");
  }
  const doc = await ContactMessageModel.findByIdAndUpdate(id, { read: true }, { new: true }).lean();
  return doc ? { id: String(doc._id), ...doc } : null;
}

export async function deleteContactMessage(id) {
  if (mongoose.connection?.readyState !== 1) {
    throw new Error("MongoDB not connected");
  }
  const doc = await ContactMessageModel.findByIdAndDelete(id).lean();
  return doc ? { id: String(doc._id), ...doc } : null;
}
