export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {{code?: string, details?: any}} [opts]
   */
  constructor(message, status = 500, opts = {}) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = opts.code;
    this.details = opts.details;
  }
}
