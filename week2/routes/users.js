// routes/users.js
//
// Routes ONLY wire up an HTTP method + path to a controller function
// (with validation middleware in between where needed). No business
// logic lives here - that keeps this file easy to scan as an API map.

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

const {
  validateCreateUser,
  validateUpdateUser,
  validateIdParam,
} = require('../middleware/validation');

router.get('/', getAllUsers);
router.get('/:id', validateIdParam, getUserById);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateIdParam, validateUpdateUser, updateUser);
router.delete('/:id', validateIdParam, deleteUser);

module.exports = router;
