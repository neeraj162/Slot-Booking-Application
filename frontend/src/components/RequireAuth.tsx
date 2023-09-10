import React from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    const location = useLocation();

    return (
        sessionStorage.getItem('email') ? <Outlet /> :
            <Navigate to='/login' state={{ from: location }} replace />
    );
}

export default RequireAuth