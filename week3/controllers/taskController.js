const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title: title.trim(),
    description,
    status,
    priority,
    dueDate,
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

/**
 * @desc    Get all tasks (supports optional filtering & pagination)
 * @route   GET /api/tasks
 * @access  Public
 *
 * Query params supported:
 *   status   - filter by task status
 *   priority - filter by task priority
 *   page     - page number (default 1)
 *   limit    - results per page (default 10)
 */
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: tasks,
  });
});

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, `Task not found with id: ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, `Task not found with id: ${req.params.id}`);
  }

  const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'completed'];
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  const updatedTask = await task.save(); // triggers schema validation + pre-save hook

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask,
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new ApiError(404, `Task not found with id: ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: { id: req.params.id },
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
