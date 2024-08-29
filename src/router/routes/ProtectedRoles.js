import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const withRoleProtection = (Component, allowedRoles) => {
  return (props) => {
    const location = useLocation();
    const user =
      JSON.parse(localStorage.getItem("loginUserData")) ||
      JSON.parse(localStorage.getItem("loginUserData"));
    const userRole = user.role; // Assuming a 'role' field in user data

    if (!allowedRoles.includes(userRole)) {
      // Redirect if user role is not allowed
      return (
        <Navigate to={`/${userRole}/home`} replace state={{ from: location }} />
      );
    }

    return <Component {...props} />;
  };
};
