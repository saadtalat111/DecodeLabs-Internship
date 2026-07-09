// models/userModel.js
//
// Acts as the "data access layer" for users. Controllers never touch the
// in-memory array directly - they always go through these functions.
// This mirrors how a real project would talk to a database through a
// model/repository, and makes it trivial to swap in MongoDB/Postgres later
// without changing a single line in the controllers.

const users = require('../data/users');
const { generateId } = require('../utils/helper');

// Returns every user currently stored in memory.
const getAll = () => users;

// Finds a single user by numeric ID. Returns undefined if not found.
const getById = (id) => users.find((user) => user.id === id);

// Adds a new user record to the in-memory store and returns it.
const create = ({ name, email, age }) => {
  const newUser = {
    id: generateId(users),
    name,
    email,
    age,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
};

// Updates an existing user in place. Returns the updated record,
// or null if no user with that ID exists.
const update = (id, updates) => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    id: users[index].id, // id must never be overwritten by the request body
    updatedAt: new Date().toISOString(),
  };

  return users[index];
};

// Removes a user by ID. Returns the removed record, or null if not found.
const remove = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  const [deletedUser] = users.splice(index, 1);
  return deletedUser;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
