import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ActiveReservations from "./pages/reservations/ActiveReservations";
import UseCode from "./pages/usecode/UseCode";
import PastReservations from "./pages/reservations/PastReservations";
import Reservation from "./pages/reservation/Reservation";
import Subscription from "./pages/subscription/Subscription";
import BookFlight from "./pages/bookflight/BookFlight";
import CheckIn from "./pages/checkin/CheckIn";
import Flight from "./pages/flight/Flight";
import Chatbot from "./pages/chatbot/Chatbot";
import SeatMapView from "./pages/seatmap/SeatMapView";
import SelectSeat from "./pages/seatmap/SelectSeat";
import BookWithCode from "./pages/bookflight/BookWithCode";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element = {<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/flight/:id" element={<Flight/>}/>

                <Route element={<ProtectedRoute />}>
                <Route path="/me" element={<Profile />} />
                <Route path="/chatbot" element={<Chatbot/>} />
                <Route path="/me/activereservations" element={<ActiveReservations />}/>
                <Route path="/me/pastreservations" element={<PastReservations/>}/>
                <Route path="/me/activereservations/:id" element={<Reservation/>}/>
                <Route path="/me/pastreservations/:id" element={<Reservation/>}/>
                <Route path="/me/subscription" element={<Subscription/>}/>
                <Route path="/flight/:id/book" element={<BookFlight/>} />
                <Route path="/me/activereservations/:id/checkin/:passagers" element={<CheckIn/>} />
                <Route path="/me/activereservations/:id/seatsmap" element={<SeatMapView/>} />
                <Route path="/promo-code" element={<UseCode />} />
                <Route path="/promo-code/:code" element={<BookWithCode />} />
                <Route path="/me/activereservations/:bookingId/purchaseseats/:flightId/:number_of_seats" element={<SelectSeat/>} />
                </Route>
            </Routes>

        </Router> 
    );
}

export default App;
