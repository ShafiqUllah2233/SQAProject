// src/routes/cart.js
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartcontroller');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Middleware for user authentication

// Add item to cart
router.post('/add-to-cart', authMiddleware, CartController.addItemToCart);


module.exports = router;
