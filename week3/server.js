require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to the database first; only start accepting HTTP traffic
// once the connection has been established.
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Gracefully handle unexpected promise rejections instead of
  // letting the process crash silently.
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
