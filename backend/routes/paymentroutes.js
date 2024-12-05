// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { processPayment, getPastInvoices } = require('../controllers/paymentcontroller');
const {authMiddleware}=require('../middlewares/authMiddleware');

// Route to process payment
router.post('/process',authMiddleware, processPayment);

// Route to get past invoices for a user
router.get('/invoices',authMiddleware, getPastInvoices);

module.exports = router;
