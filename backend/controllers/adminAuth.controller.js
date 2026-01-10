import { z } from "zod";

import { AppError } from "../shared/errors/AppError.js";
import { loginAdmin, logoutAdmin } from "../services/adminAuth.service.js";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function postAdminLogin(req, res, next) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError("Invalid payload", 400, { code: "BAD_REQUEST", details: parsed.error.flatten() }));
  }

  try {
    const result = loginAdmin(parsed.data);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export function postAdminLogout(req, res) {
  const auth = req.header("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  logoutAdmin(match?.[1]);
  res.status(204).send();
}


