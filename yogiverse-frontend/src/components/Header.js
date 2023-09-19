// I wrote this code

/**
 * Header.js
 */

// Imports
import React, { useState, useEffect } from 'react';
import './Header.css';
import { handleLogout, fetchUsers } from '../utils/handlers.js';

/**
 * Header Component
 * @param {Boolean} isLoggedIn - check if the user is currently logged in.
 * @param {Function} setIsLoggedIn - function to change the login state.
 */
const Header = ({ isLoggedIn, setIsLoggedIn }) => {

  // State variables to keep track of the user list and search activity
  const [userList, setUserList] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Search bar focus
  const handleSearch = async (e) => {
    setSearchActive(true);
    setSearchText(e.target.value);
  };

  // Delay the hiding of the search dropdown
  let blurTimeout = null;

  // Hide search results
  const handleBlur = () => {
    blurTimeout = setTimeout(() => {
      setSearchActive(false);
    }, 200);
  };

  // User logout
  const handleUserLogout = async (e) => {
    await handleLogout();
    setIsLoggedIn(false);
  };

  // Click on a search result
  const handleResultClick = (e) => {
    clearTimeout(blurTimeout);  // Stops the hiding of search results
  };

  // Fetch all users if search is active
  useEffect(() => {
    if (searchActive) {
      const fetchAllUsers = async () => {
        const { success, data } = await fetchUsers();
        if (success) {
          // Filter userList based on the input text
          const filteredUsers = data.filter(user =>
            user.fullname.toLowerCase().includes(searchText.toLowerCase())
          );
          setUserList(filteredUsers);
        }
      };
      fetchAllUsers();
    }
  }, [searchActive, searchText]);

  return (
    <header className="header">
      <h1 className="header-title">Yogiverse</h1>

      <div className="header-search">
        <input
          type="text"
          placeholder="Search users..."
          onFocus={handleSearch}
          onBlur={handleBlur}
          onChange={handleSearch}
        />
        {searchActive && userList.length > 0 && (
          <ul className="search-results">
            {userList.map(user => (
              <li key={user.id} onClick={handleResultClick}>
                <a href={`/user/${user.username}`}>{user.fullname}</a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <nav className="header-nav">
        <a href="/" className="header-link">Home</a>
        {isLoggedIn ? (
          <a href="/chats" className="header-link">Chats</a>
        ) : null}

        {isLoggedIn ? (
          <a onClick={handleUserLogout} className="header-link">Logout</a>
        ) : (
          <a href="/" className="header-link">Login</a>
        )}
      </nav>
    </header>
  );
};

export default Header;

// end of the code I wrote
