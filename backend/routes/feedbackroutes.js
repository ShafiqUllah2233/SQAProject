// src/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('../controllers/feedbackcontroller');
const {authMiddleware} = require('../middlewares/authMiddleware');

// Route to submit feedback (requires authentication)
router.post('/submit', authMiddleware, submitFeedback);

// Route to get feedback for a specific order
router.get('/:orderId/check', authMiddleware, getFeedback);

module.exports = router;
