// middleware/validation.js
//
// All incoming request validation lives here, separate from routes and
// controllers. Each middleware either calls next() to let the request
// continue, or next(new AppError(...)) to short-circuit it with a 400.

const AppError = require('../utils/AppError');
const { isValidEmail } = require('../utils/helper');

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

// Runs shared validation rules against a request body.
// `partial: true` means fields are optional individually (used for PUT),
// but whichever fields ARE present still have to pass their own rules.
const collectValidationErrors = (body, { partial = false } = {}) => {
  const errors = [];
  const { name, email, age } = body;

  // --- Name ---
  if (!partial || name !== undefined) {
    if (name === undefined || name === null || `${name}`.trim() === '') {
      errors.push('Name is required.');
    } else if (typeof name !== 'string') {
      errors.push('Name must be a string.');
    } else if (name.trim().length < NAME_MIN_LENGTH) {
      errors.push(`Name must be at least ${NAME_MIN_LENGTH} characters long.`);
    } else if (name.trim().length > NAME_MAX_LENGTH) {
      errors.push(`Name must not exceed ${NAME_MAX_LENGTH} characters.`);
    }
  }

  // --- Email ---
  if (!partial || email !== undefined) {
    if (email === undefined || email === null || `${email}`.trim() === '') {
      errors.push('Email is required.');
    } else if (typeof email !== 'string' || !isValidEmail(email)) {
      errors.push('Email must be a valid email address.');
    }
  }

  // --- Age ---
  if (!partial || age !== undefined) {
    if (age === undefined || age === null || age === '') {
      errors.push('Age is required.');
    } else if (typeof age !== 'number' || Number.isNaN(age)) {
      errors.push('Age must be a valid number.');
    } else if (age <= 0) {
      errors.push('Age must be greater than zero.');
    } else if (!Number.isInteger(age)) {
      errors.push('Age must be a whole number.');
    }
  }

  return errors;
};

// Validates the body of POST /users. All fields are required.
const validateCreateUser = (req, res, next) => {
  const errors = collectValidationErrors(req.body, { partial: false });

  if (errors.length > 0) {
    return next(new AppError(errors.join(' '), 400));
  }

  next();
};

// Validates the body of PUT /users/:id. At least one field must be
// present, and any field that is present must be individually valid.
const validateUpdateUser = (req, res, next) => {
  const { name, email, age } = req.body;

  if (name === undefined && email === undefined && age === undefined) {
    return next(
      new AppError('At least one field (name, email, age) must be provided to update.', 400)
    );
  }

  const errors = collectValidationErrors(req.body, { partial: true });

  if (errors.length > 0) {
    return next(new AppError(errors.join(' '), 400));
  }

  next();
};

// Validates that the :id route param is a positive integer, and
// normalizes it to a Number for downstream handlers.
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return next(new AppError('User ID must be a positive integer.', 400));
  }

  req.params.id = parsedId;
  next();
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateIdParam,
};
