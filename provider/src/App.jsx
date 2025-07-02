import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ProtectedProviderRoute from "./components/ProtectedProviderRoute";
import AddFlight from "./pages/addflight/AddFlight";
import UpdateFlight from "./pages/updateflight/updateflight";
import Flight from "./pages/flight/Flight";
import SeatMapPage from "./pages/seatmap/SeatMapPage";
import './App.css'
import Dashboard from "./pages/dashboard/Dashboard";

function App() {

  return (
    <Router>

      <Routes>
          <Route path="/charter-login" element={<Login/>} />
          <Route path="/charter-register" element={<Register/>} />

          <Route element={<ProtectedProviderRoute />}>
                  <Route path="/" element={<Dashboard/>}/>
                  <Route path="/add-flight" element={<AddFlight/>} />
                  <Route path="/flight/:id/update" element={<UpdateFlight/>} />
                  <Route path="/flight/:id" element={<Flight/>} />
                  <Route path="/flight/:id/seatmap" element={<SeatMapPage />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
