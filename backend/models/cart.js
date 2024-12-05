const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MenuItem',
        required: true
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1
      },
      price: { 
        type: Number, 
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', CartSchema);
