// I wrote this code

/**
 * FriendsList.js
 */

// Imports
import React from 'react';
import './FriendsList.css'

/**
 * FriendsList Functional Component
 * @param {Array} friends - array of friend objects.
 * @param {Number} currentUserId - ID of the current user.
 */
const FriendsList = ({ friends, currentUserId }) => {

  return (
    <div className="friends-list">
      <h2>Friends List</h2>
      {/* Conditionally rendering the friends list or a 'no friends' message */}
      {friends.length === 0 ? (
        <p>No friends available</p>
      ) : (
        // Iterating through the array of friends and displaying each.
        friends.map((friendObj, index) => {
          // Determining if the current user is user1 in the friend object.
          const isCurrentUser1 = friendObj.user1.id === currentUserId;

          // Picking a friend
          const friend = isCurrentUser1 ? friendObj.user2 : friendObj.user1;

          return (
            <div key={index} className="friend-item">
              <a href={`/user/${friend.username}`} className="friend-list-link">
                {friend.fullname}
              </a>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FriendsList;


// end of the code I wrote
