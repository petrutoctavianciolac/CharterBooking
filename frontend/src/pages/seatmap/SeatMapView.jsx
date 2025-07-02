import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SeatMap from "../../components/seatmap/SeatMap";
import "./seats.css";

const SeatMapView = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState("");
  

  useEffect(() => {

    const fetchFlight = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/flights/${id}`, {
          withCredentials: true,
        });

        setFlight(response.data);
      } catch (err) {
        setError("Could not fetch flight data.");
      }
    };

    fetchFlight();
  }, [id]);

  return (
    <div className="seatmap-page">
      <h2>Seat Map </h2>
      {error && <p className="error">{error}</p>}

      {flight && flight.seats && flight.aircraftType ? (
        <SeatMap
          seats={flight.aircraftType.seatsConfiguration}
          model={flight.aircraftType.modelName}
          columns={flight.aircraftType.columns}
          rows={flight.aircraftType.rows}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SeatMapView;
