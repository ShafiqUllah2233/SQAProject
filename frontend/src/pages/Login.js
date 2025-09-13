// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Initialize useNavigate hook for navigation
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token',data.token); // Store the JWT token
      navigate('/dashboard');
      console.log(response); // Redirect to dashboard
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='Container'>
        <div className="auth-container">
          <div className='blurredimage'></div>
          <img style={{width:'100px'}} src="data:image/jpeg;base64,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"></img>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" label="Login" />
      </form>

      {/* Link to the Signup page */}
      <div className="auth-footer">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>

    </div>
    
  );
};

export default Login;
