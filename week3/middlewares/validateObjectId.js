const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

/**
 * Guards any route that expects a MongoDB ObjectId in the URL params
 * (e.g. /api/tasks/:id). Rejects malformed IDs with a 400 before the
 * request ever reaches the controller or database layer.
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, `Invalid task ID: ${id}`));
  }

  next();
};

module.exports = validateObjectId;
