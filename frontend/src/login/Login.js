import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom"; // Import Navigate from react-router-dom

import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "./home.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [redirectTo, setRedirectTo] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);

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
      if (response.data.message === "Password change required") {
        setUserId(response.data.userId); // Set the userId for the password change modal
        setShowModal(true); // Show password change modal
      }
    } catch (error) {
      console.error("Login failed", error.message);
      setAlertMessage("Login failed. Please enter correct email or password.");
    }
  };
  const handleClose = () => setShowModal(false);
  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const newPassword = e.target.newPassword.value;
      const confirmPassword = e.target.confirmPassword.value;

      if (newPassword !== confirmPassword) {
        // Handle password mismatch error
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/updatePassword",
        {
          userId: userId,
          newPassword: newPassword,
        }
      );

      // Handle successful password change
      setShowModal(false);
    } catch (error) {
      // Handle password change error
      console.error("Password change failed", error.message);
    }
  };

  return (
    <div className="hero-section-login">
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Password Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                required
              />
            </div>
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="container-fluid h-custom">
        <div className="row align-items-center h-100">
          <div className="col-lg-6">
            <h1 className="display-2 text-white">College Management System</h1>
            <h3 className="display-9 text-white" style={{ marginTop: "40px" }}>
              "Empowering Education, Simplifying Management: Your College, Your
              System!"
            </h3>
          </div>{" "}
          <div className="col-lg-6">
            <form onSubmit={handleLogin} className="custom-login-form">
              <h1
                className="display-6 text-white "
                style={{ marginBottom: "20px" }}
              >
                Login Here!
              </h1>
              {alertMessage && (
                <div className="alert alert-danger" role="alert">
                  {alertMessage}
                </div>
              )}
              {/* <div className="d-flex flex-row align-items-center justify-content-center"></div> */}

              <label
                className="form-label"
                htmlFor="form3Example3"
                style={{ color: "white" }}
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="Enter correct email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label
                className="form-label"
                htmlFor="form3Example4"
                style={{ color: "white" }}
              >
                Password
              </label>

              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  name="password"
                  className="form-control form-control-lg bg-transparent text-white border-white"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-center text-lg-start mt-4 pt-2 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    color: "black",
                    width: "200px",
                    backgroundColor: "white",
                    border: "1px solid white",
                  }}
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
