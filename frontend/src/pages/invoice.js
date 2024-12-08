import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { MoonLoader } from 'react-spinners';
import { FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';  // Importing icons
import '../index.css';  // Make sure to add your custom styles

const Invoice = () => {
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token found
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/payment/invoice', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment info');
        }
        const data = await response.json();
        setPayment(data);     
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payment info');
        setLoading(false);
      }
    };

    fetchInvoiceInfo();
  }, [navigate]);

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        <Sidebar />

        <div className="dashboard-content">
          <div className='blurredimage'></div>
          <h1>Invoices</h1>

          {/* Loading Spinner */}
          {loading ? (
            <div className="loading-container">
              <MoonLoader size={50} color={"#36D7B7"} />
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <div className="payment-info">
              {payment.length > 0 ? (
                payment.map((invoice) => (
                  <div key={invoice._id} className="order-item">
                    <div className='invoice-item'>
                      <h2 style={{ fontWeight: 'bold', color: '#2980b9', fontSize: '2rem' }}>
                        Order ID: {invoice.orderId}
                      </h2>
                      <p style={{ fontWeight: 'bold', color: 'red' }}>
                        <strong>Amount:</strong> ${invoice.amount}
                        <FaMoneyBillWave style={{ marginLeft: '10px', color: '#f39c12' }} /> {/* Money icon */}
                      </p>
                      <p style={{ fontWeight: 'bold', color: 'green' }}>
                        <strong>Payment Method:</strong> {invoice.paymentMethod.cardType}
                        <FaCreditCard style={{ marginLeft: '10px' }} /> {/* Card icon */}
                      </p>
                      <p style={{ fontWeight: 'bold', color: 'blue' }}>
                        <strong>Status:</strong> {invoice.status}
                        {invoice.status === 'SUCCESS' ? (
                          <FaCheckCircle style={{ marginLeft: '10px', color: 'green' }} />  // Completed icon
                        ) : (
                          <FaTimesCircle style={{ marginLeft: '10px', color: 'red' }} />  // Failed icon
                        )}
                      </p>
                      <p style={{ fontWeight: 'bold', color: '#36D7B7' }}>
                        <strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Check if paymentMethod exists and has details */}
                    {invoice.paymentMethod && typeof invoice.paymentMethod === 'object' && (
                      <div className='invoice-item'>
                        <h2>Card Details:</h2>
                        <p style={{ fontWeight: 'bold', color: '#2980b9' }}>
                          <strong>Card Type:</strong> {invoice.paymentMethod.cardType || 'N/A'}
                          <FaCreditCard style={{ marginLeft: '10px' }} />
                        </p>
                        <p style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                          <strong>Card Number:</strong> {invoice.paymentMethod.cardNumber || 'N/A'}
                        </p>
                        <p style={{ fontWeight: 'bold', color: '#f39c12' }}>
                          <strong>Expiry Date:</strong> {invoice.paymentMethod.expiryDate || 'N/A'}
                        </p>
                        <p style={{ fontWeight: 'bold', color: '#2ecc71' }}>
                          <strong>Card Holder:</strong> {invoice.paymentMethod.cardHolderName || 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <h2 style={{color: 'red'}}>No invoices found.</h2>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
