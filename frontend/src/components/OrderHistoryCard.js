import React, { useState, useEffect } from 'react';
import { MoonLoader } from 'react-spinners';
const OrderList = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in first.');
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
          throw new Error('Failed to fetch order history');
        }

        const data = await response.json();
        setOrders(data); // Set the fetched orders in state
      } catch (err) {
        setError(err.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchOrderHistory();
  }, []);

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in first.');
      return;
    }

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
      setSuccessMessage('Order has been successfully cancelled!'); // Set success message
      setTimeout(() => setSuccessMessage(null), 3000); // Remove success message after 3 seconds
    } catch (err) {
      setError(err.message); // Handle error
      setTimeout(() => setError(null), 3000); // Remove error message after 3 seconds
    }
  };

  return (
    <div className="order-list" style={{ padding: '20px' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-text">
            <div> <MoonLoader color="#36d7b7" loading={loading} size={100} />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="modal-overlay">
          <div className="error-modal">
            <p>{error}</p>
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

      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="order-item"
            style={{
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textDecoration: order.status === 'CANCELLED' ? 'line-through' : 'none', // Add line-through for cancelled orders
            }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px',borderBottom:'0.1px solid gray' }}>Order #{order._id}</h2>
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
            <p className="order-price" style={{ fontSize: '1.2rem', marginTop: '10px', fontWeight: 'bold', color: 'blue' }}>
              Total Price: ${order.totalPrice}
            </p>

            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              {order.items.map((item, index) => (
                <li key={index} style={{ marginBottom: '5px',color:'red' }}>
                  {item.menuItem.name} x {item.quantity} - ${item.menuItem.price * item.quantity}
                </li>
              ))}
            </ul>

            {/* Cancel button only if the order is not delivered or already cancelled */}
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
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
        ))
      ) : (
        <p style={{ color: '#555' }}>No orders found.</p>
      )}
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
