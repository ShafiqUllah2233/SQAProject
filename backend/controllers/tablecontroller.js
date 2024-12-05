const Table = require('../models/table');
const Reservation = require('../models/reservation');

// Create a new table
//predefined we have to add them manually 
const createTable = async (req, res) => {
  const { tableNumber, capacity, location } = req.body;

  try {
    // Check if table already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: 'Table with this number already exists' });
    }

    // Create a new table
    const newTable = new Table({
      tableNumber,
      capacity,
      location
    });

    await newTable.save();

    res.status(201).json({ message: 'Table created successfully', table: newTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating the table' });
  }
};

// Update table details
const updateTable = async (req, res) => {
  const { tableid } = req.params;
  const { capacity, status, location } = req.body;
  try {
    // Find the table by ID
    const table = await Table.findById(tableid);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Update the table's details
    table.capacity = capacity || table.capacity;
    table.status = status || table.status;
    table.location = location || table.location;

    await table.save();

    res.status(200).json({ message: 'Table updated successfully', table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating the table' });
  }
};

// Delete a table
const deleteTable = async (req, res) => {
  const { tableid } = req.params;

  try {
    // Find the table by ID
    const table = await Table.findById(tableid);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if the table is currently reserved or occupied
    if (table.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Table cannot be deleted because it is reserved or occupied' });
    }

    // Delete the table
    await table.remove();

    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting the table' });
  }
};

// Get available tables (as already implemented earlier)
const getAvailableTables = async (req, res) => {
  const { date, time, partySize } = req.query;

  try {
    // Convert date and time into a proper Date object
    const reservationTime = new Date(`${date} ${time}`);

    // Find available tables that are not reserved at the given time and have the required capacity
    const availableTables = await Table.find({
      status: 'AVAILABLE',
      capacity: { $gte: partySize },
      reservationTime: { $ne: reservationTime }  // Ensure that the table is not reserved at the given time
    });

    // If no available tables are found, return a message
    if (availableTables.length === 0) {
      return res.status(404).json({ message: 'No tables available for the selected time and date' });
    }

    res.status(200).json({ availableTables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching available tables' });
  }
};





module.exports = {
  createTable,
  updateTable,
  deleteTable,
  getAvailableTables,
};
