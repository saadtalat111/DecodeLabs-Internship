const ApiError = require('../utils/ApiError');

/**
 * Handles requests to undefined routes.
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized error-handling middleware. Every error in the application
 * (thrown manually via ApiError, or raised by Mongoose/MongoDB/Express)
 * ends up here and is translated into a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation errors (schema-level validation failures)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join('; ');
  }

  // Mongoose duplicate key error (e.g. unique field violated)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose cast errors (e.g. malformed ObjectId reaching the driver)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field ${err.path}: ${err.value}`;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
