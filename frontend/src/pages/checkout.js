import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { MoonLoader } from 'react-spinners';
import { FaShoppingCart, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';  // Import React Icons
import '../index.css';

const Checkout = () => {
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetching data from multiple endpoints
        const [addressesRes, paymentMethodsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:5000/api/address/get', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('http://localhost:5000/api/payment/get', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('http://localhost:5000/api/order/history', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        // Parsing responses
        const [addressesData, paymentMethodsData, ordersData] = await Promise.all([
          addressesRes.json(),
          paymentMethodsRes.json(),
          ordersRes.json(),
        ]);

        // Checking for response validity
        if (!addressesRes.ok) throw new Error('No addresses found');
        if (!paymentMethodsRes.ok) throw new Error('No payment methods found');
        if (!ordersRes.ok) throw new Error('No orders found');

        // Updating state
        setAddresses(addressesData || []);
        setPaymentMethods(paymentMethodsData || []);
        setPendingOrders(
          ordersData.filter(
            (order) =>
              order.paymentStatus === 'PENDING' &&
              (order.status === 'PENDING' || order.status === 'IN_PROGRESS')
          )
        );

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'No Found');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handlePayment = async () => {
    if (!selectedOrder || !selectedAddress || !selectedPaymentMethod) {
      setError('Please select an order, address, and payment method');
      return;
    }

    // Find the selected order to get its total price
    const orderToProcess = pendingOrders.find(order => order._id === selectedOrder);

    if (!orderToProcess) {
      setError('Selected order not found');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payment/process', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder,
          addressId: selectedAddress,
          paymentMethod: selectedPaymentMethod,
          amount: orderToProcess.totalPrice // Add the amount to the payload
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment processing failed');
      }

      // Display success message
      setSuccessMessage('Payment Successful!');
      
      // Hide the message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

      navigate('/invoice'); // Optional: redirect to orders page after successful payment
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <MoonLoader color="#36d7b7" size={100} />
      </div>
    );
  }

  

  return (
    <div className="checkout">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <div className='blurredimage'></div>
          <h1>Checkout</h1>
          
          {error&&(
            <div >
              <h2 style={{color: 'red'}}>{error}</h2>
            </div>
          )}
          {/* Display success message if payment is successful */}
          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Orders Section */}
          <div className="checkout-section">
            <h2>Select an Order</h2>
            {pendingOrders.length === 0 ? (
              <p>No pending orders available.</p>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order._id}
                  className={`order-item ${selectedOrder === order._id ? 'selected' : ''}`}
                  onClick={() => setSelectedOrder(order._id)}
                >
                  <p style={{color: '#2980b9', fontWeight: 'bold', fontSize: '1.5rem'}}>
                    <FaShoppingCart /> Order ID: {order._id}
                  </p>
                  <p style={{color: '#e74c3c', fontWeight: 'bold'}}>
                    <FaCreditCard /> Total: ${order.totalPrice}
                  </p>
                  <p style={{color: '#2ecc71', fontWeight: 'bold'}}>Status: {order.status}</p>
                  <p style={{color: '#f1c40f', fontWeight: 'bold'}}>Payment Status: {order.paymentStatus}</p>
                </div>
              ))
            )}
          </div>

          {/* Addresses Section */}
          <div className="checkout-section">
            <h2><FaMapMarkerAlt /> Select Delivery Address</h2>
            {addresses.length === 0 ? (
              <p>No addresses found. Please add one.</p>
            ) : (
              <ul>
                {addresses.map((address) => (
                  <li
                    key={address._id}
                    className={`address-item ${selectedAddress === address._id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address._id)}
                  >
                    <span>
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      , {address.city}, {address.state}, {address.country}
                      {address.isDefault && (
                        <span className="ml-2 text-green-500">(Default)</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Payment Methods Section */}
          <div className="checkout-section">
            <h2><FaCreditCard /> Select Payment Method</h2>
            {paymentMethods.length === 0 ? (
              <p>No payment methods available. Please add one.</p>
            ) : (
              <ul>
                {paymentMethods.map((method) => (
                  <li
                    key={method._id}
                    className={`payment-method ${selectedPaymentMethod === method ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod(method)}
                  >
                    <span>
                      CardType: {method.cardType}
                      <br />CardNumber: **** **** **** {method.cardNumber.slice(-4)},
                      <br />Name: {method.cardHolderName}
                      <br />ExpDate: {method.expiryDate}
                      {method.isDefault && <span>(Default)</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="proceed-button"
            onClick={handlePayment}
            disabled={!selectedOrder || !selectedAddress || !selectedPaymentMethod}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
