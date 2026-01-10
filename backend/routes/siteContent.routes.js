import { Router } from "express";
import { getPublicSiteContent } from "../controllers/siteContent.controller.js";

export const siteContentRouter = Router();
siteContentRouter.get("/", getPublicSiteContent);




