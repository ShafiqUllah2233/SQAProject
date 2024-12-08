const Feedback = require('../models/Feedback');
const Order = require('../models/Order');

// Submit feedback for an order

const submitFeedback = async (req, res) => {
  try {
    const { orderId, rating, comment, menuItemRatings } = req.body;
    const userId=req.id;
    // Check if the order exists and the user is the customer for that order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (!order.customer.equals(userId)) {
      return res.status(403).json({ message: 'You are not authorized to leave feedback for this order' });
    }

    // Create feedback object
    const feedbackData = {
      order: orderId,
      customer: userId,
      rating,
      comment,
      menuItemRatings,
    };

    // Create feedback entry in the database
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Optionally update order status or mark it as completed if necessary
    order.status = 'DELIVERED'; // or any other business logic you have
    order.completedAt = new Date();
    await order.save();

    return res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get feedback for an order
const getFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.id;
    const order=orderId;
    const customer=customerId; // Assuming you're using middleware to attach userid
    // Check if a feedback exists for this order and customer
    const feedbackExists = await Feedback.find({ order,customer });
    res.status(200).json({ exists: !!feedbackExists });
  } catch (error) {
    console.error('Error checking feedback:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { submitFeedback, getFeedback };
