// Example for Express.js backend
const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware'); 
const {getUserInfo} = require('../controllers/customerController'); // Assuming you have a middleware for authentication
// Middleware to verify token and get user data


// Route to get customer info
router.get('/me', authMiddleware,getUserInfo);

module.exports = router;
