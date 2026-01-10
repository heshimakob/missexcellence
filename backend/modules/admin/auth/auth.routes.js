import { Router } from "express";
import { postAdminLogin, postAdminLogout } from "./auth.controller.js";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", postAdminLogin);
adminAuthRouter.post("/logout", postAdminLogout);


