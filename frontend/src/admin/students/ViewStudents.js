import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch student data from backend
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/getAllStudents");
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

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="viewTable" style={{ paddingTop: "60px" }}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Registration Date</th>
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
