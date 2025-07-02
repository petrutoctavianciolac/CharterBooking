import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviderContext } from "../../components/AuthProviderContext";
import axios from "axios";
import "./addflight.css";

const AddFlight = () => {

    const navigate = useNavigate();
    const provider = useContext(AuthProviderContext);
    const [airplanes, setAirplanes] = useState([]);
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        airplane: "",
        flight_number: "",
        source_city: "",
        source: "",
        destination_city: "",
        destination: "",
        departure_date: "",
        departure_time: "",
        arrival_date: "",
        arrival_time: "",
        fly_time: "",
        public_seats: "",
        charter_seats: "",
        price: "",
        status: "Active",
    });

    useEffect(() => {
        axios.get("http://localhost:3000/airplanes", { withCredentials: true })
            .then(res => setAirplanes(res.data))
            .catch(err => console.error("Failed to fetch airplanes", err));

        axios.get("http://localhost:3000/cities/", { withCredentials: true })
            .then(res => setCities(res.data))
            .catch(err => console.error("Failed to fetch cities", err));
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post("http://localhost:3000/flights", {
                ...formData,
                charter_provider_id: provider.charter_provider_id
            }, { withCredentials: true });

            navigate("/");
        } catch (err) {
            console.error("Failed to create flight", err);
            alert("Error creating flight");
        }
    };

    return (
        <div className="add-flight-container">
            <h2 className="form-title">Add New Flight</h2>
            <form onSubmit={handleSubmit} className="flight-form">
                <div className="form-group">
                    <label>Airplane:</label>
                    <select name="airplane" value={formData.airplane} onChange={handleChange} required>
                        <option value="">Select an airplane</option>
                        {airplanes.map(ap => (
                            <option key={ap._id} value={ap._id}>{ap.modelName}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Flight Number:</label>
                    <input type="text" name="flight_number" value={formData.flight_number} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Source City:</label>
                    <select name="source_city" value={formData.source_city} onChange={handleChange} required>
                        <option value="">Select source city</option>
                        {cities.map(city => (
                            <option key={city._id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Source Airport:</label>
                    <input name="source" value={formData.source} onChange={handleChange} required>
                    </input>
                </div>

                <div className="form-group">
                    <label>Destination City:</label>
                    <select name="destination_city" value={formData.destination_city} onChange={handleChange} required>
                        <option value="">Select destination city</option>
                        {cities.map(city => (
                            <option key={city._id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Destination Airport:</label>
                    <input name="destination" value={formData.destination} onChange={handleChange} required>
                    </input>
                </div>

                <div className="form-group">
                    <label>Departure Date:</label>
                    <input type="date" name="departure_date" value={formData.departure_date} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Departure Time:</label>
                    <input type="time" name="departure_time" value={formData.departure_time} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Arrival Date:</label>
                    <input type="date" name="arrival_date" value={formData.arrival_date} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Arrival Time:</label>
                    <input type="time" name="arrival_time" value={formData.arrival_time} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Flight Duration:</label>
                    <input type="text" name="fly_time" value={formData.fly_time} onChange={handleChange} placeholder="e.g. 02:45" required />
                </div>

                <div className="form-group">
                    <label>Public Seats:</label>
                    <input type="number" name="public_seats" value={formData.public_seats} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Package Seats:</label>
                    <input type="number" name="charter_seats" value={formData.charter_seats} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Price (EUR):</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <button type="submit" className="submit-btn">Create Flight</button>
            </form>
        </div>
    );
};

export default AddFlight;
