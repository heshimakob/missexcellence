import { Router } from "express";
import { getPublicHome } from "../controllers/public.controller.js";

export const publicRouter = Router();
publicRouter.get("/home", getPublicHome);


