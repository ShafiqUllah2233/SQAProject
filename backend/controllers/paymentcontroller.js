// src/controllers/paymentController.js
const Payment = require('../models/payment');
const Invoice = require('../models/invoice');
const Cart = require('../models/cart');

// Simulate Payment Processing
const processPayment = async (req, res) => {
  const { paymentMethod } = req.body;
  const userId = req.id;  // Get userId from authenticated user
  
  try {
    // Fetch cart items for the user
    const cart = await Cart.findOne({ customerId: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot proceed with payment.' });
    }

    // Calculate total amount from cart items
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Create the invoice
    const invoice = new Invoice({
      userId,
      amount: totalAmount,
      items: cart.items.map(item => ({
        menuItem: item.itemId,
        quantity: item.quantity,
      })),
    });

    await invoice.save();

    // Simulate successful payment (dummy transaction ID)
    const transactionId = `txn_${Date.now()}`;
    const payment = new Payment({
      userId,
      amount: totalAmount,
      paymentMethod,
      paymentStatus: 'Completed',
      transactionId,
      invoiceId: invoice._id,
    });

    await payment.save();

    // Update invoice status to 'Paid'
    invoice.paymentStatus = 'Paid';
    await invoice.save();

    // Respond with success
    res.status(200).json({ message: 'Payment processed successfully', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

// Get past invoices
const getPastInvoices = async (req, res) => {
  const userId = req.id;  // Get userId from authenticated user

  try {
    const invoices = await Invoice.find({ userId })
      .populate('items.menuItem', 'name price description'); // Populate MenuItem details

    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found for this user' });
    }

    res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};

module.exports = {
  processPayment,
  getPastInvoices
};
