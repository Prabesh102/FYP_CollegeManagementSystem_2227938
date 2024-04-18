import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

const ViewScheduleTeacher = () => {
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [ongoingClass, setOngoingClass] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Number of items per page
  const teacherName = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleResponse = await axios.get(
          `http://localhost:5000/api/schedule/classes/teacher/?teacherName=${teacherName}`
        );
        const { ongoingClasses, upcomingClasses } = scheduleResponse.data;
        setOngoingClass(ongoingClasses);
        setUpcomingClass(upcomingClasses);

        const tableDataResponse = await axios.get(
          `http://localhost:5000/api/schedule/schedule/teacher?teacherName=${teacherName}`
        );
        setScheduleData(tableDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [teacherName]);

  // Logic to get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = scheduleData.slice(indexOfFirstItem, indexOfLastItem);

  // Logic for pagination number buttons
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(scheduleData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div className="container">
          <div style={{ display: "flex", marginTop: "50px" }}>
            {/* Ongoing Classes */}
            {ongoingClass && ongoingClass.length > 0 ? (
              <div
                className="ongoing-class-box"
                style={{
                  width: "400px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  display: "flex", // Added to make the container flex
                  flexDirection: "column", // Align items vertically
                }}
              >
                <h4>Ongoing Class</h4>
                {ongoingClass.map((classItem, index) => (
                  <div
                    key={index}
                    style={{
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginTop: "10px",
                      }}
                    >
                      <h6 style={{ marginRight: "40px" }}>
                        Section: {classItem.section}
                      </h6>
                      <p>
                        Classroom:{" "}
                        {classItem.scheduleDetails.classrooms.classroom}
                      </p>
                    </div>
                    <hr />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10px", // Adjust the top margin
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#b7e4cc",
                            width: "190px",
                            height: "30px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          <p style={{ textAlign: "center", margin: "auto" }}>
                            <i
                              className="fa-solid fa-calendar-days"
                              style={{ marginRight: "3px" }}
                            ></i>{" "}
                            Started at:{" "}
                            {classItem.scheduleDetails.classrooms.startTime}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10px", // Adjust the top margin
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#fdd68d",
                            width: "190px",
                            height: "30px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <p style={{ textAlign: "center", margin: "auto" }}>
                            {" "}
                            <i
                              className="fa-solid fa-calendar-days"
                              style={{ marginRight: "3px" }}
                            ></i>{" "}
                            Ending Time:{" "}
                            {classItem.scheduleDetails.classrooms.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No ongoing classes right now</p>
            )}
            {/* Upcoming Classes */}
            {upcomingClass && upcomingClass.length > 0 ? (
              <div
                className="upcoming-class-box"
                style={{
                  width: "400px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  marginLeft: "50px",
                  display: "flex", // Added to make the container flex
                  flexDirection: "column", // Align items vertically
                }}
              >
                <h4>Upcoming Class</h4>
                {upcomingClass.map((classItem, index) => (
                  <div
                    key={index}
                    style={{
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginTop: "10px",
                      }}
                    >
                      <h6 style={{ marginRight: "40px" }}>
                        Section: {classItem.section}
                      </h6>
                      <p>
                        Classroom:{" "}
                        {classItem.scheduleDetails.classrooms.classroom}
                      </p>
                    </div>{" "}
                    <hr />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10px", // Adjust the top margin
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#b7e4cc",
                            width: "190px",
                            height: "30px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          <p style={{ textAlign: "center", margin: "auto" }}>
                            <i
                              className="fa-solid fa-calendar-days"
                              style={{ marginRight: "3px" }}
                            ></i>{" "}
                            Starting at:{" "}
                            {classItem.scheduleDetails.classrooms.startTime}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10px", // Adjust the top margin
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#fdd68d",
                            width: "190px",
                            height: "30px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <p style={{ textAlign: "center", margin: "auto" }}>
                            {" "}
                            <i
                              className="fa-solid fa-calendar-days"
                              style={{ marginRight: "3px" }}
                            ></i>{" "}
                            Ending Time:{" "}
                            {classItem.scheduleDetails.classrooms.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No upcoming classes for today</p>
            )}
          </div>

          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ marginTop: "60px" }}
          ></div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Section</th>
                <th>Scheduled Day</th>
                {/* <th>Number of Classes</th> */}
                <th>Classroom</th>
                <th>Class Type</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule.section}</td>
                  <td>{schedule.scheduleDetails[0]?.scheduledDay || "N/A"}</td>
                  {/* <td>{schedule.scheduleDetails[0]?.numberOfClass || "N/A"}</td> */}
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
          <ul className="pagination">
            {pageNumbers.map((number) => (
              <li key={number} className="page-item">
                <button
                  onClick={() => setCurrentPage(number)}
                  className="page-link"
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ViewScheduleTeacher;
