// src/config/db.js

// This file is dedicated to a single, critical task: connecting our application to the MongoDB database.
// By keeping this logic separate, our code stays organized and easier to manage.

// We need Mongoose to handle the connection.
const mongoose = require('mongoose');

// We also need `dotenv` to load our secret database connection string from the .env file.
// This is important for security, as we never want to hardcode passwords or secret keys directly in our code.
require('dotenv').config();


/**
 * connectDB is an asynchronous function that attempts to establish a connection
 * to our MongoDB Atlas cluster.
 */
const connectDB = async () => {
  try {
    // This is the core of the connection logic. Mongoose's `connect` method
    // takes the connection string (URI) from our environment variables and
    // tries to connect to the database. We use `await` because this process
    // is asynchronous and can take a moment to complete.
    await mongoose.connect(process.env.MONGO_URI);
    
    // If the `await` line above completes without throwing an error, it means
    // the connection was successful! We log a message to the console to confirm this.
    console.log('MongoDB Connected...');

  } catch (err) {
    // If Mongoose fails to connect to the database (e.g., wrong password,
    // IP not whitelisted, server is down), it will throw an error.
    // The `catch` block will capture that error.
    
    // We log the specific error message to the console for debugging.
    console.error(err.message);
    
    // This is a crucial step. If the application cannot connect to its database,
    // it cannot function correctly. So, we exit the entire process with an
    // exit code of '1', which signifies a failure. This prevents the server
    // from running in a broken state.
    process.exit(1);
  }
};

// We export the `connectDB` function so that our main `server.js` file can import and use it.
module.exports = connectDB;