// src/controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User'); // Assuming User model exists
const MenuItem = require('../models/MenuItem');  // Import the MenuItem model

const getOrderHistory = async (req, res) => {
  const userId = req.id; // Assigned by the authenticate middleware

  try {
    // Fetch orders for the authenticated user
    const orders = await Order.find({ customer: userId }) // Use 'customer' instead of 'customerId'
      .populate('items.menuItem', 'name price');  // Populate the item details (menuItem)

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
};

// src/controllers/orderController.j

// Create an Order
const createOrder = async (req, res) => {
  const { items, totalPrice, orderType, paymentMethod, specialRequests } = req.body;
  const customerId = req.id; // Assuming the user is authenticated and their ID is in req.id
  try {
    // Check if customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate if all menu items exist
    const menuItems = await MenuItem.find({ '_id': { $in: items.map(item => item.menuItem) } });
    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: 'One or more menu items do not exist' });
    }

    // Create the new order
    const newOrder = new Order({
      customer: customerId,
      items,
      totalPrice,
      orderType,
      paymentMethod,
      specialRequests,
    });

    // Save the order to the database
    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating the order' });
  }
};




module.exports = {
  getOrderHistory,createOrder
};