// Example for Express.js backend
const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware'); 
// Middleware to verify token and get user data
const { 
  addDeliveryAddress,
  getDeliveryAddresses, 
  updateAddress, 
  deleteAddress 
} = require('../controllers/addressController');

// Route to get customer info
router.post('/add', authMiddleware, addDeliveryAddress);
router.get('/get', authMiddleware, getDeliveryAddresses);
router.put('/update/:addressId', authMiddleware, updateAddress);
router.delete('/delete/:addressId', authMiddleware, deleteAddress);

module.exports = router;
