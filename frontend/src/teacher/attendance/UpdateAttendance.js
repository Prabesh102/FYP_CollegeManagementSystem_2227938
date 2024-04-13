import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [filterSection, setFilterSection] = useState("");
  const sectionsFromLocalStorage = JSON.parse(localStorage.getItem("sections"));

  useEffect(() => {
    // Fetch students and attendance records when filterDate or filterSection changes
    if (filterDate || filterSection) {
      axios
        .get(
          `http://localhost:5000/api/users/getStudentsBySection?section=${filterSection}`
        )
        .then((response) => {
          setStudents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });

      axios
        .get(
          `http://localhost:5000/api/attendance/getAttendanceByTeacherNameDateAndSection?teacherName=${localStorage.getItem(
            "username"
          )}&date=${
            filterDate ? filterDate.toISOString() : ""
          }&section=${filterSection}`
        )
        .then((response) => {
          setAttendanceRecords(response.data);
        })
        .catch((error) => {
          console.error("Error fetching attendance records:", error);
        });
    }
  }, [filterDate, filterSection]);

  const handleAttendanceChange = (studentId, present) => {
    const updatedAttendanceRecords = attendanceRecords.map((record) => {
      if (record.studentName === studentId) {
        return { ...record, present: present };
      }
      return record;
    });
    setAttendanceRecords(updatedAttendanceRecords);
  };

  const handleUpdateAttendance = async () => {
    try {
      // Send updated attendance records to the backend
      await axios.put("http://localhost:5000/api/attendance/updateAttendance", {
        attendanceRecords: attendanceRecords,
      });
      console.log("Attendance updated successfully");
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleApplyFilter = () => {
    // Fetch data based on selected filters
    axios
      .get(
        `http://localhost:5000/api/attendance/getAttendanceByTeacherNameDateAndSection?teacherName=${localStorage.getItem(
          "username"
        )}&date=${
          filterDate ? filterDate.toISOString() : ""
        }&section=${filterSection}`
      )
      .then((response) => {
        setAttendanceRecords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance records:", error);
      });
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div className="container mt-4">
          <div className="text-center">
            <h1 className="text-center mb-4">Attendance System</h1>
            <div className="form-group">
              <label htmlFor="filterDate">Filter by Date:</label>
              <div>
                <DatePicker
                  selected={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="filterSection">Filter by Section:</label>
              <select
                id="filterSection"
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="form-control"
              >
                <option value="">All Sections</option>
                {sectionsFromLocalStorage.map((section, index) => (
                  <option key={index} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="primary" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>
          {students.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.username}</td>
                    <td>
                      <label className="mr-2">
                        <input
                          type="checkbox"
                          checked={
                            attendanceRecords.find(
                              (record) =>
                                record.studentName === student.username
                            )?.present || false
                          }
                          onChange={(e) =>
                            handleAttendanceChange(
                              student.username,
                              e.target.checked
                            )
                          }
                        />{" "}
                        Present
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={
                            !attendanceRecords.find(
                              (record) =>
                                record.studentName === student.username
                            )?.present || false
                          }
                          onChange={(e) =>
                            handleAttendanceChange(
                              student.username,
                              !e.target.checked
                            )
                          }
                        />{" "}
                        Absent
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="text-center">
            <Button variant="success" onClick={handleUpdateAttendance}>
              Update Attendance
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateAttendance;
