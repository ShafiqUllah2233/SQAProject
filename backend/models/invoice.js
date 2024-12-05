// models/invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  dateIssued: { type: Date, default: Date.now },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
