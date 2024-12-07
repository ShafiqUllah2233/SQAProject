// src/pages/Orderhistory.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import OrderList from '../components/OrderHistoryCard'; // Import the OrderList component
import '../index.css';

const Orderhistory = () => {
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token found
      return;
    }
  }, [navigate]);

  return (
    <div className="cart-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <h1>Order History</h1>
          <div className='orderlist'>
            
          <OrderList /> {/* Use the OrderList component */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderhistory;
