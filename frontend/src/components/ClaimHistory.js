import { useState, useEffect } from 'react';
import axios from 'axios';

// The base URL for our backend API. Storing it here keeps our code clean
// and makes it easy to change if the server address ever changes.
const API_URL = 'http://localhost:5000/api';

// --- Helper Functions for UI Styling ---

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
 * ClaimHistory Component:
 * This component is responsible for fetching and displaying the log of all point claims.
 * It includes a pagination system to efficiently handle large amounts of history data.
 */
const ClaimHistory = () => {
    // --- State Management ---
    // We use state to store all the dynamic data for this component.
    const [history, setHistory] = useState([]);               // Holds the history data for the currently visible page.
    const [currentPage, setCurrentPage] = useState(1);       // Tracks the current page number we are on.
    const [totalPages, setTotalPages] = useState(1);         // Stores the total number of pages available.
    const [loading, setLoading] = useState(true);            // A boolean to track if data is being fetched (for showing a "Loading..." message).

    // --- Data Fetching Effect ---
    // This `useEffect` hook runs when the component first mounts and
    // whenever the `currentPage` state changes.
    useEffect(() => {
        // An async function to fetch the history data from our backend.
        const fetchHistory = async () => {
            setLoading(true); // Set loading to true before starting the API call.
            try {
                // Make a GET request to our history API, passing the current page number.
                const response = await axios.get(`${API_URL}/history?page=${currentPage}&limit=10`);
                
                // Once the data arrives, update our component's state.
                setHistory(response.data.history);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            } catch (error) {
                // If the API call fails, log the error to the console for debugging.
                console.error("Error fetching claim history:", error);
            } finally {
                // No matter if the call succeeds or fails, always set loading to false at the end.
                setLoading(false);
            }
        };

        fetchHistory(); // Execute the function we just defined.
    }, [currentPage]); // The dependency array: This effect will only re-run if `currentPage` changes.

    // --- Pagination Handlers ---
    // This function handles the "Previous" button click.
    const handlePrevPage = () => {
        // Decrease the current page by 1, but never go below page 1.
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    // This function handles the "Next" button click.
    const handleNextPage = () => {
        // Increase the current page by 1, but never go beyond the total number of pages.
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // --- Component Rendering (The UI) ---
    return (
        <div>
            <h2>Claim History</h2>
            {/* Conditional Rendering: If `loading` is true, show a simple loading message. */}
            {loading ? (
                <div>Loading History...</div>
            ) : (
                // Once loading is false, render the history list and pagination controls.
                <>
                    <div className="history-list">
                        {/* If there's no history data, display a helpful message. */}
                        {history.length === 0 && <p>No claims have been made yet.</p>}
                        
                        {/* If there is history data, map over the array to create a list item for each entry. */}
                        {history.map(item => (
                            <div className="history-item" key={item._id}>
                                <div className="history-user-info">
                                    {/* The user avatar, with its color and initials generated by our helper functions. */}
                                    <div className="history-avatar" style={{ backgroundColor: stringToColor(item.userId?.name) }}>
                                        {getInitials(item.userId?.name)}
                                    </div>
                                    <span className="history-user-name">{item.userId?.name || 'Unknown User'}</span>
                                </div>
                                
                                <div className="history-details">
                                    <span className="history-points-badge">
                                        +{item.pointsClaimed}
                                    </span>
                                    <span className="history-timestamp">
                                        {/* Display the timestamp in a human-readable, localized format. */}
                                        {new Date(item.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls: Only show these if there is more than one page of history. */}
                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ClaimHistory;