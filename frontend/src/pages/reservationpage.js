
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import Reservation from '../components/reservationcomponent';
import '../index.css';



const Reservations = () => {
  

  return (
    <div className="account-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
        <div className='blurredimage'></div>

          <div className="account-sections">
            <h1>Available Tables</h1>
            <Reservation/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
