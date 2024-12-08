// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { processPayment,getpayments } = require('../controllers/paymentcontroller');
const {authMiddleware}=require('../middlewares/authMiddleware');

// Route to process payment
router.post('/process',authMiddleware, processPayment);
router.get('/invoice',authMiddleware, getpayments);

module.exports = router;
