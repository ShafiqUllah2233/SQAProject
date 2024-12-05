// src/controllers/customerController.js
const User = require('../models/User');
const Address = require('../models/Address');

// Add new delivery address
const addDeliveryAddress = async (req, res) => {
  const { addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;
  const userId = req.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAddress = new Address({
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    // If this is the default address, set others as non-default
    if (isDefault) {
      await Address.updateMany(
        { userId: userId, _id: { $ne: newAddress._id } },
        { $set: { isDefault: false } }
      );
    }

    await newAddress.save();

    res.json({ message: 'Delivery address added successfully', address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding delivery address' });
  }
};

// Get all delivery addresses for the user
const getDeliveryAddresses = async (req, res) => {
  const userId = req.id;

  try {
    const addresses = await Address.find({ userId }).exec();

    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching delivery addresses' });
  }
};

// Update an existing delivery address
const updateAddress = async (req, res) => {
  const { addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;
  const { addressId } = req.params;
  const userId = req.id;

  try {
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Update address fields
    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 || address.addressLine2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    // If this address is marked as default, set others as non-default
    if (address.isDefault) {
      await Address.updateMany(
        { userId: userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    await address.save();

    res.json({ message: 'Address updated successfully', address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating address' });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  const userId = req.id;

  try {
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Use deleteOne() instead of remove()
    await Address.deleteOne({ _id: addressId, userId });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting address' });
  }
};


module.exports = {
  addDeliveryAddress,
  getDeliveryAddresses,
  updateAddress,
  deleteAddress,
};