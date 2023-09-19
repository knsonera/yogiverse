// I wrote this code

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Chat from './pages/Chat';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<Home />} />

        {/* Route for a User's profile */}
        <Route path="/user/:username" element={<UserProfile />} />

        {/* Route for the Chat page */}
        <Route path="/chats" element={<Chat />} />

        {/* Route for the Login page */}
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;

// end of the code I wrote
