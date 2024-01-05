import React, { useState } from "react";
import axios from "axios";
import image from "../image/loginImage.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import Navbar from "../admin/main/Navbar";
const Register = () => {
  const [alertMessage, setAlertMessage] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    registrationDate: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      console.log("Registration successful", response.data);
      setAlertMessage("Registration successful. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Registration failed", error.message);

      console.log(error.response);

      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Email already exists"
      ) {
        setAlertMessage("Email already exists. Please use a different email.");
      } else {
        setAlertMessage("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar />
      {/* <div className="hero-section-login"> */}
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <h1
              className="display-4"
              style={{ color: "white", marginBottom: "60px" }}
            >
              Add new user
            </h1>
            <h3 className="display-5" style={{ color: "white" }}>
              Send email after registration !!!
            </h3>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              {alertMessage && (
                <div className="alert alert-success" role="alert">
                  {alertMessage}
                </div>
              )}
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start"></div>
              <label
                className="form-label"
                htmlFor="username"
                style={{ color: "white" }}
              >
                Username
              </label>
              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control form-control-lg bg-transparent text-white border-white"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{ color: "white" }}
                />
              </div>
              <label
                className="form-label"
                htmlFor="email"
                style={{ color: "white" }}
              >
                Email address
              </label>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control form-control-lg bg-transparent text-white border-white"
                  placeholder="Enter correct email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <label
                className="form-label"
                htmlFor="password"
                style={{ color: "white" }}
              >
                Password
              </label>
              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control form-control-lg bg-transparent text-white border-white"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <label
                className="form-label"
                htmlFor="password"
                style={{ color: "white" }}
              >
                Role
              </label>
              <div className="form-outline mb-3">
                <select
                  className="custom-select"
                  style={{ width: "200px" }}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">student</option>
                  <option value="teacher">teacher</option>
                  <option value="teacher">admin</option>
                </select>
              </div>
              <label
                className="form-label"
                htmlFor="registrationDate"
                style={{ color: "white" }}
              >
                Registration Date
              </label>
              <div className="form-outline mb-4">
                <input
                  type="date"
                  id="registrationDate"
                  name="registrationDate"
                  className="form-control form-control-lg bg-transparent text-white border-white"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="text-center text-lg-start mt-4 pt-2">
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
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Register;
