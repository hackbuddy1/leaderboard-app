import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- Helper functions (ye waise hi rahenge) ---
const stringToColor = (str) => { /* ... */ };
const getInitials = (name) => { /* ... */ };
/* --- Paste the helper functions from the previous version here ---*/

const ClaimHistory = () => {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // <-- NAYA STATE ERROR KE LIYE

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null); // Har nayi request par purana error hata do.
            try {
                const response = await axios.get(`${API_URL}/history?page=${currentPage}&limit=10`);
                setHistory(response.data.history);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                // Agar error aaye, to use state mein save kar lo.
                console.error("Error fetching claim history:", err);
                setError("Failed to load claim history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [currentPage]);
    
    // ... (handlePrevPage aur handleNextPage waise hi rahenge) ...

    return (
        <div>
            <h2>Claim History</h2>
            {loading && <div>Loading History...</div>}
            
            {/* Agar error hai, to error message dikhao */}
            {error && <div className="error-message">{error}</div>}

            {/* Agar loading nahi hai aur error bhi nahi hai, tabhi list dikhao */}
            {!loading && !error && (
                <>
                    <div className="history-list">
                        {/* ... (history.map wala poora code waise hi rahega) ... */}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-controls">
                           {/* ... (buttons waise hi rahenge) ... */}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


export default ClaimHistory;