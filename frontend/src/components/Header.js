import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa'; // Import a food-related icon

const Header = () => {
  const navigate = useNavigate();

  // Array of greetings in different languages
  const greetings = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Hallo', 'Konnichiwa', 'Olá'];

  const [currentGreeting, setCurrentGreeting] = useState(greetings[0]); // Default greeting
  const [fadeClass, setFadeClass] = useState('fade-in'); // For fade effect
  const [flashClass, setFlashClass] = useState(''); // Flashing effect toggle

  // Function to cycle through greetings every 3 seconds
  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setFadeClass('fade-out'); // Start fading out
      setTimeout(() => {
        setCurrentGreeting(greetings[Math.floor(Math.random() * greetings.length)]); // Set a random greeting
        setFadeClass('fade-in'); // Start fading in the new greeting
      }, 300); // Wait for 300ms before changing the greeting
    }, 3000); // Change greeting every 3 seconds

    // Toggle flashing effect every 5 seconds (for example)
    const flashInterval = setInterval(() => {
      setFlashClass('flash-logo'); // Apply flashing effect
      setTimeout(() => setFlashClass(''), 1000); // Reset after 1 second
    }, 3000); // Flash effect every 5 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(greetingInterval);
      clearInterval(flashInterval);
    };
  }, []); // Empty array means this useEffect runs only once when the component mounts

  return (
    <div className="header">
      <div className="logo">
        <FaUtensils size={32} style={{ marginRight: '10px', color: '#FF5722' }} className={flashClass} /> {/* Restaurant icon with flashing effect */}
        FoodEaters
      </div>
      <div className="user-info">
        <span className={`greeting ${fadeClass}`}>{currentGreeting}</span> {/* Display the dynamic greeting */}
        <button onClick={() => {
          localStorage.removeItem('token');
          navigate('/'); // Redirect to login after logout
        }}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
