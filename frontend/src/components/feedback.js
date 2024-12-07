import React, { useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
const Feedbackitem = ({ orders }) => {
  const [feedbackStatus, setFeedbackStatus] = useState({}); // Track feedback status for orders
  const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for feedback
  const [feedbackData, setFeedbackData] = useState({ comment: '', rating: '', menuItemRatings: [] });
  const [popupVisible, setPopupVisible] = useState(false); // Track popup visibility
  const [formError, setFormError] = useState(''); // Track form validation errors
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [message,setMessage]=useState("");
  // Check feedback existence for all orders
  useEffect(() => {
    const checkFeedback = async () => {
      setIsLoading(true); // Set loading state to true while fetching
      try {
        const token = localStorage.getItem('token');
        const status = {};
        for (const order of orders) {
          const response = await fetch(`http://localhost:5000/api/feedback/${order._id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
          status[order._id] = result.exists;
        }
        setFeedbackStatus(status);
      } catch (error) {
        console.error('Error checking feedback status:', error.message);
      } finally {
        setIsLoading(false); // Set loading state to false once fetching is done
      }
    };
    if (orders.length) {
      checkFeedback();
    }
    else
    {
      setMessage("You have No delivered Orders yet");
    }
  }, [orders]);

  const handleFeedbackClick = (order) => {
    setSelectedOrder(order._id); // Set the current order for feedback
    const initialRatings = order.items.map((item) => ({
      menuItem: item.menuItem._id,
      rating: '',
    }));
    setFeedbackData({ comment: '', rating: '', menuItemRatings: initialRatings });
    setFormError(''); // Clear any previous errors
  };

  const handleInputChange = (e, field) => {
    const { name, value } = e.target;

    if (field === 'menuItemRating') {
      const numericValue = Math.min(Math.max(Number(value), 1), 5); // Clamp value between 1 and 5
      const menuItemId = name; // `name` is the menuItem ID
      setFeedbackData((prevData) => ({
        ...prevData,
        menuItemRatings: prevData.menuItemRatings.map((rating) =>
          rating.menuItem === menuItemId ? { ...rating, rating: numericValue } : rating
        ),
      }));
    } else if (field === 'rating') {
      const numericValue = Math.min(Math.max(Number(value), 1), 5); // Clamp value between 1 and 5
      setFeedbackData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else {
      // For non-numeric fields like 'comment'
      setFeedbackData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmitFeedback = async () => {
    // Validation: Check if the required fields are filled
    if (!feedbackData.comment || !feedbackData.rating || feedbackData.menuItemRatings.some(item => item.rating === '')) {
      setFormError('Please fill in all fields before submitting.');
      return; // Don't submit if there are validation errors
    }

    setIsLoading(true); // Set loading state to true while submitting
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder,
          comment: feedbackData.comment,
          rating: feedbackData.rating,
          menuItemRatings: feedbackData.menuItemRatings,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      const result = await response.json();
      console.log(result.message); // Feedback submitted successfully
      setFeedbackStatus((prevStatus) => ({ ...prevStatus, [selectedOrder]: true })); // Update feedback status
      setSelectedOrder(null); // Close the feedback form
      showPopup(); // Trigger popup
    } catch (error) {
      console.error('Error submitting feedback:', error.message);
    } finally {
      setIsLoading(false); // Set loading state to false once submission is done
    }
  };

  // Show popup for 3 seconds
  const showPopup = () => {
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
  };

  return (
    <div className="Feedbackitems">
      {popupVisible && (
        <div className="popup">
          Feedback submitted successfully!
        </div>
      )}

      {/* Loading spinner or message */}
      {isLoading && <div className="loading-overlay">
    <div className='loading-text'>   <MoonLoader color="#36d7b7" loading={isLoading} size={100} />
       </div> 
        </div>}
        {message && <p className='centered-message'>{message}</p>}
    
      {orders.map((order) => (
        <div key={order._id} className="order-item">
          <h2>Order ID: {order._id}</h2>
          <p style={{ color: '#4CAF50' }}>Status: {order.status}</p>
          <p style={{ color: '#2196F3' }}><strong>Total Price: $</strong>{order.totalPrice}</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px',color:'red' }}>
            {order.items.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {item.menuItem.name} x {item.quantity} - ${item.menuItem.price * item.quantity}
              </li>
            ))}
          </ul>
          {feedbackStatus[order._id] ? (
            <p style={{ color: '#9E9E9E' }}>Feedback submitted</p>
          ) : selectedOrder === order._id ? (
            <div className="feedback-form">
              {formError && <div className="error" style={{ color: '#F44336' }}>{formError}</div>} {/* Show error message if form is invalid */}
              <textarea
                name="comment"
                placeholder="Leave your comment"
                value={feedbackData.comment}
                onChange={(e) => handleInputChange(e, 'comment')}
                required
              ></textarea>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                placeholder="Overall Rating (1-5)"
                value={feedbackData.rating}
                onChange={(e) => handleInputChange(e, 'rating')}
                required
              />
              <h4 style={{ color: '#FF9800' }}>Rate Menu Items:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.menuItem._id}>
                    <label>
                      {item.menuItem.name}:
                      <input
                        type="number"
                        name={item.menuItem._id} // Use menuItem ID as the name
                        min="1"
                        max="5"
                        placeholder="Rating (1-5)"
                        value={
                          feedbackData.menuItemRatings.find((rating) => rating.menuItem === item.menuItem._id)?.rating ||
                          ''
                        }
                        onChange={(e) => handleInputChange(e, 'menuItemRating')}
                        required
                      />
                    </label>
                  </li>
                ))}
              </ul>
              <button onClick={handleSubmitFeedback}>Submit</button>
              <button onClick={() => setSelectedOrder(null)}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => handleFeedbackClick(order)}>Submit Feedback</button>
          )}
        </div>
      ))}
      
    </div>
  );
};

export default Feedbackitem;
