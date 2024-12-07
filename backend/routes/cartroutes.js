// src/routes/cart.js
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartcontroller');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Middleware for user authentication

// Add item to cart
router.post('/add-to-cart', authMiddleware, CartController.addItemToCart);
router.get('/getitems', authMiddleware, CartController.getItemsfromcart);
router.put('/updatequantity',authMiddleware, CartController.updateQuantity);
router.delete('/delete/:itemId',authMiddleware, CartController.deleteCartItem);

module.exports = router;
