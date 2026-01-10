import { Router } from "express";

import { postAdminLogin, postAdminLogout } from "../controllers/adminAuth.controller.js";
import { getAdminMe } from "../controllers/adminMe.controller.js";
import { requireAdminAuth } from "../middlewares/requireAdminAuth.js";

export const adminAuthRouter = Router();
adminAuthRouter.post("/login", postAdminLogin);
adminAuthRouter.post("/logout", postAdminLogout);

export const adminRouter = Router();
adminRouter.get("/me", requireAdminAuth, getAdminMe);


