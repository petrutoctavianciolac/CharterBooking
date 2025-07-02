import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../components/AuthContext";
import "./reservation.css";
import axios from "axios";

const Reservation = () => {

    const authData = useContext(AuthContext);
    const params = useParams();
    const [reservation, setReservation] = useState({});
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    
        const fetchReservation = async() => {

            try{

                const response = await axios.get(`http://localhost:3000/bookedflights/${authData.user.user_id}?r_id=${params.id}`, {withCredentials: true});
                const data = response.data;

                if(response.status === 200) {

                    setReservation(data[0]);
                }
            }
            catch(e) {

                setError("Something went wrong. Please Reload the page");
            }
        }

        fetchReservation();
    }, [params.id, authData.user.user_id]);

    const cancelReservation = async() => {

      try{

          await axios.delete(`http://localhost:3000/bookedflights/${params.id}`, {withCredentials: true});
      }
      catch(e) {

        setDeleteError("Can't cancel the reservation. Retry.");
      }
    }

    if (error) {
        return (
          <>
            <Navbar />
            <p className="error">{error}</p>
          </>
        );
      }
    
    const flight_id = reservation.flight_id;
    const passagers = reservation.passagers || [];
    const seats = reservation.seats || [];

    if (!reservation || !flight_id) {
        return (
          <>
            <Navbar />
            <p className="loading">Loading reservation...</p>
          </>
        );
      }

    const downloadTickets = async (reservationId) => {
      const response = await axios.get(`http://localhost:3000/bookedflights/${reservationId}/pdf`,
        {responseType: 'blob'}, {withCredentials: true});

      if (response.status != 200) {
        alert('Error while generating tickets. Please try again!');
        return;
      }

      const blob = await response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tickets_${reservationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    };


    return(
        <>
            <Navbar/>
            <div className="reservation-details">
        <h2>Reservation Summary</h2>

        <section className="flight-info">
          <p><strong>Provider: </strong> {flight_id.charter_provider_id.name}</p>
          <p><strong>Type: </strong> {reservation.booking_type}</p>
          <p><strong>From:</strong> {flight_id.source_city}, {flight_id.source}</p>
          <p><strong>To:</strong> {flight_id.destination_city}, {flight_id.destination}</p>
          <p><strong>Departure:</strong> {new Date(flight_id.departure_date).toLocaleDateString("RO")} at {flight_id.departure_time}</p>
          <p><strong>Arrival:</strong> {new Date(flight_id.arrival_date).toLocaleDateString("RO")} at {flight_id.arrival_time}</p>
          <p><strong>Duration:</strong> {flight_id.fly_time}</p>
          <p><strong>Passagers:</strong> {reservation.number_of_seats}</p>
          <p><strong>Ticket Price:</strong> {reservation.ticket_price}€</p>
          <p><strong>Total Paid:</strong> {(reservation.total_price).toPrecision(5)}€</p>

          {(new Date(flight_id.departure_date) > Date.now()) && <button className="action-btn delete" onClick={() => {cancelReservation(); navigate("/me/activereservations");}}>Cancel Reservation</button>}

          {deleteError && <p className="error">{deleteError}</p>}
        
        <br/>
        {reservation.seats?.length > 0 && reservation.passagers?.length > 0 && (<button onClick={() => downloadTickets(reservation._id)} className="action-btn">
          Download Tickets
        </button>)}

        </section>

        <section className="passenger-section">
          <h3>Passengers</h3>
          {passagers.length > 0 ? (
            <div className="scroll-container">
              {passagers.map((p) => (
                <div className="passenger-card" key={p._id}>
                  <p><strong>Name:</strong> {p.name}</p>
                  <p><strong>ID:</strong> {p.personal_id}</p>
                  <p><strong>Gender:</strong> {p.gender}</p>
                  <p><strong>Birthdate:</strong> {new Date(p.birthdate).toLocaleDateString("RO")}</p>
                  <p><strong>Baggage:</strong> {p.baggage}</p>
                  <p><strong>Baggage price:</strong> {p.additional_price}€</p>
                </div>
              ))}
            </div>
          ) : (
            <button
              className="action-btn"
              onClick={() =>
                navigate(`/me/activereservations/${reservation._id}/checkin/${reservation.number_of_seats}`)
              }
            >
              Add Passagers
            </button>
          )}
        </section>


        <section className="seats-section">
          <h3>Seats</h3>
          {seats.length > 0 ? (
            <div className="scroll-container">
              {seats.map((s) => (
                <div className="seat-card" key={s._id}>
                  <p><strong>Seat Number:</strong> {s}</p>
                </div>
              ))}
            </div>
          ) : (
            <button
              className="action-btn"
              onClick={() => navigate(`/me/activereservations/${reservation._id}/purchaseseats/${reservation.flight_id._id}/${reservation.number_of_seats}`)}
            >
              Select Seats
            </button>
          )}
          <br />
          <button
            className="action-btn"
            onClick={() => navigate(`/me/activereservations/${reservation.flight_id._id}/seatsmap`)}
          >
            View Seats Map
          </button>
        </section>

    

      </div>
        </>
    );
}

export default Reservation;
