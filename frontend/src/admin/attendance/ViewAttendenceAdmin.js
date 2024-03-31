import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../main/Navbar";
import { Button, Table, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ViewAttendanceAdmin = () => {
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filterDate, setFilterDate] = useState(null); // Change to null
  const [filterSection, setFilterSection] = useState("");
  const [sectionNames, setSectionNames] = useState([]);

  useEffect(() => {
    // Fetch attendance details and section names from the backend
    axios
      .all([
        axios.get("http://localhost:5000/api/attendance/getAllAttendance"),
        axios.get("http://localhost:5000/api/section/getAllSection"),
      ])
      .then((response) => {
        setAttendanceDetails(response[0].data);
        setFilteredAttendance(response[0].data); // Initialize filteredAttendance with all attendance details
        setSectionNames(response[1].data); // Set section names fetched from the backend
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error
      });
  }, []);

  // Function to handle filtering based on date and section
  const handleFilter = () => {
    let filteredData = attendanceDetails;

    // Filter by date if date is selected
    if (filterDate) {
      filteredData = filteredData.filter(
        (attendance) =>
          new Date(attendance.timestamp).toLocaleDateString() ===
          filterDate.toLocaleDateString() // Change toLocaleDateString
      );
    }

    // Filter by section if section is selected
    if (filterSection) {
      filteredData = filteredData.filter(
        (attendance) => attendance.section === filterSection
      );
    }

    setFilteredAttendance(filteredData);
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "60px" }}>
        {/* Filter options */}
        <Form className="mb-3">
          <Form.Group className="mb-3 d-flex">
            <DatePicker
              selected={filterDate} // Change to filterDate
              onChange={(date) => setFilterDate(date)} // Change to setFilterDate
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Select Date" // Placeholder text
              className="form-control"
            />
            <Form.Select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              style={{ width: "150px", height: "38px" }} // Adjust width and height as needed
            >
              <option value="">All Sections</option>
              {sectionNames.map((section) => (
                <option key={section._id} value={section.sectionName}>
                  {section.sectionName}
                </option>
              ))}
            </Form.Select>

            <Button onClick={handleFilter}>Apply Filter</Button>
          </Form.Group>
        </Form>

        <h2>Attendance Details</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Section</th>
              <th>Student Name</th>
              <th>Attendance Status</th>
              <th>Date-Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((attendance, index) => (
              <tr key={index}>
                <td>{attendance.section}</td>
                <td>{attendance.studentName}</td>
                <td>{attendance.present ? "Present" : "Absent"}</td>
                <td>{new Date(attendance.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ViewAttendanceAdmin;
