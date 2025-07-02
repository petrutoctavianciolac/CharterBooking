import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../components/AuthContext";

const ActiveReservations = () => {

    const authData = useContext(AuthContext);
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchReservations = async() => {

            try{

                const response = await axios.get(`http://localhost:3000/bookedflights/${authData.user.user_id}`, {withCredentials: true});
                const data = response.data;

                if (response.status === 200) {

                    const activeReservations = data.filter(reservation =>
                      new Date(reservation.flight_id.departure_date) >= Date.now()
                    );
                    
                    setReservations(activeReservations);
                  }
                  
                else {
                    setError("Something went wrong. Please refresh the page.");
                }
            }
            catch(error) {
            
                setError("Something went wrong. Please refresh the page.");
            }
        }

        fetchReservations();
    }, [authData.user.user_id]);

    //useEffect(() =>{}, [reservations]);

    return(
        
        <>
        <Navbar />
        {error && <p className="error">{error}</p>}
        <div className="reservations-container">
            {reservations.map((reservation) => (
                <div className="reservation-card" key={reservation._id}>
                <div className="reservation-summary">
                    <p><strong>Provider: </strong> {reservation.flight_id.charter_provider_id.name}</p>
                    <p><strong>From: </strong>{reservation.flight_id.source_city}, {reservation.flight_id.source}</p>
                    <p><strong>To: </strong>{reservation.flight_id.destination_city}, {reservation.flight_id.destination}</p>
                    <p><strong>Departure date: </strong>{new Date(reservation.flight_id.departure_date).toLocaleDateString("RO")}</p>
                    <p><strong>Departure time: </strong>{reservation.flight_id.departure_time}</p>
                    <p><strong>Fly time: </strong>{reservation.flight_id.fly_time}</p>
                    <p><strong>Booked at:</strong> {new Date(reservation.booked_at).toLocaleDateString("RO")}</p>
                    <p><strong>Seats:</strong> {reservation.number_of_seats}</p>
                    <p><strong>Total Price:</strong> {reservation.total_price.toPrecision(5)}€</p>
                    <button onClick={() => navigate(`/me/activereservations/${reservation._id}`)}>
                    See reservation
                    </button>
                </div>
                </div>
            ))}
        </div>

        </>
    );
}

export default ActiveReservations;