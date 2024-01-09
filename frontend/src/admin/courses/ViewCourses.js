import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import { Modal, Button, Form } from "react-bootstrap";

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedCredits, setUpdatedCredits] = useState(0);
  const [updatedModules, setUpdatedModules] = useState(0);
  const [updatedStudentsAllocated, setUpdatedStudentsAllocated] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/courses/getAllCourse"
        );
        if (response.ok) {
          const data = await response.json();
          setCourses(data); // Update state with fetched course data
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSelectedCourse(null);
  };

  const handleUpdateClick = (course) => {
    setSelectedCourse(course);
    setShowUpdateModal(true);
    setUpdatedName(course.courseName);
    setUpdatedCredits(course.totalCredits);
    setUpdatedModules(course.modules);
    setUpdatedStudentsAllocated(course.totalStudentsAllocated);
  };

  const handleUpdateClose = () => {
    setShowUpdateModal(false);
    setSelectedCourse(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/updateCourse/${selectedCourse._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseName: updatedName,
            totalCredits: updatedCredits,
            modules: updatedModules,
            totalStudentsAllocated: updatedStudentsAllocated,
          }),
        }
      );

      if (response.ok) {
        setShowUpdateAlert(true);
        setShowUpdateModal(false);
        setSelectedCourse(null);
        // You may want to refresh the course list after an update
      } else {
        setShowUpdateAlert(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteClose = () => {
    setSelectedCourse(null);
    setShowDeleteConfirmation(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/deleteCourse/${selectedCourse._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setShowDeleteAlert(true);
        setShowDeleteConfirmation(false);
        // You may want to refresh the course list after deletion
      } else {
        setShowDeleteAlert(false);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  const handleViewClick = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  const handleCloseView = () => {
    setSelectedCourse(null);
    setShowViewModal(false);
  };
  return (
    <>
      <Navbar />
      <div className="viewTable" style={{ paddingTop: "60px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          {showDeleteAlert && (
            <div className="alert alert-success" role="alert">
              Course deleted successfully!
            </div>
          )}

          {showUpdateAlert && (
            <div className="alert alert-success" role="alert">
              Course details updated successfully!
            </div>
          )}
          <div className="ml-auto">
            <input
              type="text"
              className="form-control form-control-sl border-black text-black"
              placeholder="Search by course name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">Course Name</th>
              <th scope="col">Total Credits</th>
              <th scope="col">Total Modules</th>
              <th scope="col">Total Students Allocated</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course, index) => (
              <tr key={course._id}>
                <th scope="row">{index + 1}</th>
                <td>{course.courseName}</td>
                <td>{course.totalCredits}</td>
                <td>{course.modules}</td>
                <td>{course.totalStudentsAllocated}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleViewClick(course)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateClick(course)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => handleDeleteClick(course)}
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
            <p>Are you sure you want to delete this course?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="formUpdateName">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formUpdateCredits">
                <Form.Label>Total Credits</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter total credits"
                  value={updatedCredits}
                  onChange={(e) => setUpdatedCredits(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formUpdateModules">
                <Form.Label>Total Modules</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter total modules"
                  value={updatedModules}
                  onChange={(e) => setUpdatedModules(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formUpdateStudentsAllocated">
                <Form.Label>Total Students Allocated</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter total students allocated"
                  value={updatedStudentsAllocated}
                  onChange={(e) => setUpdatedStudentsAllocated(e.target.value)}
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
        <Modal show={showViewModal} onHide={handleCloseView}>
          <Modal.Header closeButton>
            <Modal.Title>Course Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Course Name: {selectedCourse?.courseName}</p>
            <p>Total Credits: {selectedCourse?.totalCredits}</p>
            <p>Total Modules: {selectedCourse?.modules}</p>
            <p>
              Total Students Allocated: {selectedCourse?.totalStudentsAllocated}
            </p>
            {/* Add other details you want to display */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseView}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewCourses;
