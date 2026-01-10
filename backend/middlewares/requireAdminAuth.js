import { AppError } from "../shared/errors/AppError.js";
import { adminSessionStore } from "../models/adminSession.store.js";

export function requireAdminAuth(req, _res, next) {
  const auth = req.header("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return next(new AppError("Missing Bearer token", 401, { code: "UNAUTHORIZED" }));

  const token = match[1];
  const session = adminSessionStore.get(token);
  if (!session) return next(new AppError("Invalid token", 401, { code: "UNAUTHORIZED" }));

  if (session.expiresAt < Date.now()) {
    adminSessionStore.delete(token);
    return next(new AppError("Token expired", 401, { code: "UNAUTHORIZED" }));
  }

  req.admin = { email: session.email };
  return next();
}


