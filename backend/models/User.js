const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8 
  },
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER'],
    required: true
  },
  permissions: [{
    type: String,
    enum: [
      'VIEW_MENU', 'EDIT_MENU', 
      'MANAGE_ORDERS', 'VIEW_REPORTS', 
      'MANAGE_USERS', 'MANAGE_TABLES'
    ]
  }],
  contact: {
    phone: { 
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid phone number']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },


  dietaryPreferences: [{
    type: String,
    enum: ['VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'NUT_ALLERGY']
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: Date
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
