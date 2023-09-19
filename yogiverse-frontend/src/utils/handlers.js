// I wrote this code

import axios from 'axios';
import api from '../services/api';
import { refreshTheToken } from './axiosConfig';

// Authentication

// Get the JWT token from local storage
const jwtToken = localStorage.getItem('authToken');
if (jwtToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
}

// Retrieve authentication headers with the JWT token.
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.log("No authentication token found.");
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Register

/**
 * Register a new user.
 */

export const registerUser = async (formData) => {
  try {
    const registerResponse = await api.post('register/', formData);

    if (registerResponse.status === 201) {
      const tokenResponse = await api.post('token/', {
        username: formData.username,
        password: formData.password,
      });
      if (tokenResponse.status === 200) {
        localStorage.setItem('authToken', tokenResponse.data.access);
        localStorage.setItem('refreshToken', tokenResponse.data.refresh);
        return true; // success
      }
    }
    return false; // failure

  } catch (error) {
    const status = error.response.status;
    switch (status) {
      case 400:
        console.error("Bad request:", error);
        break;
      case 401:
        console.error("Unauthorized:", error);
        break;
      case 403:
        console.error("Forbidden:", error);
        break;
      default:
        console.error("An unknown error occurred:", error);
    }
    return false;
  }
};

/**
 * Log in
 * @param {string} username - username.
 * @param {string} password - password.
 * @returns {Promise<boolean>} - true on successful login, false otherwise.
 */
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('token/', { username, password });
    const { refresh, access } = response.data;
    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);
    return true; // success
  } catch (error) {
    const status = error.response.status;
    switch (status) {
      case 400:
        console.error("Bad request:", error);
        break;
      case 401:
        console.error("Unauthorized:", error);
        break;
      case 403:
        console.error("Forbidden:", error);
        break;
      default:
        console.error("An unknown error occurred:", error);
    }
    window.location.href = '/';
    return false;
  }
};

/**
 * Logout
 */
export const handleLogout = async () => {
  try {
    const response = await api.get('logout/', {
      headers: {
        ...getAuthHeaders(),
      }
    });

    if (response.status === 200) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }

  } catch (error) {
    const status = error.response.status;
    switch (status) {
      case 400:
        console.error("Bad request:", error);
        break;
      case 401:
        console.error("Unauthorized:", error);
        break;
      case 403:
        console.error("Forbidden:", error);
        break;
      default:
        console.error("An unknown error occurred:", error);
    }
    window.location.href = '/';
  }
};


/**
 * Fetch a list of users.
 */
