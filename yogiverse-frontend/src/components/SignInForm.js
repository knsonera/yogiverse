// I wrote this code

/**
 * SignInForm.js
 */

import React, { useState } from 'react';
import './SignInForm.css';  // Import styles for this component
import axios from 'axios';
import api from '../services/api';
import { loginUser } from '../utils/handlers.js'; // Utility function for handling user login

/**
 * SignInForm Component
 * @param {Boolean} show - indicator if modal should be displayed.
 * @param {Function} onClose - close the modal function.
 */
const SignInForm = ({ show, onClose }) => {
  // Form data (username and password)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(formData.username, formData.password);

    if (success) {
      console.log("Login successful!");
      window.location.reload(); // Refresh the page
    } else {
      console.log("Login failed, check the console for details.");
    }
  };

  // Don't render the component if 'show' is false
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-form">
        <span className="close-button" onClick={onClose}>&times;</span>
        <form className="form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <input className="form-input" name="username" onChange={handleChange} placeholder="Username" />
          <input className="form-input" type="password" name="password" onChange={handleChange} placeholder="Password" />
          <button className="form-button" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;

// end of the code I wrote
