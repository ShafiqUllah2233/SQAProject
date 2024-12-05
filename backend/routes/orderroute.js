// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware'); // Auth middleware
const { getOrderHistory, createOrder } = require('../controllers/ordercontroller');

// Route to get order history
router.get('/history', authMiddleware, getOrderHistory);

router.post('/create',authMiddleware, createOrder);


//have to complete

module.exports = router;
