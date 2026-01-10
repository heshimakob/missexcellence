import { Router } from "express";
import { getBlogPost, getBlogPosts } from "./blog.controller.js";

export const blogRouter = Router();

blogRouter.get("/posts", getBlogPosts);
blogRouter.get("/posts/:slug", getBlogPost);


