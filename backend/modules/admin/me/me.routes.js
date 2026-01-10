import { Router } from "express";
import { requireAdminAuth } from "../auth/index.js";
import { getAdminMe } from "./me.controller.js";

export const adminMeRouter = Router();

adminMeRouter.get("/me", requireAdminAuth, getAdminMe);


