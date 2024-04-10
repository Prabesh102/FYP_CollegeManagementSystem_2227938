import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";

const UpdateAttendance = () => {
  const [students, setStudents] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Retrieve section array from localStorage
    const sections = JSON.parse(localStorage.getItem("sections"));
    if (sections) {
      setSections(sections);
    }

    // Fetch students and attendance records when sectionName changes
    if (sectionName) {
      axios
        .get(
          `http://localhost:5000/api/users/getStudentsBySection?section=${sectionName}`
        )
        .then((response) => {
          setStudents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });

      axios
        .get(
          `http://localhost:5000/api/attendance/getAttendanceByTeacherName?teacherName=${localStorage.getItem(
            "username"
          )}`
        )
        .then((response) => {
          setAttendanceRecords(response.data);
        })
        .catch((error) => {
          console.error("Error fetching attendance records:", error);
        });
    }
  }, [sectionName]);

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

  const handleSectionChange = (selectedSection) => {
    setSectionName(selectedSection);
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div className="container mt-4">
          <div
            style={{
              display: "flex",
              width: "500px",
              justifyContent: "space-evenly",
            }}
          >
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: "150px" }}
              >
                {sectionName ? sectionName : "Select Section"}
              </button>
              <ul className="dropdown-menu">
                {sections.map((section, index) => (
                  <li key={index}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSectionChange(section)}
                    >
                      {section}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <Button>
              <Link
                to="/teacher/oldAttendance"
                className="nav-link"
                style={{ color: "white", width: "150px" }}
              >
                <i class="fa-solid fa-laptop"></i> Old Attendances
              </Link>
            </Button>
          </div>
          <h1 className="text-center mb-4">Attendance System</h1>
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
