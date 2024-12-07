
import React,{useState,useEffect} from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Requestitem from '../components/specialrequestcomponent';
import '../index.css';



const SpecialRequest = () => {
  const [order,setOrders]=useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/order/history', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order history');
        }

        const data = await response.json();

        const Filteredorders=data.filter((items)=>{
          return items.status==="PENDING"
        });
        console.log(Filteredorders)
        setOrders(Filteredorders); // Set the fetched orders in state

      } catch (err) {
      }
    };

    fetchOrderHistory();
  }, [navigate]);

  return (
    <div className="account-management">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <div className="account-sections">
            <h1>Special Requests</h1>
            <Requestitem data={order}/>           
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;
