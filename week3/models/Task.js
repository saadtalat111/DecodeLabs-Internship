const mongoose = require('mongoose');

/**
 * Task Schema
 *
 * Represents a single task/todo item persisted in MongoDB.
 * Includes field-level validation so that invalid data never
 * reaches the database layer.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be one of: pending, in-progress, completed',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be one of: low, medium, high',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // dueDate is optional, but if provided it must be a valid future-or-present date
          if (!value) return true;
          return value instanceof Date && !isNaN(value);
        },
        message: 'dueDate must be a valid date',
      },
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    versionKey: false,
  }
);

// Keep "completed" and "status" in sync at the schema level so the
// two fields never contradict each other regardless of which one
// the client updates.
taskSchema.pre('save', function (next) {
  if (this.status === 'completed') {
    this.completed = true;
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
