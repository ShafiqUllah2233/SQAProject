const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerroute');
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
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
