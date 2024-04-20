import React, { useState, useEffect } from "react";
import axios from "axios";
import AttendancePieChart from "./AttendancePieChart";
import Sidebar from "../Sidebar";
const ViewAttendanceStudent = () => {
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const studentName = localStorage.getItem("username");

    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/attendance/getAttendancePercentageByStudent?studentName=${studentName}`
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    if (studentName) {
      fetchAttendanceData();
    }
  }, []);

  console.log("Attendance Data:", attendanceData);
  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        {attendanceData && (
          <div
            style={{
              marginTop: "100px",
              marginLeft: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: "100%",
              height: "300px",
            }}
          >
            <div style={{ backgroundColor: "white" }}>
              <AttendancePieChart
                presentCount={attendanceData.totalPresent}
                absentCount={
                  attendanceData.totalAttendanceTaken -
                  attendanceData.totalPresent
                }
              />
              <p>
                Total Attendance Taken: {attendanceData.totalAttendanceTaken}
              </p>
              <p>Total Present: {attendanceData.totalPresent}</p>
              <p>
                Attendance Percentage: {attendanceData.attendancePercentage}%
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewAttendanceStudent;
