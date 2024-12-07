import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Menuitem from '../components/menuitem';
import Button from '../components/Button';
import FilterDropdown from '../components/MenuFilter';  // Import the filter component
import '../index.css';
import { MoonLoader } from 'react-spinners';

const MenuBrowsing = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [filterParams, setFilterParams] = useState({});  // Store filter parameters
  const [showMessage, setShowMessage] = useState(false);  // State to control the visibility of the "Item added" message
  const [loading, setLoading] = useState(true);  // Loading state to manage data fetching

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
      return;
    }

    const fetchMenuData = async () => {
      try {
        let url = 'http://localhost:5000/api/menu/';
        
        // Append filter parameters to the URL if they exist
        const queryParams = new URLSearchParams(filterParams).toString();
        if (queryParams) {
          url += `filter/?${queryParams}`;
        }

        const response = await fetch(url, {
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
        setMenuItems(data);
        setLoading(false);  // Set loading to false once the data is fetched
        
      } catch (err) {
        console.log(err);
        setLoading(false);  // In case of an error, stop the loading state
      }
    };

    fetchMenuData();
  }, [navigate, filterParams]);  // Re-fetch data when filterParams change

  const handleOrder = async (itemId, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
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
      
      // Show the "Item added" message
      setShowMessage(true);
      // Hide the message after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-text">  <MoonLoader color="#36d7b7" loading={loading} size={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="account-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          {/* Filter Dropdown */}
          <h1 style={{color:'white'}}>Browse Menu</h1>
          <FilterDropdown setFilterParams={setFilterParams} />
          
          <div className="Menugrid">
            {/* Map over the menuItems array and render each Menuitem */}
            {menuItems.length > 0 ? menuItems.map((item, index) => (
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
                  onClick={() => handleOrder(item._id)} 
                />
              </div>
            )) : (
              <p>No menu items found based on the selected filters.</p>
            )}
          </div>
        </div>
      </div>

      {/* Show "Item added to cart" message */}
      {showMessage && (
        <div className="added-to-cart-message">
          <p>Item added to cart</p>
        </div>
      )}
    </div>
  );
};

export default MenuBrowsing;
