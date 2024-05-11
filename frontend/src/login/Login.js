import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "./home.css";
import { useAuth } from "./AuthContext";

const Login = () => {
  const { login, authenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const navigateUser = () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole === "admin") {
        navigate("/AdminDashboard");
      } else if (userRole === "teacher") {
        navigate("/TeacherDashboard");
      } else if (userRole === "student") {
        navigate("/StudentDashboard");
      }
    };

    if (isMounted && authenticated) {
      navigateUser();
    }

    return () => {
      isMounted = false;
    };
  }, [authenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      const { role, username, semester, section, course, sections, module } =
        response.data;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);
      localStorage.setItem("semester", semester);
      localStorage.setItem("section", section);
      localStorage.setItem("course", course);
      localStorage.setItem("sections", JSON.stringify(sections));
      localStorage.setItem("module", module);

      console.log("User Role:", role);
      console.log("User Username:", username);
      console.log("Navigating to Dashboard");
      login();

      if (response.data.message === "Password change required") {
        setUserId(response.data.userId);
        setShowModal(true);
      } else {
        navigate(`/${role}Dashboard`); // Redirect to appropriate dashboard
      }
    } catch (error) {
      console.error("Login failed", error.message);
      setAlertMessage("Login failed. Please enter correct email or password.");
    }
  };

  const handleClose = () => setShowModal(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const newPassword = e.target.newPassword.value;
      const confirmPassword = e.target.confirmPassword.value;

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }

      // Check for whitespace in the password
      if (/\s/.test(newPassword)) {
        setErrorMessage("Password should not contain whitespace");
        return;
      }

      // Check for minimum length
      if (newPassword.length < 6) {
        setErrorMessage("Password should be at least 6 characters long");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/updatePassword",
        {
          userId: userId,
          newPassword: newPassword,
        }
      );

      setShowModal(false);
      navigate(`/${response.data.role}Dashboard`);
    } catch (error) {
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
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
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
