// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/account">Account Management</Link></li>
        <li><Link to="/menu">Menu Browsing</Link></li>
        <li><Link to="/order-history">Order History</Link></li>
        <li><Link to="/reservation">Reservation</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/feedback">Feedback and Ratings</Link></li>
        <li><Link to="/special-requests">Special Requests</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
