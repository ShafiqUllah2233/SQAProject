const express = require('express');
const router = express.Router();
const { getAllMenuItems, getMenuItemsByCategory, getFilteredMenuItems , getMenuItemDetails} = require('../controllers/menucontroller');

// Get all menu items
router.get('/', getAllMenuItems);

// Get menu items by category
router.get('/category/:category', getMenuItemsByCategory);

router.get('/filter', getFilteredMenuItems);
router.get('/:id', getMenuItemDetails); 
module.exports = router;