export const fetchUsers = async () => {
  try {
    const response = await api.get('users/', {
      headers: {
        ...getAuthHeaders(),
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshTheToken();
      if (newToken) {
        return fetchUsers();
      }
    }
    return { success: false, error: "Could not fetch users" };
  }
};

/**
 * Fetch a user by username.
 */
export const fetchUserByUsername = async (username) => {
  try {
    const response = await api.get(`users/username/${username}/`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshTheToken();
      if (newToken) {
        return fetchUserByUsername(username);
      }
    }
    return { success: false, error: `Could not get user by username: ${username}` };
  }
};

/**
 * Fetch a user by id.
 */
export const fetchUserById = async (id) => {
  try {
    const response = await api.get(`users/id/${id}/`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshTheToken();
      if (newToken) {
        return fetchUserById(id);
      }
    }
    return { success: false, error: `Could not get user by id: ${id}` };
  }
};

/**
 * Create a new user.
 * @param {string} username
 * @param {string} fullname
 * @param {string} email
 * @param {string} password
 */
export const createUser = async (username, fullname, email, password) => {
  try {
    const response = await api.post('register/', {
      username,
      fullname,
      email,
      password,
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return { success: false, error: `Unable to create user` };
  }
};


/**
 * Fetch the details of the current user.
 */
export const fetchUserDetails = async () => {
  try {
    const res = await api.get('me/', {
      headers: {
        ...getAuthHeaders(),
      }
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch user details');
  }
};


/**
 * Add a new status update.
 * @param {string} newStatus - text of the new status update.
 * @param {File} mediaFile - media file to upload (can be null).
 * @param {string} mediaType - type of media (can be null ).
 * @param {number} userId - userId
 * @param {Array} statusUpdates
 * @param {function} setNewStatus
 * @param {function} setStatusUpdates
 */
export const addNewStatus = async (newStatus, mediaFile, mediaType, userId, statusUpdates, setNewStatus, setStatusUpdates) => {
    // if mediaFile is not null
    if(mediaFile) {
      try {
        const mediaFormData = new FormData();
        mediaFormData.append('user_id', userId);
        mediaFormData.append('media_file', mediaFile);
        mediaFormData.append('media_type', mediaType);

        // Upload the media file
        const mediaUploadResponse = await api.post(`users/${userId}/media/`, mediaFormData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        });

        if (mediaUploadResponse.status === 201) {
          // successful upload, get media file id
          const mediaId = mediaUploadResponse.data.media_file_id;

          // Create the status update with media file id
          const statusFormData = new FormData();
          statusFormData.append('user', userId);
          statusFormData.append('text_content', newStatus);
          statusFormData.append('media_file_id', mediaId);

          // Create new status update
          const statusResponse = await api.post(`users/${userId}/status/`, statusFormData, {
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'multipart/form-data',
            },
          });

          if (statusResponse.status === 201) {
            // Append the media file URL to the status update object
            const newStatusUpdate = {
              ...statusResponse.data,
              media_file: mediaUploadResponse.data.media_file
            };

            console.log(newStatusUpdate);

            // Update the list of status updates
            setStatusUpdates([newStatusUpdate, ...statusUpdates]);

            // Clear the input field
            setNewStatus('');
          } else {
            console.error('Failed to create status update', statusResponse);
          }
        } else {
          console.error('Failed to upload media file', mediaUploadResponse);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
        // no media
        const statusFormData = new FormData();
        statusFormData.append('user', userId);
        statusFormData.append('text_content', newStatus);
        statusFormData.append('media_file_id', '');

        // Create the status update
        const statusResponse = await api.post(`users/${userId}/status/`, statusFormData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        });

        if (statusResponse.status === 201) {
          // Success, update the list of status updates
          setStatusUpdates([statusResponse.data, ...statusUpdates]);

          // Clear the input field
          setNewStatus('');
        } else {
          console.error('Failed to create status update', statusResponse);
        }
   }
};


/**
 * Fetch status updates of a user.
 */
export const fetchUserStatusUpdates = async (userId) => {
  try {
    const response = await api.get(`users/${userId}/status/`, {
      headers: {
        ...getAuthHeaders(),
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user status updates:', error);
    throw error;
  }
};

// Friends

/**
 * Add a new friend.
 * @param {number} user1Id - first user id.
 * @param {number} user2Id - second user id.
 * @param {string} status - (not functional yet)
 */
export const addFriend = async (user1Id, user2Id, status = 'accepted') => {
  try {
    const response = await api.post(`users/${user1Id}/friends/`, {
      user1_id: user1Id,
      user2_id: user2Id,
      status
    }, {
      headers: {
        ...getAuthHeaders(),
      }
    });
    return response.data;
  } catch (error) {
    console.error('Could not add friend:', error);
  }
};

/**
 * Remove a friend.
 * @param {number} friendshipId - friendship id.
 */
export const removeFriend = async (friendshipId) => {
  try {
    const response = await api.delete(`friendship/${friendshipId}/`, {
      headers: {
        ...getAuthHeaders(),
      }
    });
    return response.data;
  } catch (error) {
    console.error('Could not remove friend:', error);
  }
};

/**
 * List user's friends.
 * @param {number} userId
 */
export const listFriends = async (userId) => {
  try {
    const response = await api.get(`users/${userId}/friends/`, {
      headers: {
        ...getAuthHeaders(),
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to list friends:', error);
  }
};

/**
 * Get user's friends (duplicate)
 */
export const fetchUserFriends = async (userId) => {
  const res = await api.get(`users/${userId}/friends/`, {
    headers: {
      ...getAuthHeaders(),
    }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error('Failed to get user friends');
  }
};

/**
 * Upload a new media file.
 * @param {number} user_id
 * @param {File} file
 * @param {string} mediaType
 */
export const uploadMedia = async (userId, file, mediaType) => {
  const formData = new FormData();
  formData.append('file_path', file);
  formData.append('media_type', mediaType);

  try {
    const response = await api.post(`users/${userId}/media/`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Could not upload media:', error);
  }
};

/**
 * Get a media item by id.
 * @param {number} mediaId
 */
export const fetchMediaFileById = async (mediaId) => {
  try {
    const response = await api.get(`media/${mediaId}/`, {
      headers: {
        ...getAuthHeaders(),
      }
    });
    return response.data;

  } catch (error) {
    console.error('Could not get media:', error);
  }
};

// end of the code I wrote
