import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Cartitem from '../components/cartitem';
import { MoonLoader } from 'react-spinners'; // Import the MoonLoader spinner
import '../index.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const navigate = useNavigate(); // Hook for navigation

  const fetchItemsFromCart = async () => {
    setLoading(true); // Set loading true when fetching
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart/getitems', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items from cart');
      }

      const data = await response.json();
      setCartItems(data.items);
      setTotalPrice(data.totalPrice);
    } catch (err) {
      if(!err.message==="Failed to fetch items from cart")
      setError(err.message); // Update error state on failure
    } finally {
      setLoading(false); // Set loading false once the fetch is done
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    setLoading(true); // Set loading true when updating quantity
    setError(null); // Reset error state on new update
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cart/updatequantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      fetchItemsFromCart(); // Refetch cart after updating
    } catch (err) {
      setError(err.message); // Update error state on failure
    } finally {
      setLoading(false); // Set loading false once update is done
    }
  };

  const deleteCartItem = async (itemId) => {
    setLoading(true); // Set loading true when deleting item
    setError(null); // Reset error state
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cart/delete/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item from cart');
      }

      fetchItemsFromCart(); // Refetch cart after deleting item
    } catch (err) {
      setError(err.message); // Update error state on failure
    } finally {
      setLoading(false); // Set loading false once delete is done
    }
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id, // Make sure this matches the menuItem ObjectId
            quantity: item.quantity,
            // Add any other relevant fields
            specialInstructions: item.specialInstructions || ''
          })),
          totalPrice: totalPrice,
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.details || 'Failed to place order');
      }
  
      // Clear cart items in the frontend
      setCartItems([]);
      setTotalPrice(0);
  
  
      // Navigate to order confirmation or some success page
      navigate('/Order-history'); // Adjust route as needed
  
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err.message);
      
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetchItemsFromCart();
  }, [navigate]);

  return (
    <div className="cart-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
        <div className='blurredimage'></div>

          <h1>Shopping Cart</h1>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-text">
              <MoonLoader color="#36d7b7" loading={loading} size={100} />
              </div>
            </div>

          )}

          {error && <p className="error">{error}</p>} {/* Show error message if any */}
          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <Cartitem
                  key={item.id}
                  id={item.id}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  quantity={item.quantity}
                  price={item.price}
                  description={item.description}
                  category={item.category}
                  onQuantityIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onQuantityDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  onDelete={() => deleteCartItem(item.id)}
                />
              ))
            ) : (
              <h2 style={{color: '#e74c3c' ,fontSize: '20px'}}>Your cart is empty.</h2>
            )}
          </div>

          <h2 style={{color: 'red'}} className="total-price">Total Price: ${totalPrice.toFixed(2)}</h2>
          {cartItems.length > 0 && (
                <div>
                  <button className="btncheckout" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              )}


        </div>
      </div>
    </div>
  );
};

export default Cart;
