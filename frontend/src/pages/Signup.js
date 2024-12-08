import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const userData = {
      username,
      email,
      password,
      firstName,
      lastName,
      role:'CUSTOMER'
    };
  console.log(userData);
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(userData), // Send the data as a JSON string
      });
  
      const data = await response.json(); // Parse the JSON response
      
      console.log(data);
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store JWT Token
        window.location.href = '/'; // Redirect to login page
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.log(err);
    }
  };

  return (

    <div className='Container'>
<div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSignup}>
        <Input
          type="text"
          name="username"
          className="signupinput"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          name="email"
          className="signupinput"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          name="password"
          className="signupinput"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="text"
          name="firstName"
          className="signupinput"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          type="text"
          name="lastName"
          className="signupinput"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        

        <Button type="submit" label="Sign Up" />
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/">Login</Link>
      </div>
    </div>
    </div>
    
  );
};

export default Signup;
