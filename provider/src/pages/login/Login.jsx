import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; 
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => { 
        e.preventDefault(); 

        setError(""); 
        setIsLoading(true); 


        if (!email || !password) {
            setError("Email and password are required.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/auth/charter-login", { email, password }, {
                withCredentials: true,
            });

            if (response.status === 200) {

                navigate("/dashboard"); 
            } else {
                
                setError(response.data.message || "Login failed. Please try again.");
            }
        } catch (err) {

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); 
            } else {
                setError("Network error or server unavailable. Please try again.");
            }
            console.error("Login error:", err);
        } finally {
            setIsLoading(false); 
            setPassword(""); 
        }
    };

    return (
        <div className="login-container"> 
            <form className="login-form" onSubmit={handleLogin}> 
                <h2>Login Charter Provider</h2> 
                
                <div className="form-group"> 
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email..." 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password..." 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                
                {error && <p className="error">{error}</p>} 

                <p className="register-link-text">
                    No account? <a href="/charter-register" className="register-link">Register here</a>
                </p>
                
                <button type="submit" disabled={isLoading}> 
                    {isLoading ? "Logging in..." : "Login"} 
                </button>
            </form>
        </div>
    );
};

export default Login;