const Cart = require('../models/cart');
const MenuItem = require('../models/menuitem');

// Add item to the cart
const addItemToCart = async (req, res) => {
  const { itemId, quantity} = req.body;
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

const getItemsfromcart = async (req, res) => {
  const customerId = req.id; // Assuming authentication middleware adds user info

  try {
    // Find the cart and populate item details
    const cart = await Cart.findOne({ customerId }).populate('items.itemId', 'name imageUrl description category price');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the cart is empty
    if (cart.items.length === 0) {
      return res.json({ message: 'Your cart is empty', items: [], totalPrice: cart.totalPrice });
    }

    // Respond with populated cart data
    res.json({
      message: 'Cart retrieved successfully',
      items: cart.items.map(item => ({
        id: item.itemId._id,
        name: item.itemId.name,
        imageUrl: item.itemId.imageUrl,
        description: item.itemId.description,
        category: item.itemId.category,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching items from cart' });
  }
};

const updateQuantity = async (req, res) => {
  const { itemId, quantity } = req.body;
  const customerId = req.id;  // Assuming authentication middleware adds user info

  // Ensure quantity is provided and is a valid number
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  try {
    // Find the cart for the customer
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    // Recalculate the total price of the cart
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

    // Save the updated cart
    await cart.save();

    // Respond with the updated cart
    res.json({
      message: 'Quantity updated successfully',
      items: cart.items.map(item => ({
        id: item.itemId._id,
        name: item.itemId.name,
        imageUrl: item.itemId.imageUrl,
        description: item.itemId.description,
        category: item.itemId.category,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating quantity' });
  }
};


const deleteCartItem = async (req, res) => {
  const { itemId } = req.params;  // Get itemId from request parameters
  const customerId = req.id;      // Assuming authentication middleware adds user info

  try {
    // Find the cart for the customer
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the item to be deleted in the cart
    const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate the total price of the cart after deletion
    cart.totalPrice = cart.items.reduce((acc, item) => {
      if (!item.price || isNaN(item.price) || !item.quantity || isNaN(item.quantity)) {
        return acc;  // Skip invalid price or quantity
      }
      return acc + item.price * item.quantity;
    }, 0);

    // Ensure totalPrice is a valid number
    if (isNaN(cart.totalPrice)) {
      cart.totalPrice = 0;
    }

    // Save the updated cart
    await cart.save();

    // Respond with the updated cart
    res.json({
      message: 'Item deleted successfully',
      items: cart.items.map(item => ({
        id: item.itemId._id,
        name: item.itemId.name,
        imageUrl: item.itemId.imageUrl,
        description: item.itemId.description,
        category: item.itemId.category,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting item from cart' });
  }
};


module.exports = { addItemToCart, getItemsfromcart, updateQuantity, deleteCartItem };

