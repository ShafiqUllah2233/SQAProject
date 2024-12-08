import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Edit, 
  Trash2, 
  Plus 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import ItemForm from '../components/ItemForm';
import { MoonLoader } from 'react-spinners';
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
    email: { required: true, email: true }
  };

  // Address fields configuration
  const addressFields = [
    { name: 'addressLine1', label: 'Address Line 1' },
    { name: 'addressLine2', label: 'Address Line 2', required: false },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'country', label: 'Country' },
    { name: 'isDefault', label: 'Set as Default', type: 'checkbox' }
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
    { name: 'cardType', label: 'Card Type', type: 'select', 
      options: ['Visa', 'MasterCard', 'American Express', 'Discover'] },
    { name: 'cardNumber', label: 'Card Number' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { name: 'cardHolderName', label: 'Cardholder Name' },
    { name: 'isDefault', label: 'Set as Default', type: 'checkbox' }
  ];

  // Payment method validation rules
  const paymentMethodValidationRules = {
    cardType: { required: true },
    cardNumber: { 
      required: true, 
      minLength: 16, 
      maxLength: 16, 
      pattern: /^\d{16}$/ 
    },
    expiryDate: { required: true },
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
  const handleSaveAddress = async (newAddress) => {
    const token = localStorage.getItem('token');
    try {
      let response;
      if (editingAddress) {
        // Update existing address
        response = await fetch(`http://localhost:5000/api/address/edit/${editingAddress._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressLine1: newAddress.addressLine1,
            addressLine2: newAddress.addressLine2 || '',
            city: newAddress.city,
            state: newAddress.state,
            country: newAddress.country,
            isDefault: newAddress.isDefault || false
          })
        });
      } else {
        // Add new address
        response = await fetch('http://localhost:5000/api/address/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressLine1: newAddress.addressLine1,
            addressLine2: newAddress.addressLine2 || '',
            city: newAddress.city,
            state: newAddress.state,
            country: newAddress.country,
            isDefault: newAddress.isDefault || false
          })
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save address');
      }
  
      // Refresh addresses to ensure we have the latest data from the server
      const addressesResponse = await fetch('http://localhost:5000/api/address/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!addressesResponse.ok) {
        throw new Error('Failed to fetch updated addresses');
      }
  
      const updatedAddresses = await addressesResponse.json();
      setAddresses(updatedAddresses);
  
      setAddingNewAddress(false);
      setEditingAddress(null);
    } catch (err) {
      setError(err.message || 'Failed to save address');
      console.error(err);
    }
  };
  
  const handleDeleteAddress = async (addressToDelete) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/address/delete/${addressToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete address');
      }
  
      // Refresh addresses to ensure we have the latest data from the server
      const addressesResponse = await fetch('http://localhost:5000/api/address/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!addressesResponse.ok) {
        throw new Error('Failed to fetch updated addresses');
      }
  
      const updatedAddresses = await addressesResponse.json();
      setAddresses(updatedAddresses);
    } catch (err) {
      setError(err.message || 'Failed to delete address');
      console.error(err);
    }
  };

  // Handle payment method save
  const handleSavePaymentMethod = async (newPaymentMethod) => {
    const token = localStorage.getItem('token');
    try {
      let response;
      if (editingPaymentMethod) {
        // Update existing payment method
        response = await fetch(`http://localhost:5000/api/payment/update/${editingPaymentMethod._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardType: newPaymentMethod.cardType,
            cardNumber: newPaymentMethod.cardNumber,
            expiryDate: newPaymentMethod.expiryDate,
            cardHolderName: newPaymentMethod.cardHolderName,
            isDefault: newPaymentMethod.isDefault || false
          })
        });
      } else {
        // Add new payment method
        response = await fetch('http://localhost:5000/api/payment/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardType: newPaymentMethod.cardType,
            cardNumber: newPaymentMethod.cardNumber,
            expiryDate: newPaymentMethod.expiryDate,
            cardHolderName: newPaymentMethod.cardHolderName,
            isDefault: newPaymentMethod.isDefault || false
          })
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save payment method');
      }
  
      // Refresh payment methods to ensure we have the latest data from the server
      const paymentMethodsResponse = await fetch('http://localhost:5000/api/payment/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!paymentMethodsResponse.ok) {
        throw new Error('Failed to fetch updated payment methods');
      }
  
      const updatedPaymentMethods = await paymentMethodsResponse.json();
      setPaymentMethods(updatedPaymentMethods);
  
      setAddingNewPaymentMethod(false);
      setEditingPaymentMethod(null);
    } catch (err) {
      setError(err.message || 'Failed to save payment method');
      console.error(err);
    }
  };
  
  // Handle payment method delete
  const handleDeletePaymentMethod = async (paymentMethodToDelete) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/payment/delete/${paymentMethodToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete payment method');
      }
  
      // Refresh payment methods to ensure we have the latest data from the server
      const paymentMethodsResponse = await fetch('http://localhost:5000/api/payment/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!paymentMethodsResponse.ok) {
        throw new Error('Failed to fetch updated payment methods');
      }
  
      const updatedPaymentMethods = await paymentMethodsResponse.json();
      setPaymentMethods(updatedPaymentMethods);
    } catch (err) {
      setError(err.message || 'Failed to delete payment method');
      console.error(err);
    }
  };

  // Handle save preferences
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

  // Loading state
  if (loading) return (
    <div className='loading-overlay'>
      <div className='loading-text'>
        <MoonLoader color="#36d7b7" loading={loading} size={100} />
      </div>
    </div>
  );
  
  // Error state
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="account-management">
      <Header customerInfo={customerInfo} />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <div className='blurredimage'></div>
          <h1>Account Management</h1>
          <div className="account-sections">
            {/* Account Preferences */}
            <div className="section" id="preferences">
              <h2>
                <User className="" /> 
                Account Preferences
              </h2>
              
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
                  <button 
                    className='accountmgmtbutton flex items-center' 
                    onClick={() => setEditingPreferences(true)}
                  >
                    <Edit className="mr-2" /> Edit Preferences
                  </button>
                </div>
              )}
            </div>

            {/* Address Management */}
            <div className="section" id="addresses">
              <h2>
                <MapPin className="inline-icon mr-2" /> 
                Address Management
              </h2>
              <ul>
                {addresses.map((address) => (
                  <li 
                    key={address._id} 
                    className=""
                  >
                    <span>
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      , {address.city}, {address.state}, {address.country}
                      {address.isDefault && (
                        <span className="ml-2 text-green-500">(Default)</span>
                      )}
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        label={<><Edit className="mr-1" /> Edit</>} 
                        onClick={() => {
                          setEditingAddress(address);
                          setAddingNewAddress(true);
                        }} 
                      />
                      <Button 
                        type="button" 
                        label={<><Trash2 className="mr-1" /> Delete</>} 
                        onClick={() => handleDeleteAddress(address)} 
                      />
                    </div>
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
                  label={
                    <>
                      <Plus className="mr-1" /> 
                      Add New Address
                    </>
                  }
                  onClick={() => {
                    setAddingNewAddress(true);
                    setEditingAddress(null);
                  }} 
                />
              )}
            </div>

            {/* Payment Methods */}
            <div className="section" id="payments">
              <h2>
                <CreditCard className="inline-icon mr-2" /> 
                Payment Methods
              </h2>
              <ul>
                {paymentMethods.map((method) => (
                  <li 
                    key={method._id} 
                    className="flex items-center justify-between mb-2 p-2 border rounded"
                  >
                    <span>
                      {method.cardType} - **** **** **** {method.cardNumber.slice(-4)}
                      {method.isDefault && (
                        <span className="ml-2 text-green-500">(Default)</span>
                      )}
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        label={<><Edit className="mr-1" /> Edit</>} 
                        onClick={() => {
                          setEditingPaymentMethod(method);
                          setAddingNewPaymentMethod(true);
                        }} 
                      />
                      <Button 
                        type="button" 
                        label={<><Trash2 className="mr-1" /> Delete</>} 
                        onClick={() => handleDeletePaymentMethod(method)} 
                      />
                    </div>
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
                  label={
                    <>
                      <Plus className="mr-1" /> 
                      Add New Payment Method
                    </>
                  }
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