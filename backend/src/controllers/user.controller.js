// src/controllers/user.controller.js

// This file contains all the core business logic for our application.
// Each function here corresponds to a specific API route and handles
// tasks like fetching data from the database, processing it, and sending back a response.

// We need our Mongoose models to interact with the 'users' and 'histories' collections.
const User = require('../models/user.model');
const History = require('../models/history.model');


/**
 * ------------------------------------------------------------------------------
 * A Helper Function (Not a direct API endpoint)
 * ------------------------------------------------------------------------------
 * This internal function is responsible for fetching all users, sorting them by
 * their points, and assigning a rank. We reuse this logic in multiple places.
 */
const getRankedLeaderboard = async () => {
  // 1. Fetch all users and sort them in descending order of their totalPoints.
  // The user with the most points will be first in the array.
  const users = await User.find({}).sort({ totalPoints: -1 });

  // 2. Add a 'rank' property to each user object.
  // We use .map() to create a new array. The user's rank is simply their position
  // in the sorted array (plus one, because array indexes start at 0).
  const rankedUsers = users.map((user, index) => ({
    ...user.toObject(), // .toObject() converts the Mongoose document into a plain JavaScript object so we can add new properties.
    rank: index + 1,
  }));

  return rankedUsers;
};


/**
 * ------------------------------------------------------------------------------
 * API Endpoint Controllers
 * ------------------------------------------------------------------------------
 */

/**
 * Controller for: GET /api/users
 * Fetches a lightweight list of all users, containing only their name and ID.
 * This is perfect for populating the user selection dropdown on the frontend.
 */
exports.getAllUsers = async (req, res) => {
  try {
    // .select('name _id') is an optimization. We're telling the database to only
    // send us these two fields, which makes the query faster and uses less bandwidth.
    const users = await User.find().select('name _id');
    res.json(users);
  } catch (err) {
    // Standard error handling in case something goes wrong with the database.
    res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * Controller for: POST /api/users
 * Creates a new user in the database.
 */
exports.addUser = async (req, res) => {
  try {
    // 1. Get the user's name from the request body sent by the frontend.
    const { name } = req.body;
    
    // 2. Basic validation: Make sure a name was actually provided.
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // 3. Prevent duplicates: Check if a user with this name already exists.
    // Our database model also enforces this, but checking here provides a cleaner error message.
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 4. If all checks pass, create and save the new user.
    const newUser = new User({ name }); // totalPoints will default to 0.
    await newUser.save();

    // 5. REAL-TIME UPDATE: Notify all connected clients that the leaderboard has changed.
    const io = req.app.get('socketio');
    const leaderboard = await getRankedLeaderboard();
    io.emit('leaderboardUpdate', leaderboard);
    
    // 6. Send a success response back to the client.
    res.status(201).json(newUser);
  } catch (err) {
     res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * Controller for: POST /api/users/:userId/claim
 * Awards random points to a specified user and records the event.
 */
exports.claimPoints = async (req, res) => {
  try {
    // 1. Get the user's ID from the URL parameter (e.g., /api/users/12345/claim).
    const { userId } = req.params;
    const user = await User.findById(userId);

    // 2. Handle the case where the user ID is invalid.
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Generate a random number of points between 1 and 10.
    const randomPoints = Math.floor(Math.random() * 10) + 1;
    user.totalPoints += randomPoints;

    // 4. Create a corresponding entry in our history log.
    const historyRecord = new History({
      userId: user._id,
      pointsClaimed: randomPoints,
    });
    
    // 5. Save both the updated user and the new history record to the database.
    // Using Promise.all() runs these two operations concurrently, which is slightly more efficient.
    await Promise.all([user.save(), historyRecord.save()]);

    // 6. REAL-TIME UPDATE: Broadcast the new leaderboard to all connected clients.
    const io = req.app.get('socketio');
    const leaderboard = await getRankedLeaderboard();
    io.emit('leaderboardUpdate', leaderboard);

    // 7. Send a specific success message back to the user who clicked the button.
    res.json({ message: `Awarded ${randomPoints} points to ${user.name}`, points: randomPoints });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * Controller for: GET /api/leaderboard
 * A simple endpoint to fetch the current, fully ranked leaderboard.
 */
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await getRankedLeaderboard();
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};


/**
 * Controller for: GET /api/history
 * Fetches the claim history with pagination to ensure efficiency.
 */
exports.getClaimHistory = async (req, res) => {
    try {
        // 1. Get pagination parameters from the URL query string (e.g., /history?page=2).
        // Provide default values in case they aren't specified.
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit; // Calculate how many records to "skip" over.

        // 2. Build the two database queries we need.
        // Query 1: Fetches the actual history data for the current page.
        const historyPromise = History.find()
            .sort({ timestamp: -1 }) // Show the most recent claims first.
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name'); // Super useful! This replaces the `userId` with the actual user object (or just the name, as we specified).

        // Query 2: Counts the total number of history documents in the entire collection.
        const countPromise = History.countDocuments();

        // 3. Execute both queries at the same time for better performance.
        const [history, totalCount] = await Promise.all([historyPromise, countPromise]);
        
        // 4. Send the response, including both the data and the pagination info
        //    that the frontend needs to build the page controls.
        res.json({
            history,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (err) {
        console.error("Pagination Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// We also export the helper function itself so our `server.js` can use it
// to send the leaderboard to newly connected clients.
exports.getRankedLeaderboard = getRankedLeaderboard;