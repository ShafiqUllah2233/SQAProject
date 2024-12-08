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
  try {
    const { 
      category, 
      price, 
      ingredients, 
      page = 1, 
      limit = 10 
    } = req.query;

    let query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (price) {
      query.price = {};
      if (price.$gte) query.price.$gte = parseFloat(price.$gte);
      if (price.$lte) query.price.$lte = parseFloat(price.$lte);
    }

    // Ingredients filter
    if (ingredients) {
      const ingredientList = Array.isArray(ingredients) 
        ? ingredients 
        : ingredients.split(',');
      query.ingredients = { $all: ingredientList };
    }

    // Pagination
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };

    // Fetch items
    const items = await MenuItem.find(query, null, options);
    const total = await MenuItem.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error filtering menu items', 
      error: error.message 
    });
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