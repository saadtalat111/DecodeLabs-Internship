const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI provided in the
 * environment configuration. The application is intentionally designed
 * to fail fast if the database is unreachable, since there is no point
 * running an API server that cannot persist data.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not defined in the environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB runtime error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection lost. Attempting to reconnect is handled by the driver.');
    });
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
