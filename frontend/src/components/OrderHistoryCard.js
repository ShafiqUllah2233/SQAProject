import React, { useState, useEffect } from 'react';
import { MoonLoader } from 'react-spinners';

const OrderList = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // Loading state
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
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
          // If the response is not OK, keep the orders empty
          console.error('Failed to fetch order history');
          return;
        }

        const data = await response.json();
        setOrders(data); // Set the fetched orders in state
      } catch (err) {
        console.error('Error fetching orders:', err.message);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchOrderHistory();
  }, []);

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/order/cancel/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel the order');
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'CANCELLED' } : order
        )
      ); // Update the state with the cancelled order
      setSuccessMessage('Order has been successfully cancelled!');
      setTimeout(() => setSuccessMessage(null), 3000); // Remove success message after 3 seconds
    } catch (err) {
      console.error('Error cancelling order:', err.message);
    }
  };

  return (
    <div className="order-list" style={{ padding: '20px' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-text">
            <div>
              <MoonLoader color="#36d7b7" loading={loading} size={100} />
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="modal-overlay">
          <div className="success-modal">
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <h2 style={{ color: 'red', textAlign: 'center' }}>No orders found.</h2>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="order-item"
          style={{
            backgroundColor: '#ffffffb8',
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textDecoration: order.status === 'CANCELLED' ? 'line-through' : 'none',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', borderBottom: '0.1px solid gray' }}>
            Order #{order._id}
          </h2>
          <p className="order-date" style={{ fontSize: '1rem', color: '#555', marginBottom: '5px' }}>
            Created At: {new Date(order.createdAt).toLocaleString()}
          </p>
          <p
            className={`order-status ${order.status.toLowerCase()}`}
            style={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              marginTop: '10px',
              color: getStatusColor(order.status),
            }}
          >
            Status: {order.status}
          </p>
          <p style={{ fontSize: '1.2rem', marginTop: '10px', fontWeight: 'bold', color: 'green' }}>
            Payment Status: {order.paymentStatus}
          </p>
          <p
            className="order-price"
            style={{ fontSize: '1.2rem', marginTop: '10px', fontWeight: 'bold', color: 'blue' }}
          >
            Total Price: ${order.totalPrice}
          </p>

          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {order.items.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px', color: 'red' }}>
                {item.menuItem
                  ? `${item.menuItem.name} x ${item.quantity} - $${item.menuItem.price * item.quantity}`
                  : 'Item details unavailable'}
              </li>
            ))}
          </ul>

          {order.status !== 'DELIVERED' &&
            order.status !== 'CANCELLED' &&
            order.paymentStatus !== 'PAID' && (
              <button
                onClick={() => handleCancelOrder(order._id)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Cancel Order
              </button>
            )}
        </div>
      ))}
    </div>
  );
};

// Helper function to get color based on the order status
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'orange';
    case 'confirmed':
      return 'green';
    case 'preparing':
      return 'blue';
    case 'ready':
      return 'purple';
    case 'delivered':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'black';
  }
};

export default OrderList;
