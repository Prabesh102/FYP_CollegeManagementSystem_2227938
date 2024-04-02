import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../Sidebar";

const ViewAttendance = () => {
  const [students, setStudents] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [isScheduledTime, setIsScheduledTime] = useState(false); // New state to track if it's scheduled time

  useEffect(() => {
    // Fetch sections assigned to the teacher
    const fetchSections = async () => {
      try {
        const teacherUsername = localStorage.getItem("username");
        const response = await axios.get(
          `http://localhost:5000/api/schedule/teacher/${teacherUsername}/sections`
        );
        if (response.data.length > 0) {
          setSectionName(response.data[0]); // Assuming only one section is assigned to the teacher
          checkScheduledTime(response.data[0]); // Check if it's scheduled time
        }
      } catch (error) {
        console.error("Error fetching teacher's sections:", error);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    // Fetch students by section
    if (sectionName) {
      axios
        .get(
          `http://localhost:5000/api/users/students/getStudentsBySection?section=${sectionName}`
        )
        .then((response) => {
          console.log("Fetched students:", response.data); // Log the fetched data
          setStudents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
          // Handle error
        });
    }
  }, [sectionName]);

  useEffect(() => {
    console.log("Students:", students); // Log the students array
  }, [students]);

  const handleAttendanceChange = (studentId, present) => {
    // Update the attendance status for the student
    const updatedStudents = students.map((student) => {
      if (student._id === studentId) {
        return { ...student, present: present, absent: !present };
      }
      return student;
    });
    setStudents([...updatedStudents]); // Ensure state update
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

  const checkScheduledTime = (sectionName) => {
    axios
      .get(`http://localhost:5000/api/schedule/findBysection/${sectionName}`)
      .then((response) => {
        const scheduleDetailsArray = response.data.scheduleDetails;
        let isScheduledTime = false;

        scheduleDetailsArray.forEach((scheduleDetail) => {
          const startTime = new Date(
            `01/01/1970 ${scheduleDetail.startTime}`
          ).getTime();
          const endTime = new Date(
            `01/01/1970 ${scheduleDetail.endTime}`
          ).getTime();

          const currentDay = new Date().toLocaleDateString("en-US", {
            weekday: "long",
          });
          const currentTime = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          const currentDateTime = new Date(
            `01/01/1970 ${currentTime}`
          ).getTime();

          if (
            currentDay === scheduleDetail.scheduledDay &&
            currentDateTime >= startTime &&
            currentDateTime <= endTime
          ) {
            isScheduledTime = true;
          }
        });

        setIsScheduledTime(isScheduledTime);
      })
      .catch((error) => {
        console.error("Error fetching scheduled time:", error);
      });
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
          {isScheduledTime && students.length > 0 && (
            <table className="table">
              {/* Table headers */}
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {students.map((student) => {
                  console.log("Student:", student); // Add this line for debugging
                  return (
                    <tr key={student._id}>
                      <td>{student.username}</td>
                      <td>
                        {/* Checkboxes for present and absent */}
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
                  );
                })}
              </tbody>
            </table>
          )}

          {!attendanceSubmitted && isScheduledTime && (
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
