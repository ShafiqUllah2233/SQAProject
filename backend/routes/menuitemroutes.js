const express = require('express');
const router = express.Router();
const {authMiddleware}=require('../middlewares/authMiddleware');
const { getAllMenuItems, getMenuItemsByCategory, getFilteredMenuItems , getMenuItemDetails,createitem} = require('../controllers/menucontroller');

// Get all menu items
router.get('/', getAllMenuItems);

// Get menu items by category
router.get('/category/:category', getMenuItemsByCategory);

router.get('/filter', getFilteredMenuItems);
router.get('/:id', getMenuItemDetails); 
router.post('/create',authMiddleware, createitem);
module.exports = router;
