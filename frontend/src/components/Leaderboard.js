// src/components/Leaderboard.js

// --- Helper Functions for UI Styling ---
// These utility functions are used to make our UI more visually appealing.

/**
 * Generates a consistent, unique color based on an input string (like a user's name).
 * This is used to give each user's avatar a distinct, yet predictable, background color.
 * @param {string} str - The input string (e.g., "Rahul Kumar").
 * @returns {string} - A hex color code (e.g., "#a1b2c3").
 */
const stringToColor = (str) => {
  if (!str) return '#cccccc'; // Default to a neutral gray if the name is missing.
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

/**
 * Extracts initials from a user's full name (e.g., "Rahul Kumar" becomes "RK").
 * This looks much cleaner inside the small avatar circle.
 * @param {string} name - The user's full name.
 * @returns {string} - The calculated initials (e.g., "RK").
 */
const getInitials = (name) => {
  if (!name) return '?'; // Show a '?' if the name is unavailable.
  const parts = name.split(' ');
  // If the name has multiple parts, take the first letter of the first and last parts.
  return parts.length > 1
    ? parts[0][0] + parts[parts.length - 1][0]
    : name.substring(0, 2).toUpperCase(); // Otherwise, just take the first two letters.
};

/**
 * Leaderboard Component:
 * This is the main component for displaying user rankings. It features a special
 * "podium" for the top 3 users and a standard list for everyone else.
 * @param {object} props - The component's props.
 * @param {Array} props.data - An array of ranked user objects from the backend.
 */
const Leaderboard = ({ data }) => {
  // --- Data Preparation ---
  // To create the special podium UI, we first need to separate our users.
  const topThree = data.slice(0, 3);    // Gets the first 3 users.
  const restOfList = data.slice(3);   // Gets all users from the 4th position onwards.

  // The `topThree` array might not always have 3 users (e.g., at the start of the game).
  // Also, their order in our JSX needs to be specific (2nd, 1st, 3rd).
  // So, we explicitly find each ranked user to handle these cases gracefully.
  const rank1 = topThree.find(u => u.rank === 1);
  const rank2 = topThree.find(u => u.rank === 2);
  const rank3 = topThree.find(u => u.rank === 3);

  return (
    <div>
      <h2>Leaderboard</h2>

      {/* --- Top 3 Podium Section --- */}
      {/* This entire section will only render if there's at least one user in the top three. */}
      {topThree.length > 0 && (
        <div className="leaderboard-podium">
          
          {/* Rank 2 (Left Side) - Only renders if a user with rank 2 exists. */}
          {rank2 && (
            <div className="podium-item rank-2">
              <div className="podium-avatar-wrapper">
                <div className="podium-avatar" style={{ backgroundColor: stringToColor(rank2.name) }}>
                  {getInitials(rank2.name)}
                </div>
                <div className="podium-rank-badge">2</div>
              </div>
              <div className="podium-name">{rank2.name}</div>
              <div className="podium-points">{rank2.totalPoints.toLocaleString()} 🏆</div>
            </div>
          )}

          {/* Rank 1 (Center, Elevated) - Only renders if a user with rank 1 exists. */}
          {rank1 && (
            <div className="podium-item rank-1">
              <div className="podium-rank-icon">👑</div>
              <div className="podium-avatar-wrapper">
                <div className="podium-avatar" style={{ backgroundColor: stringToColor(rank1.name) }}>
                  {getInitials(rank1.name)}
                </div>
                <div className="podium-rank-badge">1</div>
              </div>
              <div className="podium-name">{rank1.name}</div>
              <div className="podium-points">{rank1.totalPoints.toLocaleString()} 🏆</div>
            </div>
          )}
          
          {/* Rank 3 (Right Side) - Only renders if a user with rank 3 exists. */}
          {rank3 && (
            <div className="podium-item rank-3">
              <div className="podium-avatar-wrapper">
                <div className="podium-avatar" style={{ backgroundColor: stringToColor(rank3.name) }}>
                  {getInitials(rank3.name)}
                </div>
                <div className="podium-rank-badge">3</div>
              </div>
              <div className="podium-name">{rank3.name}</div>
              <div className="podium-points">{rank3.totalPoints.toLocaleString()} 🏆</div>
            </div>
          )}
        </div>
      )}

      {/* --- Rest of the List (Ranks 4 and below) --- */}
      <div className="leaderboard-list">
        {/* We map over the remaining users to create a simple, clean list for them. */}
        {restOfList.map((user) => (
          <div className="list-item" key={user._id}>
            <div className="list-rank">{user.rank}</div>
            <div className="list-user-info">
              <div className="list-avatar" style={{ backgroundColor: stringToColor(user.name) }}>
                {getInitials(user.name)}
              </div>
              <span>{user.name}</span>
            </div>
            <div className="list-points">{user.totalPoints.toLocaleString()} 🏆</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;