// utils/AppError.js
//
// Custom error class used across the app so we can attach an HTTP status
// code to any error we throw on purpose (e.g. "user not found").
// This lets the central error handler tell the difference between
// "expected" errors (bad input, missing resource) and real bugs.

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; // marks this as a known, handled error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
