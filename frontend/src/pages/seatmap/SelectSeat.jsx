import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import SeatMapS from "../../components/seatmap/SeatMapS";
import { number } from "mathjs";

const SelectSeat = () => {

  const navigate = useNavigate();
  const { bookingId, flightId, number_of_seats } = useParams();
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reserving, setReserving] = useState(false);

const socket = io("http://localhost:3000", {
  withCredentials: true,
});


useEffect(() => {
  const fetchFlight = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/flights/${flightId}`, {
        withCredentials: true,
      });
      setFlightData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching flight:", err);
      setLoading(false);
    }
  };

  fetchFlight();

  const socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  socket.on("seatReserved", ({ flightId: reservedFlightId, seatNumber }) => {
    if (reservedFlightId === flightId) {
      setFlightData(prev => {
        if (!prev) return prev;

        const updatedSeats = prev.seats.map(seat => {
          if (seat.seatNumber === seatNumber) {
            return { ...seat, status: "occupied" };
          }
          return seat;
        });

        setSelectedSeats(prevSelected =>
          prevSelected.filter(seat => seat.seatNumber !== seatNumber)
        );

        return { ...prev, seats: updatedSeats };
      });
    }
  });

  return () => {
    socket.disconnect();
  };
}, [flightId]);


  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      setReserving(true);

      await axios.put(
        `http://localhost:3000/bookedflights/${bookingId}/select-seats`,
        {
          selectedSeats: selectedSeats.map((s) => s.seatNumber),
        },
        {
          withCredentials: true,
        }
      );
      navigate(`/me/activereservations/${bookingId}`)
    } catch (err) {
      console.error("Error reserving seats:", err);
      alert("Failed to reserve seats.");
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div>Loading flight details...</div>;
  if (!flightData) return <div>Flight not found.</div>;

  const { aircraftType, seats } = flightData;
  const { seatsConfiguration, modelName, columns, rows } = aircraftType;

  return (
    <div className="purchase-seats-page">
      <h2>Select your seats for flight</h2>

      <SeatMapS
        seats={seatsConfiguration}
        model={modelName}
        columns={columns}
        rows={rows}
        flightId={flightId}
        bookingId={bookingId}
        seatss ={seats}
        ns = {number_of_seats}
        onSelectionChange={handleSeatSelection}
      />

      <button onClick={handleReserve} disabled={reserving} className="reserve-button">
        {reserving ? "Reserving..." : "Reserve Selected Seats"}
      </button>
    </div>
  );
};

export default SelectSeat;
