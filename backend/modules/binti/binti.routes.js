import { Router } from "express";
import { getBintiPost, getBintiPosts } from "./binti.controller.js";

export const bintiRouter = Router();

bintiRouter.get("/posts", getBintiPosts);
bintiRouter.get("/posts/:slug", getBintiPost);
