import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch student data from backend
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/getAllStudents"
        );
        if (response.ok) {
          const data = await response.json();
          setStudents(data); // Update state with fetched student data
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, []);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filter students enrolled this month
  const enrolledThisMonth = students.filter((student) => {
    const registrationDate = new Date(student.registrationDate);
    return (
      registrationDate.getMonth() === currentMonth &&
      registrationDate.getFullYear() === currentYear
    );
  });

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalStudents = students.length;
  const totalEnrolledThisMonth = enrolledThisMonth.length;
  const currentlyOnlineStudents = students.filter((student) => student.online);
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <Navbar />
      <div className="viewTable" style={{ paddingTop: "60px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div
            className="summary-box summary-box-custom green"
            style={{ height: "150px" }}
          >
            <div className="overallAdminBox">
              <h3>
                <i
                  className="fa-solid fa-graduation-cap"
                  style={{ color: "white" }}
                ></i>
              </h3>
              <div className="admin-text">
                <h4>Total Students</h4>

                <h2 className="fw-bold">{totalStudents}</h2>
              </div>
            </div>
          </div>
          <div
            className="summary-box summary-box-custom red"
            style={{ height: "150px" }}
          >
            <div className="overallAdminBox">
              <h3>
                <i
                  class="fa-solid fa-building-columns"
                  style={{ color: "white" }}
                ></i>
              </h3>
              <div className="admin-text">
                <h4>Enrolled this month</h4>

                <h2 className="fw-bold">{totalEnrolledThisMonth}</h2>
              </div>
            </div>
          </div>
          <div
            className="summary-box summary-box-custom yellow"
            style={{ height: "150px" }}
          >
            <div className="overallAdminBox">
              <h3>
                <i
                  class="fa-solid fa-building-columns"
                  style={{ color: "white" }}
                ></i>
              </h3>
              <div className="admin-text">
                <h4>Currently online users</h4>

                <h2 className="fw-bold">{currentlyOnlineStudents.length}</h2>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <input
              type="text"
              className="form-control form-control-sl border-white bg-black text-white"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">
                <i class="fa-solid fa-user"></i> Username
              </th>
              <th scope="col">
                <i class="fa-regular fa-envelope"></i> Email
              </th>
              <th scope="col">
                <i class="fa-regular fa-calendar-days"></i> Registration Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student._id}>
                <th scope="row">{index + 1}</th>
                <td>{student.username}</td>
                <td>{student.email}</td>
                <td>
                  {new Date(student.registrationDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewStudents;
