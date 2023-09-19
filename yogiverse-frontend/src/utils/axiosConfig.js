// I wrote this code

import axios from 'axios';
import api from '../services/api';

// Set JWT token in Axios headers if available in local storage
const setJwtToken = () => {
  const jwtToken = localStorage.getItem('authToken');
  if (jwtToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  }
};
setJwtToken();

// Refresh the JWT token using a refresh token.
export const refreshTheToken = async (refreshToken) => {
  try {
    const response = await api.post('token/refresh/', { refresh: refreshToken });
    return response.data.access;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    return null;
  }
};

// Automatic token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (error.response.status === 401 && storedRefreshToken) {
      const newAccessToken = await refreshTheToken(storedRefreshToken);

      if (newAccessToken) {
        localStorage.setItem('jwtToken', newAccessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } else {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        window.location = '/login'; // Redirect to the login page
      }
    }

    console.error("Axios request failed:", error);
    return Promise.reject(error);
  }
);
