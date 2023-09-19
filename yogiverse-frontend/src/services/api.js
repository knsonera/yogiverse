// I wrote this code

// API calls configs

import axios from 'axios';
import { refreshTheToken } from '../utils/axiosConfig.js';


// Axios instance with pre-configured URL for all API calls
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Automatic token refresh
axios.interceptors.response.use(
  // if no errors, just return response
  response => {
    return response;
  },
  async function(error) {

    const originalRequest = error.config;
    // Check if the error is a 401
    if (error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;  // Mark the request as retried

      // Get the refresh token from local storage
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        // Get a new token using the refresh token
        const newToken = await refreshTheToken(refreshToken);

        // Update token in local storage
        localStorage.setItem('authToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Modify headers
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);

      } catch (err) {
        console.error("Token refresh failed:", err);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// end of the code I wrote
