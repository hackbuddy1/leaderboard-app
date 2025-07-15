import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';

// --- Helper functions ---
const stringToColor = (str) => {
  if (!str) return '#cccccc';
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

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  return parts.length > 1
    ? parts[0][0] + parts[parts.length - 1][0]
    : name.substring(0, 2).toUpperCase();
};

const ClaimHistory = () => {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/history?page=${currentPage}&limit=10`);
                setHistory(response.data.history);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("Error fetching claim history:", err);
                setError("Failed to load claim history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [currentPage]);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div>
            <h2>Claim History</h2>
            {loading && <div>Loading History...</div>}
            
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <>
                    <div className="history-list">
                        {/* YEH HISSA MISSING THA */}
                        {history.length === 0 ? (
                            <p>No claims have been made yet.</p>
                        ) : (
                            history.map(item => (
                                <div className="history-item" key={item._id}>
                                    <div className="history-user-info">
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
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

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