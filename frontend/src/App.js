import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import AccountManagement from './pages/AccountManagement';
import MenuBrowsing from './pages/menubrowsing';
import Orderhistory from "./pages/orderhistory";
import Feedback from "./pages/feedbackpage"
import Cart from "./pages/cart";
import SpecialRequest from "./pages/specialrequest";
import Reservations from "./pages/reservationpage";
import Checkout from "./pages/checkout";
import Invoice from "./pages/invoice";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/account" element={<AccountManagement />} />
        <Route path="/menu" element={<MenuBrowsing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Order-history" element={<Orderhistory/>}></Route>
        <Route path="/feedback" element={<Feedback/>}></Route>
        <Route path="/SpecialRequest" element={<SpecialRequest/>}></Route>
        <Route path="/reservation" element={<Reservations/>}></Route>
        <Route path="/checkout" element={<Checkout/>}></Route>
        <Route path="/invoice" element={<Invoice/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
