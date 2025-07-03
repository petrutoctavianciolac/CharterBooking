import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./flight.css";

const Flight = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState("");
    const [flight, setFlight] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [packages, setPackages] = useState([]);
    const [generateError, setGenerateError] = useState("");
    const [numberOfCodesToGenerate, setNumberOfCodes] = useState(0);
    const [seatsPerCode, setSeatsPerCode] = useState(0);

    const getData = async () => {
        try {
            const flightResponse = await axios.get(`http://localhost:3000/flights/${id}`, { withCredentials: true });
            setFlight(flightResponse.data);

            const reservationsResponse = await axios.get(`http://localhost:3000/bookedflights/all/${id}`, { withCredentials: true });
            setReservations(reservationsResponse.data);

            const packagesResponse = await axios.get(`http://localhost:3000/pack/${id}`, {withCredentials: true});
            setPackages(packagesResponse.data);
        } catch (e) {
            setError("Could not fetch data.");
        }
    };

    const generatePackageCode = async() => {

        try {

            const response = await axios.post(`http://localhost:3000/pack/${id}/generate-package-codes`, {numberOfCodesToGenerate, seatsPerCode}, {withCredentials: true});
            
            if (response.status >= 200 && response.status < 300) {
                location.reload();
            }
        }
        catch(e) {

            setGenerateError("Can't be generated");
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("RO");

    const charterReservations = reservations.filter(r => r.booking_type === "package");
    const publicReservations = reservations.filter(r => r.booking_type === "public");

    return (
        <div className="flight-details-container">
            {error && <p className="error">{error}</p>}

            {flight && (
                <div className="flight-header">
                    <h1>Flight {flight.flightNumber}</h1>
                    <p><strong>From:</strong> {flight.source_city} ({flight.source})</p>
                    <p><strong>To:</strong> {flight.destination_city} ({flight.destination})</p>
                    <p><strong>Departure:</strong> {formatDate(flight.departure_date)} at {flight.departure_time}</p>
                    <p><strong>Arrival:</strong> {formatDate(flight.arrival_date)} at {flight.arrival_time}</p>
                    <p><strong>Flight Time:</strong> {flight.fly_time}</p>
                    <p><strong>Price:</strong> €{flight.price}</p>
                    <p><strong>Status:</strong> {flight.status}</p>
                    <button
                    onClick={() => navigate(`/flight/${id}/seatmap`)}
                    className="view-seatmap-button"
                    >
                    View Seat Map
                    </button>
                </div>
            )}

            <div className="flight-side-panel">
            <h2>Generated Codes</h2>
            {packages.length === 0 ? (
                <p>No codes generated yet.</p>
            ) : (
                <ul className="package-code-list">
                    {packages.map((pkg) => (
                        <li 
                        className={pkg.isUsed ? "used-package" : ""}
                        key={pkg._id}>{pkg.code} ({pkg.seatsAllocated} seats)</li>
                    ))}
                </ul>
            )}

            <div className="package-generator">
                <h3>Generate Codes</h3>
                <input
                    type="number"
                    placeholder="Number of codes"
                    value={numberOfCodesToGenerate}
                    onChange={(e) => setNumberOfCodes(parseInt(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Seats per code"
                    value={seatsPerCode}
                    onChange={(e) => setSeatsPerCode(parseInt(e.target.value))}
                />
                <button onClick={generatePackageCode}>Generate</button>
                {generateError && <p className="error">{generateError}</p>}
            </div>
        </div>

            <div className="reservations-columns">
                <div className="reservation-column">
                    <h2>Package Reservations</h2>
                    {charterReservations.length === 0 && <p>No charter reservations.</p>}
                    {charterReservations.map((res) => (
                        <div className="reservation-card" key={res._id}>
                            <p><strong>User:</strong> {res.user_id.email}</p>
                            <p><strong>Booked At:</strong> {new Date(res.booked_at).toLocaleString("RO")}</p>
                            <p><strong>Number of Seats:</strong> {res.number_of_seats}</p>
                            <p><strong>Ticket Price:</strong> €{res.ticket_price}</p>
                            <p><strong>Total Price:</strong> €{(res.total_price).toPrecision(5)}</p>
                            <p><strong>Status:</strong> {res.status}</p>
                            <p><strong>Seats:</strong> {res.seats?.join(", ") || "-"}</p>
                            <p><strong>Passengers:</strong> {res.passagers?.map(p => `${p.name} `).join(", ") || "-"}</p>
                        </div>
                    ))}
                </div>

                <div className="reservation-column">
                    <h2>Public Reservations</h2>
                    {publicReservations.length === 0 && <p>No public reservations.</p>}
                    {publicReservations.map((res) => (
                        <div className="reservation-card" key={res._id}>
                            <p><strong>User ID:</strong> {res.user_id.email}</p>
                            <p><strong>Booked At:</strong> {new Date(res.booked_at).toLocaleString("RO")}</p>
                            <p><strong>Number of Seats:</strong> {res.number_of_seats}</p>
                            <p><strong>Ticket Price:</strong> €{res.ticket_price}</p>
                            <p><strong>Total Price:</strong> €{(res.total_price).toPrecision(5)}</p>
                            <p><strong>Status:</strong> {res.status}</p>
                            <p><strong>Seats:</strong> {res.seats?.join(", ") || "-"}</p>
                            <p><strong>Passengers:</strong> {res.passagers?.map(p => `${p.name}`).join(", ") || "-"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Flight;
