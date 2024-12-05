
const User=require('../models/User');

const updateCustomerProfile = async (req, res) => {
  const id= req.id;
  const { username, email, password, firstName, lastName, contact, dietaryPreferences } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }
    

    // Update the fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Hash the new password
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (contact) user.contact = contact;
    if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;

    await user.save();
    res.status(200).json({ message: 'Customer profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating customer profile' });
  }
};

module.exports  = { updateCustomerProfile };