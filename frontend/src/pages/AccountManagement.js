
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import ItemForm from '../components/ItemForm';
import '../index.css';



const AccountManagement = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [addingNewPaymentMethod, setAddingNewPaymentMethod] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const navigate = useNavigate();

    // Account preferences fields configuration
    const preferencesFields = [
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'email', label: 'Email' }
    ];
  
    // Account preferences validation rules
    const preferencesValidationRules = {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true }
    };
  // Address fields configuration
  const addressFields = [
    { name: 'addressLine1', label: 'Address Line 1' },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'country', label: 'Country' }
  ];

  // Address validation rules
  const addressValidationRules = {
    addressLine1: { required: true },
    city: { required: true },
    state: { required: true },
    country: { required: true }
  };

  // Payment method fields configuration
  const paymentMethodFields = [
    { name: 'cardNumber', label: 'Card Number' },
    { name: 'cardHolderName', label: 'Cardholder Name' }
  ];

  // Payment method validation rules
  const paymentMethodValidationRules = {
    cardNumber: { required: true, minLength: 16 },
    cardHolderName: { required: true }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
      return;
    }

    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Customers/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer info');
        }

        const data = await response.json();
        setCustomerInfo(data);
      } catch (err) {
        setError('Failed to fetch customer info');
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/address/get', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }

        const data = await response.json();
        setAddresses(data);
      } catch (err) {
        setError('Failed to fetch addresses');
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/payment/get', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment methods');
        }

        const data = await response.json();
        setPaymentMethods(data);
      } catch (err) {
        setError('Failed to fetch payment methods');
      }
    };

    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCustomerInfo(), fetchAddresses(), fetchPaymentMethods()]);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  // Handle address save
  const handleSaveAddress = (newAddress) => {
    if (editingAddress) {
      // Update existing address
      setAddresses((prevAddresses) => 
        prevAddresses.map((address) => 
          address.id === editingAddress.id ? { ...address, ...newAddress } : address
        )
      );
      setEditingAddress(null);
    } else {
      // Add new address
      setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    }
    setAddingNewAddress(false);
  };

  // Handle payment method save
  const handleSavePaymentMethod = (newPaymentMethod) => {
    if (editingPaymentMethod) {
      // Update existing payment method
      setPaymentMethods((prevPaymentMethods) => 
        prevPaymentMethods.map((method) => 
          method.id === editingPaymentMethod.id 
            ? { ...method, ...newPaymentMethod } 
            : method
        )
      );
      setEditingPaymentMethod(null);
    } else {
      // Add new payment method
      setPaymentMethods((prevPaymentMethods) => [
        ...prevPaymentMethods,
        newPaymentMethod
      ]);
    }
    setAddingNewPaymentMethod(false);
  };

  // Handle address delete
  const handleDeleteAddress = (addressToDelete) => {
    setAddresses((prevAddresses) =>
      prevAddresses.filter((address) => address !== addressToDelete)
    );
  };

  // Handle payment method delete
  const handleDeletePaymentMethod = (paymentMethodToDelete) => {
    setPaymentMethods((prevPaymentMethods) =>
      prevPaymentMethods.filter((method) => method !== paymentMethodToDelete)
    );
  };

  const handleSavePreferences = async (updatedPreferences) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      // Update local state
      setCustomerInfo(prev => ({
        ...prev,
        ...updatedPreferences
      }));

      // Exit edit mode
      setEditingPreferences(false);
    } catch (err) {
      setError('Failed to update preferences');
      console.error(err);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="account-management">
      <Header customerInfo={customerInfo} />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <div className="account-sections">
            {/* Account Preferences */}
            <div className="section" id="preferences">
              <h2>Account Preferences</h2>
              
              {editingPreferences ? (
                <ItemForm
                  itemType="preferences"
                  onSave={handleSavePreferences}
                  fields={preferencesFields}
                  validationRules={preferencesValidationRules}
                  existingItem={customerInfo}
                />
              ) : (
                <div>
                  <p>First Name: {customerInfo?.firstName}</p>
                  <p>Last Name: {customerInfo?.lastName}</p>
                  <p>Email: {customerInfo?.email}</p>
                  <Button 
                    type="button" 
                    label="Edit Preferences" 
                    onClick={() => setEditingPreferences(true)} 
                  />
                </div>
              )}
            </div>

            {/* Address Management */}
            <div className="section" id="addresses">
              <h2>Address Management</h2>
              <ul>
                {addresses.map((address, index) => (
                  <li key={index}>
                    {address.addressLine1}, {address.city}, {address.state}, {address.country}
                    <Button 
                      type="button" 
                      label="Edit" 
                      onClick={() => {
                        setEditingAddress(address);
                        setAddingNewAddress(true);
                      }} 
                    />
                    <Button 
                      type="button" 
                      label="Delete" 
                      onClick={() => handleDeleteAddress(address)} 
                    />
                  </li>
                ))}
              </ul>
              
              {addingNewAddress && (
                <ItemForm
                  itemType="address"
                  onSave={handleSaveAddress}
                  fields={addressFields}
                  validationRules={addressValidationRules}
                  existingItem={editingAddress}
                />
              )}
              
              {!addingNewAddress && (
                <Button 
                  type="button" 
                  label="Add New Address" 
                  onClick={() => {
                    setAddingNewAddress(true);
                    setEditingAddress(null);
                  }} 
                />
              )}
            </div>

            {/* Payment Methods */}
            <div className="section" id="payments">
              <h2>Payment Methods</h2>
              <ul>
                {paymentMethods.map((method, index) => (
                  <li key={index}>
                    {method.cardNumber} - {method.cardHolderName}
                    <Button 
                      type="button" 
                      label="Edit" 
                      onClick={() => {
                        setEditingPaymentMethod(method);
                        setAddingNewPaymentMethod(true);
                      }} 
                    />
                    <Button 
                      type="button" 
                      label="Delete" 
                      onClick={() => handleDeletePaymentMethod(method)} 
                    />
                  </li>
                ))}
              </ul>
              
              {addingNewPaymentMethod && (
                <ItemForm
                  itemType="payment method"
                  onSave={handleSavePaymentMethod}
                  fields={paymentMethodFields}
                  validationRules={paymentMethodValidationRules}
                  existingItem={editingPaymentMethod}
                />
              )}
              
              {!addingNewPaymentMethod && (
                <Button 
                  type="button" 
                  label="Add New Payment Method" 
                  onClick={() => {
                    setAddingNewPaymentMethod(true);
                    setEditingPaymentMethod(null);
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
