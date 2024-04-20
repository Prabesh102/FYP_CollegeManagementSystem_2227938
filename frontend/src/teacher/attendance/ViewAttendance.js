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
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const section = JSON.parse(localStorage.getItem("sections"));
    if (section) {
      setSections(section);

      // Set the default section name to the top-most section in the array
      if (section.length > 0) {
        setSectionName(section[0]);
      }
    }
    const teacherName = localStorage.getItem("username");

    // Remove sectionName from the dependency array

    if (section && teacherName) {
      axios
        .get(
          `http://localhost:5000/api/schedule/?section=${sectionName}&teacherName=${teacherName}`
        )
        .then((response) => {
          const scheduleData = response.data;

          if (scheduleData.section === sectionName) {
            setShowSubmitButton(true);
            setScheduleData(scheduleData);

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
          }
        })
        .catch((error) => {
          console.error("Error fetching schedule data:", error);
        });
    }

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
    }

    const sections = JSON.parse(localStorage.getItem("sections"));
    if (sections) {
      setSections(sections);
    }
  }, []);
  const handleSectionChange = async (selectedSection) => {
    setSectionName(selectedSection);
    setShowSubmitButton(false);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/getStudentsBySection?section=${selectedSection}`
      );
      setStudents(response.data);

      const teacherName = localStorage.getItem("username");
      const scheduleResponse = await axios.get(
        `http://localhost:5000/api/schedule/?section=${selectedSection}&teacherName=${teacherName}`
      );
      const scheduleData = scheduleResponse.data;
      if (scheduleData.section === selectedSection) {
        setShowSubmitButton(true);
        setScheduleData(scheduleData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAttendanceChange = (studentId, present) => {
    const updatedStudents = students.map((student) => {
      if (student._id === studentId) {
        return { ...student, present: present, absent: !present };
      }
      return student; // Return the unchanged student
    });
    setStudents(updatedStudents);
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendanceData = students.map((student) => ({
        studentName: student.username,
        present: student.present,
      }));

      const teacherName = localStorage.getItem("username");

      await axios.post("http://localhost:5000/api/attendance/attendance", {
        section: sectionName,
        teacherName: teacherName,
        attendance: attendanceData,
      });

      console.log("Attendance submitted successfully");
      setAttendanceSubmitted(true);
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
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
            <table className="table table-bordered">
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
