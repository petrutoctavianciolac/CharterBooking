import {useState, useContext, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import "./flight.css";

const Flight = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [flight, setFlight] = useState(null);

    const getFlight = async() => {

        try {

            const response = await axios.get(`http://localhost:3000/flights/${id}`, {withCredentials: true});
            const data = response.data;

            if(response.status === 200) setFlight(data);
        }
        catch(e) {

            setError("Flight not found");
        }
    }


    useEffect(() => {

        getFlight();
    }, [id]);

    return(
    <>
    <Navbar/>     
    <div className="flight-container">
        {error && <p className="error">{error}</p>}
        {flight && (
          <div className="flight-card">
            <h2>Flight Details</h2>
            <div className="flight-details">
              <p><strong>From:</strong> {flight.source_city}, {flight.source}</p>
              <p><strong>To:</strong> {flight.destination_city}, {flight.destination}</p>
              <p><strong>Departure Time:</strong> {new Date(flight.departure_date).toDateString("RO")}, {flight.departure_time}</p>
              <p><strong>Arrival Time:</strong> {new Date(flight.arrival_date).toDateString("RO")}, {flight.arrival_time}</p>
              <p><strong>Price:</strong> {flight.price} €</p>
              <p><strong>Fly time:</strong> {flight.fly_time}</p>
              <p><strong>Available Seats:</strong> {flight.number_of_seats}</p>
            </div>
          </div>
        )}

        <div className="booking-section">
        <button onClick={()=> {navigate(`/flight/${id}/book`);}}>Book now</button>
        </div>
      </div>
    <Footer/>
    </>);
}

export default Flight;