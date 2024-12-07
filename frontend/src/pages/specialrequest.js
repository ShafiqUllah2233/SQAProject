
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import Requestitem from '../components/specialrequestcomponent';
import '../index.css';



const SpecialRequest = () => {
 
  return (
    <div className="account-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <div className="account-sections">
            <Requestitem/>           
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;
