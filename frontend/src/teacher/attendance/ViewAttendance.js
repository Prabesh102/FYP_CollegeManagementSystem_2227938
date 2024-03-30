import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../Sidebar";

const ViewAttendance = () => {
  const [students, setStudents] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  useEffect(() => {
    // Retrieve section name from localStorage
    const section = localStorage.getItem("section");
    setSectionName(section);

    // Fetch students by section
    if (section) {
      axios
        .get(
          `http://localhost:5000/api/users/students/getStudentsBySection?section=${section}`
        )
        .then((response) => {
          setStudents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
          // Handle error
        });
    }
  }, []);

  const handleAttendanceChange = (studentId, present) => {
    // Update the attendance status for the student
    const updatedStudents = students.map((student) => {
      if (student._id === studentId) {
        return { ...student, present: present, absent: !present };
      } else {
        return { ...student, present: false, absent: false };
      }
    });
    setStudents(updatedStudents);
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendanceData = students.map((student) => ({
        studentName: student.username, // Assuming username holds the student's name
        present: student.present,
      }));

      // Send attendance data to the backend
      await axios.post("http://localhost:5000/api/attendance/attendance", {
        section: sectionName,
        attendance: attendanceData,
      });

      console.log("Attendance submitted successfully");
      setAttendanceSubmitted(true);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      // Handle error
    }
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div className="container mt-4">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sectionName ? sectionName : "Section"}
            </button>
            <ul className="dropdown-menu">
              {/* Render section name if available */}
              {sectionName && (
                <li>
                  <a className="dropdown-item" href="#">
                    {sectionName}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <h1 className="text-center mb-4">Attendance System</h1>
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
                        checked={student.present}
                        onChange={() =>
                          handleAttendanceChange(student._id, true)
                        }
                      />{" "}
                      Present
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={student.absent}
                        onChange={() =>
                          handleAttendanceChange(student._id, false)
                        }
                      />{" "}
                      Absent
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!attendanceSubmitted && (
            <div className="text-center">
              <Button variant="primary" onClick={handleSubmitAttendance}>
                Submit Attendance
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAttendance;
