import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import { Modal, Button, Form } from "react-bootstrap";
const ViewClassroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDesk, setUpdatedDesk] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showClassroomDetailsModal, setShowClassroomDetailsModal] =
    useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showAddClassroomModal, setShowAddClassroomModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    totalDesk: "",
  });
  const handleAddClassroomClick = () => {
    setShowAddClassroomModal(true);
  };

  const handleAddClassroomClose = () => {
    setShowAddClassroomModal(false);
  };

  const handleAddClassroomSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/classroom/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: formData.className,
          totalDesk: formData.totalDesk,
        }),
      });

      if (response.ok) {
        // Handle successful registration
        console.log("Classroom added successfully");
        // Close the modal or handle any other UI updates
        setShowAddClassroomModal(false);
        setAlertMessage("Classroom added successfully!");
      } else {
        // Handle errors
        console.error("Failed to add classroom");
        setAlertMessage("Failed to add classroom. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classroom/");
        if (response.ok) {
          const data = await response.json();
          setClassrooms(data); // Update state with fetched student data
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      }
    };

    fetchClassroomData();
  }, []);

  const filteredClassrooms = classrooms.filter((classrooms) =>
    classrooms.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSelectedClassroom(null);
  };

  const handleUpdateClick = (classroom) => {
    setSelectedClassroom(classroom);
    setShowUpdateModal(true);
  };

  const handleUpdateClose = () => {
    setShowUpdateModal(false);
    setUpdatedName("");
    setUpdatedDesk("");
    setSelectedClassroom(null);
  };
  const handleView = (section) => {
    setSelectedClassroom(section);
    setShowClassroomDetailsModal(true);
  };

  const handleCloseClassroomDetails = () => {
    setSelectedClassroom(null);
    setShowClassroomDetailsModal(false);
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/classroom/${selectedClassroom._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            className: updatedName,
            totalDesk: updatedDesk,
          }),
        }
      );

      if (response.ok) {
        console.log("Classroom details updated successfully");

        setShowUpdateModal(false);
        setUpdatedName("");
        setUpdatedDesk("");
        setSelectedClassroom(null);
        setShowUpdateAlert(true);
      } else {
        console.error("Failed to update classroom details");
        setShowUpdateAlert(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedClassroom(user);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteClose = () => {
    setSelectedClassroom(null);
    setShowDeleteConfirmation(false);
  };

  const handleDelete = async (userId) => {
    try {
      if (!selectedClassroom) {
        console.error("No classroom selected for deletion");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/classroom/${userId}`,
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
      console.error("Error deleting classroom:", error);
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
          <div className="ml-auto">
            <input
              type="text"
              className="form-control form-control-sl border-black text-black"
              placeholder="Search by section name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddClassroomClick}
            >
              Add Classroom
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">
                <i class="fa-solid fa-user"></i> Classroom Name
              </th>
              <th scope="col">
                <i class="fa-regular fa-envelope"></i> Total Desk
              </th>
              <th scope="col">
                <i class="fa-solid fa-gear"></i> Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClassrooms.map((classroom, index) => (
              <tr key={classroom._id}>
                <th scope="row">{index + 1}</th>
                <td>{classroom.className}</td>
                <td>{classroom.totalDesk}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleView(classroom)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateClick(classroom)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => handleDeleteClick(classroom)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeleteAlert && (
          <div className="alert alert-success" role="alert">
            Classroom deleted successfully!
          </div>
        )}

        {showUpdateAlert && (
          <div className="alert alert-success" role="alert">
            Classroom details updated successfully!
          </div>
        )}
        {alertMessage && (
          <div className="alert alert-success" role="alert">
            Classroom added successfully!
          </div>
        )}
        <Modal show={showDeleteConfirmation} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this classroom?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedClassroom?._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Classroom</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="formUpdateName">
                <Form.Label>Classroom Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formUpdateStudentNumber">
                <Form.Label>Total Desk</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter updated total desk"
                  value={updatedDesk}
                  onChange={(e) => setUpdatedDesk(e.target.value)}
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

        <Modal
          show={showClassroomDetailsModal}
          onHide={handleCloseClassroomDetails}
        >
          <Modal.Header closeButton>
            <Modal.Title>Classroom Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Classroom name: {selectedClassroom?.className}</p>
            <p>Total Desk: {selectedClassroom?.totalDesk}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseClassroomDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddClassroomModal} onHide={handleAddClassroomClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Classroom</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Classroom name</label>
              <input
                type="text"
                name="className"
                className="form-control"
                placeholder="Enter class name"
                value={formData.className}
                onChange={(e) =>
                  setFormData({ ...formData, className: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Total desk</label>
              <input
                type="number"
                name="totalDesk"
                className="form-control"
                placeholder="Enter total desk "
                value={formData.totalDesk}
                onChange={(e) =>
                  setFormData({ ...formData, totalDesk: e.target.value })
                }
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddClassroomClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddClassroomSubmit}>
              Add Classroom
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewClassroom;
