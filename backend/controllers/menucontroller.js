const MenuItem = require('../models/MenuItem');

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};



// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const menuItems = await MenuItem.find({ category: category.toUpperCase() });
    if (menuItems.length === 0) {
      return res.status(404).json({ message: `No items found in category: ${category}` });
    }
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching menu items by category' });
  }
};

const getFilteredMenuItems = async (req, res) => {
  const { category, ingredients, minPrice, maxPrice } = req.query;

  // Build filter object based on query params
  let filter = {};

  // Filter by category if provided
  if (category) {
    filter.category = category.toUpperCase();
  }

  // Filter by ingredients if provided
  if (ingredients) {
    const ingredientsArray = ingredients.split(','); // ingredients will be a comma separated list
    filter.ingredients = { $all: ingredientsArray };
  }

  // Filter by price range if provided
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  try {
    const menuItems = await MenuItem.find(filter);
    
    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'No menu items found matching the filters' });
    }
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching filtered menu items' });
  }
};

const getMenuItemDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Return the detailed information
    res.json({
      
      
      ingredients: menuItem.ingredients,
      nutritionalInfo: menuItem.nutritionalInfo,
      allergens: menuItem.allergens,
      availability: menuItem.availability,
      preparationTime: menuItem.preparationTime,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching menu item details' });
  }
};



module.exports = {
  getAllMenuItems,
  getMenuItemsByCategory,
  getFilteredMenuItems,
  getMenuItemDetails
};