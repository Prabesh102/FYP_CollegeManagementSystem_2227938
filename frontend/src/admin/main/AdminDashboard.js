import React, { useState, useEffect } from "react";

import "./admin.css";
import LineChartComponent from "./LineChartComponent";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [recentlyRegisteredUsers, setRecentlyRegisteredUsers] = useState([]);
  useEffect(() => {
    const fetchRecentlyRegisteredUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/recentlyRegisteredUsers"
        );
        const data = await response.json();
        setRecentlyRegisteredUsers(data); // Assuming data is an array of recently registered users
      } catch (error) {
        console.error("Error fetching recently registered users:", error);
      }
    };
    fetchRecentlyRegisteredUsers();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/userCountsByRole"
        );
        const data = await response.json();
        setStudentCount(data.studentCount);
        setTeacherCount(data.teacherCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <Navbar />
      <div className="main-admin-page" style={{ paddingTop: "60px" }}>
        <div className="dashboard-summary d-flex justify-content-around mt-4">
          <div className="admin-details">
            <i class="fa-solid fa-user fa-3x" style={{ color: "#4d8a8a" }}></i>
            <h4 className="text-admin">Admin</h4>
            <h5>admin@gmail.com</h5>
          </div>
          <div className="registered-group">
            <div className="recently-registered-text">
              <h3
                style={{
                  textAlign: "center",
                  color: "#4d8a8a",
                  marginBottom: "15px",
                }}
              >
                Recently Registered Users
              </h3>
            </div>
            <div className="recently-registered-columns">
              {recentlyRegisteredUsers.map((user) => (
                <div key={user._id} className="recently-registered-column">
                  <div className="recently-registered">
                    <i
                      className="fa-solid fa-user fa-2x"
                      style={{ color: "#4d8a8a" }}
                    ></i>
                    <h4 className="text-admin">{user.username}</h4>
                    <h5>{user.email}</h5>
                    <h5>Role: {user.role}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <LineChartComponent />
          </div>
        </div>
        <div className="summary  d-flex justify-content-around">
          <div className="summary-box summary-box-custom">
            <h4>Total Students</h4>
            <h1>
              <i
                className="fa-solid fa-graduation-cap"
                style={{ color: "#4d8a8a" }}
              ></i>
            </h1>
            <h2 className="fw-bold">{studentCount}</h2>
          </div>
          <div className="summary-box summary-box-custom">
            <h4>Total Teachers</h4>
            <h1>
              <i
                className="fa-solid fa-person-chalkboard"
                style={{ color: "#4d8a8a" }}
              ></i>
            </h1>
            <h2 className="fw-bold">{teacherCount}</h2>
          </div>
          <div className="summary-box summary-box-custom">
            <h4>Total Classes </h4>
            <h1>
              {" "}
              <i className="fa-solid fa-book" style={{ color: "#4d8a8a" }}></i>
            </h1>
            <h2 className="fw-bold">40</h2>
          </div>
          <div className="summary-box summary-box-custom">
            <h4>Total Sections</h4>
            <h1>
              {" "}
              <i
                className="fa-solid fa-people-group"
                style={{ color: "#4d8a8a" }}
              ></i>
            </h1>
            <h2 className="fw-bold"> 80</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
