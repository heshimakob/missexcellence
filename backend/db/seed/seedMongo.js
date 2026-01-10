import { SiteContentModel } from "../models/SiteContent.js";
import { NewsModel } from "../models/News.js";
import { BlogPostModel } from "../models/BlogPost.js";
import { defaultSiteContent } from "./defaultSiteContent.js";
import { newsItems } from "../../models/news.model.js";
import { blogPosts } from "../../models/blog.model.js";

export async function seedMongoIfEmpty() {
  const existingContent = await SiteContentModel.findOne({ key: "main" }).lean();
  if (!existingContent) {
    await SiteContentModel.create({ key: "main", content: defaultSiteContent });
  }

  const newsCount = await NewsModel.countDocuments();
  if (newsCount === 0) {
    await NewsModel.insertMany(newsItems.map(stripIds));
  }

  const blogCount = await BlogPostModel.countDocuments();
  if (blogCount === 0) {
    await BlogPostModel.insertMany(blogPosts.map(stripIds));
  }
}

function stripIds(obj) {
  const { id, _id, ...rest } = obj;
  return rest;
}




