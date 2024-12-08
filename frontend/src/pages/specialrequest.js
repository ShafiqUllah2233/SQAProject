import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Requestitem from '../components/specialrequestcomponent';
import '../index.css';

const SpecialRequest = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/order/history', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }

      const data = await response.json();

      // Filter orders that are pending
      const filteredOrders = data.filter((order) => order.status === "PENDING");

      // Add a check for existing special requests in the orders
      const updatedOrders = filteredOrders.map(order => ({
        ...order,
        hasSpecialRequest: order.specialRequest ? true : false, // Assuming specialRequest is in the order schema
      }));

      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error fetching order history:', err);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [navigate]);

  return (
    <div className="account-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <div className='blurredimage'></div>
          <div className="account-sections">
            <h1>Special Requests</h1>
            <Requestitem data={orders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;
