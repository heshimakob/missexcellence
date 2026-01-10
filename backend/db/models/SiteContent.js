import mongoose from "mongoose";

const { Schema } = mongoose;

const SiteContentSchema = new Schema(
  {
    key: { type: String, unique: true, index: true, default: "main" },
    // We keep this flexible so you can evolve content without migrations.
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const SiteContentModel =
  mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);




