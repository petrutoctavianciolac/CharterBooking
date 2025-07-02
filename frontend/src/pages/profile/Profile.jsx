import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { AuthContext } from "../../components/AuthContext.js";
import "./profile.css";

const Profile = () => {

    const authData = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [active, setActive] = useState(0);
    const [past, setPast] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {

            try {
                const response = await axios.get(`http://localhost:3000/users/${authData.user.user_id}`, {withCredentials: true});

                const data = response.data;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ;
                if (response.status === 200) {
                    setUser(data);
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchReservations = async() => {

            try{

                const response = await axios.get(`http://localhost:3000/bookedflights/${authData.user.user_id}`, {withCredentials: true});
                const data = response.data;

                if(response.status === 200) {
                    
                    let active = 0;
                    let past = 0;

                    for(const reservation of data) {

                        if(new Date(reservation.flight_id.departure_date) < Date.now()) past++;
                            else active++;
                    }

                    setActive(active);
                    setPast(past);
                }
                else {
                    setError("Something went wrong. Please refresh the page.");
                }
            }
            catch(error) {
            
                setError("Something went wrong. Please refresh the page.");
            }
        }

        fetchUser();
        fetchReservations();

    }, [navigate]);

    const deleteUser = async () => {

        try{

            const response = await axios.delete(`http://localhost:3000/users/${authData.user.user_id}`, {withCredentials: true});

            if(response.status === 200) {

                navigate("/");
            }

        }
        catch(e){

            const errorMessage = e.response && e.response.data && e.response.data.message ? e.response.data.message : "Unknown error";
            setError(errorMessage);
        }
    };

    return (

        <>
        <Navbar />
        <div className="profile-container">
            <h2 className="profile-title">My Profile</h2>

            {user ? (
            <div className="profile-card">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <div className="profile-buttons">
                <button className="profile-btn logout" onClick={() => {
                    axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
                    navigate("/");
                }}>Logout</button>

                <button className="profile-btn delete" onClick={deleteUser}>Delete Account</button>
                </div>
                {error && <p className="error">{error}</p>}
            </div>
            ) : (
            <p className="loading-text">Loading...</p>
            )}

            <div className="profile-section">
            <h3>Active Reservations</h3>
            <p className="section-placeholder">{active ? ("You have " + active + " active reservations.") :"No active reservations."}</p>
            <button className="more-btn" onClick={() => {navigate("/me/activereservations");}}>More</button>
            </div>

            <div className="profile-section">
            <h3>Past Reservations</h3>
            <p className="section-placeholder">{past ? ("You have " + past + " past reservations.") :"No past reservations."}</p>
            <button className="more-btn" onClick={() => {navigate("/me/pastreservations");}}>More</button>
            </div>

            <div className="profile-section">
            <h3>My Subscriptions</h3>
            <p className="section-placeholder">You are not subscribed yet.</p>
            <button className="more-btn" onClick={() => {navigate("/me/subscription");}}>More</button>
            </div>
        </div>
        <Footer />
        </>

    );
};

export default Profile;
