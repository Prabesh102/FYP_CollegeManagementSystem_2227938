import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of Navigate

const Logout = () => {
  const navigate = useNavigate(); // Initialize the navigate function from useNavigate

  // Function to handle logout when the logout button is clicked
  const handleLogout = () => {
    // Remove all values from localStorage
    localStorage.clear();
    // Redirect to the login page
    navigate("/login"); // Use the navigate function to redirect to "/login"
  };

  // Render the logout button
  return (
    <button
      onClick={handleLogout}
      className="nav-link"
      style={{ color: "white" }}
    >
      <i class="fa-solid fa-sign-out"></i> Logout
    </button>
  );
};

export default Logout;
