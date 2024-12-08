// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
// Import necessary icons
import { FaHome, FaUserCircle, FaUtensils, FaHistory, FaCalendarAlt, FaShoppingCart, FaStar, FaRegQuestionCircle,FaMoneyBillWave } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/Dashboard">
            <FaHome className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/account">
            <FaUserCircle className="icon" /> Account Management
          </Link>
        </li>
        <li>
          <Link to="/menu">
            <FaUtensils className="icon" /> Menu Browsing
          </Link>
        </li>
        <li>
          <Link to="/order-history">
            <FaHistory className="icon" /> Order History
          </Link>
        </li>
        <li>
          <Link to="/reservation">
            <FaCalendarAlt className="icon" /> Reservation
          </Link>
        </li>
        <li>
          <Link to="/cart">
            <FaShoppingCart className="icon" /> Cart
          </Link>
        </li>
        <li>
          <Link to="/feedback">
            <FaStar className="icon" /> Feedback and Ratings
          </Link>
        </li>
        <li>
          <Link to="/SpecialRequest">
            <FaRegQuestionCircle className="icon" /> Special Requests
          </Link>
        </li>
        <li>
          <Link to="/checkout">
            <FaMoneyBillWave className="icon" /> Checkout
          </Link>
        </li>
        <li>
          <Link to="/invoice">
            <FaMoneyBillWave className="icon" /> Invoices
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
