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
  const { category, ingredients, Price } = req.query;

  // Build filter object based on query params
  let filter = {};

  // Filter by category if provided
  if (category) {
    filter.category = category.toUpperCase();
  }

  // Filter by ingredients if provided
  if (ingredients) {
    const ingredientsArray = ingredients.split(',').map((ingredient) => ingredient.trim().toLowerCase());
    filter.ingredients = { $in: ingredientsArray };  // Use $in to filter by any of the ingredients
  }

  // Filter by price if provided (only maxPrice)
  let maxPrice = null;
  if (Price) {
    maxPrice = parseFloat(Price.trim());
    if (isNaN(maxPrice)) {
      return res.status(400).json({ message: 'Invalid price value' });
    }
    filter.price = { $lte: maxPrice };  // Only show items that are less than or equal to maxPrice
  }

  try {
    const menuItems = await MenuItem.find(filter);

    // If no menu items match the filter, return a 404 response
    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'No menu items found matching the filters' });
    }

    // Filter the menu items further to ensure price is less than or equal to maxPrice
    if (maxPrice) {
      const filteredMenuItems = menuItems.filter(item => item.price <= maxPrice);
      // If no items match the price condition, return a 404 response
      if (filteredMenuItems.length === 0) {
        return res.status(404).json({ message: 'No menu items found within the specified price range' });
      }
      return res.json(filteredMenuItems); // Return the filtered menu items
    }

    // Return the filtered menu items without price filtering
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