import React, { useState, useEffect } from "react";
// import Navbar from "../main/Navbar";
import { Link } from "react-router-dom"; // Import Link
// import "../main/admin.css";
import axios from "axios";
import Sidebar from "../Sidebar";
const ViewScheduleTeacher = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const teacherName = localStorage.getItem("username");
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/schedule/getAllSchedule?teacherName=${teacherName}`
        );
        setScheduleData(response.data);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };
    fetchScheduleData();
  }, []);

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />

        <div className="container">
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ marginTop: "60px" }}
          >
            <h1>Schedule Data</h1>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Scheduled Day</th>
                <th>Number of Classes</th>
                <th>Classroom</th>
                <th>Class Type</th>

                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule.section}</td>
                  <td>{schedule.scheduleDetails[0]?.scheduledDay || "N/A"}</td>
                  <td>{schedule.scheduleDetails[0]?.numberOfClass || "N/A"}</td>
                  <td>
                    <ul>
                      {schedule.scheduleDetails[0]?.classrooms.map(
                        (classroom, i) => (
                          <li key={i}>{classroom.classroom}</li>
                        )
                      )}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {schedule.scheduleDetails[0]?.classrooms.map(
                        (classroom, i) => (
                          <li key={i}>{classroom.classType || "N/A"}</li>
                        )
                      )}
                    </ul>
                  </td>

                  <td>
                    <ul>
                      {schedule.scheduleDetails[0]?.classrooms.map(
                        (classroom, i) => (
                          <li key={i}>{classroom.startTime || "N/A"}</li>
                        )
                      )}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {schedule.scheduleDetails[0]?.classrooms.map(
                        (classroom, i) => (
                          <li key={i}>{classroom.endTime || "N/A"}</li>
                        )
                      )}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewScheduleTeacher;