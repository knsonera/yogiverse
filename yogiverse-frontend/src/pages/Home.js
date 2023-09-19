// I wrote this code

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';
import NewsFeed from '../components/NewsFeed';
import FriendsList from '../components/FriendsList';
import UserInfo from '../components/UserInfo';

import './Home.css';

import axios from 'axios';
import { fetchUserDetails, fetchUserStatusUpdates, fetchUserFriends } from '../utils/handlers.js';

// Home page

const Home = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [friends, setFriends] = useState([]);

  // Fetch current user data
  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.log("No auth token found.");
      return;
    }

    try {
      const userDetails = await fetchUserDetails(token);
      const userId = userDetails.id;
      const friends = await fetchUserFriends(userId);

      setUserData(userDetails);
      setUserId(userId);
      setIsAuthenticated(true);
      setFriends(friends);

    } catch (error) {
      console.error('Could not fetch user data:', error);
    }

  };

  // Signup Modal
  const handleSignupClick = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  // Signin Modal
  const handleSigninClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          fetchUserData();
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <Header isLoggedIn={isAuthenticated} setIsLoggedIn={setIsAuthenticated} />
      <SignUpForm show={showSignUp} onClose={() => setShowSignUp(false)} />
      <SignInForm show={showSignIn} onClose={() => setShowSignIn(false)} />

      <div>
        { isAuthenticated ? (
          <>
            <div className="home">
              <div className="left-column">
                <UserInfo userData={userData} isCurrentUser={true} />
                <FriendsList friends={friends} currentUserId={userId} />
              </div>
              <div className="right-column">
                <NewsFeed userId={userId} readOnly={false} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="landing">
              <h1>Welcome to Yogiverse!</h1>
              <p>Where yogis meet in the digital world.</p>
              <button className="home-button" onClick={handleSignupClick}>Sign Up</button>
              <button className="home-button" onClick={handleSigninClick}>Sign In</button>
            </div>
          </>
      )}
      </div>
      <Footer />
    </>
  );

};

export default Home;

// end of the code I wrote
