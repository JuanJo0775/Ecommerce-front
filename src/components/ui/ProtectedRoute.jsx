import React, { useState, useEffect } from 'react';
import api from "../../api";
import { jwtDecode } from 'jwt-decode';
import Spinner from "./Spinner";
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthorised, setIsAuthorised] = useState(null);
    const location = useLocation()

    useEffect(() => {
        auth().catch(() => setIsAuthorised(false));
    }, []);

    async function refreshToken() {
        const refreshToken = localStorage.getItem("refresh");

        try {
            const res = await api.post("/token/refresh/", {
                refresh: refreshToken,
            });

            if (res.status === 200) {
                localStorage.setItem("access", res.data.access);
                setIsAuthorised(true);
            } else {
                setIsAuthorised(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorised(false);
        }
    }

    async function auth() {
        const token = localStorage.getItem("access");
        if (!token) {
            setIsAuthorised(false);
            return;
        }

        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_time = Date.now() / 1000;

        if (current_time > expiry_date) {
            await refreshToken();
        } else {
            setIsAuthorised(true);
        }
    }

    if (isAuthorised === null) {
        return <Spinner />;
    }

    if (!isAuthorised) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return children;
};

export default ProtectedRoute;
