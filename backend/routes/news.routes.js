import { Router } from "express";
import { getNewsDetail, getNewsList } from "../controllers/news.controller.js";

export const newsRouter = Router();

newsRouter.get("/", getNewsList);
newsRouter.get("/:slug", getNewsDetail);


