import { Router } from "express";
import { getBintiPost, getBintiPosts } from "../controllers/binti.controller.js";

export const bintiRouter = Router();

bintiRouter.get("/posts", getBintiPosts);
bintiRouter.get("/posts/:slug", getBintiPost);
