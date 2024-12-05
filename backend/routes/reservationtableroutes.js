const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');
const { reserveTable,cancelReservation } = require('../controllers/reservationcontroller');


// Route to reserve a table
router.post('/reserve',authMiddleware, reserveTable);

// Route to cancel a reservation
router.delete('/cancel/:reservationId', authMiddleware,cancelReservation);

module.exports = router;
