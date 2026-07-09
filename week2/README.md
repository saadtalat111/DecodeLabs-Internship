# Project 2 — User Management API

A RESTful backend API for managing users, built with **Node.js** and **Express.js** as part of the DecodeLabs Full Stack Development internship (Project 2: Backend API Development).

This project focuses purely on backend concepts: routing, request/response handling, validation, layered architecture, and centralized error handling. Data is stored in memory (no database yet), as per the project requirements.

---

## 1. Project Overview

The API implements full CRUD (Create, Read, Update, Delete) operations for a `User` resource:

- `id` — auto-generated, unique
- `name` — string, 2–50 characters
- `email` — string, valid email format
- `age` — number, positive integer

The project is structured the way a real Express backend would be organized in production: routes only define paths, controllers hold business logic, middleware handles cross-cutting concerns (validation, errors), and a model layer abstracts away the data source.

---

## 2. Features

- ✅ GET, POST, PUT, DELETE endpoints for `/users`
- ✅ Field-level request validation (name, email, age) with descriptive messages
- ✅ Route param validation (`:id` must be a positive integer)
- ✅ Proper HTTP status codes (200, 201, 400, 404, 500)
- ✅ Centralized error handling (no scattered try/catch per route)
- ✅ Handling of malformed JSON request bodies
- ✅ 404 handler for unknown routes
- ✅ Clean, modular folder structure with separation of concerns
- ✅ In-memory data store simulating a database table

---

## 3. Folder Structure

```
project-2/
│
├── package.json
├── package-lock.json
├── server.js               # App entry point: middleware, routes, error handling
├── .gitignore
├── README.md
│
├── routes/
│   └── users.js             # Route definitions only (method + path -> controller)
│
├── controllers/
│   └── usersController.js   # Business logic for each endpoint
│
├── middleware/
│   ├── validation.js         # Request validation (body + params)
│   └── errorHandler.js       # 404 handler + centralized error handler
│
├── models/
│   └── userModel.js          # Data access layer (getAll, getById, create, update, remove)
│
├── data/
│   └── users.js              # In-memory array acting as the "database"
│
└── utils/
    ├── helper.js              # generateId(), isValidEmail()
    └── AppError.js            # Custom error class carrying an HTTP status code
```

**Why this structure?** Each layer has exactly one job:

| Layer | Responsibility |
|---|---|
| `routes/` | Maps HTTP method + path to a controller. No logic. |
| `middleware/` | Validates requests and handles errors, before/around controllers. |
| `controllers/` | Business logic; shapes the HTTP response. |
| `models/` | Only place that touches the data store. |
| `data/` | The "database" (in-memory for now). |
| `utils/` | Small stateless helpers shared across layers. |

---

