import http from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectMongo, disconnectMongo } from "./config/mongo.js";
import { logger } from "./shared/logger.js";

const app = createApp();
const server = http.createServer(app);

await connectMongo();

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    logger.error(
      `Port ${env.PORT} is already in use. Stop the other process or change PORT in .env (see env.example.txt).`,
    );
    process.exit(1);
  }
  logger.error("Server error", { err });
  process.exit(1);
});

server.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT} (or http://127.0.0.1:${env.PORT})`);
});

async function shutdown(signal) {
  logger.info(`Shutting down (${signal})...`);
  try {
    await disconnectMongo();
  } finally {
    server.close(() => process.exit(0));
    // Force-exit if something hangs
    setTimeout(() => process.exit(0), 1200).unref();
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));


