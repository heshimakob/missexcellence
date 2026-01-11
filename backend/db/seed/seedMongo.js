import { SiteContentModel } from "../models/SiteContent.js";
import { NewsModel } from "../models/News.js";
import { BintiPostModel } from "../models/BintiPost.js";
import { defaultSiteContent } from "./defaultSiteContent.js";
import { newsItems } from "../../models/news.model.js";
import { bintiPosts } from "../../models/binti.model.js";

export async function seedMongoIfEmpty() {
  const existingContent = await SiteContentModel.findOne({ key: "main" }).lean();
  if (!existingContent) {
    await SiteContentModel.create({ key: "main", content: defaultSiteContent });
  }

  const newsCount = await NewsModel.countDocuments();
  if (newsCount === 0) {
    await NewsModel.insertMany(newsItems.map(stripIds));
  }

  const bintiCount = await BintiPostModel.countDocuments();
  if (bintiCount === 0) {
    await BintiPostModel.insertMany(bintiPosts.map(stripIds));
  }
}

function stripIds(obj) {
  const { id, _id, ...rest } = obj;
  return rest;
}




