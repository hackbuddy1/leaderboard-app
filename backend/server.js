// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');
const User = require('./src/models/user.model');
const { getRankedLeaderboard } = require('./src/controllers/user.controller');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// --- CORS Configuration ---
// Yahan hum un sabhi URLs ki list banayenge jinhe hum allow karna chahte hain.
const allowedOrigins = [
    "http://localhost:3000",
    "https://leaderboard-frontend-lakshya.netlify.app"
];

const corsOptions = {
  origin: allowedOrigins
};

// --- Middleware ---
app.use(cors(corsOptions)); // Regular API routes ke liye
app.use(express.json());

// Socket.IO ko bhi wahi options dein.
const io = new Server(server, {
  cors: corsOptions
});

// --- Baaki ka code ---
connectDB();
app.set('socketio', io);
app.use('/api', userRoutes);

// --- Seed Users Function Definition (Yeh hissa chhoot gaya tha) ---
const seedUsers = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('No users found, seeding initial data...');
            const initialUsers = [
                { name: 'Rahul' }, { name: 'Kamal' }, { name: 'Sanaka' },
                { name: 'Priya' }, { name: 'Amit' }, { name: 'Deepika' },
                { name: 'Vikram' }, { name: 'Anjali' }, { name: 'Rohan' }, { name: 'Sneha' },
            ];
            await User.insertMany(initialUsers);
            console.log('Database seeded with 10 users.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};
// Ab function ko call karein
seedUsers(); 

// --- Socket.IO Connection Handling (Yeh hissa bhi zaroori hai) ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  getRankedLeaderboard().then(leaderboard => {
    socket.emit('leaderboardUpdate', leaderboard);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));