import React from "react";
import profile from "../image/profile.png";
import image from "../image/CMS.png";
import "./students.css";
import logooo from "../image/logooo.png";

const Sidebar = () => {
  return (
    <>
      <nav
        className="sidebar"
        style={{
          marginTop: "50px",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          height: "90%",
        }}
      >
        <div className="sidebar-sticky justify-content-center text-align-center align-items-center">
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
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-house"></i> Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-book"></i> Classroom
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-laptop"></i> Assignments
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-person-circle-check"></i> Attendance
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-book-open-reader"></i> Library
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ color: "white" }}>
                <i class="fa-solid fa-clock"></i> Class Schedule
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
