import mongoose from "mongoose";
import { SiteContentModel } from "../db/models/SiteContent.js";
import { defaultSiteContent } from "../db/seed/defaultSiteContent.js";

export async function getSiteContent() {
  if (!isMongoReady()) return defaultSiteContent;
  const doc = await SiteContentModel.findOne({ key: "main" }).lean();
  return doc?.content ?? defaultSiteContent;
}

export async function upsertSiteContent(content) {
  if (!isMongoReady()) {
    // If Mongo isn't configured, we still allow the app to run;
    // but admin changes can't persist.
    return { saved: false };
  }

  const doc = await SiteContentModel.findOneAndUpdate(
    { key: "main" },
    { $set: { content } },
    { upsert: true, new: true },
  ).lean();
  return { saved: true, content: doc.content };
}

function isMongoReady() {
  return mongoose.connection?.readyState === 1;
}




