// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ customerInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="logo">Restaurant Name</div>
      <div className="user-info">
        <span>Hello, {customerInfo ? customerInfo.name : 'Customer'}</span>
        <button onClick={() => {
          localStorage.removeItem('token');
          navigate('/'); // Redirect to login after logout
        }}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
