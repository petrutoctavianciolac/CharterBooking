import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (

        <>
        <nav className="navbar">
            <h1 className="logo">Booking System</h1>


            <button className="menu-toggle" onClick={toggleMenu}>☰</button>

            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                <li><button className="nav-button" onClick={() => navigate("/chatbot")}>Ciprian Assistant</button></li>
                <li><button className="nav-button" onClick={() => navigate("/promo-code")}>Code Reservation</button></li>
                <li><button className="nav-button" onClick={() => navigate("/")}>Flights</button></li>
                <li><button className="nav-button" onClick={() => navigate("/me")}><FaUser size={24} color="white" /></button></li>
            </ul>
        </nav>

        <br></br>
        </>
    );
}

export default Navbar;
