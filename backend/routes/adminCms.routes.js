import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

import { requireAdminAuth } from "../middlewares/requireAdminAuth.js";
import { getAdminSiteContent, putAdminSiteContent } from "../controllers/siteContent.controller.js";
import { AppError } from "../shared/errors/AppError.js";
import { adminCreateNews, adminDeleteNews, adminUpdateNews, listNewsAsync } from "../services/news.service.js";
import { adminCreateBinti, adminDeleteBinti, adminUpdateBinti, listBintiPostsAsync } from "../services/bintiMongo.service.js";
import { getContactMessages, patchContactMessage, deleteContactMessageHandler } from "../controllers/contactAdmin.controller.js";

export const adminCmsRouter = Router();

adminCmsRouter.use(requireAdminAuth);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "public", "uploads");
await fs.mkdir(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

adminCmsRouter.post("/upload", upload.single("file"), (req, res, next) => {
  if (!req.file) return next(new AppError("Fichier manquant", 400, { code: "BAD_REQUEST" }));
  const url = `/static/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

// Site content (single JSON)
adminCmsRouter.get("/site", getAdminSiteContent);
adminCmsRouter.put("/site", putAdminSiteContent);

// News CRUD
adminCmsRouter.get("/news", async (_req, res) => res.json({ items: await listNewsAsync() }));
adminCmsRouter.post("/news", async (req, res, next) => {
  try {
    const item = await adminCreateNews(req.body);
    res.status(201).json({ item });
  } catch (e) {
    next(new AppError(e.message || "Cannot create", 503, { code: "SERVICE_UNAVAILABLE" }));
  }
});
adminCmsRouter.put("/news/:id", async (req, res, next) => {
  try {
    const item = await adminUpdateNews(req.params.id, req.body);
    if (!item) return next(new AppError("Not found", 404, { code: "NOT_FOUND" }));
    res.json({ item });
  } catch (e) {
    next(new AppError(e.message || "Cannot update", 503, { code: "SERVICE_UNAVAILABLE" }));
  }
});
adminCmsRouter.delete("/news/:id", async (req, res, next) => {
  try {
    const item = await adminDeleteNews(req.params.id);
    if (!item) return next(new AppError("Not found", 404, { code: "NOT_FOUND" }));
    res.status(204).send();
  } catch (e) {
    next(new AppError(e.message || "Cannot delete", 503, { code: "SERVICE_UNAVAILABLE" }));
  }
});

// Binti CRUD
adminCmsRouter.get("/binti", async (_req, res) => res.json({ posts: await listBintiPostsAsync() }));
adminCmsRouter.post("/binti", async (req, res, next) => {
  try {
    const post = await adminCreateBinti(req.body);
    res.status(201).json({ post });
  } catch (e) {
    next(new AppError(e.message || "Cannot create", 503, { code: "SERVICE_UNAVAILABLE" }));
  }
});
adminCmsRouter.put("/binti/:id", async (req, res, next) => {
  try {
    const post = await adminUpdateBinti(req.params.id, req.body);
    if (!post) return next(new AppError("Not found", 404, { code: "NOT_FOUND" }));
    res.json({ post });
  } catch (e) {
    next(new AppError(e.message || "Cannot update", 503, { code: "SERVICE_UNAVAILABLE" }));
  }
});
adminCmsRouter.delete("/binti/:id", async (req, res, next) => {
  try {
    const post = await adminDeleteBinti(req.params.id);
    if (!post) return next(new AppError("Not found", 404, { code: "NOT_FOUND" }));
    res.status(204).send();
  } catch (e) {
    next(new AppError(e.message || "Cannot delete", 503, { code: "SERVICE_UNAVAILABLE" }));
  }
});

// Contact Messages CRUD
adminCmsRouter.get("/contact/messages", getContactMessages);
adminCmsRouter.patch("/contact/messages/:id", patchContactMessage);
adminCmsRouter.delete("/contact/messages/:id", deleteContactMessageHandler);




