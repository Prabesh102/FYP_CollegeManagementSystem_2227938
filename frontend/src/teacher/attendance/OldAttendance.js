import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Table, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const OldAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [filterSection, setFilterSection] = useState("");
  const sectionName = localStorage.getItem("section");
  const sectionsFromLocalStorage = JSON.parse(localStorage.getItem("sections"));

  useEffect(() => {
    const teacherName = localStorage.getItem("username");

    if (teacherName) {
      axios
        .get(
          `http://localhost:5000/api/attendance/getAttendanceByTeacherName?teacherName=${teacherName}`
        )
        .then((response) => {
          setAttendanceData(response.data);
          setFilteredAttendance(response.data); // Initialize filteredAttendance with all data
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
        });
    }
  }, []);

  const handleFilter = () => {
    let filteredData = attendanceData;

    if (filterDate) {
      filteredData = filteredData.filter(
        (attendance) =>
          new Date(attendance.timestamp).toLocaleDateString() ===
          filterDate.toLocaleDateString()
      );
    }
    if (filterSection) {
      filteredData = filteredData.filter(
        (attendance) => attendance.section === filterSection
      );
    }

    setFilteredAttendance(filteredData);
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div className="container mt-4">
          <div
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h2>Attendance Details</h2>
            <Form className="filter-form" style={{ marginBottom: "50px" }}>
              <Form.Group controlId="filterDate">
                <Form.Label>Date:</Form.Label>
                <DatePicker
                  selected={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group
                controlId="filterSection"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "50px",
                  marginRight: "50px",
                }}
              >
                <Form.Label style={{ marginRight: "10px" }}>
                  Section:
                </Form.Label>
                <Form.Control
                  as="select"
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                >
                  <option value="">All Sections</option>
                  {sectionsFromLocalStorage &&
                    sectionsFromLocalStorage.map((section, index) => (
                      <option key={index} value={section}>
                        {section}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={handleFilter}>
                Apply Filter
              </Button>
              <div style={{ marginLeft: "30px" }}>
                <Button variant="primary">
                  {" "}
                  <Link
                    to="/teacher/updateAttendance"
                    className="nav-link"
                    style={{ color: "white" }}
                  >
                    <i class="fa-solid fa-laptop"></i> Update Attendance
                  </Link>
                </Button>
              </div>
            </Form>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Present</th>
                  <th>Date-Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((attendance, index) => (
                  <tr key={index}>
                    <td>{attendance.studentName}</td>
                    <td>{attendance.present ? "Yes" : "No"}</td>
                    <td>{new Date(attendance.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OldAttendance;
