// server.js

// ---  Importing all the necessary packages and modules ---
// Express is our framework for creating the API server.
const express = require('express');
// Node's built-in 'http' module. We need this to create a server that both Express and Socket.IO can use.
const http = require('http');
// Socket.IO for our real-time magic (live leaderboard updates).
const { Server } = require('socket.io');
// CORS is a security feature that allows our frontend (on localhost:3000) to communicate with our backend (on localhost:5000).
const cors = require('cors');

// --- Importing our own application files ---
// This keeps our code organized and clean.
const connectDB = require('./src/config/db'); // Our database connection logic.
const userRoutes = require('./src/routes/user.routes'); // All the API routes related to users.
const User = require('./src/models/user.model'); // The Mongoose model for our 'users' collection.
const { getRankedLeaderboard } = require('./src/controllers/user.controller'); // A helper function from our controller.

// This line is super important! It loads environment variables from our .env file (like database passwords and port numbers).
require('dotenv').config();


// --- Initializing the App, Server, and Socket.IO ---
// 'app' is our main Express application instance.
const app = express();
// We create a standard HTTP server using our Express app.
const server = http.createServer(app);
// Now we attach Socket.IO to that server, enabling real-time, two-way communication.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // We explicitly tell Socket.IO to only accept connections from our React app.
    methods: ["GET", "POST"], // The allowed HTTP methods.
  },
});


// --- Connecting to the Database ---
// Let's establish the connection to our MongoDB Atlas database.
connectDB();


// --- Setting up Middleware ---
// Middleware are functions that run for every request.
app.use(cors()); // Enables CORS for all our regular API routes.
app.use(express.json()); // This allows our server to understand and process JSON data sent from the frontend.


// --- Making Socket.IO available to our routes ---
// This is a clever Express trick. We're "setting" the `io` instance on our app.
// This allows us to access it from our controller files (using `req.app.get('socketio')`)
// so we can emit events after a database operation, like when a user claims points.
app.set('socketio', io);


// --- API Routes ---
// We tell our app to use the `userRoutes` for any request that starts with '/api'.
// For example, a request to '/api/users' will be handled by our user routes file.
app.use('/api', userRoutes);


/**
 * seedUsers is a handy helper function we run once when the server starts.
 * Its job is to check if the database is empty and, if so, populate it
 * with a default set of 10 users. This makes development and testing much easier.
 */
const seedUsers = async () => {
    try {
        // First, let's count how many users are currently in the database.
        const userCount = await User.countDocuments();
        
        // If there are no users, then we'll add our initial data.
        if (userCount === 0) {
            console.log('No users found, seeding initial data...');
            const initialUsers = [
                { name: 'Rahul' }, { name: 'Kamal' }, { name: 'Sanaka' },
                { name: 'Priya' }, { name: 'Amit' }, { name: 'Deepika' },
                { name: 'Vikram' }, { name: 'Anjali' }, { name: 'Rohan' }, { name: 'Sneha' },
            ];
            // 'insertMany' is an efficient way to add multiple documents at once.
            await User.insertMany(initialUsers);
            console.log('Database seeded with 10 users.');
        }
    } catch (error) {
        // If something goes wrong during seeding (e.g., database connection issue), we log the error.
        console.error('Error seeding database:', error);
    }
};
// Let's run the seeding function as soon as the server starts.
seedUsers();


// --- Socket.IO Connection Handling ---
// This is the heart of our real-time functionality.
// The code inside this `io.on` block runs every time a new user opens the React app in their browser.
io.on('connection', (socket) => {
  // We log the unique ID of the connected user's socket to the terminal for debugging.
  console.log('A user connected:', socket.id);

  // As soon as a user connects, we should send them the current leaderboard state.
  // We don't want them to see an empty screen while they wait for an update.
  getRankedLeaderboard().then(leaderboard => {
    // We use `socket.emit` to send the data ONLY to the user who just connected.
    // (`io.emit` would send it to everyone).
    socket.emit('leaderboardUpdate', leaderboard);
  });

  // This event listener runs when that specific user closes their browser tab or navigates away.
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// --- Starting the Server ---
// We get the port from our .env file. If it's not defined, we'll default to 5000.
const PORT = process.env.PORT || 5000;
// Finally, we tell our server to start listening for incoming requests on the specified port.
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));