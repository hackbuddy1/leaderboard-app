// src/routes/user.routes.js

// This file defines all the API endpoints (routes) related to users and the leaderboard.
// It acts like a switchboard, connecting specific URL paths and HTTP methods
// to their corresponding logic in the controller file.

// We need the Express router to create these routes.
const express = require('express');
const router = express.Router();

// We import our controller, which contains all the functions that actually do the work.
const userController = require('../controllers/user.controller');


// --- Defining the API Routes ---

// Route to get a simple list of all users (primarily for the dropdown on the frontend).
// Method: GET
// URL: /api/users
router.get('/users', userController.getAllUsers);

// Route to create a new user.
// Method: POST
// URL: /api/users
router.post('/users', userController.addUser);

// Route to claim points for a specific user.
// The ':userId' part is a URL parameter, allowing us to specify which user to update.
// Method: POST
// URL: /api/users/12345/claim (where 12345 is the user's ID)
router.post('/users/:userId/claim', userController.claimPoints);

// Route to get the fully calculated and ranked leaderboard.
// Method: GET
// URL: /api/leaderboard
router.get('/leaderboard', userController.getLeaderboard);

// Route to get the paginated history of all point claims.
// Method: GET
// URL: /api/history?page=1&limit=10
router.get('/history', userController.getClaimHistory);


// We export the router so that it can be used by our main server.js file.
module.exports = router;