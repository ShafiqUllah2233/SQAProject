const User = require('../models/User');
require('dotenv').config();


const getUserInfo = async (req, res) => {
  const id= req.id;
  try {
    const user = await User.findById(req.id); // Find user by ID from decoded token
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); // Return user data
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

module.exports = { getUserInfo };