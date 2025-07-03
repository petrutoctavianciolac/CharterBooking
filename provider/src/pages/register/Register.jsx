import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css"; 

const Register = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
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
        setIsLoading(true); 


        const emptyFields = Object.entries(userData).filter(([, value]) => value === "");
        if (emptyFields.length > 0) {
            setError("All fields are mandatory!");
            setIsLoading(false);
            return;
        }

        try {
            await axios.post(`http://localhost:3000/auth/charter-register`, userData, { withCredentials: true });
            navigate("/charter-login?registered=true"); 
        } catch (err) {

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); 
            } else if (err.response && err.response.status === 409) {
                setError("This email is already in use."); 
            } else {
                setError("Something went wrong. Please try again.");
            }
            console.error("Register error:", err); 
        } finally {
            setIsLoading(false); 

        }
    };

    return (
        <div className="register-container"> 
            <form className="register-form" onSubmit={handleRegister}> 
                <h2>Register as Charter Provider</h2> 

                <div className="form-group"> 
                    <label htmlFor="name">Provider Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Company Name..."
                        value={userData.name}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email..."
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password..."
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>} 

                <p className="login-link-text"> 
                    Already have an account? <a href="/charter-login" className="login-link">Login here</a>
                </p>

                <button type="submit" disabled={isLoading}> 
                    {isLoading ? "Registering..." : "Register"} 
                </button>
            </form>
        </div>
    );
};

export default Register;