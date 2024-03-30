import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewAttendance = () => {
  const [attendanceDetails, setAttendanceDetails] = useState([]);

  useEffect(() => {
    // Fetch attendance details from the backend
    axios
      .get("http://localhost:5000/api/attendance/allAttendance")
      .then((response) => {
        setAttendanceDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance details:", error);
        // Handle error
      });
  }, []);

  return (
    <div>
      <h2>Attendance Details</h2>
      <table>
        <thead>
          <tr>
            <th>Section</th>
            <th>Student Name</th>
            <th>Attendance Status</th>
            <th>Date-Time</th>
          </tr>
        </thead>
        <tbody>
          {attendanceDetails.map((attendance, index) => (
            <tr key={index}>
              <td>{attendance.section}</td>
              <td>{attendance.studentName}</td>
              <td>{attendance.attendanceStatus}</td>
              <td>{attendance.dateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAttendance;
