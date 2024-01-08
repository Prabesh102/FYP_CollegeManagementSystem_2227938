import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import { Modal, Button } from "react-bootstrap";
const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
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

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

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
          <div className="ml-auto">
            <input
              type="text"
              className="form-control form-control-sl border-black text-black"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="table">
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
              <th scope="col">
                <i class="fa-regular fa-calendar-days"></i> Actions
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
                <td>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleView(student)}
                  >
                    View
                  </button>
                  <button type="button" className="btn btn-warning me-2">
                    Update
                  </button>
                  <button type="button" className="btn btn-danger me-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedUser && (
          <Modal show={!!selectedUser} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Username: {selectedUser.username}</p>
              <p>Email: {selectedUser.email}</p>
              <p>
                Registration Date:{" "}
                {new Date(selectedUser.registrationDate).toLocaleDateString()}
              </p>
              {/* Add other details you want to display */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ViewStudents;
