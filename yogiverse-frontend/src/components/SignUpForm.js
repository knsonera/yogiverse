// I wrote this code

/**
 * SignUpForm.js
 */

import React, { useState } from 'react';
import './SignUpForm.css';
import axios from 'axios';
import api from '../services/api';
import { registerUser } from '../utils/handlers.js';

/**
 * SignUpForm Component
 * @param {Boolean} show - indicator if the modal should be displayed.
 * @param {Function} onClose - close the modal function.
 */
const SignUpForm = ({ show, onClose }) => {
  // Form fields
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  });

  // Password validation
  const [repeatPassword, setRepeatPassword] = useState('');

  // Changes in form fields
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

    // Check if passwords match
    if (formData.password !== repeatPassword) {
      alert('Passwords do not match');
      return;
    }

    // Trying to register the user
    const success = await registerUser(formData);
    if (success) {
      console.log("Registration successful!");
      window.location.reload();
    } else {
      console.log("Registration failed, check the console for details.");
    }
  };

  // Don't render if 'show' is false
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-form">
        <span className="close-button" onClick={onClose}>&times;</span>
        <form className="form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <input className="form-input" name="fullname" onChange={handleChange} placeholder="Full Name" />
          <input className="form-input" name="username" onChange={handleChange} placeholder="Username" />
          <input className="form-input" name="email" onChange={handleChange} placeholder="Email" />
          <input className="form-input" type="password" name="password" onChange={handleChange} placeholder="Password" />
          <input className="form-input" type="password" onChange={(e) => setRepeatPassword(e.target.value)} placeholder="Repeat Password" />
          <button className="form-button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;

// end of the code I wrote
