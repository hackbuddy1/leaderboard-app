// src/App.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Leaderboard from './components/Leaderboard';
import UserControl from './components/UserControl';
import ClaimHistory from './components/ClaimHistory';
import './App.css';

const API_URL = 'https://leaderboard-backend-0a77.onrender.com/api';
const SOCKET_URL = 'https://leaderboard-backend-0a77.onrender.com';

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- PROBLEM YAHAN THA ---
  // Aapne is state ko array bana diya hai, jo bilkul sahi hai.
  // Lekin isko update karne wala function (showNotification) purana reh gaya hoga.
  const [notifications, setNotifications] = useState([]); // CORRECT: Must be an array []

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`);
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();

    const socket = io(SOCKET_URL);
    socket.on('leaderboardUpdate', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
      const updatedUsers = updatedLeaderboard.map(({ _id, name }) => ({ _id, name }));
      setUsers(updatedUsers);
    });

    return () => socket.disconnect();
  }, []);
  
  // --- SOLUTION YAHAN HAI ---
  // Yeh function ab `notifications` array ke saath kaam karne ke liye design kiya gaya hai.
  // `prev => [...prev, newNotification]` syntax ek array ki copy banata hai. Agar state object hoga to error aayega.
  const showNotification = (message, type) => {
    const id = Date.now();
    // This is the line that was causing the error if `notifications` wasn't an array
    setNotifications(prev => [...prev, { id, message, type }]); 
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleAddUser = async (name) => {
    try {
      const res = await axios.post(`${API_URL}/users`, { name });
      showNotification(`User "${res.data.name}" added successfully!`, 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error adding user', 'error');
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/${selectedUser}/claim`);
      showNotification(res.data.message, 'success');
    } catch (error) {
       showNotification('Error claiming points', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Notifications will appear here */}
      <div className="notification-container">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            {notif.message}
          </div>
        ))}
      </div>

      <h1>Leaderboard Challenge</h1>
      
      <div className="card">
        <UserControl
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          onAddUser={handleAddUser}
          onClaimPoints={handleClaimPoints}
          loading={loading}
        />
      </div>
      
      <div className="card">
        <Leaderboard data={leaderboard} />
      </div>

      <div className="card">
        
          <ClaimHistory />
        </div>
      </div>
    
  );
}

export default App;