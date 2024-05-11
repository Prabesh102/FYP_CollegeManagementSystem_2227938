import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import { Modal, Button, Form } from "react-bootstrap";
const ViewSections = () => {
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedStudentNumber, setUpdatedStudentNumber] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSectionDetailsModal, setShowSectionDetailsModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [formData, setFormData] = useState({
    sectionName: "",
    totalStudents: "",
    course: "",
  });
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionsPerPage] = useState(8);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/courses/getAllCourse"
        );
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleAddSectionClick = () => {
    setShowAddSectionModal(true);
  };

  const handleAddSectionClose = () => {
    setShowAddSectionModal(false);
  };

  const handleAddSectionSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/section/postSection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sectionName: formData.sectionName,
            totalStudents: formData.totalStudents,
            course: selectedCourse,
          }),
        }
      );

      if (response.ok) {
        // Handle successful registration
        console.log("Section added successfully");
        // Close the modal or handle any other UI updates
        setShowAddSectionModal(false);
        setAlertMessage("Section added successfully!");
      } else {
        // Handle errors
        console.error("Failed to add section");
        setAlertMessage("Failed to add section. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredSections = sections.filter((sections) =>
    sections.sectionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSelectedSection(null);
  };

  const handleUpdateClick = (section) => {
    setSelectedSection(section);
    setShowUpdateModal(true);
  };

  const handleUpdateClose = () => {
    setShowUpdateModal(false);
    setUpdatedName("");
    setUpdatedStudentNumber("");
    setSelectedSection(null);
  };
  const handleView = (section) => {
    setSelectedSection(section);
    setShowSectionDetailsModal(true); // Show the "View User Details" modal
  };

  const handleCloseSectionDetails = () => {
    setSelectedSection(null);
    setShowSectionDetailsModal(false); // Close the "View User Details" modal
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/section/updateSection/${selectedSection._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sectionName: updatedName,
            totalStudents: updatedStudentNumber,
          }),
        }
      );

      if (response.ok) {
        // Handle successful update
        console.log("User details updated successfully");
        // Close the modal or handle any other UI updates
        setShowUpdateModal(false);
        setUpdatedName("");
        setUpdatedStudentNumber("");
        setSelectedSection(null);
        setShowUpdateAlert(true);
      } else {
        // Handle errors
        console.error("Failed to update section details");
        setShowUpdateAlert(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedSection(user); // Set the selected user
    setShowDeleteConfirmation(true); // Show the delete confirmation modal
  };

  const handleDeleteClose = () => {
    setSelectedSection(null);
    setShowDeleteConfirmation(false);
  };

  const handleDelete = async (userId) => {
    try {
      if (!selectedSection) {
        console.error("No section selected for deletion");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/section/deleteSection/${userId}`,
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
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/section/getAllSection"
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          throw new Error("Failed to fetch section data");
        }
      } catch (error) {
        console.error("Error fetching section data:", error);
      }
    };

    fetchSectionData();
  }, []);
  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
  const currentSections = filteredSections.slice(
    indexOfFirstSection,
    indexOfLastSection
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: "auto", marginLeft: "20px" }}>
            <h3>Section Details Table</h3>
          </div>
          <div style={{ marginRight: "20px" }}>
            <h6 style={{ textAlign: "center" }}>Search by section name</h6>
            <hr />
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
            </div>
          </div>
          <div style={{ marginRight: "20px" }}>
            <h6 style={{ textAlign: "center" }}>Add section</h6>
            <hr />
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddSectionClick}
              >
                Add Section
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <table className="table table-bordered" style={{ padding: "10px" }}>
            <thead>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">
                  <i class="fa-solid fa-user"></i> Section name
                </th>
                <th scope="col">
                  <i class="fa-regular fa-envelope"></i> Course Name
                </th>
                <th scope="col">
                  <i class="fa-regular fa-envelope"></i> Total students
                  allocated
                </th>
                <th scope="col">
                  <i class="fa-solid fa-gear"></i> Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSections.map((section, index) => (
                <tr key={section._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{section.sectionName}</td>
                  <td>{section.course}</td>
                  <td>{section.totalStudents}</td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={() => handleView(section)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdateClick(section)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={() => handleDeleteClick(section)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav>
            <ul className="pagination">
              {Array.from(
                { length: Math.ceil(sections.length / sectionsPerPage) },
                (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <a
                      onClick={() => paginate(index + 1)}
                      className="page-link"
                      href="#"
                    >
                      {index + 1}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
        {showDeleteAlert && (
          <div className="alert alert-success" role="alert">
            Section deleted successfully!
          </div>
        )}

        {showUpdateAlert && (
          <div className="alert alert-success" role="alert">
            Section details updated successfully!
          </div>
        )}
        {alertMessage && (
          <div className="alert alert-success" role="alert">
            Section added successfully!
          </div>
        )}
        <Modal show={showDeleteConfirmation} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this section?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedSection?._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="formUpdateName">
                <Form.Label>Section Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateStudentNumber">
                <Form.Label>Total students allocated</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter updated section"
                  value={updatedStudentNumber}
                  onChange={(e) => setUpdatedStudentNumber(e.target.value)}
                  required
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
          show={showSectionDetailsModal}
          onHide={handleCloseSectionDetails}
        >
          <Modal.Header closeButton>
            <Modal.Title>Section Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Section name: {selectedSection?.sectionName}</p>
            <p>Total students allocated: {selectedSection?.totalStudents}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSectionDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddSectionModal} onHide={handleAddSectionClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Section name</label>
              <input
                type="text"
                name="sectionName"
                className="form-control"
                placeholder="Enter section name"
                value={formData.sectionName}
                onChange={(e) =>
                  setFormData({ ...formData, sectionName: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Total students allocated</label>
              <input
                type="number"
                name="totalStudents"
                className="form-control"
                placeholder="Enter total students allocated "
                value={formData.totalStudents}
                onChange={(e) =>
                  setFormData({ ...formData, totalStudents: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Course</label>
              <Form.Select
                name="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddSectionClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddSectionSubmit}>
              Add Section
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewSections;
