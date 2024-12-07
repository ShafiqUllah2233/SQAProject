import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";
const Reservation = (props) => {
  const navigate = useNavigate();
  const [availableTables, setAvailableTables] = useState([]); // State to store available tables
  const [selectedTable, setSelectedTable] = useState(null); // State to store selected table
  const [partySize, setPartySize] = useState(1); // Party size default to 1
  const [specialRequests, setSpecialRequests] = useState(""); // Special requests
  const [reservationConfirmed, setReservationConfirmed] = useState(false); // State to track reservation status
  const [loading, setLoading] = useState(false); // State to track loading state for fetching tables
  const [reserving, setReserving] = useState(false); // State to track loading state for reservation process

  // Fetch available tables
  useEffect(() => {
    const fetchAvailableTables = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      try {
        const response = await fetch("http://localhost:5000/api/table/available");
        if (!response.ok) {
          throw new Error("Failed to fetch available tables");
        }
        const data = await response.json();
        setAvailableTables(data.availableTables); // Assuming response structure contains availableTables
      } catch (error) {
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchAvailableTables();
  }, [navigate]); // Runs once on mount, or when navigate changes

  // Handle Reserve button click
  const handleReserve = (table) => {
    setSelectedTable(table);
    setReservationConfirmed(false); // Reset reservation confirmation
  };

  // Handle form submission to reserve a table
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (partySize > selectedTable.capacity) {
      return;
    }

    const reservationData = {
      tableid: selectedTable._id,
      date: e.target.date.value,
      time: e.target.time.value,
      partySize: partySize,
      specialRequests: specialRequests,
    };

    setReserving(true); // Set reserving state to true when the reservation is being processed
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch("http://localhost:5000/api/reservation/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        setReservationConfirmed(true);
        navigate("/dashboard"); // Example of navigation after reservation
      } else {
      }
    } catch (error) {
    } finally {
      setReserving(false); // Set reserving to false after the reservation process is completed
    }
  };

  return (
    <div className="tableflex">

      {/* Show Loading message while fetching tables */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-text">
            <div> <MoonLoader color="#36d7b7" loading={loading} size={100} />
            </div>
          </div>
        </div>
      )}

      {/* Show Loading message while reserving */}
      {reserving && (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#f39c12" }}>Reserving your table...</p>
      )}

      {!loading && availableTables.length > 0 ? (
        availableTables.map((table) => (
          <div
            className="tableitem"
            key={table._id}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#2980b9" }}>
              <strong>Table Number:</strong> {table.tableNumber}
            </h1>
            <p style={{ fontSize: "16px", color: "#e74c3c" }}>
              <strong>Status:</strong> {table.status}
            </p>
            <p style={{ fontSize: "16px", color: "#2ecc71" }}>
              <strong>Capacity:</strong> {table.capacity} people
            </p>
            <p style={{ fontSize: "16px", color: "#8e44ad" }}>
              <strong>Location:</strong> {table.location}
            </p>

            {!reservationConfirmed && selectedTable?._id !== table._id && (
              <button onClick={() => handleReserve(table)}>Reserve</button>
            )}

            {selectedTable && selectedTable._id === table._id && !reservationConfirmed && (
              <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                <div className="forminputtable">
                  <label htmlFor="date">Date:</label>
                  <input type="date" id="date" required />
                </div>
                <div className="forminputtable">
                  <label htmlFor="time">Time:</label>
                  <input type="time" id="time" required />
                </div>
                <div className="forminputtable">
                  <label htmlFor="partySize">Party Size:</label>
                  <input
                    type="number"
                    id="partySize"
                    min="1"
                    max={table.capacity}
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    required
                  />
                </div>
                <div className="forminputtable">
                  <label htmlFor="specialRequests">Special Requests:</label>
                  <textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
                <button type="submit">Confirm Reservation</button>
              </form>
            )}

            {reservationConfirmed && selectedTable?._id === table._id && (
              <p style={{ fontSize: "16px", color: "#27ae60" }}>Reservation Confirmed!</p>
            )}
          </div>
        ))
      ) : (
        !loading && <p className="error-message">No available tables at the moment</p>
      )}
    </div>
  );
};

export default Reservation;
