import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../shared/logger.js";
import { seedMongoIfEmpty } from "../db/seed/seedMongo.js";

export async function connectMongo() {
  if (!env.MONGO_URI) {
    logger.warn("MONGO_URI not set. MongoDB connection skipped.");
    return;
  }

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("MongoDB connected");
    await seedMongoIfEmpty();
    logger.info("MongoDB seed ensured");
  } catch (err) {
    logger.error("MongoDB connection failed", { err });
    process.exit(1);
  }
}

export async function disconnectMongo() {
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
}


