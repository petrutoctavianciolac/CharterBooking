import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = () => {
    const [authData, setAuthData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3000/auth/verify", { withCredentials: true })
            .then((res) => {
                setAuthData(res.data);
            })
            .catch(() => {
                setAuthData(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!authData) return <Navigate to="/login" />;

    return (
        <AuthContext.Provider value={authData}>
            <Outlet />
        </AuthContext.Provider>
    );
};

export default ProtectedRoute;
