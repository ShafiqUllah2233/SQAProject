const Cart = require('../models/cart');
const MenuItem = require('../models/menuitem');
const Order = require('../models/Order');

// Add item to the cart
const addItemToCart = async (req, res) => {
  const { itemId, quantity } = req.body;
  const customerId = req.id;  // assuming authentication middleware adds user info

  // Ensure quantity is provided and is a valid number
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  try {
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      // If the cart does not exist, create one
      cart = new Cart({ customerId, items: [], totalPrice: 0 });
    }

    // Check if the item is already in the cart
    const existingItemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);

    if (existingItemIndex !== -1) {
      // Update the existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to the cart with price from the menu item
      cart.items.push({
        itemId,
        quantity,
        price: menuItem.price // Set the price from the MenuItem
      });
    }

    // Recalculate the total price, making sure to handle edge cases
    cart.totalPrice = cart.items.reduce((acc, item) => {
      if (!item.price || isNaN(item.price) || !item.quantity || isNaN(item.quantity)) {
        return acc; // Skip invalid price or quantity
      }
      return acc + item.price * item.quantity;
    }, 0);

    // Ensure totalPrice is a valid number
    if (isNaN(cart.totalPrice)) {
      cart.totalPrice = 0;
    }

    // Save the cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};



module.exports = {
  addItemToCart
};
