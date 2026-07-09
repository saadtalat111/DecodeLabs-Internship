// data/users.js
//
// In-memory data store simulating a database table.
// This module intentionally exports the array itself (not a copy) so that
// the model layer can mutate it directly, the same way a real DB driver
// would let you mutate rows through queries. Data resets on server restart.

let users = [
  {
    id: 1,
    name: 'Ali Raza',
    email: 'ali.raza@example.com',
    age: 24,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Sara Khan',
    email: 'sara.khan@example.com',
    age: 21,
    createdAt: new Date().toISOString(),
  },
];

module.exports = users;
