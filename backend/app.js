const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerroute');
const addressroutes=require('./routes/address');
const paymentmethodroutes=require('./routes/paymentmethodroutes');
const orderRoutes=require('./routes/orderroute');
const menuRoutes=require('./routes/menuitemroutes');
const cartRoutes=require('./routes/cartroutes');
const reservationRoutes=require('./routes/reservationtableroutes');
const tableRoutes=require('./routes/tableroutes');
const paymentroutes=require('./routes/paymentroutes');
const feedbackroutes=require('./routes/feedbackroutes');
const profileRoutes=require('./routes/profileroute');

const cors = require('cors');
dotenv.config();
const app = express();

// Connect to the database
connectDB();
app.use(cors());
// Middleware
app.use(express.json()); // Parse JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/Customers',customerRoutes);
app.use('/api/address',addressroutes );
app.use('/api/payment',paymentmethodroutes);
app.use('/api/order',orderRoutes);
app.use('/api/menu',menuRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/reservation',reservationRoutes);
app.use('/api/table',tableRoutes);
app.use('/api/payment',paymentroutes);
app.use('/api/feedback',feedbackroutes);
app.use('/api/profile',profileRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
