import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

const ViewScheduleStudent = () => {
  const [ongoingClasses, setOngoingClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [selectedDay, setSelectedDay] = useState(""); // State to store the selected day

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const sections = JSON.parse(localStorage.getItem("sections"));
        const url = `http://localhost:5000/api/schedule/classes/section/?section=${sections}`;

        const response = await axios.get(url);
        const { ongoingClasses, upcomingClasses } = response.data;

        setOngoingClasses(ongoingClasses);
        setUpcomingClasses(upcomingClasses);

        const tableDataResponse = await axios.get(
          `http://localhost:5000/api/schedule/schedule/section?section=${sections}`
        );
        setScheduleData(tableDataResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter schedule data based on the selected day
  const filteredScheduleData = selectedDay
    ? scheduleData.filter(
        (schedule) =>
          schedule.scheduleDetails[0]?.scheduledDay.toLowerCase() ===
          selectedDay.toLowerCase()
      )
    : scheduleData;

  // Logic to paginate filtered schedule data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredScheduleData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle day selection change
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
    setCurrentPage(1); // Reset pagination when changing the day
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div className="container">
          <div style={{ display: "flex", marginTop: "50px" }}>
            {/* Ongoing Classes */}
            {ongoingClasses && ongoingClasses.length > 0 ? (
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
                {ongoingClasses.map((classItem, index) => (
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
              <div
                className="ongoing-class-box"
                style={{
                  width: "400px",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  display: "flex", // Added to make the container flex
                  flexDirection: "column", // Align items vertically
                }}
              >
                <h4>Ongoing Class</h4>
                <p>No ongoing class right now</p>
              </div>
            )}
            {/* Upcoming Classes */}
            {upcomingClasses && upcomingClasses.length > 0 ? (
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
                {upcomingClasses.map((classItem, index) => (
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
              <div
                className="ongoing-class-box"
                style={{
                  width: "400px",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  display: "flex", // Added to make the container flex
                  flexDirection: "column", // Align items vertically
                  marginLeft: "50px",
                }}
              >
                <h4>Upcoming Class</h4>
                <p>No Upcoming class for today</p>
              </div>
            )}
          </div>

          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ marginTop: "60px" }}
          ></div>
          <div className="mb-3" style={{ width: "150px" }}>
            <select
              className="form-select"
              value={selectedDay}
              onChange={handleDayChange}
            >
              <option value="">All Days</option>
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
            </select>
          </div>
          {currentItems.length > 0 ? (
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
                    <td>
                      {schedule.scheduleDetails[0]?.scheduledDay || "N/A"}
                    </td>
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
          ) : (
            <p>No classes scheduled for the selected day</p>
          )}
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(filteredScheduleData.length / itemsPerPage) },
              (_, i) => i + 1
            ).map((number) => (
              <li key={number} className="page-item">
                <button onClick={() => paginate(number)} className="page-link">
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

export default ViewScheduleStudent;
