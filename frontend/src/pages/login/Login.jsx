import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import "./login.css";
import axios from "axios";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async() => {

        setError("");
        setPassword("");
        setEmail("");

        try{

            const response = await axios.post("http://localhost:3000/auth/login", { email, password }, {
                withCredentials: true,
            });

            console.log(response);

            if (response.status === 200) {
                navigate("/me");
            } else {
                setError(data.error || "Login failed.");
            }
        }
        catch(error){

            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("Network error. Please try again.");
            }
        }
    }

    return (
        <>
        <Navbar />
        <div className="login-form">
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br/>
            <br/>
            <p><a href="/register">No account? Register</a></p>
            <button onClick={handleLogin}>Login</button>
            {error && <p className="error">{error}</p>}
        </div>
        </>
    );
};

export default Login;
