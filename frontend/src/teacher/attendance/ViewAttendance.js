import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";

const ViewAttendance = () => {
  const [students, setStudents] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    // Retrieve section name and teacher name from localStorage
    const section = localStorage.getItem("section");
    const teacherName = localStorage.getItem("username");

    // Fetch schedule data
    if (section && teacherName) {
      axios
        .get(
          `http://localhost:5000/api/schedule/?section=${section}&teacherName=${teacherName}`
        )
        .then((response) => {
          const scheduleData = response.data;

          // Check if the response section name is equal to the selected section name
          if (scheduleData.section === section) {
            // Show the submit button
            setShowSubmitButton(true);

            // Store the schedule data
            setScheduleData(scheduleData);

            // Set the section name
            setSectionName(scheduleData.section);

            // Fetch students by section
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
        })
        .catch((error) => {
          console.error("Error fetching schedule data:", error);
          // Handle error
        });
    }

    // Fetch students by section even if schedule data is not available
    const sectionName = localStorage.getItem("section");
    if (sectionName) {
      axios
        .get(
          `http://localhost:5000/api/users/students/getStudentsBySection?section=${sectionName}`
        )
        .then((response) => {
          setStudents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
          // Handle error
        });
    }

    // Set the section name
    const localSectionName = localStorage.getItem("section");
    if (localSectionName) {
      setSectionName(localSectionName);
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
        studentName: student.username,
        present: student.present,
      }));

      const teacherName = localStorage.getItem("username"); // Get the teacher's name

      // Send attendance data to the backend along with teacherName
      await axios.post("http://localhost:5000/api/attendance/attendance", {
        section: sectionName,
        teacherName: teacherName,
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
          {/* Render section name and teacher name if available */}
          {scheduleData.section && <p>Section: {scheduleData.section}</p>}
          {/* Render dropdown for section name */}
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
          )}
          {showSubmitButton && (
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
