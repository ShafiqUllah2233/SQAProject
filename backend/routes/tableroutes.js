const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');
const { getAvailableTables,createTable,updateTable,deleteTable } = require('../controllers/tablecontroller');

// Route to get available tables
router.get('/available', getAvailableTables);

// Route to reserve a table
router.post('/create',authMiddleware, createTable);

router.put('/update/:tableid',authMiddleware, updateTable);
// Route to cancel a reservation
router.delete('/table/:tableid', authMiddleware,deleteTable);

module.exports = router;
