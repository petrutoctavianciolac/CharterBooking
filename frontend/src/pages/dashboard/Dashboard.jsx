import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cityList, setCityList] = useState([]);
  const [results, setResults] = useState([]);
  const [tripType, setTripType] = useState("oneway");

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    departure_date: "",
    return_date: "none",
    passagers: 1,
  });

  const foundFlights = async () => {
    setError("");
    setMessage("");
    setResults([]);

    if (tripType === "roundtrip" && filters.return_date === "") {
      setError("Please select a return date for round trip.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/flights/${filters.from}/${filters.to}/${filters.departure_date}/${filters.return_date}/${filters.passagers}`,
        { withCredentials: true }
      );

      if (!response.data || (Array.isArray(response.data) && response.data.length < 1)) {
        setMessage("No flights found.");
        return;
      }

      setResults(response.data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
  };

  const getCityList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cities/", {
        withCredentials: true,
      });
      setCityList(response.data);
    } catch (e) {
      console.error("Can't fetch cities");
    }
  };

  useEffect(() => {
    getCityList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="search-form">
          <h2>Search Flights</h2>

          <div className="trip-type-tabs">
            <button
            className={tripType === "oneway" ? "active" : ""}
            onClick={() => {
                setTripType("oneway");
                setFilters({
                from: "",
                to: "",
                departure_date: "",
                return_date: "none",
                passagers: 1,
                });
                setError("");
                setMessage("");
                setResults([]);
            }}
            >
            One Way
            </button>

            <button
            className={tripType === "roundtrip" ? "active" : ""}
            onClick={() => {
                setTripType("roundtrip");
                setFilters({
                from: "",
                to: "",
                departure_date: "",
                return_date: "",
                passagers: 1,
                });
                setError("");
                setMessage("");
                setResults([]);
            }}
            >
            Round Trip
            </button>
          </div>

<div className="form-fields-row">
  <div className="form-row">
    <label>From:</label>
    <select name="from" value={filters.from} onChange={handleChange}>
      <option value="">Select city</option>
      {cityList.map((city, idx) => (
        <option key={idx} value={city.name}>{city.name}</option>
      ))}
    </select>
  </div>

    <div className="form-row">
        <label>To:</label>
        <select name="to" value={filters.to} onChange={handleChange}>
        <option value="">Select city</option>
        {cityList.map((city, idx) => (
            <option key={idx} value={city.name}>{city.name}</option>
        ))}
        </select>
    </div>

    <div className="form-row">
        <label>Departure:</label>
        <input
        type="date"
        name="departure_date"
        min={new Date().toISOString().split("T")[0]}
        value={filters.departure_date}
        onChange={handleChange}
        />
    </div>

    {tripType === "roundtrip" && (
        <div className="form-row">
        <label>Return:</label>
        <input
            type="date"
            name="return_date"
            min={new Date().toISOString().split("T")[0]}
            value={filters.return_date}
            onChange={handleChange}
        />
        </div>
    )}

    <div className="form-row">
        <label>Passengers:</label>
        <input
        type="number"
        name="passagers"
        value={filters.passagers}
        min="1"
        onChange={handleChange}
        />
    </div>
    </div>


          <button className="search-btn" onClick={foundFlights}>
            Search
          </button>

          {message && <p className="info-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>

 <div className="flight-results-wrapper">
  <div className="go-flights-column">
    <h3>Go Flights:</h3>
    {results?.goFlights?.length > 0 ? (
      results.goFlights.map((flight, idx) => (
        <div
          key={idx}
          className="flight-card"
          onClick={() => navigate(`/flight/${flight._id}`)}
        >
          <h4>
            {flight.source_city}, {flight.source} → {flight.destination_city}, {flight.destination}
          </h4>
          <p>Departure: {new Date(flight.departure_date).toDateString("RO")}</p>
          <p>Price: {flight.price} €</p>
          <p>Available seats: {flight.public_seats}</p>
        </div>
      ))
    ) : (
      <p>No go flights found.</p>
    )}
  </div>

  {tripType === "roundtrip" && <div className="return-flights-column">
    <h3>Return Flights:</h3>
    {results?.returnFlights?.length > 0 ? (
      results.returnFlights.map((flight, idx) => (
        <div
          key={idx}
          className="flight-card"
          onClick={() => navigate(`/flight/${flight._id}`)}
        >
          <h4>
            {flight.source_city}, {flight.source} → {flight.destination_city}, {flight.destination}
          </h4>
          <p>Departure: {new Date(flight.departure_date).toDateString("RO")}</p>
          <p>Price: {flight.price} €</p>
          <p>Available seats: {flight.public_seats}</p>
        </div>
      ))
    ) : (
      <p>No return flights found.</p>
    )}
  </div>}
</div>

      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
