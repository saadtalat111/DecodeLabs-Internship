// controllers/usersController.js
//
// Controllers contain the actual business logic for each endpoint.
// They talk to the model layer (never the raw data array), and are
// responsible for shaping the HTTP response - status codes, JSON body,
// and delegating errors to the centralized error handler via next().

const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

// GET /users
// Returns every user in the system.
const getAllUsers = (req, res) => {
  const users = userModel.getAll();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};

// GET /users/:id
// Returns a single user, or delegates a 404 to the error handler.
const getUserById = (req, res, next) => {
  const { id } = req.params;
  const user = userModel.getById(id);

  if (!user) {
    return next(new AppError(`User with ID ${id} not found.`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// POST /users
// Creates a new user. Validation has already run in middleware by
// the time this executes, so req.body is guaranteed to be well-formed.
const createUser = (req, res) => {
  const { name, email, age } = req.body;

  const newUser = userModel.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    age,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: newUser,
  });
};

// PUT /users/:id
// Updates one or more fields on an existing user.
const updateUser = (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.name) updates.name = updates.name.trim();
  if (updates.email) updates.email = updates.email.trim().toLowerCase();

  const updatedUser = userModel.update(id, updates);

  if (!updatedUser) {
    return next(new AppError(`User with ID ${id} not found.`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: updatedUser,
  });
};

// DELETE /users/:id
// Removes a user from the store.
const deleteUser = (req, res, next) => {
  const { id } = req.params;
  const deletedUser = userModel.remove(id);

  if (!deletedUser) {
    return next(new AppError(`User with ID ${id} not found.`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully.',
    data: deletedUser,
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
