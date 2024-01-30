import React, { useState } from "react";
import axios from "axios";
import Navbar from "../admin/main/Navbar";

const Register = () => {
  const [alertMessage, setAlertMessage] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    registrationDate: new Date().toISOString(),
    section: "",
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
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4">
          <form onSubmit={handleSubmit}>
            {alertMessage && (
              <div className="alert alert-success" role="alert">
                {alertMessage}
              </div>
            )}

            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter correct email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Role</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Registration Date</label>
              <input
                type="date"
                name="registrationDate"
                className="form-control"
                value={formData.registrationDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Section</label>
              <input
                type="text"
                name="section"
                className="form-control"
                value={formData.section}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add User
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
