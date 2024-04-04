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

  useEffect(() => {
    // Retrieve section name and teacher name from localStorage
    const sectionName = localStorage.getItem("section");
    if (sectionName) {
      setSectionName(sectionName);

      // Fetch students by section
      axios
        .get(
          `http://localhost:5000/api/users/students/getStudentsBySection?section=${sectionName}`
        )
        .then((response) => {
          setStudents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });

      // Fetch attendance records by teacher name
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
  }, []);

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

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div className="container mt-4">
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
