// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// ... (baaki ke imports waise hi rahenge)
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');
const User = require('./src/models/user.model');
const { getRankedLeaderboard } = require('./src/controllers/user.controller');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// --- CORS Configuration (Sabse Zaroori Hissa) ---
// Yahan hum un sabhi URLs ki list banayenge jinhe hum allow karna chahte hain.
const allowedOrigins = [
    "http://localhost:3000",
    "https://leaderboard-frontend-lakshya.netlify.app"
];

const corsOptions = {
  origin: allowedOrigins
};

// --- Middleware (Ab hum CORS ko options ke saath use karenge) ---
app.use(cors(corsOptions)); // Regular API routes ke liye
app.use(express.json());

// Socket.IO ko bhi wahi options dein.
const io = new Server(server, {
  cors: corsOptions
});

// --- Baaki ka code waise hi rahega ---
connectDB();
app.set('socketio', io);
app.use('/api', userRoutes);

// ... (seedUsers function waise hi rahega) ...
seedUsers(); 

// ... (io.on('connection', ...) waise hi rahega) ...
io.on('connection', (socket) => {
  // ...
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Make sure to paste the full seedUsers and io.on('connection') functions back here
// if you copy-paste this whole block.