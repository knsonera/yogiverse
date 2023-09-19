// I wrote this code

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Chat.css';
import { ws } from '../utils/websockets.js';
import { fetchUserFriends, fetchUserDetails, fetchUserById } from '../utils/handlers.js';

// Chat page
// TODO: save messages and chats to the database

const Chat = () => {
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  // Fetch current user data
  const fetchData = async () => {
    try {
      const userDetails = await fetchUserDetails();
      setCurrentUser(userDetails);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      window.location.href = '/';
    }
  };

  // Fetch user's friends
  const fetchFriendsData = async (userId) => {
    try {
      const friendsData = await fetchUserFriends(userId);
      setFriends(friendsData);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  // Fetch user's messages
  const fetchMessages = async (chatId) => {
    try {
      const messagesData = [];
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Click on friend in the list
  const handleFriendClick = async (friend) => {
    setSelectedFriendId(friend.id);
    setMessages([]);
    if (currentUser) {
      try {
        setSelectedFriend(friend);
      } catch (error) {
        console.error('Could not handle friend click:', error);
      }
    }
  };

  // Send message
  const handleSendMessage = async () => {
      if (selectedFriend) {
        ws.send(JSON.stringify({ message: newMessage, to_user_id: selectedFriend.id }));
        setToUserId('');
        setNewMessage(''); // Clearing the input
      }
  };

  // Function to scroll to the bottom of the chat area
  const scrollToBottom = () => {
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  };

  // Create a ref for the chat messages container
  const chatMessagesRef = useRef();

  // Auth state
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Friend list for current user
  useEffect(() => {
    if (currentUser) {
      fetchFriendsData(currentUser.id);
    }
  }, [currentUser]);

  // WebSocket message handling
  useEffect(() => {
    const handleMessage = (event) => {
      const incomingMessage = JSON.parse(event.data);

      // Adding user_id of message sender
      if (incomingMessage.message === 'Hello, world!') {
        setMessages((prevMessages) => [...prevMessages, { text: incomingMessage.message, sender: 'Server' }]);
      } else {
        var transformedMessage = {
          text: incomingMessage.message,
          sender: incomingMessage.from_user_id
        };

        // Changing sender to user's full name
        fetchUserDetails().then((userDetails) => {
          // current user
          if (incomingMessage.from_user_id == userDetails.id) {
            transformedMessage.sender = userDetails.fullname + " (me)";//userDetails.fullname;

            setMessages((prevMessages) => [...prevMessages, transformedMessage]);
          // other user
          } else {
            fetchUserById(incomingMessage.from_user_id).then((response) => {
              transformedMessage.sender = response.data.fullname;
              setMessages((prevMessages) => [...prevMessages, transformedMessage]);
            });
          }
        });
      }
    };

    // Listening for WebSocket messages
    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Header isLoggedIn={isAuthenticated} setIsLoggedIn={setIsAuthenticated} />
      <div className="chat">
        <div className="chat-container">
          <div className="friends-list">
              <h2>Friends List</h2>
              {friends.length === 0 ? (
                <p>No friends available</p>
              ) : (
                friends.map((friendObj, index) => {
                  const isCurrentUser1 = friendObj.user1.id === currentUser.id;
                  const friend = isCurrentUser1 ? friendObj.user2 : friendObj.user1;
                  return (
                    <div
                      key={index}
                      className={selectedFriendId === friend.id ? 'selected' : ''}
                      onClick={() => handleFriendClick(friend)}
                    >
                      <p>{friend.fullname}</p>
                    </div>
                  );
                })
              )}
          </div>
          <div className="chat-area" ref={chatMessagesRef}>
            <h2 className="chat-title">{selectedFriend ? "Chat with " + selectedFriend.fullname : "Select friend"}</h2>
            {/* Render chat messages */}
            <div className="chat-messages">
              <ul>
                {messages.map((message, index) => (
                  <li key={index} className={message.sender.includes('(me)') ? 'chat-owner' : ''}> {message.sender}: {message.text}</li>
                ))}
              </ul>
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chat;

// end of the code I wrote
