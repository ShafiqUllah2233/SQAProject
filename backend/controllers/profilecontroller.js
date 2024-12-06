const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported

const updateCustomerProfile = async (req, res) => {
  const id = req.id; // Ensure this is properly set by middleware
  const { username, email, password, firstName, lastName, contact, dietaryPreferences } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    // Check if the new email already exists in the database
    if (email !== undefined && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email; // Update email if it's unique
    }

    // Update other fields if they exist in the request body
    if (username !== undefined) user.username = username;
    if (password !== undefined) user.password = await bcrypt.hash(password, 10);
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (contact !== undefined) user.contact = contact;
    if (dietaryPreferences !== undefined) user.dietaryPreferences = dietaryPreferences;

    // Save updated user
    await user.save();

    res.status(200).json({ message: 'Customer profile updated successfully', user });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({ message: 'Error updating customer profile' });
  }
};

module.exports = { updateCustomerProfile };
