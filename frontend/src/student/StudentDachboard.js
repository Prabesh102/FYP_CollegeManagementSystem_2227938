import React from "react";
import Sidebar from "./Sidebar";
import profile from "../image/profile.png";
import cap from "../image/cap.png";
import studentIn from "../image/studentIn.png";
import laptop from "../image/laptop.png";
import assignment from "../image/assignment.png";
import session from "../image/session.png";
import attendance from "../image/attendance.png";
import notice from "../image/notice.png";
import "./students.css";

const StudentDachboard = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <div className="main" style={{ backgroundColor: "#fafafa" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-9 d-flex">
              <Sidebar />
              <div className="content-container d-flex flex-column p-3">
                <nav className="navbar navbar-light">
                  <div className="d-flex align-items-center">
                    <form className="form-inline d-flex p-3">
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <button
                        className="btn btn-outline-success my-2 my-sm-0"
                        type="submit"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </nav>

                <div
                  className="hero-section-main d-flex col-md-12 p-3"
                  style={{
                    width: "147%",
                    marginLeft: "10px",
                    borderRadius: "20px",
                    marginBottom: "20px", // Added margin
                  }}
                >
                  <div className="hero-section-text">
                    {" "}
                    <p style={{ color: "#c7acf0" }}>Saturday, Feb 17</p>
                    <div
                      className="down-text-hero-section-text"
                      style={{ marginTop: "120px" }}
                    >
                      <h2 style={{ color: "white" }}>Welcome Back ! User</h2>
                      <p style={{ color: "#c7acf0" }}>
                        Stay updated with College Management System.
                      </p>
                    </div>
                  </div>
                  <div
                    className="hero-section-images"
                    style={{ marginLeft: "auto" }}
                  >
                    <img
                      src={laptop}
                      alt="this is a laptop"
                      style={{
                        height: "150px",
                        width: "150px",
                        paddingRight: "4px",
                        marginBottom: "50px",
                      }}
                    />
                    <img
                      src={studentIn}
                      alt="this is the student"
                      style={{ height: "250px", width: "150px" }}
                    />
                    <img
                      src={cap}
                      alt="this is cap"
                      style={{
                        height: "120px",
                        width: "120px",
                        marginTop: "100px",
                      }}
                    />
                  </div>
                </div>
                <h5 style={{ marginTop: "20px", marginLeft: "33px" }}>
                  Dashboard
                </h5>
                <div
                  className="main-section d-flex"
                  style={{
                    marginTop: "20px",
                    width: "150%",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div
                    className="container-content mt-4"
                    style={{
                      border: "1px solid #BFBFBF",
                      backgroundColor: "white",
                      boxShadow: "1px 2px 2px 1px #aaaaaa",
                      height: "190px",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                      width: "28%",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px", // Added margin
                    }}
                  >
                    <div className="imageDashboard">
                      <img src={assignment} alt="this is a book" />
                    </div>
                    <div
                      className="dashboardText1"
                      style={{ textDecoration: "none", fontSize: "25px" }}
                    >
                      2
                    </div>
                    <div className="dashboardText" style={{ fontSize: "22px" }}>
                      {" "}
                      Assignments
                    </div>
                  </div>
                  <div
                    className="container-content mt-4"
                    style={{
                      border: "1px solid #BFBFBF",
                      backgroundColor: "white",
                      boxShadow: "1px 2px 2px 1px #aaaaaa",
                      height: "190px",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                      width: "28%",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px", // Added margin
                    }}
                  >
                    <div className="imageDashboard">
                      <img src={session} alt="this is a session" />
                    </div>
                    <div
                      className="dashboardText1"
                      style={{ textDecoration: "none", fontSize: "25px" }}
                    >
                      5
                    </div>
                    <div className="dashboardText" style={{ fontSize: "22px" }}>
                      {" "}
                      Today's Sessions
                    </div>
                  </div>
                  <div
                    className="container-content mt-4"
                    style={{
                      border: "1px solid #BFBFBF",
                      backgroundColor: "white",
                      boxShadow: "1px 2px 2px 1px #aaaaaa",
                      height: "190px",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                      width: "28%",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px", // Added margin
                    }}
                  >
                    <div className="imageDashboard">
                      <img src={attendance} alt="this is a book" />
                    </div>
                    <div
                      className="dashboardText1"
                      style={{ textDecoration: "none", fontSize: "25px" }}
                    >
                      80%
                    </div>
                    <div className="dashboardText" style={{ fontSize: "22px" }}>
                      {" "}
                      Overall Attendance
                    </div>
                  </div>
                  {/* <div
                    className="vertical-line"
                    style={{ borderLeft: "1px solid #BFBFBF", height: "200px" }}
                  ></div> */}
                  <div
                    className="container-notice mt-4"
                    style={{
                      border: "1px solid #BFBFBF",
                      backgroundColor: "white",
                      // boxShadow: "1px 2px 2px 1px #aaaaaa",
                      height: "200px",
                      // justifyContent: "center",
                      // textAlign: "center",
                      // alignItems: "center",
                      height: "190px",
                      width: "38%",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "15px",
                    }}
                  >
                    <div className="imageDashboard d-flex">
                      {" "}
                      <img
                        src={notice}
                        alt="this is a book"
                        style={{
                          height: "30px",
                          width: "30px",
                          marginRight: "5px",
                        }}
                      />
                      <h5> Notice: </h5>
                    </div>

                    <div
                      className="dashboardText"
                      style={{
                        fontSize: "22px",
                        // justifyContent: "center",
                        // textAlign: "center",
                        // alignItems: "center",
                        // marginLeft: "20px",
                      }}
                    >
                      {" "}
                      <p
                        style={{
                          fontSize: "16px",
                          height: "50px",
                          marginLeft: "20px",
                        }}
                      >
                        {" "}
                        Lorem Ipsum is simply dummy text of <br></br>the
                        printing and typesetting industry.
                      </p>
                      <button
                        type="button"
                        class="btn btn-link"
                        style={{ marginLeft: "7px" }}
                      >
                        View all notice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end p-4">
              <div
                className="ml-2 d-flex flex-column"
                style={{ marginRight: "8px" }}
              >
                <div className="ml-2 d-flex">
                  <img
                    src={profile}
                    alt=""
                    style={{
                      height: "40px",
                      width: "40px",
                      marginRight: "3px",
                    }}
                  />
                  <div className="ml-2 d-flex">
                    <div className="context-texts">
                      {" "}
                      <h5>Username</h5>
                      <p>Semester/year</p>{" "}
                    </div>

                    <i
                      class="fa-solid fa-bell fa-2x p-3"
                      style={{ marginLeft: "5px" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDachboard;
