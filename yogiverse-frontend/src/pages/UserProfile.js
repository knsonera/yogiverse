// I wrote this code

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsFeed from '../components/NewsFeed';
import FriendsList from '../components/FriendsList';  // Adjust the path as needed
import UserInfo from '../components/UserInfo'; // Adjust the path as needed
import './UserProfile.css';
import { fetchUserByUsername, fetchUserDetails, fetchUserStatusUpdates, fetchUserFriends, addFriend, removeFriend } from '../utils/handlers.js'; // Replace with the actual file name

// User Profile Page

const UserProfile = () => {
  const { username } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [userData, setUserData] = useState(null);

  const [statusUpdates, setStatusUpdates] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isUserFriend, setIsUserFriend] = useState(false);

  const navigate = useNavigate();

  const authToken = localStorage.getItem('authToken');

  // Fetch user profile data
  const fetchUserProfile = async () => {
    const result = await fetchUserByUsername(username);
    if (result.success) {
      setUserData(result.data);

      // fetch status updates and friends only if fetching user data succeeds
      const statusData = await fetchUserStatusUpdates(result.data.id);
      setStatusUpdates(statusData);

      const friendsData = await fetchUserFriends(result.data.id);
      setFriends(friendsData);
    } else {
      console.error("Failed to fetch user profile:", result.error);
    }
  };

  // Add to Friends handler
  const handleFriendButtonClick = async () => {
    const currentUserID = currentUserData.id;
    const profileUserID = userData?.id;
    try {
      const result = await addFriend(currentUserID, profileUserID);
      if (result) {
        console.log('Friend added:', result);
      }
    } catch (error) {
      console.log('Error adding friend:', error);
    }
  };

  // Fetching data for user profile
  useEffect(() => {
    const fetchAllData = async () => {
      // Check if a token is in local storage to set isAuthenticated
      if (authToken) {
        try {
          const userDetails = await fetchUserDetails(authToken);
          setCurrentUserData(userDetails);
        } catch (error) {
          setIsAuthenticated(false);
          console.error("Error fetching user data: ", error);
          window.location.href = '/';
        }

        setIsAuthenticated(true);
        await fetchUserProfile();

      } else {
        setIsAuthenticated(false);
        window.location.href = '/';
      }
    };

    if (currentUserData) {
      setCurrentUserId(currentUserData.id);
    }

    // Call the async function above
    fetchAllData();
  }, [isAuthenticated, navigate]);

  // Check if user is friend
  useEffect(() => {
    const userIsFriend = friends.some((friend) => friend.id === userData.id);
    setIsUserFriend(userIsFriend);
  }, [friends, userData?.id]);

  return (
    <>
      <Header isLoggedIn={isAuthenticated} setIsLoggedIn={setIsAuthenticated} />
      <div>
        { userData ? (
          <>
            <div className="home">
              <div className="left-column">
                <UserInfo
                  userData={userData}
                  isCurrentUser={false}
                  isUserFriend={isUserFriend}
                  handleFriendButtonClick={handleFriendButtonClick}
                />
                <FriendsList friends={friends} currentUserId={userData.id} />
              </div>
              <div className="right-column">
                <NewsFeed statusUpdates={statusUpdates} setStatusUpdates={setStatusUpdates} userId={userData.id} readOnly={true} />
              </div>
            </div>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;

// end of the code I wrote
