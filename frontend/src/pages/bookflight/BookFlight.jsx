import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../components/AuthContext';
import Navbar from '../../components/navbar/Navbar';
import "./bookflight.css"

const BookFlight = () => {

  const { id } = useParams();
  const authData = useContext(AuthContext);
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState("");
  const [ns, setNs] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:3000/flights/${id}`, { withCredentials: true })
      .then(res => setFlight(res.data))
      .catch(() => setError("Flight not found"));
  }, [id]);

  const bookFlight = async () => {
    try {
      const res = await axios.post("http://localhost:3000/bookedflights/public-booking", {
        user_id: authData.user.user_id,
        flight_id: id,
        numberOfTickets: ns
      }, { withCredentials: true });

      navigate('/me/activereservations')
    } catch (e) {
      alert("Failed to book flight.");
    }
  };

  return (
        <>
        <Navbar />
        <div className="book-flight-container">
        <div className="book-flight-card">
            <h2>Booking Flight</h2>
            {flight && (
            <div className="book-flight-details">
                <p><strong>From:</strong> {flight.source_city}</p>
                <p><strong>To:</strong> {flight.destination_city}</p>
                <p><strong>Date:</strong> {new Date(flight.departure_date).toDateString("RO")}</p>
            </div>
            )}
        </div>

        <div className="booking-form">
            <input
            type="number"
            min="1"
            max={flight?.number_of_seats || 1}
            value={ns}
            onChange={e => setNs(e.target.value)}
            />
            <button onClick={bookFlight}>Confirm Booking</button>
        </div>

        {error && <div className="error">{error}</div>}
        </div>
        </>
  );
};

export default BookFlight;
