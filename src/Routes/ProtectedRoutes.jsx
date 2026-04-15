import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

const ProtectedRoutes = () => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/auth/me");
                // If success → user is authenticated
                setIsAuth(true);
            } catch (error) {
                // If 401 → user is NOT authenticated
                if (error.response && error.response.status === 401) {
                    setIsAuth(false);
                } else {
                    // Optional: handle other errors
                    setIsAuth(false);
                }
            }
        };

        checkAuth();
    }, []);

    //  Loading state
    if (isAuth === null) {
        return <div>Loading...</div>;
    }

    //  Final decision
    return isAuth ? <Outlet /> : <Navigate to="*" replace />;
};

export default ProtectedRoutes;