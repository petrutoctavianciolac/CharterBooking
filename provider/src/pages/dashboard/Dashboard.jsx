import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthProviderContext } from '../../components/AuthProviderContext';
import { useContext } from 'react';

import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const provider = useContext(AuthProviderContext);

    const [flights, setFlights] = useState([]);
    const [stats, setStats] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        
        setIsLoading(true);
        setError(null);
        try {
            if (!provider || !provider.charter_provider_id) {
                setError("Provider ID not found. Please log in again.");
                setIsLoading(false);
                return;
            }


            const flightsResponse = await axios.get(`http://localhost:3000/flights/charter-flights/${provider.charter_provider_id}`, { withCredentials: true });
            setFlights(flightsResponse.data);
            const statsResponse = await axios.get(`http://localhost:3000/flights/charter-stats/${provider.charter_provider_id}`, {withCredentials: true});
            setStats(statsResponse.data);

        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Session expired or unauthorized. Please log in again.');
                setTimeout(() => navigate('/charter-login'), 2000);
            } else {
                setError(err.response?.data?.message || 'Failed to load dashboard data.');
            }
            console.error('Dashboard data fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        if (provider && provider.charter_provider_id) {
            fetchDashboardData();
        }
    }, [provider, navigate]);

    const deleteFlight = async (id) => {

        try {

            console.log("here");
            const response = await axios.delete(`http://localhost:3000/flights/${id}`, {withCredentials: true});
            window.location.reload();
        }
        catch(e) {

            setError("Unable to delete. Please try again");
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3000/auth/charter-logout", {}, { withCredentials: true });

            navigate("/charter-login");
        } catch (err) {
            console.error("Logout failed:", err);
            setError(err.response?.data?.message || "Logout failed. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <p className="loading-message">Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <p className="error-message">{error}</p>
                <button onClick={handleLogout} className="dashboard-btn logout-btn">Logout</button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">{provider.name} Dashboard</h1>
                <button onClick={handleLogout} className="dashboard-btn logout-btn">Logout</button>
            </header>

            {stats && (
                <section className="stats-section">
                    <div className="stat-card">
                        <h3>Total Flights</h3>
                        <p className="stat-value">{stats.totalFlights}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Booked Seats</h3>
                        <p className="stat-value">{stats.bookedSeats}</p>
                    </div>
                </section>
            )} 


            <section className="flights-management-section">
                <h2 className="section-title">Your Flights</h2>
                <div className="flights-actions-top">

                    <Link to="/add-flight" className="dashboard-btn add-flight-btn">Add New Flight</Link>
                </div>

                {flights.length === 0 ? (
                    <p className="no-flights-message">You don't have any flights yet. Click "Add New Flight" to get started!</p>
                ) : (
                    <div className="flights-list">
                        {flights.map(flight => (
                            <div key={flight._id} className="flight-card">
                                <div className="flight-info">
                                    <h3>{flight.source_city}, {flight.source} - {flight.destination_city}, {flight.destination} ({flight.flightNumber})</h3>
                                    <p>Departure: {new Date(flight.departure_date).toLocaleDateString("RO")} at {flight.departure_time}</p>
                                    <p>Arrival: {new Date(flight.arrival_date).toLocaleDateString("RO")} at {flight.arrival_time}</p>
                                    <p>Flight Time: {flight.fly_time}</p>
                                    <p>Total Seats: {flight.number_of_seats}</p>
                                    <p>Public Available Seats: {flight.public_seats}</p>
                                    <p>Package Available Seats: {flight.charter_seats}</p>
                                    <p>Price: € {flight.price}</p>
                                    <p>Status: <span className={`flight-status ${flight.status ? flight.status.toLowerCase() : 'unknown'}`}>{flight.status || 'N/A'}</span></p>
                                </div>
                                <div className="flight-actions">
                                    <button className="action-btn view-btn" onClick={() => {navigate(`/flight/${flight._id}`)}}>View Details & Bookings</button>
                                    <button className="action-btn edit-btn" onClick={() => {navigate(`/flight/${flight._id}/update`)}}>Edit</button>
                                    <button className="action-btn delete-btn" onClick={() => {deleteFlight(flight._id)}}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;