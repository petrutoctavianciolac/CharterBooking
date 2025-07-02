import {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import "./BookFlight";

const BookWithCode = () => {

    const { code } = useParams();
    const authData = useContext(AuthContext);
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/pack/pro/${code}`, { withCredentials: true })
        .then(res => setFlight(res.data[0]))
        .catch(() => setError("Flight not found"));
    }, [code]);

    const bookFlight = async () => {
        try {
        const res = await axios.post("http://localhost:3000/bookedflights/charter-booking", {
            user_id: authData.user.user_id,
            flight_id: flight.flightId._id,
            packageCode: code
        }, { withCredentials: true });

        navigate('/me/activereservations')
        } catch (e) {
        alert("Failed to book flight.");
        }
    };

    return(        <>
        <Navbar />
        <div className="book-flight-container">
        <div className="book-flight-card">
            <h2>Booking Flight</h2>
            {flight && (
            <div className="book-flight-details">
                <p><strong>From:</strong> {flight.flightId.source_city}</p>
                <p><strong>To:</strong> {flight.flightId.destination_city}</p>
                <p><strong>Date:</strong> {new Date(flight.flightId.departure_date).toDateString("RO")}</p>
                <p><strong>Number of seats:</strong> {flight.seatsAllocated}</p>
            </div>
            )}
        </div>

        <div className="booking-form">
            <button onClick={bookFlight}>Confirm Booking</button>
        </div>

        {error && <div className="error">{error}</div>}
        </div>
        </>)
}

export default BookWithCode;