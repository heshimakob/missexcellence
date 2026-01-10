/**
 * Simple in-memory admin session store (token -> { email, expiresAt }).
 * Replace with Redis/DB for production.
 */
export const adminSessionStore = new Map();


