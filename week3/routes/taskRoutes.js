const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const validateObjectId = require('../middlewares/validateObjectId');
const { validateCreateTask, validateUpdateTask } = require('../middlewares/validateTask');

// POST   /api/tasks       -> create a task
// GET    /api/tasks       -> get all tasks (supports ?status, ?priority, ?page, ?limit)
router.route('/').post(validateCreateTask, createTask).get(getTasks);

// GET    /api/tasks/:id   -> get single task
// PUT    /api/tasks/:id   -> update task
// DELETE /api/tasks/:id   -> delete task
router
  .route('/:id')
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, validateUpdateTask, updateTask)
  .delete(validateObjectId, deleteTask);

module.exports = router;
