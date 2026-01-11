import { Router } from "express";
import { getPublicHome } from "../controllers/public.controller.js";
import { postContactMessage } from "../controllers/contact.controller.js";

export const publicRouter = Router();
publicRouter.get("/home", getPublicHome);
publicRouter.post("/contact", postContactMessage);


