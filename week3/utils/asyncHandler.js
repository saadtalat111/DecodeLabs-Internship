/**
 * Wraps an async Express route handler and forwards any thrown/rejected
 * error to the next() middleware, so we avoid repeating try-catch blocks
 * in every single controller function.
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function} Express-compatible middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
