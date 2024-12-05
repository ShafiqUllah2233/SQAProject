const Table = require('../models/table');
const Reservation = require('../models/reservation');


const reserveTable = async (req, res) => {
  const { tableid, date, time, partySize, specialRequests } = req.body;
  const customerId = req.id;  // assuming user info is in the request after authentication

  try {
    // Find the table by ID
    const table = await Table.findById(tableid);
    
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    console.log(table);
    // Check if the table is already reserved or occupied
    if (table.status === 'RESERVED' || table.status === 'OCCUPIED') {
      return res.status(400).json({ message: 'Table is not available for the selected time' });
    }

    // Check if the party size fits the table's capacity
    if (partySize > table.capacity) {
      return res.status(400).json({ message: `The table only accommodates up to ${table.capacity} people` });
    }

    // Update table status to RESERVED and add reservation time
    table.status = 'RESERVED';
    table.reservedBy = customerId;
    table.reservationTime = new Date(`${date} ${time}`);

    // Save the updated table status
    await table.save();

    // Create a new reservation record
    const reservation = new Reservation({
      customer: customerId,
      table: tableid,
      date: new Date(date),
      time,
      partySize,
      specialRequests,
      status: 'CONFIRMED'
    });

    // Save the reservation
    await reservation.save();

    // Send confirmation response to customer
    res.status(200).json({ message: 'Reservation confirmed', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error making the reservation' });
  }
};



const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;  // Reservation ID from the URL
  const customerId = req.id;  // Assuming user info is available

  try {
    // Find the reservation by ID
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.customer.toString() !== customerId) {
      return res.status(403).json({ message: 'You can only cancel your own reservations' });
    }

    // Update table status to AVAILABLE and clear reservation time
    const table = await Table.findById(reservation.table);
    table.status = 'AVAILABLE';
    table.reservedBy = null;
    table.reservationTime = null;
    await table.save();

    // Mark the reservation as cancelled
    reservation.status = 'CANCELLED';
    await reservation.save();

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error cancelling reservation' });
  }
};

module.exports = {
  reserveTable,
  cancelReservation
};