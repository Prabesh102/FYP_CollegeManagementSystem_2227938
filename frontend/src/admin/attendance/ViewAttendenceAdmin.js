import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../main/Navbar";
import { Button, Table, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ViewAttendanceAdmin = () => {
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [filterSection, setFilterSection] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [sectionNames, setSectionNames] = useState([]);
  const [teacherNames, setTeacherNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    // Fetch attendance details, section names, and teacher names from the backend
    axios
      .all([
        axios.get("http://localhost:5000/api/attendance/getAllAttendance"),
        axios.get("http://localhost:5000/api/section/getAllSection"),
        axios.get("http://localhost:5000/api/users/getAllTeachers"),
      ])
      .then((response) => {
        setAttendanceDetails(response[0].data);
        setFilteredAttendance(response[0].data);
        setSectionNames(response[1].data);
        setTeacherNames(response[2].data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to handle filtering based on date, section, and teacher
  const handleFilter = () => {
    let filteredData = attendanceDetails;

    // Apply filters
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
    if (filterTeacher) {
      filteredData = filteredData.filter(
        (attendance) => attendance.teacherName === filterTeacher
      );
    }

    setFilteredAttendance(filteredData);
    setCurrentPage(1); // Reset to the first page after applying filters
  };

  // Calculate indexes of the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAttendance.slice(indexOfFirstRow, indexOfLastRow);

  // Function to handle page navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "60px" }}>
        <Form className="mb-3">
          <Form.Group className="mb-3 d-flex">
            <DatePicker
              selected={filterDate}
              onChange={(date) => setFilterDate(date)}
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Select Date"
              className="form-control"
            />
            <Form.Select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              style={{ width: "150px", height: "38px" }}
            >
              <option value="">All Sections</option>
              {sectionNames.map((section) => (
                <option key={section._id} value={section.sectionName}>
                  {section.sectionName}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              style={{ width: "150px", height: "38px" }}
            >
              <option value="">All Teachers</option>
              {teacherNames.map((teacher) => (
                <option key={teacher._id} value={teacher.username}>
                  {teacher.username}
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
              <th>Teacher</th>
              <th>Student Name</th>
              <th>Attendance Status</th>
              <th>Date-Time</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((attendance, index) => (
              <tr key={index}>
                <td>{attendance.section}</td>
                <td>{attendance.teacherName}</td>
                <td>{attendance.studentName}</td>
                <td>{attendance.present ? "Present" : "Absent"}</td>
                <td>{new Date(attendance.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="pagination">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastRow >= filteredAttendance.length}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewAttendanceAdmin;
