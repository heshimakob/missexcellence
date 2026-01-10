import { apiFetch } from "./api.js";
import { getAdminToken } from "./adminAuth.js";

export function adminFetch(path, opts = {}) {
  const token = getAdminToken();
  if (!token) {
    throw new Error("Session admin manquante. Merci de vous reconnecter.");
  }
  const headers = new Headers(opts.headers || {});
  headers.set("authorization", `Bearer ${token}`);
  return apiFetch(path, { ...opts, headers });
}




