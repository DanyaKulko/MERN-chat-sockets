import React from 'react';
import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = ({user, redirectPath = '/login' }) => {
    // TODO: add a check to see if the user has the correct role
    if(user.isLoggedIn )
        return <Outlet />
    else if(!user.isLoggedIn && !user.isLoading)
        return <Navigate to={redirectPath} />
};

export default ProtectedRoute