// src/models/MenuItem.js
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'APPETIZER',
      'MAIN_COURSE',
      'DESSERT',
      'BEVERAGE',
      'SIDES',
      'SPECIALS',
    ],
  },
  ingredients: [
    {
      type: String,
    },
  ],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
  },
  allergens: [
    {
      type: String,
      enum: ['GLUTEN', 'DAIRY', 'NUTS', 'SHELLFISH', 'SOY', 'EGGS'],
    },
  ],
  availability: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Invalid URL format for image',
    },
  },
  preparationTime: {
    type: Number, // Time in minutes
    min: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Must be created by an authenticated user (e.g., Admin or Manager)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
module.exports = MenuItem;

