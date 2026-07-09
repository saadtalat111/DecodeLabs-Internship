// utils/helper.js
//
// Small, reusable helper functions that don't belong to any single layer
// (model, controller, or middleware) of the app.

// Generates the next unique ID for a new user based on existing records.
// Using max(id) + 1 instead of array length keeps IDs unique even after deletes.
const generateId = (users) => {
  if (users.length === 0) return 1;
  const maxId = Math.max(...users.map((user) => user.id));
  return maxId + 1;
};

// Checks whether a given string is a syntactically valid email address.
// A simple regex is enough for internship-level validation; a real
// production system would typically also verify deliverability.
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  generateId,
  isValidEmail,
};
