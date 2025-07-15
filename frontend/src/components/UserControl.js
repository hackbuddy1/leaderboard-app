// src/components/UserControl.js
import { useState } from 'react';

/**
 * UserControl Component:
 * This component acts as the main interaction panel for the user. It's a "dumb" or "presentational"
 * component because it doesn't contain any core application logic itself. Instead, it receives
 * data and functions as props from its parent (`App.js`) and simply calls those functions
 * when the user interacts with the UI.
 *
 * @param {object} props - The component's props, passed down from App.js.
 * @param {Array} props.users - The list of user objects to display in the dropdown.
 * @param {string} props.selectedUser - The ID of the currently selected user.
 * @param {Function} props.onSelectUser - A function to call when a user is selected from the dropdown.
 * @param {Function} props.onAddUser - A function to call when the "Add User" button is clicked.
 * @param {Function} props.onClaimPoints - A function to call when the "Claim Points" button is clicked.
 * @param {boolean} props.loading - A boolean that indicates if an action (like claiming points) is in progress.
 */
const UserControl = ({ users, selectedUser, onSelectUser, onAddUser, onClaimPoints, loading }) => {
  // --- Internal State ---
  // This component only needs to manage one piece of state itself: the value of the 'Add User' input field.
  const [newUserName, setNewUserName] = useState('');

  // This function handles the submission of the "Add User" form.
  const handleAddUser = (e) => {
    // e.preventDefault() is crucial. It stops the browser from doing a full page refresh,
    // which is the default behavior for HTML form submissions.
    e.preventDefault();
    
    // We trim the input to remove any leading/trailing whitespace and ensure the name isn't empty.
    if (newUserName.trim()) {
      // Call the `onAddUser` function that was passed down from App.js, sending the new name.
      onAddUser(newUserName.trim());
      // After submission, clear the input field for the next entry.
      setNewUserName('');
    }
  };

  return (
    <div className="control-panel-grid">
      
      {/* --- Section 1: User Selection and Claiming Points --- */}
      <div className="control-group">
        <label htmlFor="user-select">Select & Claim</label>
        
        {/* The dropdown menu for selecting a user. */}
        <select 
          id="user-select" 
          value={selectedUser} // The dropdown's value is controlled by the `selectedUser` prop from App.js.
          onChange={(e) => onSelectUser(e.target.value)} // When the user selects a new option, call the parent's handler function.
        >
          <option value="">-- Select a User --</option>
          {/* We map over the `users` array to create an <option> for each user. */}
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        
        {/* The button to claim points. */}
        <button 
          onClick={onClaimPoints} 
          // The button is disabled if no user is selected OR if a claim is already in progress.
          // This prevents accidental clicks and provides clear feedback to the user.
          disabled={!selectedUser || loading} 
          className="btn-primary"
        >
          {loading ? 'Claiming...' : 'Claim Points'}
        </button>
      </div>

      {/* --- Section 2: Adding a New User --- */}
      <form className="control-group" onSubmit={handleAddUser}>
        <label htmlFor="new-user">Add New User</label>
        
        {/* The text input for the new user's name. */}
        <input
          id="new-user"
          type="text"
          value={newUserName} // Its value is controlled by our component's internal state.
          onChange={(e) => setNewUserName(e.target.value)} // Update the state on every keystroke.
          placeholder="e.g., Maria"
        />
        
        {/* The submit button for the form. */}
        <button 
          type="submit" 
          // This button is disabled if the input field is empty (or just contains whitespace).
          disabled={!newUserName.trim()} 
          className="btn-secondary"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default UserControl;