# Task Manager API

A RESTful backend service for managing tasks, built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. This project demonstrates full CRUD functionality backed by persistent database storage, proper schema design, request validation, and centralized error handling using an MVC-style architecture.

> Built as part of the **DecodeLabs Full Stack Development Internship — Week 3: Database Integration**.

---

## Project Overview

Earlier stages of this internship stored data in memory (arrays/objects), which meant all data was lost every time the server restarted. This project replaces that approach with **real data persistence**: every task is stored in a MongoDB database via Mongoose, with schema-level validation, proper HTTP status codes, and structured error responses — the same patterns used in production Express APIs.

The domain chosen for this project is a **Task Manager**, since it's a realistic use case that naturally exercises every CRUD operation (create a task, list tasks, fetch one task, update its status, delete it).

---

## Features

- Full CRUD REST API (Create, Read, Update, Delete)
- MongoDB persistence via Mongoose ODM
- Schema-level validation (required fields, enums, length limits, custom validators)
- Request-level validation middleware (rejects bad input before it touches the DB)
- Centralized error handling (Mongoose `ValidationError`, `CastError`, duplicate keys, 404s, 500s)
- Consistent JSON response shape across all endpoints
- Pagination and filtering support on the "list tasks" endpoint
- Clean MVC folder structure with separated concerns
- Environment-based configuration via `dotenv` (no hardcoded secrets)
- CORS enabled for cross-origin requests

---

## Technologies Used

| Technology  | Purpose                                   |
|-------------|--------------------------------------------|
| Node.js     | JavaScript runtime                        |
| Express.js  | Web framework / routing                   |
| MongoDB     | NoSQL database                            |
| Mongoose    | ODM — schema definition & validation      |
| dotenv      | Environment variable management           |
| cors        | Cross-Origin Resource Sharing              |
| nodemon     | Dev-time auto-restart on file changes      |

---

## Folder Structure

```
task-manager-api/
├── config/
│   └── database.js          # MongoDB connection logic
├── controllers/
│   └── taskController.js    # Business logic for each CRUD operation
├── middlewares/
│   ├── errorHandler.js      # Centralized error handling + 404 handler
│   ├── validateObjectId.js  # Validates :id route params
│   └── validateTask.js      # Validates request bodies (create/update)
├── models/
│   └── Task.js              # Mongoose schema & model
├── routes/
│   └── taskRoutes.js        # Route definitions
├── utils/
│   ├── ApiError.js           # Custom error class with statusCode
│   └── asyncHandler.js       # Wrapper to avoid repetitive try-catch
├── app.js                   # Express app configuration
├── server.js                # Entry point — connects DB, starts server
├── .env.example              # Sample environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

1. **Clone or download the project**, then move into the project directory:
   ```bash
   cd task-manager-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** — copy the example file and fill in your own values:
   ```bash
   cp .env.example .env
   ```

---

## Dependencies

Production:
- `express`
- `mongoose`
- `dotenv`
- `cors`

Development:
- `nodemon`

All versions are pinned in `package.json`.

---

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable    | Description                              | Example                                              |
|-------------|--------------------------------------------|-------------------------------------------------------|
| `PORT`      | Port the server listens on                | `5000`                                                |
| `NODE_ENV`  | Environment mode                          | `development`                                         |
| `MONGO_URI` | MongoDB connection string                 | `mongodb://127.0.0.1:27017/task-manager-db`           |

**Never commit your real `.env` file.** It's already excluded via `.gitignore`.

---

## How to Run

**Development mode** (auto-restarts on file changes via nodemon):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

On successful startup you should see:
```
MongoDB connected: 127.0.0.1/task-manager-db
Server running in development mode on port 5000
```

---

## API Endpoints

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint          | Description                          |
|--------|-------------------|----------------------------------------|
| POST   | `/api/tasks`      | Create a new task                     |
| GET    | `/api/tasks`      | Get all tasks (supports filters/pagination) |
| GET    | `/api/tasks/:id`  | Get a single task by ID               |
| PUT    | `/api/tasks/:id`  | Update an existing task               |
| DELETE | `/api/tasks/:id`  | Delete a task                         |

