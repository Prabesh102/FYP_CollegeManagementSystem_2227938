import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom"; // Import Navigate from react-router-dom
import image from "../image/loginImage.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [redirectTo, setRedirectTo] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Inside handleLogin function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );
      // setAlertMessage("Login successfull. Redirecting to homepage");

      const userRole = response.data.role;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", userRole); // Store user role
      // Check the role and set redirection accordingly
      if (userRole === "student") {
        setRedirectTo("/StudentDashboard");
      } else if (userRole === "teacher") {
        setRedirectTo("/TeacherDashboard");
      } else if (userRole === "admin") {
        setRedirectTo("/AdminDashboard");
      }
    } catch (error) {
      console.error("Login failed", error.message);
      setAlertMessage("Login failed. Please enter correct email or password.");
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <div className="hero-section-login">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img src={image} className="img-fluid" alt="" />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            {alertMessage && (
              <div className="alert alert-danger" role="alert">
                {alertMessage}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start"></div>

              <label className="form-label" htmlFor="form3Example3">
                Email address
              </label>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter correct email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className="form-label" htmlFor="form3Example4">
                Password
              </label>

              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
