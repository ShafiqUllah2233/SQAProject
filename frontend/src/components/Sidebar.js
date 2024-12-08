import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
// Import all the existing icons
import { 
  FaHome, FaUserCircle, FaUtensils, FaHistory, 
  FaCalendarAlt, FaShoppingCart, FaStar, 
  FaRegQuestionCircle, FaMoneyBillWave, FaFileInvoice 
} from 'react-icons/fa';

const ResponsiveSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a link is clicked
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Automatically close sidebar on desktop view
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar menu items
  const menuItems = [
    { path: "/Dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/account", icon: FaUserCircle, label: "Account Management" },
    { path: "/menu", icon: FaUtensils, label: "Menu Browsing" },
    { path: "/order-history", icon: FaHistory, label: "Order History" },
    { path: "/reservation", icon: FaCalendarAlt, label: "Reservation" },
    { path: "/cart", icon: FaShoppingCart, label: "Cart" },
    { path: "/feedback", icon: FaStar, label: "Feedback and Ratings" },
    { path: "/SpecialRequest", icon: FaRegQuestionCircle, label: "Special Requests" },
    { path: "/checkout", icon: FaMoneyBillWave, label: "Checkout" },
    { path: "/invoice", icon: FaFileInvoice, label: "Invoices" }
  ];

  // Render sidebar content
  const renderSidebarContent = () => (
    <ul>
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link to={item.path} onClick={closeSidebar}>
            <item.icon className="icon" /> {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  // Render hamburger menu for mobile
  const renderHamburgerMenu = () => (
    <div 
      className={`hamburger-menu ${isSidebarOpen ? 'open' : ''}`} 
      onClick={toggleSidebar}
    >
      {isSidebarOpen ? <FaTimes /> : <FaBars />}
    </div>
  );

  return (
    <>
      {isMobile && renderHamburgerMenu()}
      
      <div 
        className={`sidebar ${isMobile ? 'mobile' : ''} ${isSidebarOpen ? 'open' : ''}`}
        // Add overlay click to close on mobile
        onClick={isMobile && isSidebarOpen ? closeSidebar : undefined}
      >
        {renderSidebarContent()}
      </div>

      {/* Overlay for mobile menu */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default ResponsiveSidebar;