### Query parameters for `GET /api/tasks`
| Param      | Description                                  |
|------------|-----------------------------------------------|
| `status`   | Filter by `pending`, `in-progress`, `completed` |
| `priority` | Filter by `low`, `medium`, `high`             |
| `page`     | Page number (default: `1`)                    |
| `limit`    | Results per page (default: `10`, max: `100`)  |

### Task Schema

| Field         | Type    | Required | Default   | Notes                                      |
|---------------|---------|----------|-----------|---------------------------------------------|
| `title`       | String  | Yes      | —         | 3–100 characters                            |
| `description` | String  | No       | `""`      | Max 500 characters                          |
| `status`      | String  | No       | `pending` | `pending` \| `in-progress` \| `completed`   |
| `priority`    | String  | No       | `medium`  | `low` \| `medium` \| `high`                 |
| `dueDate`     | Date    | No       | `null`    | Valid date string                            |
| `completed`   | Boolean | No       | `false`   | Auto-set to `true` when status is `completed` |
| `createdAt`   | Date    | Auto     | —         | Set by Mongoose timestamps                  |
| `updatedAt`   | Date    | Auto     | —         | Set by Mongoose timestamps                  |

### HTTP Status Codes Used
| Code | Meaning                                        |
|------|--------------------------------------------------|
| 200  | Successful GET / PUT / DELETE                  |
| 201  | Resource created (POST)                        |
| 400  | Validation error / malformed request / bad ID  |
| 404  | Resource or route not found                    |
| 500  | Unexpected server error                        |

---

## Example Requests (Postman-ready)

### 1. Create a task
`POST http://localhost:5000/api/tasks`
```json
{
  "title": "Prepare Week 3 internship submission",
  "description": "Finish database integration project and write README",
  "priority": "high",
  "dueDate": "2026-07-15"
}
```
**Response — 201 Created**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "668f1c2e4a1b2c3d4e5f6789",
    "title": "Prepare Week 3 internship submission",
    "description": "Finish database integration project and write README",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-07-15T00:00:00.000Z",
    "completed": false,
    "createdAt": "2026-07-09T10:00:00.000Z",
    "updatedAt": "2026-07-09T10:00:00.000Z"
  }
}
```

### 2. Get all tasks (with filters)
`GET http://localhost:5000/api/tasks?status=pending&priority=high&page=1&limit=10`

### 3. Get a single task
`GET http://localhost:5000/api/tasks/668f1c2e4a1b2c3d4e5f6789`

### 4. Update a task
`PUT http://localhost:5000/api/tasks/668f1c2e4a1b2c3d4e5f6789`
```json
{
  "status": "in-progress"
}
```

### 5. Delete a task
`DELETE http://localhost:5000/api/tasks/668f1c2e4a1b2c3d4e5f6789`

### Example validation error response
`POST /api/tasks` with `{ "title": "ab" }`
```json
{
  "success": false,
  "message": "Title must be at least 3 characters long"
}
```

### Example not-found response
`GET /api/tasks/000000000000000000000000`
```json
{
  "success": false,
  "message": "Task not found with id: 000000000000000000000000"
}
```

---

## Design Notes

- **Validation happens twice, intentionally.** Middleware validates the request shape before it reaches the controller (fast rejection, clear messages), and the Mongoose schema validates again at the data layer (defense in depth — protects the database even if a request bypasses the middleware in the future, e.g. from a new route).
- **`asyncHandler`** removes the need to wrap every controller in a `try/catch` block, keeping controllers focused on business logic.
- **Centralized error handling** means every error — whether it's a validation failure, a bad ObjectId, a duplicate key, or an unexpected exception — is normalized into the same `{ success, message }` response shape.
- **`status` and `completed`** are kept in sync via a `pre('save')` hook so the two fields can never contradict each other.

---

## Possible Future Enhancements

- Add user authentication (JWT) and scope tasks per user
- Add a `PATCH /api/tasks/:id/status` shortcut endpoint
- Add automated tests (Jest + Supertest)
- Add rate limiting and request logging (morgan)
