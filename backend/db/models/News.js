import mongoose from "mongoose";

const { Schema } = mongoose;

const NewsSchema = new Schema(
  {
    slug: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true }, // keep as ISO date string for now
    tag: { type: String, default: "Actualité" },
    excerpt: { type: String, default: "" },
    imageUrl: { type: String, default: "" }, // can be /static/... or full URL
    content: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const NewsModel = mongoose.models.News || mongoose.model("News", NewsSchema);




