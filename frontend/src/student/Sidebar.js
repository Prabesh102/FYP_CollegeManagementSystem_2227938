import React from "react";
import profile from "../image/profile.png";
import image from "../image/CMS.png";
import "./students.css";
import logooo from "../image/logooo.png";
import { Link } from "react-router-dom";
import Logout from "../login/Logout";
const Sidebar = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <nav
        className="sidebar"
        style={{
          marginTop: "50px",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          height: "650px",
          width: "155px",
          maxWidth: "250px",
          minWidth: "155px",
        }}
      >
        <div className="justify-content-center text-align-center align-items-center">
          <div
            className="logoContainer"
            style={{
              display: "flex",
              backgroundColor: "#7b4bcb",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              marginTop: "30px",
              borderRadius: "10px",
              height: "80px",
              width: "80px",
              marginLeft: "35px",
            }}
          >
            <img
              src={logooo}
              alt="Logo"
              className="img-fluid mb-3"
              style={{
                height: "50px",
                width: "50px",
                marginTop: "15px",
              }}
            />
          </div>

          <ul
            className="nav flex-column"
            style={{
              marginTop: "auto",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Link
              to="/StudentDashboard"
              className="nav-link"
              style={{ color: "white" }}
            >
              <i className="fa-solid fa-house"></i> Home
            </Link>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-book"></i> Classroom
              </a>
            </li>
            <li className="nav-item">
              <Link
                to="/student/ViewAssignment"
                className="nav-link"
                style={{ color: "white" }}
              >
                <i class="fa-solid fa-laptop"></i> Assignments
              </Link>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-person-circle-check"></i> Attendance
              </a>
            </li>
            <li className="nav-item">
              <Link
                to="/student/viewLibrary"
                className="nav-link"
                style={{ color: "white" }}
              >
                <i class="fa-solid fa-book-open-reader"></i> Library
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/student/ViewSchedule"
                className="nav-link"
                style={{ color: "white" }}
              >
                <i class="fa-solid fa-book-open-reader"></i> Class Schedule
              </Link>
            </li>
            <li className="nav-item">
              <Logout />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
