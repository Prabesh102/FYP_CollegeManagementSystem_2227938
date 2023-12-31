import React from "react";
import { Link } from "react-router-dom";
const navbar = () => {
  return (
    <div className="col-lg-12 ">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        {/* <div className="d-flex justify-content-between"> */}
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/AdminDashboard"
                  className="nav-link active"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Students
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Teachers
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Class
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Library
                </a>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Add new user
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ height: "30px" }}
                >
                  <Link
                    to="/login"
                    className="nav-link"
                    style={{
                      lineHeight: "0",
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    Logout
                  </Link>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    // </div>
  );
};

export default navbar;
