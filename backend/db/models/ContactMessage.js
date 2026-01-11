import mongoose from "mongoose";

const { Schema } = mongoose;

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ContactMessageModel = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
