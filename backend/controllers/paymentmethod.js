const PaymentMethod = require('../models/PaymentMethod');

const addPaymentMethod = async (req, res) => {
  const { cardType, cardNumber, expiryDate, cardHolderName, isDefault } = req.body;
  const customerId = req.id; // Assuming `req.id` is populated via authentication middleware

  try {
    if (isDefault) {
      // Unset previous default payment method
      await PaymentMethod.updateMany({ customerId }, { isDefault: false });
    }

    const newPaymentMethod = new PaymentMethod({
      customerId,
      cardType,
      cardNumber,
      expiryDate,
      cardHolderName,
      isDefault,
    });

    await newPaymentMethod.save();
    res.status(201).json({ message: 'Payment method added successfully', paymentMethod: newPaymentMethod });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding payment method' });
  }
};


const getPaymentMethods = async (req, res) => {
  const customerId = req.id;

  try {
    const paymentMethods = await PaymentMethod.find({ customerId });
    res.json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment methods' });
  }
};


const updatePaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.params;
  const { cardType, cardNumber, expiryDate, cardHolderName, isDefault } = req.body;
  const customerId = req.id;

  try {
    const paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId, customerId });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    if (isDefault) {
      // Unset other defaults
      await PaymentMethod.updateMany({ customerId }, { isDefault: false });
    }

    paymentMethod.cardType = cardType || paymentMethod.cardType;
    paymentMethod.cardNumber = cardNumber || paymentMethod.cardNumber;
    paymentMethod.expiryDate = expiryDate || paymentMethod.expiryDate;
    paymentMethod.cardHolderName = cardHolderName || paymentMethod.cardHolderName;
    paymentMethod.isDefault = isDefault !== undefined ? isDefault : paymentMethod.isDefault;

    await paymentMethod.save();

    res.json({ message: 'Payment method updated successfully', paymentMethod });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating payment method' });
  }
};


const deletePaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.params;
  const customerId = req.id;

  try {
    const paymentMethod = await PaymentMethod.findOneAndDelete({ _id: paymentMethodId, customerId });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting payment method' });
  }
};


module.exports = {
  addPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
};