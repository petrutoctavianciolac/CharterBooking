import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { AuthProviderContext } from "./AuthProviderContext"; 

const ProtectedProviderRoute = () => {
    const [providerAuthData, setProviderAuthData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios.get("http://localhost:3000/auth/charter-verify", { withCredentials: true })
            .then((res) => {
                setProviderAuthData(res.data.provider); 
            })
            .catch((err) => {
                console.error("Provider auth verification failed:", err);
                setProviderAuthData(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading provider area...</div>; 

    if (!providerAuthData) return <Navigate to="/charter-login" replace />; 

    return (
        <AuthProviderContext.Provider value={providerAuthData}>
            <Outlet />
        </AuthProviderContext.Provider>
    );
};

export default ProtectedProviderRoute;