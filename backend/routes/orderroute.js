// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware'); // Auth middleware
const { getOrderHistory, createOrder,cancelOrder } = require('../controllers/ordercontroller');

// Route to get order history
router.get('/history', authMiddleware, getOrderHistory);

router.post('/create',authMiddleware, createOrder);

router.delete('/cancel/:orderId',authMiddleware,cancelOrder);

module.exports = router;
