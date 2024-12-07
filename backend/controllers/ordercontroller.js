// src/controllers/orderController.js
const Order = require('../models/Order');
const Cart=require('../models/cart');
const mongoose  = require('mongoose');
const getOrderHistory = async (req, res) => {
  const userId = req.id; 

  try {
    
    const orders = await Order.find({ customer: userId }) 
      .populate('items.menuItem', 'name price'); 

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
};

const createOrder = async (req, res) => {
  const { items, totalPrice } = req.body;
  const userId = req.id;  // Assuming req.user is populated by a middleware for authentication
  


  // Validate input
  if (!userId || !items || items.length === 0 || totalPrice === undefined) {
    return res.status(400).json({ error: 'Invalid order details' });
  }

  const session = await mongoose.startSession(); // Start a transaction

  try {
    session.startTransaction();

    // Step 1: Create a new order from the cart items
    const orderItems = items.map(item => ({
      menuItem: new mongoose.Types.ObjectId(item.id), // Use 'new' keyword
      quantity: item.quantity,
      specialInstructions: item.specialInstructions || '' // Optional field
    }));

    const order = new Order({
      customer: new mongoose.Types.ObjectId(userId), // Use 'new' keyword
      items: orderItems,
      totalPrice: totalPrice,
      status: 'PENDING',
      orderType: 'TAKEAWAY',
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING'
    });

    // Save the order to the database within the transaction
    const savedOrder = await order.save({ session });

    // Step 2: Clear the user's cart within the same transaction
    const deleteResult = await Cart.deleteMany({ customerId: userId }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log('Order saved successfully:', savedOrder._id);
    console.log('Cart items deleted:', deleteResult.deletedCount);

    res.status(201).json({
      message: 'Order placed successfully, and cart has been emptied.',
      order: savedOrder,
    });

  } catch (error) {
    // If there's an error, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error('Order creation error:', error);
    
    // More detailed error response
    res.status(500).json({ 
      error: 'Failed to place order', 
      details: error.message,
      stack: error.stack 
    });
  }
};



// Controller to cancel an order
const cancelOrder = async (req, res) => {
  const { orderId } = req.params; // Get the orderId from the request parameters
  const userId = req.id; // Get the userId from the request (attached by your authentication middleware)

  // Validate if the orderId is provided
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    // If the order does not exist
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure that the logged-in user is the customer who placed the order
    if (order.customer.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to cancel this order' });
    }

    // Check if the order is already delivered or cancelled
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Order is already delivered or cancelled' });
    }

    // Update the order status to CANCELLED
    order.status = 'CANCELLED';
    await order.save(); // Save the updated order to the database

    // Respond with success message
    return res.status(200).json({ message: 'Order has been cancelled', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error, please try again later' });
  }
};



module.exports = {
  getOrderHistory,createOrder,cancelOrder
};