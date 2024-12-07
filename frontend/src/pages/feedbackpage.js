import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import Feedbackitem from '../components/feedback';
import '../index.css';

const Feedback = () => {

  const navigate=useNavigate();

  const [orders,setOrders]=useState([]);

  useEffect(() => {
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
  
        // Filter orders with status 'DELIVERED'
       const deliveredOrders = data.filter(order => order.status === 'DELIVERED');
       setOrders(deliveredOrders); // Set only delivered orders
       
  
      } catch (err) {
        console.error('Error fetching order history:', err);
      }
    };
  
    fetchOrderHistory();
  }, [navigate]);
  
  

  return (
    <div className="cart-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <h1>Feedback And Ratings</h1>
          {orders?<Feedbackitem orders={orders}/>:<p>No delivered orders</p>}
          

        </div>
      </div>
    </div>
  );
};

export default Feedback;
