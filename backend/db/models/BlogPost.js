import mongoose from "mongoose";

const { Schema } = mongoose;

const BlogPostSchema = new Schema(
  {
    slug: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    tag: { type: String, default: "Blog" },
    excerpt: { type: String, default: "" },
    cover: {
      gradient: { type: String, default: "from-neon-500/25 via-white/10 to-orchid-500/25" },
    },
    content: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const BlogPostModel =
  mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);




