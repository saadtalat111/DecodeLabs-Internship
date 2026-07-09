// middleware/errorHandler.js
//
// Two pieces of centralized error handling:
//   1. notFoundHandler - catches requests to routes that don't exist at all.
//   2. globalErrorHandler - catches every error passed via next(err) or
//      thrown in an async handler, and turns it into a consistent JSON
//      response so the client never sees a raw stack trace.

// Handles requests to routes that don't exist (e.g. GET /foo).
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
};

// Must be registered LAST in server.js (after all routes) so Express
// recognizes it as an error-handling middleware (4 arguments).
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Only expose the error message for errors we threw on purpose
  // (AppError instances). Anything else is an unexpected bug, so we
  // hide the details from the client but log them for ourselves.
  const message = err.isOperational ? err.message : 'Something went wrong on the server.';

  if (!err.isOperational) {
    console.error('UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
