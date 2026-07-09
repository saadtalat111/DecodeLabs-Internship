const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// --- Global middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Manager API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// --- API routes ---
app.use('/api/tasks', taskRoutes);

// --- 404 + centralized error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
