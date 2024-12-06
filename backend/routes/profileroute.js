const express = require('express');
const { updateCustomerProfile } = require('../controllers/profilecontroller');
const {authMiddleware} = require('../middlewares/authMiddleware'); // Authentication middleware

const router = express.Router();


// Route to update an existing customer profile
router.put('/update', authMiddleware, updateCustomerProfile);

module.exports = router;
