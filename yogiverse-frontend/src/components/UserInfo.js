// I wrote this code

/**
 * UserInfo.js
 */

import React from 'react';
import './UserInfo.css';

/**
 * UserInfo Component
 * @param {Object} userData - data of the user to display.
 * @param {Boolean} isCurrentUser - indicator if the displayed user is the current user.
 * @param {Boolean} isUserFriend - indicator if the displayed user is a friend of the current user.
 * @param {Function} handleFriendButtonClick - handle friend action button clicks.
 */
const UserInfo = ({ userData, isCurrentUser, isUserFriend, handleFriendButtonClick }) => {

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img
            src={userData?.profile_picture || '/profile.png'}
            alt={`${userData?.username || 'Guest'}'s profile`}
          />
        </div>
        <div className="profile-info">
          <h1>{userData?.fullname || 'Guest'}</h1>
          <h2>@{userData?.username || 'guest'}</h2>
        </div>
      </div>
      <div className="profile-button">
        {/* Show "Add to Friends" button only if not my own profile */}
        {!isCurrentUser && (
          <button onClick={handleFriendButtonClick}>
            {isUserFriend ? "Remove from Friends" : "Add to Friends"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInfo;

// end of the code I wrote
