import { AppError } from "../shared/errors/AppError.js";

export function notFoundHandler(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, { code: "NOT_FOUND" }));
}


