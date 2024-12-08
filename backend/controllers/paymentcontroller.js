const Payment = require('../models/payment'); // Payment model
const Order = require('../models/Order'); // Order model

const processPayment = async (req, res) => {
  const { orderId, addressId, paymentMethod, amount } = req.body;
  const userId = req.id; // Assuming the user ID is provided in the request body

  try {
    // Validate input
    if (!orderId || !addressId || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find the order
    const order = await Order.findOne({ _id: orderId, customer: userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify that the passed amount matches the order's total price
    if (order.totalPrice !== amount) {
      return res.status(400).json({ error: 'Order amount mismatch' });
    }

    // Check if already paid
    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    // Simulate payment success (can be replaced with external payment gateway logic)
    order.paymentStatus = 'PAID';
    await order.save();

    // Log payment in Payment model
    const payment = new Payment({
      orderId: order._id,
      customer: userId,
      paymentMethod,
      amount: order.totalPrice,
      status: 'SUCCESS',
    });
    await payment.save();

    res.status(200).json({ message: 'Payment successful', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get payments for a specific user
const getpayments = async (req, res) => {
  const userId = req.id; // Get user ID from the request (assumed to be added as part of authorization)

  try {
    // Find all payments made by the user
    const payments = await Payment.find({ customer: userId });
    
    // Respond with the list of payments
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { processPayment, getpayments };
