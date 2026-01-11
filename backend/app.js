import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "./config/env.js";
import { buildRoutes } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "http://localhost:3000", "https:"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:"],
          fontSrc: ["'self'", "https:", "data:"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  );

  // Accept larger payloads for CMS (e.g., image URLs/base64) while staying reasonable.
  // Restrict parsers to their exact content-type to avoid consuming multipart/form-data (handled by multer).
  app.use(
    express.json({
      limit: "10mb",
      type: ["application/json", "application/*+json"],
    }),
  );
  app.use(
    express.urlencoded({
      limit: "10mb",
      extended: true,
      type: "application/x-www-form-urlencoded",
    }),
  );
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/", (_req, res) => {
    res.json({ name: "miss-excellence-api", status: "ok" });
  });

  // Static assets (e.g. news images): /static/...
  app.use("/static", express.static(path.join(__dirname, "public")));

  app.use(buildRoutes());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}


