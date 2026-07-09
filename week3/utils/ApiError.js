/**
 * Custom error class used throughout the application so that every
 * intentionally-thrown error carries an explicit HTTP status code.
 * This lets the centralized error handler respond consistently.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
