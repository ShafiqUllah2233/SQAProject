const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();
const {
  addPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
} = require('../controllers/paymentmethod');

// Routes for managing payment methods
router.post('/add',authMiddleware, addPaymentMethod);
router.get('/get',authMiddleware, getPaymentMethods);

router.put('/update/:paymentMethodId', authMiddleware,updatePaymentMethod);
router.delete('/delete/:paymentMethodId', authMiddleware,deletePaymentMethod);

module.exports = router;
