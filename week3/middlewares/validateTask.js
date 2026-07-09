const ApiError = require('../utils/ApiError');

const ALLOWED_STATUS = ['pending', 'in-progress', 'completed'];
const ALLOWED_PRIORITY = ['low', 'medium', 'high'];

/**
 * Validates the request body when creating a new task.
 * Runs before the request reaches the controller/database layer so
 * that bad input is rejected early with a clear, actionable message.
 */
const validateCreateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
    errors.push(`Status must be one of: ${ALLOWED_STATUS.join(', ')}`);
  }

  if (priority !== undefined && !ALLOWED_PRIORITY.includes(priority)) {
    errors.push(`Priority must be one of: ${ALLOWED_PRIORITY.join(', ')}`);
  }

  if (dueDate !== undefined && dueDate !== null && isNaN(Date.parse(dueDate))) {
    errors.push('dueDate must be a valid date string');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('; ')));
  }

  next();
};

/**
 * Validates the request body when updating an existing task.
 * All fields are optional on update, but whichever fields ARE
 * present must be valid.
 */
const validateUpdateTask = (req, res, next) => {
  const { title, status, priority, dueDate, completed } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    errors.push('Request body cannot be empty for an update');
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title must be a non-empty string');
    } else if (title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }
  }

  if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
    errors.push(`Status must be one of: ${ALLOWED_STATUS.join(', ')}`);
  }

  if (priority !== undefined && !ALLOWED_PRIORITY.includes(priority)) {
    errors.push(`Priority must be one of: ${ALLOWED_PRIORITY.join(', ')}`);
  }

  if (dueDate !== undefined && dueDate !== null && isNaN(Date.parse(dueDate))) {
    errors.push('dueDate must be a valid date string');
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('completed must be a boolean value');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('; ')));
  }

  next();
};

module.exports = { validateCreateTask, validateUpdateTask };
