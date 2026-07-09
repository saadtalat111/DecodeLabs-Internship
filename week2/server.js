// server.js
//
// Application entry point. Wires together middleware, routes, and
// error handling. Kept intentionally thin - all real logic lives in
// routes/controllers/middleware/models.

const express = require('express');
const usersRouter = require('./routes/users');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies into req.body
app.use(express.json());

// Catches malformed JSON in the request body (e.g. a trailing comma or
// missing quote) before it can crash anything downstream.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body.',
    });
  }
  next(err);
});

// Root route - simple health check / API index
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User Management API is running.',
    endpoints: {
      getAllUsers: 'GET /users',
      getUser: 'GET /users/:id',
      createUser: 'POST /users',
      updateUser: 'PUT /users/:id',
      deleteUser: 'DELETE /users/:id',
    },
  });
});

// Feature routes
app.use('/users', usersRouter);

// 404 handler - runs when no route above matched
app.use(notFoundHandler);

// Centralized error handler - must be registered last
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
