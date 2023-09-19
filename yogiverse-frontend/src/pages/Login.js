// I wrote this code

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';

// Login Page

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {};

  return (
    <>
      <Header />
      <div className="login">
        <h1>Login to Your Account</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Login;

// end of the code I wrote
