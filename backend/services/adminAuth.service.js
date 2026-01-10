import crypto from "node:crypto";

import { env } from "../config/env.js";
import { AppError } from "../shared/errors/AppError.js";
import { adminSessionStore } from "../models/adminSession.store.js";

export function loginAdmin({ email, password }) {
  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    throw new AppError("Invalid credentials", 401, { code: "UNAUTHORIZED" });
  }

  const token = crypto.randomBytes(24).toString("base64url");
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8h
  adminSessionStore.set(token, { email, expiresAt });

  return { token, expiresAt, admin: { email } };
}

export function logoutAdmin(token) {
  if (!token) return;
  adminSessionStore.delete(token);
}


