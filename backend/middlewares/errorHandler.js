import { AppError } from "../shared/errors/AppError.js";
import { logger } from "../shared/logger.js";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const appErr = err instanceof AppError ? err : new AppError("Internal server error", 500);

  if (!(err instanceof AppError)) {
    logger.error("Unhandled error", { err });
  }

  res.status(appErr.status).json({
    error: {
      message: appErr.message,
      code: appErr.code ?? "INTERNAL_ERROR",
      details: appErr.details ?? undefined,
    },
  });
}


