import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import { Modal, Button, Form } from "react-bootstrap";

const ViewTeacher = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
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

    fetchStudentData();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleUpdateClose = () => {
    setShowUpdateModal(false);
    setUpdatedName("");
    setUpdatedEmail("");
    setSelectedUser(null);
  };
  const handleView = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true); // Show the "View User Details" modal
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setShowUserDetailsModal(false); // Close the "View User Details" modal
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/updateUserDetails",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser._id,
            updatedName,
            updatedEmail,
          }),
        }
      );

      if (response.ok) {
        // Handle successful update
        console.log("User details updated successfully");
        // Close the modal or handle any other UI updates
        setShowUpdateModal(false);
        setUpdatedName("");
        setUpdatedEmail("");
        setSelectedUser(null);
        setShowUpdateAlert(true);
      } else {
        // Handle errors
        console.error("Failed to update user details");
        setShowUpdateAlert(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowDeleteConfirmation(true); // Show the delete confirmation modal
  };

  const handleDeleteClose = () => {
    setSelectedUser(null);
    setShowDeleteConfirmation(false);
  };

  const handleDelete = async (userId) => {
    try {
      if (!selectedUser) {
        console.error("No user selected for deletion");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/users/deleteUser/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setShowDeleteAlert(true);
        setShowDeleteConfirmation(false);
      } else {
        setShowDeleteAlert(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error or show a message to the user
    }
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
          {showDeleteAlert && (
            <div className="alert alert-success" role="alert">
              User deleted successfully!
            </div>
          )}

          {showUpdateAlert && (
            <div className="alert alert-success" role="alert">
              User details updated successfully!
            </div>
          )}
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
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateClick(student)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => handleDeleteClick(student)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal show={showDeleteConfirmation} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this user?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedUser?._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="formUpdateName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formUpdateEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter updated email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleUpdateClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUserDetailsModal} onHide={handleCloseUserDetails}>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Username: {selectedUser?.username}</p>
            <p>Email: {selectedUser?.email}</p>
            <p>Registration Date: {selectedUser?.registrationDate}</p>
            {/* Add other details you want to display */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUserDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewTeacher;
