import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./updateflight.css";

const UpdateFlight = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [flightData, setFlightData] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [publicSeats, setPublicSeats] = useState("");
    const [charterSeats, setCharterSeats] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [arrivalTime, setArrivalTime] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/flights/${id}`, { withCredentials: true });
                const data = response.data;
                setFlightData(data);
                setPublicSeats(data.public_seats);
                setCharterSeats(data.charter_seats);
                setDepartureTime(data.departure_time);
                setArrivalTime(data.arrival_time);
                setPrice(data.price);
                setStatus(data.status || "");
            } catch (e) {
                setError("Unable to fetch flight data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlight();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.put(
                `http://localhost:3000/flights/${id}`,
                {
                    charter_seats: charterSeats,
                    public_seats: publicSeats,
                    departure_time: departureTime,
                    arrival_time: arrivalTime,
                    price,
                    status,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                navigate("/dashboard");
            }
        } catch (e) {
            console.error(e);
            setError("Something went wrong. Please try again.");
        }
    };

    if (isLoading) return <p>Loading flight data...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="update-flight-container">
            <h2>Update Flight</h2>
            <form onSubmit={handleUpdate} className="update-flight-form">
                <label>
                    Package Seats:
                    <input
                        type="number"
                        value={charterSeats}
                        onChange={(e) => setNumberOfSeats(e.target.value)}
                    />
                </label>

                <label>
                    Public Seats:
                    <input
                        type="number"
                        value={publicSeats}
                        onChange={(e) => setNumberOfSeats(e.target.value)}
                    />
                </label>

                <label>
                    Departure Time:
                    <input
                        type="time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                    />
                </label>

                <label>
                    Arrival Time:
                    <input
                        type="time"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                    />
                </label>

                <label>
                    Price (€):
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>

                <label>
                    Status:
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select status</option>
                        <option value="Active">Active</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>

                <div className="form-buttons">
                    <button type="submit" className="update-btn">Update Flight</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateFlight;
