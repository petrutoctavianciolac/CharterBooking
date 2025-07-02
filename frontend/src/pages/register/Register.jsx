import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.jsx";
import axios from "axios";
import "./register.css";

const Register = () => {

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };   

    const handleRegister = async (e) => {

        e.preventDefault();
        setError("");
        const emptyFields = Object.entries(userData).filter(([key, value]) => value === "");
        if (emptyFields.length > 0) {
            setError("All fields are mandatory!");
            return;
        }

        try {
            console.log(userData);
            await axios.post(`http://localhost:3000/auth/register`, userData, { withCredentials: true });
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError("This email is already in use.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (

        <>
        <Navbar />
        <div className="register-form">
            <h2>Register</h2>
            <input type="text" name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} />
            <p><a href="/login">Already have an account? Login</a></p>
            {error && <p className="error">{error}</p>}       
            <button onClick={handleRegister}>Register</button>
        </div>
        </>
    );
};

export default Register;