## 4. Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher installed
- [Postman](https://www.postman.com/) (or any REST client) for testing

### Steps

1. **Install Node.js** if you haven't already, and confirm it's installed:
   ```bash
   node -v
   npm -v
   ```

2. **Open the project folder** in your terminal / VS Code:
   ```bash
   cd project-2
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the project** (development mode, auto-restarts on file changes):
   ```bash
   npm run dev
   ```
   Or in plain mode:
   ```bash
   npm start
   ```

5. You should see:
   ```
   Server running on http://localhost:3000
   ```

6. **Test using Postman** (see section 7 below).

---

## 5. Dependencies

| Package | Type | Purpose |
|---|---|---|
| `express` | dependency | Web framework for routing and middleware |
| `nodemon` | devDependency | Auto-restarts the server on file changes during development |

---

## 6. Available Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health check / index of endpoints |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get a single user by ID |
| POST | `/users` | Create a new user |
| PUT | `/users/:id` | Update an existing user (partial updates allowed) |
| DELETE | `/users/:id` | Delete a user |

### Validation rules

| Field | Rules |
|---|---|
| `name` | Required, string, 2–50 characters |
| `email` | Required, must match a valid email format |
| `age` | Required, must be a positive whole number |

For `PUT`, all fields are optional individually, but **at least one** must be present, and any field you do send must pass its own rule above.

---

## 7. Postman Testing Guide

### GET all users
```
GET http://localhost:3000/users
```
Expected: `200 OK`

### GET single user
```
GET http://localhost:3000/users/1
```
Expected: `200 OK`, or `404` if the ID doesn't exist.

### POST — create a user
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Ali",
  "email": "ali@gmail.com",
  "age": 22
}
```
Expected: `201 Created`

### POST — validation failure
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "A",
  "email": "not-an-email",
  "age": -5
}
```
Expected: `400 Bad Request` with a message describing every failed rule.

### PUT — update a user
```
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "age": 23
}
```
Expected: `200 OK`

### DELETE — remove a user
```
DELETE http://localhost:3000/users/1
```
Expected: `200 OK`. Deleting the same ID again returns `404`.

### 404 testing
```
GET http://localhost:3000/users/9999
GET http://localhost:3000/some-fake-route
```
Both return `404 Not Found`.

### 500 testing
The global error handler is designed to catch any *unexpected* runtime error (a bug, not a validation failure) and respond with `500 Internal Server Error` instead of crashing the server or leaking a stack trace to the client. Since this is an in-memory demo with no external calls (DB, file system, network), a genuine 500 is hard to trigger by hand — but you can prove the mechanism works by temporarily throwing inside a controller, e.g. adding `throw new Error('test')` at the top of `getAllUsers`, hitting `GET /users`, and confirming you get a `500` with a generic message (then removing the line again).

---

## 8. Example Responses

### Success (GET /users)
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": 1, "name": "Ali Raza", "email": "ali.raza@example.com", "age": 24, "createdAt": "2026-07-09T09:23:55.873Z" }
  ]
}
```

### Created (POST /users)
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": { "id": 3, "name": "Bilal Ahmed", "email": "bilal@example.com", "age": 26, "createdAt": "2026-07-09T09:24:05.190Z" }
}
```

### Validation error (400)
```json
{
  "success": false,
  "message": "Name must be at least 2 characters long. Email must be a valid email address."
}
```

### Not found (404)
```json
{
  "success": false,
  "message": "User with ID 999 not found."
}
```

### Update response (200)
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": { "id": 3, "name": "Bilal Ahmed", "email": "bilal@example.com", "age": 27, "updatedAt": "2026-07-09T09:24:10.276Z" }
}
```

### Delete response (200)
```json
{
  "success": true,
  "message": "User deleted successfully.",
  "data": { "id": 3, "name": "Bilal Ahmed", "email": "bilal@example.com", "age": 27 }
}
```

### Server error (500)
```json
{
  "success": false,
  "message": "Something went wrong on the server."
}
```

---

## 9. Common Errors

| Symptom | Cause | Fix |
|---|---|---|
| `EADDRINUSE` on startup | Port 3000 already in use | Stop the other process, or set `PORT=3001` before running |
| `400` on every POST | Missing `Content-Type: application/json` header | Add the header in Postman/curl |
| `Malformed JSON in request body` | Invalid JSON syntax (trailing comma, missing quote) | Fix the JSON body |
| `Cannot GET /users/abc` — actually returns 400 | Non-numeric `:id` | Use a numeric ID |

---

## 10. Future Improvements

- Replace the in-memory array with a real database (MongoDB/PostgreSQL) once introduced in the internship
- Add pagination and filtering to `GET /users` (e.g. `?page=1&limit=10`)
- Add authentication (JWT) so routes can be protected
- Add automated tests (Jest + Supertest) for every endpoint
- Add request logging middleware (e.g. Morgan) for observability
- Add rate limiting to protect against abuse

---

## 11. Tech Stack

- Node.js
- Express.js
- JavaScript (ES6)

No frontend, database, or ORM is used, per Project 2's scope — the goal is to demonstrate backend fundamentals in isolation.
