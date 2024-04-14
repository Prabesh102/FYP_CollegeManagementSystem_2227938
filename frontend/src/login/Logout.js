import React from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  // Function to handle logout
  const handleLogout = () => {
    // Remove all values from localStorage
    localStorage.clear();
    // Redirect to the login page
    return <Navigate to="/login" />;
  };

  // Call the handleLogout function immediately
  return handleLogout();
};

export default Logout;
