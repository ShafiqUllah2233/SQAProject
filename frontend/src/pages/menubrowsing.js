import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Menuitem from '../components/menuitem';
import Button from '../components/Button';
import '../index.css';

const MenuBrowsing = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]); // Store the menu items array
  const [modalMessage, setModalMessage] = useState(''); // Store success or error message
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
      return;
    }

    const fetchmenudata = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const data = await response.json();
        setMenuItems(data); // Set the menu items array in state
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchmenudata();
  }, [navigate]); 

  // Handle order button click
  const handleOrder = async (itemId, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/add-to-cart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          quantity,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
  
      const cartData = await response.json();
  
      // Add the item to the order schema in the database
      const createOrderResponse = await fetch('http://localhost:5000/api/order/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ menuItem: itemId, quantity }], // Pass the item and quantity
          totalPrice: cartData.totalPrice,  // Assuming the response contains totalPrice
        }),
      });
  
      if (!createOrderResponse.ok) {
        throw new Error('Failed to create order');
      }
  
      // Show success message
      setModalMessage('Item added to cart and order created successfully!');
      setModalVisible(true);
  
      // Hide modal after 3 seconds
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
  
    } catch (err) {
      console.log(err);
      setModalMessage('Please try again');
      setModalVisible(true);
  
      // Hide modal after 3 seconds
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    }
  };

  return (
    <div className="account-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <div className="Menugrid">
            {/* Map over the menuItems array and render each Menuitem */}
            {menuItems.map((item, index) => (
              <div key={index}>
                <Menuitem 
                  name={item.name} 
                  description={item.description} 
                  price={item.price} 
                  category={item.category} 
                  imageUrl={item.imageUrl} 
                />
                {/* Render Button for each item */}
                <Button 
                  type="button" 
                  label="Order Now" 
                  onClick={() => handleOrder(item._id)}  // Pass the itemId
                />
              </div>
            ))}
          </div>

          {/* Modal for success or error message */}
          {modalVisible && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>{modalMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuBrowsing;
