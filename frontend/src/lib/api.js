// Backend listens on PORT (backend/.env) → default 3000. Keep the same default
// here so the frontend talks to the running API without extra config.
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export function apiUrl(path) {
  if (!path.startsWith("/")) return `${API_BASE}/${path}`;
  return `${API_BASE}${path}`;
}

export async function apiFetch(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  // Ne pas forcer JSON si on envoie du FormData (upload)
  const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData;
  if (!headers.has("content-type") && opts.body && !isFormData) {
    headers.set("content-type", "application/json");
  }

  const res = await fetch(apiUrl(path), {
    ...opts,
    headers,
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error?.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}


