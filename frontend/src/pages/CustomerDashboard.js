import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { MoonLoader } from 'react-spinners';
import '../index.css';  // Make sure to add your custom styles

const CustomerDashboard = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token found
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/Customers/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer info');
        }

        const data = await response.json();
        setCustomerInfo(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer info');
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <MoonLoader color="#36d7b7" loading={loading} size={100} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        <Sidebar />

        <div className="dashboard-content">
          <div className='blurredimage'></div>
          <div className="welcome-section">
            <h1>Welcome To FoodEaters</h1>
            <h2 style={{ color: 'white', fontSize: '1.2rem'}}><strong>Customer Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</h2>
            <h2 style={{ color: 'white', fontSize: '1.2rem'}}><strong>Email:</strong> {customerInfo.email}</h2>
          </div>

          {/* Restaurant History Section */}
          <div className="restaurant-history">
          <h2>Our Story</h2>
          <div className="history-content">
            <p>
              Culinary Delights was founded in 2020 by Ali Khan with a passion for creating memorable dining experiences. Located in the heart of the city, our restaurant started as a small, humble establishment with big dreams.
              Our aim was simple: to provide delicious meals, a welcoming atmosphere, and exceptional customer service. Over the years, we’ve grown from a cozy neighborhood spot to a beloved food destination for locals and tourists alike.
            </p>
            <p>
              The idea behind Culinary Delights stemmed from Ali’s love for food and the desire to share the flavors of the world with everyone. We take pride in offering a menu that’s a fusion of international and local flavors, carefully crafted to delight your taste buds. From the freshest ingredients to the most innovative dishes, each meal is prepared with love and dedication.
            </p>
            <p>
              Our restaurant isn't just about food – it's about creating experiences. We aim to be a place where memories are made, where families gather to celebrate special moments, and where friends bond over great food. Our journey has been incredible, and we’re just getting started. Thank you for being part of our story. We look forward to continuing to serve you for many years to come.
            </p>
  </div>

  {/* Restaurant Image */}
  <div className="history-image">
    <img
      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
      alt="Restaurant Interior"
      className="story-image"
    />
  </div>
          </div>


          {/* About Us Section */}
          <div className="about-us">
            <h2>About Us</h2>
            <p>
              At FoodEaters, we’re passionate about connecting people with the best restaurants in town. Our platform is designed to make your dining experience seamless – whether you’re ordering for delivery or reserving a table for an evening out.
            </p>
            <p>
              With a carefully curated list of top-tier restaurants, we provide you with a wide range of cuisines to explore. Whether you're craving Italian, Chinese, or a comforting homemade meal, FoodEaters brings the best of the culinary world to your fingertips.
            </p>
            <p>
              We believe in making food experiences more accessible, enjoyable, and stress-free. By working closely with each restaurant, we ensure that our users can always find the perfect meal for every occasion. Whether you’re celebrating a special day or just craving comfort food, we’ve got you covered.
            </p>
            <p>
              Our mission is simple: To help you discover the best food experiences around you, anytime, anywhere. Thank you for choosing FoodEaters to make your meals extraordinary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
